import React, { useState } from "react";
import { useReadThaiGameState } from "../hooks/useReadThaiGameState";
import ItemDisplay from "../components/syllables/ItemDisplay";
import MasteryControls from "../components/syllables/MasteryControls";
import WelcomeModal from "../components/ReadThaiWelcomeModal";
import FlashCardModal from "../components/syllables/FlashCardModal";
import SettingsModalContainer from "../components/SettingsModalContainer";
import WorkingSetCards from "../components/syllables/WorkingSetCards";
import LessonSelector from "../components/syllables/LessonSelector";
import ProgressionSelector from "../components/syllables/ProgressionSelector";
import ToggleInvertTranslationButton from "../components/syllables/ToggleInvertTranslationButton";
import SettingsHamburger from "../components/ui/SettingsHamburger";
import Divider from "../components/ui/divider";
import LessonDetails from "../components/syllables/LessonDetailScreen";
import { WorkingSetItem, Lesson } from "../types/lessons";
import CheckTranslationButton from "../components/syllables/CheckTranslationButton";
import LessonProgress from "../components/syllables/LessonProgress";

interface LessonDetailsSelection {
  lesson: Lesson;
  index: number;
}

type DisplayTrigger = "speak" | "mastery" | "CheckTranslationButton" | null;

const IndexPage: React.FC = () => {
  const {
    // Game settings
    settings,
    invertTranslation,
    toggleInvertTranslation,

    // Working set state
    workingSet,
    activeVocabItem,
    setActiveVocabItem,
    addMoreItems,

    // Lesson management
    lessons,
    totalLessons,
    currentLesson,
    setCurrentLesson,

    // Progression
    progressionMode,
    setProgressionMode,
    handleFirstPassChoice,

    // Progress tracking
    lessonSubset,
  } = useReadThaiGameState();

  const [displayTrigger, setDisplayTrigger] = useState<DisplayTrigger>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showSettingsContainer, setShowSettingsContainer] = useState(false);
  const [lessonDetailsSelectedLesson, setLessonDetailsSelectedLesson] =
    useState<LessonDetailsSelection | null>(null);

  // Load more items if needed
  if (!activeVocabItem) {
    addMoreItems(5);
  }

  const handleCardSelect = (item: WorkingSetItem) => {
    setActiveVocabItem(item);
  };

  const openSettings = () => setShowSettingsContainer(true);
  const closeSettings = () => setShowSettingsContainer(false);

  const handleViewLessonDetails = (lesson: Lesson, index: number) => {
    setLessonDetailsSelectedLesson({ lesson, index });
  };

  const handleStudyLesson = (index: number) => {
    setCurrentLesson(index);
  };

  const displayItem = activeVocabItem?.vocabularyItem;

  return (
    <>
      <WelcomeModal
        isOpen={showWelcome}
        onClose={() => setShowWelcome(false)}
      />

      <div className="p-4 pt-12 relative min-h-screen bg-gray-900 text-white">
        <SettingsHamburger onClick={openSettings} />

        {/* Active Item Display */}
        {activeVocabItem ? (
          <ItemDisplay
            vocabItem={activeVocabItem.vocabularyItem}
            iconSize={52}
            textSize="text-6xl"
            className="flex items-center justify-center mb-10"
            speakOnUnmount={false}
            invertTranslation={invertTranslation}
          />
        ) : (
          <div className="flex items-center justify-center mb-10">
            <p className="text-2xl text-gray-500">
              {progressionMode === "firstPass" &&
              lessonSubset.unseenItems.length === 0
                ? "All items have been reviewed!"
                : "No item selected. Please select a lesson to study."}
            </p>
          </div>
        )}

        <CheckTranslationButton
          onClick={() => setDisplayTrigger("CheckTranslationButton")}
          current={displayItem}
        />

        <FlashCardModal
          vocabItem={displayItem}
          onNext={() => {
            if (progressionMode !== "firstPass") {
              addMoreItems();
            }
            setDisplayTrigger(null);
          }}
          trigger={displayTrigger}
          onClose={() => setDisplayTrigger(null)}
        />

        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 bg-opacity-90 p-4">
          {/* Progress Display */}
          <LessonProgress
            workingSetLength={workingSet.length}
            lessonSubset={lessonSubset}
            className="mb-4"
          />

          <Divider className="mb-4 -mx-4" borderClass="border-slate-700" />

          {/* Mastery Controls */}
          <MasteryControls
            onRatingSelect={() => {
              /* Remove handleRateMastery as it's not needed */
            }}
            mode={progressionMode}
            onFirstPassChoice={handleFirstPassChoice}
            className="mb-10 mt-10"
          />

          <Divider className="mb-4 -mx-4" borderClass="border-slate-700" />

          {/* Working Set Display */}
          <WorkingSetCards
            workingSet={workingSet}
            selectedItem={activeVocabItem}
            onCardSelect={handleCardSelect}
            addMoreItems={addMoreItems}
            progressionMode={progressionMode}
            currentLesson={currentLesson}
          />

          <Divider className="mb-4 -mx-4" borderClass="border-slate-700" />

          {/* Lesson Selection */}
          <div className="">
            <LessonSelector
              currentLesson={currentLesson}
              setCurrentLesson={setCurrentLesson}
              totalLessons={totalLessons}
              lessons={lessons}
              onViewDetails={handleViewLessonDetails}
            />

            <Divider className="mb-4 -mx-4" borderClass="border-slate-700" />

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
