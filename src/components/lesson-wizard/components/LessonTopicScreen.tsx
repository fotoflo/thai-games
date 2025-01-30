import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WizardState } from "../types";
import { TypeAnimation } from "react-type-animation";
import { Sparkles } from "lucide-react";

interface LessonTopicScreenProps {
  state: WizardState;
  updateState: (updates: Partial<WizardState>) => void;
  onComplete: (state: WizardState) => void;
}

const topicsByType = {
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

export const LessonTopicScreen: React.FC<LessonTopicScreenProps> = ({
  state,
  updateState,
  onComplete,
}) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customTopic, setCustomTopic] = useState("");
  const topics = state.lessonType ? topicsByType[state.lessonType] : [];

  const handleTopicSelect = (topicId: string) => {
    if (topicId === "custom") {
      setShowCustomInput(true);
    } else {
      updateState({ selectedTopic: topicId });
      onComplete({ ...state, selectedTopic: topicId });
    }
  };

  const handleCustomTopicSubmit = () => {
    if (customTopic.trim()) {
      const customTopicId = `custom-${customTopic
        .toLowerCase()
        .replace(/\s+/g, "-")}`;
      updateState({
        selectedTopic: customTopicId,
        customTopicTitle: customTopic,
      });
      onComplete({
        ...state,
        selectedTopic: customTopicId,
        customTopicTitle: customTopic,
      });
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
          sequence={["Choose a specific topic to learn", 1000]}
          wrapper="h2"
          className="text-2xl font-bold text-white mb-8"
          cursor={true}
          repeat={0}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Custom Topic Card - Now at the top */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-4 rounded-xl border col-span-full ${
              showCustomInput
                ? "border-rose-500 bg-gray-800"
                : "border-gray-700 bg-gray-900 hover:border-rose-800"
            } transition-colors duration-200 group`}
          >
            {!showCustomInput ? (
              <button
                className="w-full text-left"
                onClick={() => handleTopicSelect("custom")}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✨</span>
                  <div>
                    <h3 className="font-medium text-white group-hover:text-rose-400 transition-colors flex items-center gap-2">
                      Custom Topic
                      <Sparkles className="w-4 h-4" />
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Create a personalized lesson with AI assistance
                    </p>
                  </div>
                </div>
              </button>
            ) : (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <div className="flex flex-col gap-3">
                    <input
                      type="text"
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      placeholder="Enter your topic..."
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-rose-500"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleCustomTopicSubmit}
                        disabled={!customTopic.trim()}
                        className="flex-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 disabled:bg-gray-700 text-white rounded-lg transition-colors"
                      >
                        Create Lesson
                      </button>
                      <button
                        onClick={() => {
                          setShowCustomInput(false);
                          setCustomTopic("");
                        }}
                        className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </motion.div>

          {/* Regular Topic Cards */}
          {topics.map((topic) => (
            <motion.button
              key={topic.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-xl border ${
                state.selectedTopic === topic.id
                  ? "border-blue-500 bg-gray-800"
                  : "border-gray-700 bg-gray-900"
              } transition-colors duration-200 text-left group`}
              onClick={() => handleTopicSelect(topic.id)}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{topic.icon}</span>
                <div>
                  <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {topic.description}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
