import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { ProficiencyLevels } from "../types";

interface LanguageTagsProps {
  proficiencyLevels?: ProficiencyLevels;
  onRemove?: (language: string) => void;
}

export const LanguageTags: React.FC<LanguageTagsProps> = ({
  proficiencyLevels = {},
  onRemove,
}) => {
  return (
    <div className="fixed top-0 left-0 w-full p-6 bg-gray-950/80 backdrop-blur-sm border-b border-gray-800 z-50">
      <div className="flex flex-wrap gap-2">
        {Object.entries(proficiencyLevels).map(([lang, level]) => (
          <motion.div
            key={lang}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group flex items-center gap-1 px-3 py-1 rounded-full bg-gray-800 text-gray-200 text-sm"
          >
            <span>
              {lang}: {level}
            </span>
            {onRemove && (
              <button
                onClick={() => onRemove(lang)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-gray-700 rounded-full"
              >
                <X size={14} />
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
