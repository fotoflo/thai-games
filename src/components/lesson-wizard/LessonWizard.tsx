import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { WizardState, WizardView } from "./types";
import { WizardHeader } from "./components/WizardHeader";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { LanguageSelectScreen } from "./components/LanguageSelectScreen";
import { TargetLanguageScreen } from "./components/TargetLanguageScreen";
import { PathSelectionScreen } from "./components/PathSelectionScreen";
import { JsonUploadScreen } from "./components/JsonUploadScreen";

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
    pathType: null,
    lessonType: null,
    lessonData: null,
  });

  const updateState = (updates: Partial<WizardState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const setView = (view: WizardView) => updateState({ view });

  const handleBack = () => {
    if (state.view === "jsonUpload") {
      setView("pathSelect");
      updateState({ pathType: null }); // Reset path type when going back
    } else if (state.view === "targetSelect") {
      setView("languageSelect");
    } else if (state.view === "languageSelect") {
      setView("welcome");
    }
  };

  const handleComplete = () => {
    if (state.view === "targetSelect") {
      setView("pathSelect");
    } else if (state.view === "pathSelect" && state.pathType === "new") {
      setView("jsonUpload");
    } else if (state.view === "pathSelect" && state.lessonType) {
      // Only complete if we have all required data
      if (
        state.knownLanguages.length > 0 &&
        state.targetLanguage &&
        state.pathType
      ) {
        onComplete(state);
      }
    } else if (state.view === "jsonUpload" && state.lessonData) {
      onComplete(state);
    }
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
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <WizardHeader
        showBack={state.view !== "welcome"}
        proficiencyLevels={state.proficiencyLevels}
        targetLanguage={state.targetLanguage}
        onBack={handleBack}
        onClose={onClose}
        onRemoveLanguage={handleRemoveLanguage}
      />

      <div className="flex-1">
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
          {state.view === "pathSelect" && (
            <PathSelectionScreen
              state={state}
              updateState={updateState}
              onComplete={handleComplete}
              setView={setView}
            />
          )}
          {state.view === "jsonUpload" && (
            <JsonUploadScreen
              state={state}
              updateState={updateState}
              onComplete={onComplete}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LessonWizard;
