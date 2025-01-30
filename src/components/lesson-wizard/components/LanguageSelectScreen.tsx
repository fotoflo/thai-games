import React from "react";
import { motion } from "framer-motion";
import { WizardState } from "../types";
import { LanguageTags } from "./LanguageTags";
import { commonLanguages } from "../data/constants";
import { toTitleCase } from "../utils/stringUtils";
import { ArrowLeft, X } from "lucide-react";

interface LanguageSelectScreenProps {
  state: WizardState;
  updateState: (updates: Partial<WizardState>) => void;
  onContinue: () => void;
  onBack: () => void;
  onClose: () => void;
}

export const LanguageSelectScreen: React.FC<LanguageSelectScreenProps> = ({
  state,
  updateState,
  onContinue,
  onBack,
  onClose,
}) => {
  const {
    knownLanguages,
    proficiencyLevels,
    selectedForProficiency,
    customLanguage,
    showCustomInput,
  } = state;

  const proficiencyOptions = ["Native", "Advanced", "Medium", "Beginner"];

  const handleLanguageSelect = (language: (typeof commonLanguages)[0]) => {
    if (language.code === "other") {
      updateState({ showCustomInput: true });
    } else if (!knownLanguages.includes(language.name)) {
      updateState({ selectedForProficiency: language.name });
    } else {
      const newKnownLanguages = knownLanguages.filter(
        (l) => l !== language.name
      );
      const newProficiencyLevels = { ...proficiencyLevels };
      delete newProficiencyLevels[language.name];
      updateState({
        knownLanguages: newKnownLanguages,
        proficiencyLevels: newProficiencyLevels,
      });
    }
  };

  const handleProficiencySelect = (level: string) => {
    if (selectedForProficiency) {
      updateState({
        knownLanguages: [...knownLanguages, selectedForProficiency],
        proficiencyLevels: {
          ...proficiencyLevels,
          [selectedForProficiency]: level,
        },
        selectedForProficiency: null,
      });
    }
  };

  const handleCustomLanguageAdd = () => {
    if (customLanguage.trim()) {
      updateState({
        selectedForProficiency: toTitleCase(customLanguage.trim()),
        showCustomInput: false,
        customLanguage: "",
      });
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-950 p-6 pt-24 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-8 left-8 p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={24} />
      </button>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-8 right-8 p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
      >
        <X size={24} />
      </button>

      <LanguageTags proficiencyLevels={proficiencyLevels} />

      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-2xl font-bold text-white mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          Select languages you know
        </motion.h2>

        <motion.div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[
            ...commonLanguages,
            { code: "other", name: "Another Language", flag: "🌐" },
          ].map((language) => (
            <motion.button
              key={language.code}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-xl border ${
                knownLanguages.includes(language.name)
                  ? "border-blue-500 bg-gray-800"
                  : "border-gray-700 bg-gray-900"
              } transition-colors duration-200`}
              onClick={() => handleLanguageSelect(language)}
            >
              <span className="text-white flex items-center gap-2">
                <span className="text-xl">{language.flag}</span>
                {language.name}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {showCustomInput && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-0 bg-gray-950/80 backdrop-blur-sm flex items-center justify-center p-6 z-50"
          >
            <motion.div
              className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-800"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                Enter Custom Language
              </h3>
              <input
                type="text"
                value={customLanguage}
                onChange={(e) =>
                  updateState({ customLanguage: e.target.value })
                }
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none mb-4"
                placeholder="Enter language name..."
                autoFocus
              />
              <div className="flex justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700"
                  onClick={() =>
                    updateState({
                      showCustomInput: false,
                      customLanguage: "",
                    })
                  }
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500"
                  onClick={handleCustomLanguageAdd}
                >
                  Add Language
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {selectedForProficiency && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-0 bg-gray-950/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-800"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                Select proficiency level for {selectedForProficiency}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {proficiencyOptions.map((level) => (
                  <motion.button
                    key={level}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white"
                    onClick={() => handleProficiencySelect(level)}
                  >
                    {level}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {knownLanguages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 text-lg font-medium text-white rounded-lg bg-blue-600 hover:bg-blue-500 shadow-lg"
              onClick={onContinue}
            >
              Continue
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
