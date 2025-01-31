import React from "react";
import { motion } from "framer-motion";
import { WizardState, LessonType } from "../types";
import { TypeAnimation } from "react-type-animation";
import { Loader2 } from "lucide-react";

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
    {
      id: "restaurant",
      title: "At the Restaurant",
      description: "Order food and interact with restaurant staff",
      icon: "🍽️",
    },
    {
      id: "shopping",
      title: "Shopping",
      description: "Bargain, ask about items, and make purchases",
      icon: "🛍️",
    },
    {
      id: "directions",
      title: "Asking for Directions",
      description: "Navigate and ask for help finding places",
      icon: "🗺️",
    },
    {
      id: "small-talk",
      title: "Small Talk",
      description: "Casual conversation about weather, hobbies, and daily life",
      icon: "💭",
    },
    {
      id: "transportation",
      title: "Public Transportation",
      description: "Buy tickets and navigate public transit",
      icon: "🚌",
    },
  ],
  nouns: [
    {
      id: "food-drinks",
      title: "Food & Drinks",
      description: "Common ingredients, dishes, and beverages",
      icon: "🍜",
    },
    {
      id: "clothing",
      title: "Clothing & Accessories",
      description: "Items of clothing and fashion terms",
      icon: "👕",
    },
    {
      id: "household",
      title: "Household Items",
      description: "Common objects found in homes",
      icon: "🏠",
    },
    {
      id: "nature",
      title: "Nature & Animals",
      description: "Plants, animals, and natural phenomena",
      icon: "🌿",
    },
    {
      id: "technology",
      title: "Technology",
      description: "Modern devices and digital terms",
      icon: "📱",
    },
    {
      id: "body-health",
      title: "Body & Health",
      description: "Body parts and health-related terms",
      icon: "🫀",
    },
  ],
  scenarios: [
    {
      id: "doctor-visit",
      title: "Doctor's Visit",
      description: "Medical appointments and health concerns",
      icon: "👨‍⚕️",
    },
    {
      id: "job-interview",
      title: "Job Interview",
      description: "Professional conversations and work discussions",
      icon: "💼",
    },
    {
      id: "airport",
      title: "At the Airport",
      description: "Navigate airports and flight-related situations",
      icon: "✈️",
    },
    {
      id: "hotel",
      title: "Hotel Stay",
      description: "Check-in, services, and room-related requests",
      icon: "🏨",
    },
    {
      id: "emergency",
      title: "Emergency Situations",
      description: "Important phrases for urgent situations",
      icon: "🚨",
    },
    {
      id: "banking",
      title: "Banking & Finance",
      description: "Financial transactions and services",
      icon: "🏦",
    },
  ],
  grammar: [
    {
      id: "basic-sentence",
      title: "Basic Sentence Structure",
      description: "Learn fundamental sentence patterns",
      icon: "📝",
    },
    {
      id: "verb-tenses",
      title: "Verb Tenses",
      description: "Past, present, and future expressions",
      icon: "⏳",
    },
    {
      id: "questions",
      title: "Question Formation",
      description: "Different ways to ask questions",
      icon: "❓",
    },
    {
      id: "particles",
      title: "Particles & Connectors",
      description: "Essential connecting words and particles",
      icon: "🔗",
    },
    {
      id: "modifiers",
      title: "Adjectives & Adverbs",
      description: "Words that modify nouns and verbs",
      icon: "✨",
    },
    {
      id: "honorifics",
      title: "Politeness & Honorifics",
      description: "Formal and polite language usage",
      icon: "🎭",
    },
  ],
  culture: [
    {
      id: "festivals",
      title: "Festivals & Celebrations",
      description: "Traditional holidays and customs",
      icon: "🎉",
    },
    {
      id: "etiquette",
      title: "Social Etiquette",
      description: "Cultural norms and polite behavior",
      icon: "🤝",
    },
    {
      id: "food-culture",
      title: "Food Culture",
      description: "Dining customs and food traditions",
      icon: "🥢",
    },
    {
      id: "arts",
      title: "Arts & Entertainment",
      description: "Traditional and modern cultural activities",
      icon: "🎨",
    },
    {
      id: "beliefs",
      title: "Beliefs & Values",
      description: "Cultural values and belief systems",
      icon: "🙏",
    },
    {
      id: "daily-life",
      title: "Daily Life & Customs",
      description: "Everyday cultural practices",
      icon: "🌅",
    },
  ],
  business: [
    {
      id: "meetings",
      title: "Business Meetings",
      description: "Conduct and participate in meetings",
      icon: "👥",
    },
    {
      id: "negotiations",
      title: "Negotiations",
      description: "Business deals and agreements",
      icon: "🤝",
    },
    {
      id: "presentations",
      title: "Presentations",
      description: "Give and respond to presentations",
      icon: "📊",
    },
    {
      id: "email",
      title: "Email & Communication",
      description: "Professional written communication",
      icon: "📧",
    },
    {
      id: "networking",
      title: "Networking",
      description: "Professional relationship building",
      icon: "🌐",
    },
    {
      id: "reports",
      title: "Reports & Documentation",
      description: "Business documentation and reporting",
      icon: "📑",
    },
  ],
};

const lessonTypes = {
  conversational: { title: "Conversational", icon: "💬" },
  nouns: { title: "Common Nouns", icon: "📚" },
  scenarios: { title: "Common Scenarios", icon: "🎭" },
  grammar: { title: "Grammar Focus", icon: "✏️" },
  culture: { title: "Cultural Context", icon: "🌏" },
  business: { title: "Business & Professional", icon: "💼" },
};

const getTopicTitle = (state: WizardState): string => {
  if (state.customTopicTitle) return state.customTopicTitle;
  if (!state.lessonType || !state.selectedTopic) return "";

  // Find the topic in the full topics array
  const topic = topicsByType[state.lessonType].find(
    (t) => t.id === state.selectedTopic
  );

  return topic?.title || "";
};

const getLessonTypeEmoji = (type: LessonType | null): string => {
  return type ? lessonTypes[type]?.icon || "📖" : "📖";
};

const getLessonTypeTitle = (type: LessonType | null): string => {
  return type ? lessonTypes[type]?.title || "" : "";
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
                  {state.lessonType && getLessonTypeTitle(state.lessonType)}
                  {state.selectedTopic && (
                    <>
                      <span className="mx-2">•</span>
                      <span className="text-blue-400">
                        {getTopicTitle(state)}
                      </span>
                    </>
                  )}
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
