import React, { useState, MouseEvent } from "react";
import { useReadThaiGameState } from "../hooks/useReadThaiGameState";
import ItemDisplay from "../components/syllables/ItemDisplay";
import MasteryControls from "../components/syllables/MasteryControls";
import WelcomeModal from "../components/ReadThaiWelcomeModal";
import CheckTranslationButton from "../components/syllables/CheckTranslationButton";
import FlashCardModal from "../components/syllables/FlashCardModal";
import SettingsModalContainer from "../components/SettingsModalContainer";
import WorkingSetCards from "../components/syllables/WorkingSetCards";
import LessonCarousel from "../components/LessonCarousel";
import ProgressionSelector from "../components/syllables/ProgressionSelector";
import ToggleInvertTranslationButton from "../components/syllables/ToggleInvertTranslationButton";
import SettingsHamburger from "../components/ui/SettingsHamburger";
import Divider from "../components/ui/divider";
import SettingsMenuButton from "../components/SettingsMenuButton";
import LessonDetails from "../components/syllables/LessonDetailScreen";
import { WorkingSetItem, Lesson } from "../types/lessons";

interface LessonDetailsSelection {
  lesson: Lesson;
  index: number;
}

type DisplayTrigger = "speak" | "mastery" | "CheckTranslationButton" | null;

const ThaiSyllables: React.FC = () => {
  const gameState = useReadThaiGameState();
  const [displayTrigger, setDisplayTrigger] = useState<DisplayTrigger>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showSettingsContainer, setShowSettingsContainer] = useState(false);
  const [lessonDetailsSelectedLesson, setLessonDetailsSelectedLesson] =
    useState<LessonDetailsSelection | null>(null);

  const {
    currentLesson,
    setCurrentLesson,
    totalLessons,
    workingSet,
    selectedItem: activeItem, // renamed from current
    problemList,
    possibleProblemList,
    workingList,
    rateMastery,
    reportProblem,
    reportPossibleProblem,
    addMoreItems: addMoreSyllables,
    getCurrentProgress,
    setProgressionMode,
    progressionMode,
    lessons,
    invertTranslation,
    toggleInvertTranslation,
  } = gameState;

  console.log("Render ThaiSyllables:", { currentLesson, totalLessons });

  const handleRateMastery = async (rating: number) => {
    const button = (event.target as Element).closest("button");
    if (button) {
      button.classList.add("clicked");

      setTimeout(() => {
        button.classList.remove("clicked");
      }, 1000);
    }

    await rateMastery(rating);
  };

  const handleCardSelect = (item: WorkingSetItem) => {
    const targetIndex = workingSet.findIndex((s) => s.id === item.id);
    if (targetIndex !== -1) {
      rateMastery(0, null, targetIndex);
    }
  };

  if (!activeItem) {
    addMoreSyllables(5);
  }

  const openSettings = () => {
    setShowSettingsContainer(true);
  };

  const closeSettings = () => {
    setShowSettingsContainer(false);
  };

  const handleViewLessonDetails = (lesson: Lesson, index: number) => {
    setLessonDetailsSelectedLesson({ lesson, index });
  };

  const handleStudyLesson = (index: number) => {
    setCurrentLesson(index);
  };

  return (
    <>
      <WelcomeModal
        isOpen={showWelcome}
        onClose={() => setShowWelcome(false)}
      />

      <div className="p-4 pt-12 relative min-h-screen bg-gray-900 text-white">
        <SettingsHamburger onClick={openSettings} />

        <ItemDisplay
          current={activeItem}
          iconSize={52}
          textSize="text-6xl"
          className="flex items-center justify-center mb-10"
          speakOnUnmount={true}
          invertTranslation={invertTranslation}
        />

        <CheckTranslationButton
          onClick={() => setDisplayTrigger("CheckTranslationButton")}
          current={activeItem}
          invertTranslation={invertTranslation}
          toggleInvertTranslation={toggleInvertTranslation}
        />

        {/* <pre style={{ fontSize: "small" }}>
          {JSON.stringify(activeItem || "", null, 2)}
        </pre> */}

        <FlashCardModal
          vocabItem={activeItem?.vocabularyItem}
          onNext={() => {
            gameState.addMoreSyllables();
            setDisplayTrigger(null);
          }}
          trigger={displayTrigger}
          onClose={() => setDisplayTrigger(null)}
        />

        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 bg-opacity-90 p-4">
          <Divider className="mb-10 -mx-4" borderClass="border-slate-700" />

          <MasteryControls
            onRatingSelect={handleRateMastery}
            className="mb-10"
          />

          <Divider className="mb-4 -mx-4" borderClass="border-slate-700" />

          <WorkingSetCards
            workingSet={workingSet}
            selectedItem={activeItem}
            onCardSelect={handleCardSelect}
            addMoreSyllables={addMoreSyllables}
          />

          <Divider className="mb-4 -mx-4" borderClass="border-slate-700" />

          <div className="mt-4">
            <LessonCarousel
              currentLesson={currentLesson}
              setCurrentLesson={setCurrentLesson}
              totalLessons={totalLessons}
              lessons={lessons}
              onViewDetails={handleViewLessonDetails}
            />

            <ProgressionSelector
              progressionMode={progressionMode}
              onModeChange={setProgressionMode}
            />

            <ToggleInvertTranslationButton
              toggleInvertTranslation={toggleInvertTranslation}
              invertTranslation={invertTranslation}
            />
          </div>
        </div>

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

export default ThaiSyllables;
