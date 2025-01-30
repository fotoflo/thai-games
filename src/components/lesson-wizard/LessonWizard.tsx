import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { WizardState, WizardView } from "./types";
import { WizardHeader } from "./components/WizardHeader";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { LanguageSelectScreen } from "./components/LanguageSelectScreen";
import { TargetLanguageScreen } from "./components/TargetLanguageScreen";

interface LessonWizardProps {
  onComplete: (state: WizardState) => void;
  onClose: () => void;
}

const LessonWizard: React.FC<LessonWizardProps> = ({ onComplete, onClose }) => {
  const [state, setState] = useState<WizardState>({
    view: "welcome",
    showNext: false,
    knownLanguages: [],
    proficiencyLevels: {},
    selectedForProficiency: null,
    customLanguage: "",
    showCustomInput: false,
    targetLanguage: null,
  });

  const updateState = (updates: Partial<WizardState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const setView = (view: WizardView) => updateState({ view });

  const handleBack = () => {
    if (state.view === "targetSelect") {
      setView("languageSelect");
    } else if (state.view === "languageSelect") {
      setView("welcome");
    }
  };

  const handleComplete = () => {
    onComplete(state);
  };

  const handleRemoveLanguage = (language: string) => {
    const newKnownLanguages = state.knownLanguages.filter(
      (l) => l !== language
    );
    const newProficiencyLevels = { ...state.proficiencyLevels };
    delete newProficiencyLevels[language];
    updateState({
      knownLanguages: newKnownLanguages,
      proficiencyLevels: newProficiencyLevels,
    });
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <WizardHeader
        showBack={state.view !== "welcome"}
        proficiencyLevels={state.proficiencyLevels}
        targetLanguage={state.targetLanguage}
        onBack={handleBack}
        onClose={onClose}
        onRemoveLanguage={handleRemoveLanguage}
      />

      <AnimatePresence mode="wait">
        {state.view === "welcome" && (
          <WelcomeScreen
            showNext={state.showNext}
            onShowNext={() => updateState({ showNext: true })}
            onGetStarted={() => setView("languageSelect")}
          />
        )}
        {state.view === "languageSelect" && (
          <LanguageSelectScreen
            state={state}
            updateState={updateState}
            onContinue={() => setView("targetSelect")}
          />
        )}
        {state.view === "targetSelect" && (
          <TargetLanguageScreen
            state={state}
            updateState={updateState}
            onComplete={handleComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LessonWizard;
