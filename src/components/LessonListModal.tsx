import React, { useEffect } from "react";
import { useModal, modals } from "@/hooks/useModal";
import LessonListScreen from "./LessonListScreen";
import ModalContainer from "./ui/ModalContainer";
import LessonDetailsModal from "./LessonDetailsModal";

const LessonListModal: React.FC = () => {
  const modal = useModal();

  // Connect the modal controls
  useEffect(() => {
    modals.lessonList = modal;
  }, [modal]);

  if (!modal.isOpen) return null;

  return (
    <>
      <ModalContainer
        title="Choose a Lesson"
        onClose={modal.close}
        showHeader={true}
      >
        <LessonListScreen onClose={modal.close} />
      </ModalContainer>
      <LessonDetailsModal />
    </>
  );
};

export default LessonListModal;
