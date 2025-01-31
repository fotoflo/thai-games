import React from "react";
import { motion } from "framer-motion";
import { WizardState, LessonType } from "../types";
import { TypeAnimation } from "react-type-animation";
import { Loader2 } from "lucide-react";
import { toTitleCase } from "../utils/stringUtils";

interface LessonPreviewScreenProps {
  state: WizardState;
  updateState: (updates: Partial<WizardState>) => void;
  onComplete: (state: WizardState) => void;
}

interface TopicData {
  id: string;
  title: string;
  description: string;
  icon: string;
}

type NonNullLessonType = Exclude<LessonType, null>;

const topicsByType: Record<NonNullLessonType, TopicData[]> = {
  conversational: [
    {
      id: "meeting-friends",
      title: "Meeting New Friends",
      description: "Learn phrases for introducing yourself and making friends",
      icon: "👋",
    },
    // ... other conversational topics
  ],
  nouns: [
    {
      id: "food-drinks",
      title: "Food & Drinks",
      description: "Common ingredients, dishes, and beverages",
      icon: "🍜",
    },
    // ... other noun topics
  ],
  scenarios: [
    {
      id: "doctor-visit",
      title: "Doctor's Visit",
      description: "Medical appointments and health concerns",
      icon: "👨‍⚕️",
    },
    // ... other scenario topics
  ],
  grammar: [
    {
      id: "basic-sentence",
      title: "Basic Sentence Structure",
      description: "Learn fundamental sentence patterns",
      icon: "📝",
    },
    // ... other grammar topics
  ],
  culture: [
    {
      id: "festivals",
      title: "Festivals & Celebrations",
      description: "Traditional holidays and customs",
      icon: "🎉",
    },
    // ... other culture topics
  ],
  business: [
    {
      id: "meetings",
      title: "Business Meetings",
      description: "Conduct and participate in meetings",
      icon: "👥",
    },
    // ... other business topics
  ],
};

const getTopicTitle = (state: WizardState): string => {
  if (state.customTopicTitle) return state.customTopicTitle;
  if (!state.lessonType || !state.selectedTopic) return "";
  return (
    topicsByType[state.lessonType]?.find((t) => t.id === state.selectedTopic)
      ?.title || ""
  );
};

const getLessonTypeEmoji = (type: LessonType | null): string => {
  switch (type) {
    case "conversational":
      return "💬";
    case "nouns":
      return "📚";
    case "scenarios":
      return "🎭";
    case "grammar":
      return "✏️";
    case "culture":
      return "🌏";
    case "business":
      return "💼";
    default:
      return "📖";
  }
};

const formatKnownLanguages = (languages: string[]): string => {
  if (languages.length === 0) return "";
  if (languages.length === 1) return languages[0];
  if (languages.length === 2) return `${languages[0]} & ${languages[1]}`;
  return `${languages.slice(0, -1).join(", ")}, & ${
    languages[languages.length - 1]
  }`;
};

export const LessonPreviewScreen: React.FC<LessonPreviewScreenProps> = ({
  state,
  updateState,
  onComplete,
}) => {
  const [isGenerating, setIsGenerating] = React.useState(true);
  const [previewItems, setPreviewItems] = React.useState<
    Array<{
      front: string;
      back: string;
    }>
  >([]);

  React.useEffect(() => {
    // Simulate AI generation - replace with actual API call
    const timer = setTimeout(() => {
      setPreviewItems([
        {
          front: "Hello, how are you?",
          back: "สวัสดี คุณสบายดีไหม",
        },
        {
          front: "Nice to meet you",
          back: "ยินดีที่ได้รู้จัก",
        },
        {
          front: "What's your name?",
          back: "คุณชื่ออะไร",
        },
      ]);
      setIsGenerating(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleApprove = () => {
    onComplete(state);
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    // Simulate regeneration - replace with actual API call
    setTimeout(() => {
      setPreviewItems([
        {
          front: "Where are you from?",
          back: "คุณมาจากไหน",
        },
        {
          front: "I'm from America",
          back: "ผมมาจากอเมริกา",
        },
        {
          front: "Do you like Thai food?",
          back: "คุณชอบอาหารไทยไหม",
        },
      ]);
      setIsGenerating(false);
    }, 2000);
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
          <div className="p-6 rounded-xl bg-gray-900 border border-gray-800">
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {getLessonTypeEmoji(state.lessonType)}
              </span>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {state.targetLanguage} for{" "}
                  {formatKnownLanguages(state.knownLanguages)} Speakers
                </h3>
                <p className="text-gray-300 mt-1 font-medium">
                  {state.lessonType && toTitleCase(state.lessonType)} •{" "}
                  {getTopicTitle(state)}
                </p>
              </div>
            </div>
          </div>

          {/* Preview Cards */}
          {isGenerating ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <span className="ml-3 text-gray-400">
                Generating lesson content...
              </span>
            </div>
          ) : (
            <div className="space-y-4">
              {previewItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-gray-900 border border-gray-800"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-medium">{item.front}</p>
                      <p className="text-gray-400 mt-2">{item.back}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end pt-4">
            <button
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors disabled:opacity-50"
            >
              Regenerate
            </button>
            <button
              onClick={handleApprove}
              disabled={isGenerating}
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
