import React from "react";
import { motion } from "framer-motion";
import { ProficiencyLevels } from "../types";

interface LanguageTagsProps {
  proficiencyLevels?: ProficiencyLevels;
}

export const LanguageTags: React.FC<LanguageTagsProps> = ({
  proficiencyLevels = {},
}) => {
  return (
    <div className="fixed top-0 left-0 w-full p-6 bg-gray-950/80 backdrop-blur-sm border-b border-gray-800 z-50">
      <motion.div className="flex flex-wrap gap-2">
        {Object.entries(proficiencyLevels).map(([lang, level]) => (
          <motion.span
            key={lang}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-3 py-1 rounded-full bg-gray-800 text-gray-200 text-sm"
          >
            {lang}: {level}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};
