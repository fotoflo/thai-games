import React from "react";
import { motion } from "framer-motion";
import { WizardState } from "../types";
import { TypeAnimation } from "react-type-animation";

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
  const topics = state.lessonType ? topicsByType[state.lessonType] : [];

  const handleTopicSelect = (topicId: string) => {
    updateState({ selectedTopic: topicId });
    onComplete({ ...state, selectedTopic: topicId });
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
