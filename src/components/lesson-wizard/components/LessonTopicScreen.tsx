import React, { useState } from "react";
import { motion } from "framer-motion";
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
  const [animationKey, setAnimationKey] = React.useState(0);
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
      {/* Debug Replay Button */}
      <button
        onClick={() => setAnimationKey((prev) => prev + 1)}
        className="fixed top-4 right-4 px-3 py-1 bg-white/10 hover:bg-white/20 text-white/50 text-sm rounded-full transition-colors"
      >
        Replay Animations
      </button>

      <div className="max-w-6xl mx-auto">
        <TypeAnimation
          sequence={["Choose Your Lesson Topic", 1000]}
          wrapper="h2"
          className="text-2xl font-bold text-white mb-8 text-center"
          cursor={true}
          repeat={0}
          key={`type-${animationKey}`}
        />

        <motion.div
          key={`categories-${animationKey}`}
          variants={{
            show: {
              transition: {
                staggerChildren: 0.2,
                delayChildren: 1.7,
              },
            },
          }}
          initial="hidden"
          animate="show"
          className="grid gap-8"
        >
          {Object.entries(topicsByType).map(
            ([category, topics], categoryIndex) => (
              <motion.div
                key={category}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: "spring",
                      stiffness: 100,
                      damping: 15,
                      staggerChildren: 0.1,
                      delayChildren: 0.2,
                    },
                  },
                }}
                className="space-y-4"
              >
                <motion.h3
                  className="text-xl font-semibold text-white capitalize"
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    show: {
                      opacity: 1,
                      x: 0,
                      transition: {
                        type: "spring",
                        stiffness: 100,
                        damping: 15,
                      },
                    },
                  }}
                >
                  {category.replace("-", " ")}
                </motion.h3>

                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                  variants={{
                    show: {
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                >
                  {topics.map((topic) => (
                    <motion.button
                      key={topic.id}
                      variants={{
                        hidden: {
                          opacity: 0,
                          y: 20,
                          scale: 0.8,
                        },
                        show: {
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          transition: {
                            type: "spring",
                            stiffness: 100,
                            damping: 15,
                          },
                        },
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTopicSelect(topic.id)}
                      className="p-4 rounded-xl border border-gray-700 bg-gray-900 hover:bg-gray-800 transition-colors text-left"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{topic.icon}</span>
                        <div>
                          <h4 className="font-medium text-white">
                            {topic.title}
                          </h4>
                          <p className="text-sm text-gray-400 mt-1">
                            {topic.description}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              </motion.div>
            )
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};
