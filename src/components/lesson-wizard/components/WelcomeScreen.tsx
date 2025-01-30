import React from "react";
import { motion } from "framer-motion";
import { LanguageTags } from "./LanguageTags";
import { X } from "lucide-react";

interface WelcomeScreenProps {
  showNext: boolean;
  onShowNext: () => void;
  onGetStarted: () => void;
  onClose: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  showNext,
  onShowNext,
  onGetStarted,
  onClose,
}) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-950 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={onShowNext}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-8 right-8 p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
      >
        <X size={24} />
      </button>

      <LanguageTags />

      {/* Welcome Card */}
      <motion.div
        className="relative w-96 h-48 rounded-2xl overflow-hidden shadow-xl bg-gray-900 border border-gray-800"
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(30, 64, 175, 0)",
            "0 0 20px 2px rgba(30, 64, 175, 0.2)",
            "0 0 0 0 rgba(30, 64, 175, 0)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.h1
            className="text-5xl font-bold text-white"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Welcome
          </motion.h1>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showNext ? 1 : 0, y: showNext ? 0 : 20 }}
        transition={{ delay: 1 }}
        className="mt-12"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 text-lg font-medium text-white rounded-lg bg-blue-600 hover:bg-blue-500 shadow-lg"
          onClick={onGetStarted}
        >
          Get Started
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
