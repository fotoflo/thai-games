import React, { useEffect } from "react";
import { useModal, modals } from "@/hooks/useModal";
import LessonDetails from "./syllables/LessonDetailScreen";
import { Lesson } from "@/types/lessons";
import { useGameActions } from "@/hooks/game/useReadThaiGame";

interface LessonDetailsData {
  lesson: Lesson;
  index: number;
}

const LessonDetailsModal: React.FC = () => {
  const modal = useModal<LessonDetailsData>();
  const { chooseLesson } = useGameActions();

  // Connect the modal controls
  useEffect(() => {
    modals.lessonDetails = modal;
  }, [modal]);

  if (!modal.isOpen || !modal.data) return null;

  return (
    <LessonDetails
      lesson={modal.data.lesson}
      lessonIndex={modal.data.index}
      onClose={modal.close}
      onStudyLesson={(index) => {
        chooseLesson(index, [modal.data.lesson]);
        modal.close();
      }}
    />
  );
};

export default LessonDetailsModal;
