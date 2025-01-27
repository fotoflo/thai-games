import React, { useState } from "react";
import { useLessons } from "@/hooks/game/useLessons";
import ItemDisplay from "@/components/syllables/ItemDisplay";
import MasteryControls from "@/components/syllables/MasteryControls";
import WelcomeModal from "@/components/ReadThaiWelcomeModal";
import FlashCardModal from "@/components/syllables/FlashCardModal";
import SettingsModalContainer from "@/components/SettingsModalContainer";
import PracticeSetCards from "@/components/syllables/PracticeSetCards";
import LessonSelector from "@/components/syllables/LessonSelector";
import ProgressionSelector from "@/components/syllables/ProgressionSelector";
import SettingsHamburger from "@/components/ui/SettingsHamburger";
import Divider from "@/components/ui/divider";
import LessonDetails from "@/components/syllables/LessonDetailScreen";
import { Lesson } from "@/types/lessons";
import SuperSetVisualizer from "@/components/syllables/SuperSetVisualizer";
import CheckTranslationButton from "@/components/syllables/CheckTranslationButton";
import { useGameLessons, useActiveItem } from "@/hooks/game/useReadThaiGame";
import { modals } from "@/hooks/useModal";

const IndexPage: React.FC = () => {
  const { activeItem } = useActiveItem();
  const { lessons: apiLessons, lessonsLoading, lessonsError } = useLessons();
  const { sendReadThaiGameContext } = useGameLessons();

  const [showWelcome, setShowWelcome] = useState(true);
  const [showSettingsContainer, setShowSettingsContainer] = useState(false);

  // Initialize lessons when they are loaded
  if (!lessonsLoading && !lessonsError && apiLessons) {
    sendReadThaiGameContext({ type: "INITIALIZE", lessons: apiLessons });
  }

  const openSettings = () => setShowSettingsContainer(true);
  const closeSettings = () => setShowSettingsContainer(false);

  const handleViewLessonDetails = (lesson: Lesson, index: number) => {
    const lessonWithTimestamps = {
      ...lesson,
      createdAt: lesson.createdAt || new Date(),
      updatedAt: lesson.updatedAt || new Date(),
    };
    modals.lessonDetails.open({ lesson: lessonWithTimestamps, index });
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
          onClick={() => activeItem && modals.flashCard.open({ activeItem })}
        />

        <FlashCardModal />
        <LessonDetails />

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
      </div>
    </>
  );
};

export default IndexPage;
