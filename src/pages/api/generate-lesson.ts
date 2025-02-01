import { OpenAI } from "openai";
import type { NextApiRequest, NextApiResponse } from "next";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    try {
      for await (const chunk of stream) {
        if (!isClientConnected) break;

        const content = chunk.choices[0]?.delta?.content;
        if (!content) continue;

        // Debug logging for the first few chunks
        if (accumulatedJson.length < 500) {
          console.log("Received chunk:", {
            content,
            chunkLength: content.length,
            accumulatedLength: accumulatedJson.length,
            chunk: chunk.choices[0]?.delta,
          });
        }

        accumulatedJson += content;

        // Log the current state of accumulated JSON periodically
        if (accumulatedJson.length % 500 === 0) {
          console.log(
            "Current accumulated JSON length:",
            accumulatedJson.length
          );
        }

        // Only try to parse if we have what looks like a complete object
        if (
          accumulatedJson.startsWith("{") &&
          accumulatedJson.includes("}") &&
          (accumulatedJson.match(/{/g) || []).length ===
            (accumulatedJson.match(/}/g) || []).length
        ) {
          console.log("Attempting to parse accumulated JSON...");
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
              console.log("Sending metadata to client...");
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
                console.log("Metadata event:", metadataEvent);
                res.write(metadataEvent);
                lastMetadataSent = true;
              }
            }

            // Send new items as they come in
            if (partialLesson.items?.length > lastParsedItemCount) {
              console.log("New items found:", {
                new: partialLesson.items.length - lastParsedItemCount,
                total: partialLesson.items.length,
              });
              const newItems = partialLesson.items.slice(lastParsedItemCount);
              if (isClientConnected) {
                const itemsEvent = `data: {"type":"items","items":${JSON.stringify(
                  newItems
                )},"total":${partialLesson.items.length}}\n\n`;
                console.log("Items event:", itemsEvent);
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
          const finalLesson = JSON.parse(accumulatedJson);

          // Validate lesson structure
          if (!finalLesson.items?.length) {
            throw new Error("Lesson must contain items");
          }
          if (!finalLesson.name || !finalLesson.description) {
            throw new Error("Lesson must have name and description");
          }

          res.write(
            `data: {"type":"complete","lesson":${JSON.stringify(
              finalLesson
            )}}\n\n`
          );
          res.write("data: [DONE]\n\n");
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : "Invalid JSON response";
          res.write(
            `data: {"type":"error","error":${JSON.stringify(errorMessage)}}\n\n`
          );
        }
        res.end();
      }
    } catch (streamError: unknown) {
      // Handle stream-specific errors
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
