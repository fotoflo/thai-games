import { OpenAI } from "openai";
import type { NextApiRequest, NextApiResponse } from "next";
import { calculateTokenCosts } from "@/utils/tokenCosts";
import { PrismaClient } from "@prisma/client";
import { lessonService } from "@/services/lessonService";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const prisma = new PrismaClient();

// Configure API route options
export const config = {
  api: {
    bodyParser: true,
    responseLimit: false,
    // Increase timeout to 2 minutes since GPT-4 can be slow
    externalResolver: true,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Handle client disconnection
  let isClientConnected = true;
  res.on("close", () => {
    isClientConnected = false;
  });

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Set headers for streaming
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    console.log("Creating stream...");
    const stream = await openai.chat.completions.create(
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a language learning expert who creates structured lessons. Generate a SMALL lesson with exactly 2-3 items based on the provided requirements. Format the response as a valid JSON object with the following structure: { name: string, description: string, subject: string, difficulty: string, categories: Array<{name: string, id: string}>, items: Array<{sides: Array<{markdown: string}>}> }. Keep responses concise and focused on just 2-3 key language elements.",
          },
          {
            role: "user",
            content:
              prompt +
              "\n\nIMPORTANT: Please include ONLY 2-3 items in this lesson to keep it focused and concise.",
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 4000,
        stream: true,
        stream_options: {
          include_usage: true,
        },
      },
      {
        timeout: 120000, // 2 minute timeout
      }
    );

    // Send initial event
    if (isClientConnected) {
      res.write('data: {"type":"start"}\n\n');
    }

    console.log("Stream created, beginning to process chunks...");
    let accumulatedJson = "";
    let lastParsedItemCount = 0;
    let lastMetadataSent = false;
    let finalTokenUsage = null;

    try {
      for await (const chunk of stream) {
        if (!isClientConnected) break;

        // Store the final token usage when available
        if (chunk.usage) {
          console.log("Received token usage:", chunk.usage);
          finalTokenUsage = chunk.usage;
        }

        const content = chunk.choices[0]?.delta?.content;
        if (!content) continue;

        console.log("Received chunk:", {
          content,
          chunkLength: content.length,
          accumulatedLength: accumulatedJson.length,
        });

        accumulatedJson += content;

        // Only try to parse if we have what looks like a complete object
        if (
          accumulatedJson.startsWith("{") &&
          accumulatedJson.includes("}") &&
          (accumulatedJson.match(/{/g) || []).length ===
            (accumulatedJson.match(/}/g) || []).length
        ) {
          try {
            // Try to parse the accumulated JSON
            const partialLesson = JSON.parse(accumulatedJson);
            console.log("Successfully parsed JSON. Found:", {
              hasName: !!partialLesson.name,
              hasDescription: !!partialLesson.description,
              itemCount: partialLesson.items?.length || 0,
            });

            // Send metadata once we have it
            if (
              !lastMetadataSent &&
              partialLesson.name &&
              partialLesson.description &&
              partialLesson.subject &&
              partialLesson.difficulty
            ) {
              if (isClientConnected) {
                const metadataEvent = `data: {"type":"metadata","data":${JSON.stringify(
                  {
                    name: partialLesson.name,
                    description: partialLesson.description,
                    subject: partialLesson.subject,
                    difficulty: partialLesson.difficulty,
                    categories: partialLesson.categories || [],
                  }
                )}}\n\n`;
                res.write(metadataEvent);
                lastMetadataSent = true;
              }
            }

            // Send new items as they come in
            if (partialLesson.items?.length > lastParsedItemCount) {
              const newItems = partialLesson.items.slice(lastParsedItemCount);
              if (isClientConnected) {
                const itemsEvent = `data: {"type":"items","items":${JSON.stringify(
                  newItems
                )},"total":${partialLesson.items.length}}\n\n`;
                res.write(itemsEvent);
              }
              lastParsedItemCount = partialLesson.items.length;
            }
          } catch (parseError) {
            // Only log in development and only if it's not a simple incomplete JSON error
            if (
              process.env.NODE_ENV === "development" &&
              !(
                parseError instanceof SyntaxError &&
                parseError.message.includes("Unexpected end")
              )
            ) {
              console.debug("JSON parse error:", parseError);
            }
          }
        }
      }

      // Final validation and completion
      if (isClientConnected) {
        try {
          console.log("Processing final response...");
          const finalLesson = JSON.parse(accumulatedJson);

          // Validate lesson structure
          if (!finalLesson.items?.length) {
            throw new Error("Lesson must contain items");
          }
          if (!finalLesson.name || !finalLesson.description) {
            throw new Error("Lesson must have name and description");
          }
          debugger;
          // Calculate token costs using the final usage data
          if (!finalTokenUsage) {
            console.error("No token usage data received");
            throw new Error("Failed to get token usage data");
          }

          const tokenCosts = calculateTokenCosts({
            inputTokens: finalTokenUsage.prompt_tokens,
            outputTokens: finalTokenUsage.completion_tokens,
            model: "gpt-4o-mini-2024-07-18",
          });

          console.log("Saving lesson to database...");
          // Save lesson and token usage to database
          const savedLesson = await lessonService.createLesson({
            name: finalLesson.name,
            description: finalLesson.description,
            subject: finalLesson.subject,
            difficulty: finalLesson.difficulty,
            estimatedTime: finalLesson.estimatedTime || 30,
            totalItems: finalLesson.items.length,
            version: finalLesson.version || 1,
            items: finalLesson.items,
            categories: finalLesson.categories.map(
              (cat: { name: string }) => cat.name
            ),
            aiModel: "gpt-4o-mini-2024-07-18",
          });

          console.log("Saving token usage...");
          // Create token usage record
          await prisma.tokenUsage.create({
            data: {
              lessonId: savedLesson.id,
              inputTokens: tokenCosts.inputTokens,
              inputCostPerToken: tokenCosts.inputCostPerToken,
              inputTotalCost: tokenCosts.inputTotalCost,
              outputTokens: tokenCosts.outputTokens,
              outputCostPerToken: tokenCosts.outputCostPerToken,
              outputTotalCost: tokenCosts.outputTotalCost,
              totalTokens: tokenCosts.totalTokens,
              totalCost: tokenCosts.totalCost,
            },
          });

          console.log("Sending final response...");
          // Send the complete response with lesson and token usage
          res.write(
            `data: {"type":"complete","lesson":${JSON.stringify(
              finalLesson
            )},"tokenUsage":${JSON.stringify(tokenCosts)}}\n\n`
          );
          res.write("data: [DONE]\n\n");
          res.end();
        } catch (error: unknown) {
          console.error("Error in final processing:", error);
          const errorMessage =
            error instanceof Error ? error.message : "Invalid JSON response";
          res.write(
            `data: {"type":"error","error":${JSON.stringify(errorMessage)}}\n\n`
          );
          res.end();
        }
      }
    } catch (streamError: unknown) {
      // Handle stream-specific errors
      console.error("Stream error:", streamError);
      if (streamError instanceof Error) {
        const errorMessage = streamError.message;
        if (isClientConnected) {
          res.write(
            `data: {"type":"error","error":${JSON.stringify(
              `Stream error: ${errorMessage}`
            )}}\n\n`
          );
          res.end();
        }
      }
      throw streamError; // Re-throw for global error handler
    }
  } catch (error) {
    console.error("Error generating lesson:", error);
    if (isClientConnected) {
      let errorMessage = "Failed to generate lesson";

      if (error instanceof Error) {
        // Handle specific OpenAI error types
        if ("status" in error) {
          errorMessage = `API Error: ${error.message}`;
        } else if ("code" in error && error.code === "ECONNRESET") {
          errorMessage = "Connection was reset. Please try again.";
        } else if (error.message.includes("timeout")) {
          errorMessage = "Request timed out. Please try again.";
        } else {
          errorMessage = error.message;
        }
      }

      res.write(
        `data: {"type":"error","error":${JSON.stringify(errorMessage)}}\n\n`
      );
      res.end();
    }
  }
}
