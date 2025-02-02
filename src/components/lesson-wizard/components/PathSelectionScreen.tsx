import React, { useState } from "react";
import { motion } from "framer-motion";
import { WizardState, PathType, LessonType, WizardView } from "../types";
import { TypeAnimation } from "react-type-animation";

interface PathSelectionScreenProps {
  state: WizardState;
  updateState: (updates: Partial<WizardState>) => void;
  onComplete: (state: WizardState) => void;
  setView: (view: WizardView) => void;
}

const lessonTypes = [
  {
    id: "conversational" as LessonType,
    title: "Conversational",
    description: "Learn through natural dialogues and everyday conversations",
    icon: "💬",
  },
  {
    id: "nouns" as LessonType,
    title: "Common Nouns",
    description: "Master essential vocabulary for objects and concepts",
    icon: "📚",
  },
  {
    id: "scenarios" as LessonType,
    title: "Common Scenarios",
    description: "Practice language in specific real-life situations",
    icon: "🎭",
  },
  {
    id: "grammar" as LessonType,
    title: "Grammar Focus",
    description: "Build strong foundations with structured grammar lessons",
    icon: "✏️",
  },
  {
    id: "culture" as LessonType,
    title: "Cultural Context",
    description: "Learn language through cultural insights and customs",
    icon: "🌏",
  },
  {
    id: "business" as LessonType,
    title: "Business & Professional",
    description: "Develop language skills for work and business settings",
    icon: "💼",
  },
];

export const PathSelectionScreen: React.FC<PathSelectionScreenProps> = ({
  state,
  updateState,
  onComplete,
  setView,
}) => {
  const [showLessonTypes, setShowLessonTypes] = useState(false);
  const [animationKey, setAnimationKey] = React.useState(0);

  const handlePathSelect = (path: PathType) => {
    updateState({ pathType: path });
    if (path === "existing") {
      setShowLessonTypes(true);
    } else if (path === "new") {
      setView("jsonUpload");
    }
  };

  const handleTypeSelect = (typeId: LessonType) => {
    const updatedState = { ...state, lessonType: typeId };
    updateState({ lessonType: typeId });
    onComplete(updatedState);
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

      <div className="max-w-4xl mx-auto">
        {!state.pathType && (
          <>
            <TypeAnimation
              sequence={["How would you like to learn?", 1000]}
              wrapper="h2"
              className="text-2xl font-bold text-white mb-8"
              cursor={true}
              repeat={0}
              key={`type-${animationKey}`}
            />
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
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
              key={`paths-${animationKey}`}
            >
              <motion.button
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.8 },
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
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 0 20px 2px rgba(0, 255, 242, 0.1)",
                }}
                whileTap={{ scale: 0.98 }}
                className="p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-cyan-800 transition-colors group"
                onClick={() => handlePathSelect("existing")}
              >
                <div className="text-3xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  Existing Lesson Path
                </h3>
                <p className="text-gray-400">
                  Follow a structured learning path with lessons curated by our
                  AI
                </p>
              </motion.button>

              <motion.button
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.8 },
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
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 0 20px 2px rgba(233, 69, 96, 0.1)",
                }}
                whileTap={{ scale: 0.98 }}
                className="p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-rose-800 transition-colors group"
                onClick={() => handlePathSelect("new")}
              >
                <div className="text-3xl mb-4">✨</div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-rose-400 transition-colors">
                  Create New Lesson with Your Own AI
                </h3>
                <p className="text-gray-400">
                  Design a custom lesson, useful if you&apos;re studying with a
                  textbook - you can use your smartphone camera and upload
                  anything you like into ChatGPT and ask it to create a lesson
                  for you.
                </p>
              </motion.button>
            </motion.div>
          </>
        )}

        {showLessonTypes && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <TypeAnimation
              sequence={["What type of lesson would you like?", 1000]}
              wrapper="h2"
              className="text-2xl font-bold text-white mb-8"
              cursor={true}
              repeat={0}
              key={`type-lessons-${animationKey}`}
            />
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={{
                show: {
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 1.7,
                  },
                },
              }}
              initial="hidden"
              animate="show"
              key={`lessons-${animationKey}`}
            >
              {lessonTypes.map((type) => (
                <motion.button
                  key={type.id}
                  variants={{
                    hidden: { opacity: 0, y: 20, scale: 0.8 },
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
                  className={`p-4 rounded-xl border ${
                    state.lessonType === type.id
                      ? "border-blue-500 bg-gray-800"
                      : "border-gray-700 bg-gray-900"
                  } transition-colors duration-200 text-left group`}
                  onClick={() => handleTypeSelect(type.id)}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{type.icon}</span>
                    <div>
                      <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors">
                        {type.title}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {type.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
