import React from "react";
import { motion } from "framer-motion";
import { LanguageTags } from "./LanguageTags";
import { X } from "lucide-react";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";

interface WelcomeScreenProps {
  showNext: boolean;
  onShowNext: () => void;
  onGetStarted: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  showNext,
  onShowNext,
  onGetStarted,
}) => {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-gray-950"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={onShowNext}
    >
      {/* Close Button */}
      <button className="absolute top-8 right-8 p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
        <X size={24} />
      </button>

      <div className="flex flex-col items-center gap-6 -mt-20">
        <LanguageTags />

        {/* Palo Image */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-60 h-60 relative"
        >
          <Image
            src="/assets/images/palo.svg"
            alt="Palo AI"
            width={240}
            height={240}
            priority
            onError={(e) => {
              console.error("Error loading image:", e);
            }}
            style={{ objectFit: "contain" }}
          />
        </motion.div>

        {/* Welcome Card */}
        <motion.div
          className="relative w-96 rounded-2xl overflow-hidden shadow-xl bg-gray-900 border border-gray-800 p-6"
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(30, 64, 175, 0)",
              "0 0 20px 2px rgba(30, 64, 175, 0.2)",
              "0 0 0 0 rgba(30, 64, 175, 0)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <motion.div
            className="text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome to Palo AI
            </h1>

            <TypeAnimation
              sequence={[600, "Your personal AI language App", 200]}
              wrapper="h1"
              className="text-gray-400"
              cursor={true}
              repeat={0}
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showNext ? 1 : 0, y: showNext ? 0 : 20 }}
          transition={{ delay: 2 }}
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
      </div>
    </motion.div>
  );
};
