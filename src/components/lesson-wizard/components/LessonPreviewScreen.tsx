import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WizardState, LessonType, LessonData } from "../types";
import { TypeAnimation } from "react-type-animation";
import { Loader2, Copy, Check } from "lucide-react";
import { getCompletedWizardPrompt } from "../data/lessonPrompts";
import { useMutation } from "@tanstack/react-query";

interface LessonPreviewScreenProps {
  state: WizardState;
  onComplete: (state: WizardState) => void;
}

interface StreamingItem {
  sides: Array<{
    markdown: string;
    metadata?: {
      pronunciation?: string;
    };
  }>;
}

interface StreamingMetadata {
  name: string;
  description: string;
  subject: string;
  difficulty: string;
  categories: Array<{ name: string; id: string }>;
}

const lessonTypes = {
  conversational: { icon: "💬" },
  nouns: { icon: "📚" },
  scenarios: { icon: "🎭" },
  grammar: { icon: "✏️" },
  culture: { icon: "🌏" },
  business: { icon: "💼" },
} as const;

const getLessonTypeEmoji = (type: LessonType | null): string => {
  return type ? lessonTypes[type]?.icon || "📖" : "📖";
};

const FETCH_TIMEOUT_MS = 120000; // 2 minutes

export const LessonPreviewScreen: React.FC<LessonPreviewScreenProps> = ({
  state,
  onComplete,
}) => {
  const [copied, setCopied] = React.useState(false);
  const [streamingMetadata, setStreamingMetadata] =
    React.useState<StreamingMetadata | null>(null);
  const [streamingItems, setStreamingItems] = React.useState<StreamingItem[]>(
    []
  );
  const [totalItems, setTotalItems] = React.useState(0);

  // Create a mutation for generating lessons
  const generateLessonMutation = useMutation({
    mutationFn: async () => {
      const prompt = getCompletedWizardPrompt(state);
      console.log("Frontend: Starting generation with prompt:", prompt);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

      try {
        console.log("Frontend: Sending request...");
        const response = await fetch("/api/generate-lesson", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
          signal: controller.signal,
        });

        console.log("Frontend: Got response:", {
          ok: response.ok,
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
        });

        if (!response.ok) throw new Error("Failed to generate lesson");
        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        let lesson: LessonData | null = null;

        console.log("Frontend: Starting to read stream...");
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log("Frontend: Stream complete");
            break;
          }

          const text = new TextDecoder().decode(value);
          console.log("Frontend: Received chunk:", text);

          const lines = text.split("\n");
          console.log("Frontend: Processing", lines.length, "lines");

          for (const line of lines) {
            if (!line.trim() || !line.startsWith("data: ")) {
              console.log("Frontend: Skipping empty/invalid line");
              continue;
            }
            if (line.includes("[DONE]")) {
              console.log("Frontend: Received DONE signal");
              break;
            }

            try {
              const data = JSON.parse(line.slice(5));
              console.log("Frontend: Parsed event:", { type: data.type, data });

              switch (data.type) {
                case "start":
                  console.log("Frontend: Handling start event");
                  setStreamingMetadata(null);
                  setStreamingItems([]);
                  break;
                case "metadata":
                  console.log("Frontend: Setting metadata:", data.data);
                  setStreamingMetadata(data.data);
                  break;
                case "items":
                  console.log("Frontend: Adding items:", {
                    newItems: data.items.length,
                    currentTotal: streamingItems.length,
                    incomingTotal: data.total,
                  });
                  setStreamingItems((prev) => {
                    console.log("Frontend: Previous items:", prev.length);
                    const newItems = [...prev, ...data.items];
                    console.log("Frontend: Updated items:", newItems.length);
                    return newItems;
                  });
                  setTotalItems(data.total);
                  break;
                case "complete":
                  console.log("Frontend: Received complete lesson");
                  lesson = data.lesson;
                  break;
                case "error":
                  console.error("Frontend: Received error:", data.error);
                  throw new Error(data.error);
              }
            } catch (parseError) {
              console.error(
                "Frontend: Error parsing line:",
                parseError,
                "Line:",
                line
              );
            }
          }
        }

        if (!lesson) throw new Error("No complete lesson received");
        return lesson;
      } finally {
        clearTimeout(timeoutId);
      }
    },
    onSuccess: (lesson: LessonData) => {
      // Don't immediately complete - just store the lesson data
      console.log("Frontend: Mutation succeeded with lesson:", lesson);
    },
    onError: (error) => {
      console.error("Frontend: Mutation failed:", error);
    },
  });

  // Debug useEffect to monitor state changes
  React.useEffect(() => {
    console.log("Frontend: streamingItems updated:", streamingItems);
  }, [streamingItems]);

  React.useEffect(() => {
    console.log("Frontend: streamingMetadata updated:", streamingMetadata);
  }, [streamingMetadata]);

  // Start generation when component mounts
  React.useEffect(() => {
    generateLessonMutation.mutate();
  }, []);

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
        <TypeAnimation
          sequence={["Preview Your Lesson", 1000]}
          wrapper="h2"
          className="text-2xl font-bold text-white mb-8"
          cursor={true}
          repeat={0}
        />

        <div className="space-y-6">
          {/* Topic Info */}
          <motion.div
            className="p-6 rounded-xl bg-gray-900 border border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {getLessonTypeEmoji(state.lessonType)}
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {streamingMetadata?.name ||
                      `${state.targetLanguage} Lesson`}
                  </h3>
                  <p className="text-gray-300 mt-1 font-medium">
                    {streamingMetadata?.description ||
                      "Generating lesson content..."}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCopyPrompt}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
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
          </motion.div>

          {/* Preview Cards */}
          <div className="space-y-4">
            {!streamingItems.length && generateLessonMutation.isPending && (
              <motion.div
                className="flex items-center justify-center p-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <span className="ml-3 text-gray-400">
                  Generating lesson content...
                </span>
              </motion.div>
            )}

            <AnimatePresence mode="popLayout">
              {streamingItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  className="p-4 rounded-xl bg-gray-900 border border-gray-800"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-medium">
                        {item.sides[0].markdown}
                      </p>
                      <p className="text-gray-400 mt-2">
                        {item.sides[1].markdown}
                      </p>
                      {item.sides[0].metadata?.pronunciation && (
                        <p className="text-sm text-gray-500 mt-1">
                          {item.sides[0].metadata.pronunciation}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {streamingItems.length > 0 && (
              <motion.p
                className="text-gray-400 text-sm text-center mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                Generated {streamingItems.length} of {totalItems || "?"} items
              </motion.p>
            )}
          </div>

          {generateLessonMutation.isError && (
            <motion.div
              className="p-6 rounded-xl bg-red-900/20 border border-red-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-red-400 font-medium mb-2">
                Error generating lesson:
              </p>
              <p className="text-red-300 mb-4 font-mono text-sm whitespace-pre-wrap">
                {generateLessonMutation.error instanceof Error
                  ? generateLessonMutation.error.message
                  : "An unexpected error occurred"}
              </p>
              <button
                onClick={() => generateLessonMutation.mutate()}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end pt-4">
            <button
              onClick={() => generateLessonMutation.mutate()}
              disabled={generateLessonMutation.isPending}
              className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors disabled:opacity-50"
            >
              Regenerate
            </button>
            <button
              onClick={() => {
                if (generateLessonMutation.data) {
                  onComplete({
                    ...state,
                    lessonData: generateLessonMutation.data,
                    difficulty: generateLessonMutation.data.difficulty,
                  });
                }
              }}
              disabled={
                generateLessonMutation.isPending || !generateLessonMutation.data
              }
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50"
            >
              Create Lesson
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
