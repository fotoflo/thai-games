import React, { useState } from "react";
import { useReadThaiGame } from "../context/ReadThaiGameContext";
import ItemDisplay from "../components/syllables/ItemDisplay";
import MasteryControls from "../components/syllables/MasteryControls";
import WelcomeModal from "../components/ReadThaiWelcomeModal";
import FlashCardModal from "../components/syllables/FlashCardModal";
import SettingsModalContainer from "../components/SettingsModalContainer";
import PracticeSetCards from "../components/syllables/PracticeSetCards";
import LessonSelector from "../components/syllables/LessonSelector";
import ProgressionSelector from "../components/syllables/ProgressionSelector";
import ToggleInvertTranslationButton from "../components/syllables/ToggleInvertTranslationButton";
import SettingsHamburger from "../components/ui/SettingsHamburger";
import Divider from "../components/ui/divider";
import LessonDetails from "../components/syllables/LessonDetailScreen";
import { Lesson } from "../types/lessons";

interface LessonDetailsSelection {
  lesson: Lesson;
  index: number;
}

type DisplayTrigger = "speak" | "mastery" | "CheckTranslationButton" | null;

const IndexPage: React.FC = () => {
  const {
    // Game settings
    invertTranslation,
    toggleInvertTranslation,

    // Game state
    activeItem,
    lessons,
    currentLesson,
    setCurrentLesson,

    // Progression
    progressionMode,
    handleSwitchToPracticeMode,

    // Actions
    nextItem,
    handleMarkForPractice,
    handleMarkAsMastered,
    handleSkipItem,

    // Sets
    practiceSet,
  } = useReadThaiGame();

  const [displayTrigger, setDisplayTrigger] = useState<DisplayTrigger>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showSettingsContainer, setShowSettingsContainer] = useState(false);
  const [lessonDetailsSelectedLesson, setLessonDetailsSelectedLesson] =
    useState<LessonDetailsSelection | null>(null);

  const openSettings = () => setShowSettingsContainer(true);
  const closeSettings = () => setShowSettingsContainer(false);

  const handleViewLessonDetails = (lesson: Lesson, index: number) => {
    setLessonDetailsSelectedLesson({ lesson, index });
  };

  const handleStudyLesson = (index: number) => {
    setCurrentLesson(index);
  };

  if (!activeItem) {
    return (
      <div className="flex items-center justify-center mb-10">
        <p className="text-2xl text-gray-500">
          No item selected. Please select a lesson to study.
        </p>
      </div>
    );
  }

  return (
    <>
      <WelcomeModal
        isOpen={showWelcome}
        onClose={() => setShowWelcome(false)}
      />

      <div className="p-4 pt-12 relative min-h-screen bg-gray-900 text-white">
        <SettingsHamburger onClick={openSettings} />

        {/* Active Item Display */}
        <ItemDisplay
          superSetItem={activeItem}
          iconSize={52}
          textSize="text-6xl"
          className="flex items-center justify-center mb-10"
          speakOnUnmount={false}
          invertTranslation={invertTranslation}
        />

        <FlashCardModal
          superSetItem={activeItem}
          onNext={() => {
            nextItem();
            setDisplayTrigger(null);
          }}
          trigger={displayTrigger}
          onClose={() => setDisplayTrigger(null)}
          mode={progressionMode}
        />

        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 bg-opacity-90 p-4">
          <Divider className="mb-4 -mx-4" borderClass="border-slate-700" />

          {/* Mastery Controls */}
          <MasteryControls
            mode={progressionMode}
            handleMarkForPractice={handleMarkForPractice}
            handleMarkAsMastered={handleMarkAsMastered}
            handleSkipItem={handleSkipItem}
            className="mb-10"
          />

          <Divider className="mb-4 -mx-4" borderClass="border-slate-700" />

          {/* Practice Set Display */}
          <PracticeSetCards practiceSet={practiceSet} activeItem={activeItem} />

          <Divider className="mb-4 -mx-4" borderClass="border-slate-700" />

          {/* Lesson Selection */}
          <div className="">
            <LessonSelector
              currentLesson={currentLesson}
              setCurrentLesson={setCurrentLesson}
              lessons={lessons}
              onViewDetails={handleViewLessonDetails}
            />

            <Divider className="mb-4 -mx-4" borderClass="border-slate-700" />

            <ProgressionSelector
              progressionMode={progressionMode}
              onModeChange={handleSwitchToPracticeMode}
            />

            <ToggleInvertTranslationButton
              toggleInvertTranslation={toggleInvertTranslation}
              invertTranslation={invertTranslation}
            />
          </div>
        </div>

        {/* Modals */}
        {showSettingsContainer && (
          <SettingsModalContainer onClose={closeSettings} />
        )}
        {lessonDetailsSelectedLesson && (
          <div className="fixed inset-0 z-50">
            <LessonDetails
              lesson={lessonDetailsSelectedLesson.lesson}
              lessonIndex={lessonDetailsSelectedLesson.index}
              onClose={() => setLessonDetailsSelectedLesson(null)}
              onStudyLesson={handleStudyLesson}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default IndexPage;
