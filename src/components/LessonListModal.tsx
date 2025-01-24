import React, { useEffect, useState } from "react";
import { useModal, modals } from "@/hooks/useModal";
import LessonListScreen from "./LessonListScreen";
import ModalContainer from "./ui/ModalContainer";
import LessonDetails from "./syllables/LessonDetailScreen";
import { useGameActions } from "@/hooks/game/useReadThaiGame";
import { Lesson } from "@/types/lessons";

interface LessonDetailsSelection {
  lesson: Lesson;
  index: number;
}

const LessonListModal: React.FC = () => {
  const modal = useModal();
  const { chooseLesson } = useGameActions();
  const [selectedLesson, setSelectedLesson] =
    useState<LessonDetailsSelection | null>(null);

  // Connect the modal controls
  useEffect(() => {
    modals.lessonList = modal;
  }, [modal]);

  if (!modal.isOpen) return null;

  if (selectedLesson) {
    return (
      <LessonDetails
        lesson={selectedLesson.lesson}
        lessonIndex={selectedLesson.index}
        onClose={() => setSelectedLesson(null)}
        onStudyLesson={(index) => {
          chooseLesson(index, [selectedLesson.lesson]);
          modal.close();
        }}
      />
    );
  }

  return (
    <ModalContainer
      title="Choose a Lesson"
      onClose={modal.close}
      showHeader={true}
    >
      <LessonListScreen
        onClose={modal.close}
        onViewDetails={(lesson, index) => setSelectedLesson({ lesson, index })}
      />
    </ModalContainer>
  );
};

export default LessonListModal;
