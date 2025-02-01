import { OpenAI } from "openai";
import type { NextApiRequest, NextApiResponse } from "next";
import { calculateTokenCosts } from "@/utils/tokenCosts";
import { PrismaClient } from "@prisma/client";
import { lessonService } from "@/services/lessonService";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

if (!process.env.OPENAI_MODEL) {
  throw new Error("Missing OPENAI_MODEL environment variable");
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

    console.log("[API] Starting lesson generation...");
    const stream = await openai.chat.completions.create(
      {
        model: process.env.OPENAI_MODEL as string,
        messages: [
          {
            role: "system",
            content:
              "You are a language learning expert who creates structured lessons. Generate a focused lesson based on the provided requirements. Format the response as a valid JSON object with the following structure: { name: string, description: string, subject: string, difficulty: string, categories: Array<{name: string, id: string}>, items: Array<{sides: Array<{markdown: string}>}> }.",
          },
          {
            role: "user",
            content: prompt,
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

    let accumulatedJson = "";
    let lastMetadataSent = false;
    let finalTokenUsage = null;
    let hasReceivedItems = false;

    try {
      for await (const chunk of stream) {
        if (!isClientConnected) {
          console.log("[API] Client disconnected, stopping generation");
          break;
        }

        // Store the final token usage when available
        if (chunk.usage) {
          finalTokenUsage = chunk.usage;
          console.log("[API] Token usage:", finalTokenUsage);
        }

        const content = chunk.choices[0]?.delta?.content;
        if (!content) continue;

        accumulatedJson += content;
        console.log("[API] Received chunk:", content);

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

            // Send metadata once we have it
            if (
              !lastMetadataSent &&
              partialLesson.name &&
              partialLesson.description &&
              partialLesson.subject &&
              partialLesson.difficulty
            ) {
              if (isClientConnected) {
                console.log("[API] Sending metadata:", {
                  name: partialLesson.name,
                  difficulty: partialLesson.difficulty,
                });
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
            if (partialLesson.items?.length > 0) {
              hasReceivedItems = true;
              if (isClientConnected) {
                console.log("[API] Sending items:", {
                  count: partialLesson.items.length,
                  first: partialLesson.items[0].sides[0].markdown.slice(0, 50),
                });
                const itemsEvent = `data: {"type":"items","items":${JSON.stringify(
                  partialLesson.items
                )},"total":3}\n\n`;
                res.write(itemsEvent);
              }
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
              console.debug("[API] JSON parse error:", parseError);
            }
          }
        }
      }

      // Final validation and completion
      if (isClientConnected) {
        try {
          console.log("[API] Processing final response...");
          const finalLesson = JSON.parse(accumulatedJson);

          // Only validate if we've actually received items
          if (!hasReceivedItems) {
            throw new Error("No items were generated. Please try again.");
          }

          // Validate lesson structure
          if (!finalLesson.items?.length) {
            throw new Error("Lesson must contain items");
          }
          if (!finalLesson.name || !finalLesson.description) {
            throw new Error("Lesson must have name and description");
          }

          // Calculate token costs using the final usage data
          if (!finalTokenUsage) {
            console.error("[API] No token usage data received");
            throw new Error("Failed to get token usage data");
          }

          const tokenCosts = calculateTokenCosts({
            inputTokens: finalTokenUsage.prompt_tokens,
            outputTokens: finalTokenUsage.completion_tokens,
            model: process.env.OPENAI_MODEL as string,
          });

          console.log("[API] Saving lesson to database...");
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
            aiModel: process.env.OPENAI_MODEL as string,
          });

          console.log("[API] Saving token usage...");
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

          console.log("[API] Generation complete, sending final response");
          // Send the complete response with lesson and token usage
          res.write(
            `data: {"type":"complete","lesson":${JSON.stringify(
              finalLesson
            )},"tokenUsage":${JSON.stringify(tokenCosts)}}\n\n`
          );
          res.write("data: [DONE]\n\n");
          res.end();
        } catch (error: unknown) {
          console.error("[API] Error in final processing:", error);
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
