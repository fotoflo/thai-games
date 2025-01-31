import React, { useState } from "react";
import { motion } from "framer-motion";
import { WizardState, LessonData } from "../types";
import { Upload, CheckCircle2, FileUp, Type, Copy, Check } from "lucide-react";
import { getCompletedWizardPrompt } from "../data/lessonPrompts";
import { useRouter } from "next/router";

interface JsonUploadScreenProps {
  state: WizardState;
  updateState: (updates: Partial<WizardState>) => void;
  onComplete: (state: WizardState) => void;
}

export const JsonUploadScreen: React.FC<JsonUploadScreenProps> = ({
  state,
  updateState,
  onComplete,
}) => {
  const router = useRouter();
  const [jsonContent, setJsonContent] = useState<LessonData | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<"paste" | "file">("paste");
  const [pastedText, setPastedText] = useState("");
  const [copied, setCopied] = useState(false);

  const validateAndSetJson = (json: unknown) => {
    try {
      // Type guard to check if json is an object
      if (typeof json !== "object" || json === null) {
        throw new Error("JSON must be an object");
      }

      const jsonObj = json as Record<string, unknown>;

      // Check for required fields with descriptive error messages
      const requiredFields = {
        name: "Lesson name (max 48 chars)",
        description: "Lesson description (max 128 chars)",
        categories: "Categories array",
        subject: "Subject (max 48 chars)",
        difficulty: "Difficulty level (BEGINNER, INTERMEDIATE, or ADVANCED)",
        estimatedTime: "Estimated completion time",
        version: "Lesson version",
        items: "Lesson items array (must have at least 5 items)",
      };

      const missingFields: string[] = [];

      // Validate field presence and format
      for (const [field, description] of Object.entries(requiredFields)) {
        if (!jsonObj[field]) {
          missingFields.push(description);
          continue;
        }

        // Additional format validations
        switch (field) {
          case "name":
            if (String(jsonObj[field]).length > 48) {
              missingFields.push("Lesson name must be 48 characters or less");
            }
            break;
          case "description":
            if (String(jsonObj[field]).length > 128) {
              missingFields.push("Description must be 128 characters or less");
            }
            break;
          case "subject":
            if (String(jsonObj[field]).length > 48) {
              missingFields.push("Subject must be 48 characters or less");
            }
            break;
          case "difficulty":
            const difficulty = String(jsonObj[field] || "").toUpperCase();
            if (
              !["BEGINNER", "INTERMEDIATE", "ADVANCED"].includes(difficulty)
            ) {
              missingFields.push(
                `${description} must be one of: BEGINNER, INTERMEDIATE, ADVANCED`
              );
            }
            break;
        }
      }

      // Check items array structure if it exists
      const items = jsonObj.items as Array<unknown>;
      if (!Array.isArray(items)) {
        missingFields.push("Items must be an array");
      } else {
        if (items.length < 5) {
          missingFields.push("Lesson must have at least 5 items");
        }

        items.forEach((item, index) => {
          if (typeof item !== "object" || item === null) {
            missingFields.push(`Item ${index + 1} must be an object`);
            return;
          }

          const itemObj = item as Record<string, unknown>;

          if (!itemObj.id) {
            missingFields.push(`Item ${index + 1} is missing an ID`);
          }

          const sides = itemObj.sides as Array<unknown>;
          if (!Array.isArray(sides) || sides.length !== 2) {
            missingFields.push(`Item ${index + 1} must have exactly 2 sides`);
          } else {
            sides.forEach((side, sideIndex) => {
              if (
                typeof side !== "object" ||
                side === null ||
                !("markdown" in side)
              ) {
                missingFields.push(
                  `Item ${index + 1}, side ${
                    sideIndex + 1
                  } is missing markdown content`
                );
              }
            });
          }

          if (!Array.isArray(itemObj.tags)) {
            missingFields.push(`Item ${index + 1} is missing tags array`);
          }
          if (!Array.isArray(itemObj.categories)) {
            missingFields.push(`Item ${index + 1} is missing categories array`);
          }
          if (typeof itemObj.intervalModifier !== "number") {
            missingFields.push(
              `Item ${index + 1} is missing intervalModifier number`
            );
          }
        });
      }

      if (missingFields.length > 0) {
        throw new Error("Validation Errors:\n- " + missingFields.join("\n- "));
      }

      // If we get here, basic validation passed
      const validatedJson = {
        ...jsonObj,
        totalItems: (jsonObj.items as Array<unknown>).length,
        difficulty: String(jsonObj.difficulty).toUpperCase(),
      } as LessonData;

      setJsonContent(validatedJson);
      setJsonError(null);
    } catch (error) {
      console.error("Error validating JSON:", error);
      setJsonError(
        error instanceof Error ? error.message : "Invalid JSON format"
      );
      setJsonContent(null);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const json = JSON.parse(text);
      validateAndSetJson(json);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      setJsonError(
        error instanceof Error ? error.message : "Failed to parse JSON file"
      );
      setJsonContent(null);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData?.getData("text") || "";
    setPastedText(text);

    try {
      const json = JSON.parse(text);
      validateAndSetJson(json);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Invalid JSON";
      let helpfulMessage = "Invalid JSON format. Common issues to check:\n";
      helpfulMessage +=
        '- Ensure all property names are in double quotes (e.g., "name": "value")\n';
      helpfulMessage += "- Check for missing commas between properties\n";
      helpfulMessage += "- Ensure arrays and objects are properly closed\n";
      helpfulMessage += "- Remove any trailing commas\n\n";
      helpfulMessage += "Parser error: " + errorMessage;

      setJsonError(helpfulMessage);
      setJsonContent(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setPastedText(newText);
  };

  const handlePastedJson = () => {
    try {
      const json = JSON.parse(pastedText);
      validateAndSetJson(json);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Invalid JSON";
      let helpfulMessage = "Invalid JSON format. Common issues to check:\n";
      helpfulMessage +=
        '- Ensure all property names are in double quotes (e.g., "name": "value")\n';
      helpfulMessage += "- Check for missing commas between properties\n";
      helpfulMessage += "- Ensure arrays and objects are properly closed\n";
      helpfulMessage += "- Remove any trailing commas\n\n";
      helpfulMessage += "Parser error: " + errorMessage;

      setJsonError(helpfulMessage);
      setJsonContent(null);
    }
  };

  const handleSubmit = async () => {
    if (!jsonContent) return;

    setIsSubmitting(true);
    try {
      // Transform the lesson data to match requirements
      const transformedLesson = {
        ...jsonContent,
        difficulty:
          jsonContent.difficulty.toUpperCase() as LessonData["difficulty"],
        totalItems: jsonContent.items.length,
      };

      // Update the wizard state with the lesson data
      updateState({
        lessonData: transformedLesson,
        difficulty: transformedLesson.difficulty,
      });

      // Create the lesson
      const response = await fetch("/api/lessons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transformedLesson),
      });

      if (!response.ok) {
        throw new Error("Failed to create lesson");
      }

      const createdLesson = await response.json();

      // Navigate to lesson detail screen
      router.push(`/lessons/${createdLesson.id}`);
    } catch (error) {
      console.error("Error submitting lesson:", error);
      setJsonError("Failed to submit lesson. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setJsonContent(null);
    setJsonError(null);
    setPastedText("");
  };

  const handleCopyPrompt = async () => {
    try {
      const prompt = getCompletedWizardPrompt(state);
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-950 p-6 pt-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-8">
          Create a new lesson from JSON
        </h2>

        {/* Prompt Helper */}
        <div className="mt-8 p-4 rounded-xl bg-gray-900 border border-gray-800 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-medium">
              Use our AI prompt to create your lesson
            </h3>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCopyPrompt}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Prompt</span>
                </>
              )}
            </motion.button>
          </div>
          <div className="text-gray-400 text-sm">
            <div className="mb-2">
              Copy our comprehensive prompt and use it with your preferred AI
              assistant (ChatGPT, Claude, etc.) to generate a lesson. The prompt
              includes:
            </div>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Step-by-step lesson creation guide</li>
              <li>Proper formatting rules for different languages</li>
              <li>Complete JSON schema with examples</li>
              <li>Instructions for generating 20 lesson items</li>
            </ul>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-800 border border-gray-700">
              <div className="flex-1">
                <span className="text-gray-300">
                  Complete guide for creating a {state.targetLanguage} lesson
                  for {state.knownLanguages?.join(" & ")} speakers
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Click Copy to use with your AI
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Method Selection */}
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 p-4 rounded-xl border ${
                uploadMethod === "paste"
                  ? "border-blue-500 bg-gray-800"
                  : "border-gray-700 bg-gray-900"
              } transition-colors`}
              onClick={() => setUploadMethod("paste")}
            >
              <Type className="w-6 h-6 mb-2" />
              <div className="text-white font-medium">Paste JSON</div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 p-4 rounded-xl border ${
                uploadMethod === "file"
                  ? "border-blue-500 bg-gray-800"
                  : "border-gray-700 bg-gray-900"
              } transition-colors`}
              onClick={() => setUploadMethod("file")}
            >
              <Upload className="w-6 h-6 mb-2" />
              <div className="text-white font-medium">Upload File</div>
            </motion.button>
          </div>

          {/* Paste Area */}
          {uploadMethod === "paste" && (
            <div className="space-y-4">
              <textarea
                value={pastedText}
                onChange={handleChange}
                onPaste={handlePaste}
                className="w-full h-64 p-4 rounded-xl bg-gray-900 border border-gray-700 text-white font-mono text-sm resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                placeholder="Paste your lesson JSON here..."
              />
              <div className="flex justify-end gap-2">
                {pastedText && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClear}
                    className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700"
                  >
                    Clear
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePastedJson}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500"
                  disabled={!pastedText}
                >
                  Validate JSON
                </motion.button>
              </div>
            </div>
          )}

          {/* File Upload Area */}
          {uploadMethod === "file" && (
            <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center">
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <FileUp className="w-12 h-12 mb-4 text-gray-400" />
                <span className="text-white font-medium">
                  Click to upload or drag and drop
                </span>
                <span className="text-gray-400 text-sm mt-1">
                  JSON files only
                </span>
              </label>
            </div>
          )}

          {/* Error Display */}
          {jsonError && (
            <div className="p-4 rounded-xl bg-red-900/50 border border-red-800 text-red-200 whitespace-pre-wrap font-mono text-sm">
              {jsonError}
            </div>
          )}

          {/* Success State */}
          {jsonContent && !jsonError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-emerald-900/50 border border-emerald-800 text-emerald-200 flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>JSON validated successfully!</span>
            </motion.div>
          )}

          {/* Submit Button */}
          {jsonContent && !jsonError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-end"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 text-lg font-medium text-white rounded-lg bg-blue-600 hover:bg-blue-500 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating Lesson..." : "Create Lesson"}
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
