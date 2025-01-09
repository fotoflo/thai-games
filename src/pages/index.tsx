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
import SettingsHamburger from "../components/ui/SettingsHamburger";
import Divider from "../components/ui/divider";
import LessonDetails from "../components/syllables/LessonDetailScreen";
import { Lesson } from "../types/lessons";
import SuperSetVisualizer from "@/components/syllables/SuperSetVisualizer";
import CheckTranslationButton from "../components/syllables/CheckTranslationButton";

interface LessonDetailsSelection {
  lesson: Lesson;
  index: number;
}

type DisplayTrigger = "speak" | "mastery" | "CheckTranslationButton" | null;

const IndexPage: React.FC = () => {
  const { activeItem, setCurrentLesson } = useReadThaiGame();

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

        <SuperSetVisualizer className="mb-20" />

        {/* Active Item Display */}
        <ItemDisplay
          iconSize={52}
          textSize="text-6xl"
          className="flex items-center justify-center mb-10"
          speakOnUnmount={false}
        />

        <CheckTranslationButton
          onClick={() => setDisplayTrigger("CheckTranslationButton")}
        />

        <FlashCardModal
          trigger={displayTrigger}
          onClose={() => setDisplayTrigger(null)}
        />

        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 bg-opacity-90 p-4">
          <Divider className="mb-4 -mx-4" borderClass="border-slate-700" />

          {/* Mastery Controls */}
          <MasteryControls className="mb-10" />

          <Divider className="mb-4 -mx-4" borderClass="border-slate-700" />

          {/* Practice Set Display */}
          <PracticeSetCards />

          <Divider className="mb-4 -mx-4" borderClass="border-slate-700" />

          {/* Lesson Selection */}
          <div className="">
            <LessonSelector onViewDetails={handleViewLessonDetails} />

            <Divider className="mb-4 -mx-4" borderClass="border-slate-700" />

            <ProgressionSelector />
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
              onStudyLesson={(index) => {
                setCurrentLesson(index);
                setLessonDetailsSelectedLesson(null);
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default IndexPage;
