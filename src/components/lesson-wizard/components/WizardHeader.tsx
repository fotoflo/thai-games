import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import { LanguageTags } from "./LanguageTags";
import { ProficiencyLevels } from "../types";

interface WizardHeaderProps {
  showBack?: boolean;
  proficiencyLevels: ProficiencyLevels;
  targetLanguage?: string | null;
  onBack?: () => void;
  onClose: () => void;
  onRemoveLanguage?: (language: string) => void;
}

export const WizardHeader: React.FC<WizardHeaderProps> = ({
  showBack = false,
  proficiencyLevels,
  targetLanguage,
  onBack,
  onClose,
  onRemoveLanguage,
}) => {
  return (
    <motion.div
      className="w-full bg-gray-950"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Navigation Buttons */}
      <div className="relative flex items-center justify-end gap-2 p-4">
        {showBack && onBack && (
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Language Tags */}
      <div className="w-full p-6 bg-gray-950 border-b border-gray-800">
        <LanguageTags
          proficiencyLevels={proficiencyLevels}
          targetLanguage={targetLanguage}
          onRemove={onRemoveLanguage}
        />
      </div>
    </motion.div>
  );
};
