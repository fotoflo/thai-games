import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { ProficiencyLevels } from "../types";

interface LanguageTagsProps {
  proficiencyLevels?: ProficiencyLevels;
  targetLanguage?: string | null;
  onRemove?: (language: string) => void;
}

export const LanguageTags: React.FC<LanguageTagsProps> = ({
  proficiencyLevels = {},
  targetLanguage,
  onRemove,
}) => {
  const hasKnownLanguages = Object.keys(proficiencyLevels).length > 0;

  return (
    <div className="flex flex-col gap-4">
      {hasKnownLanguages && (
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">I know:</h3>
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
      )}

      {targetLanguage && (
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Learning:</h3>
          <div className="flex flex-wrap gap-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-3 py-1 rounded-full bg-emerald-900/50 text-emerald-200 text-sm border border-emerald-800"
            >
              {targetLanguage}
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};
