import React, { useEffect } from "react";
import { useModal, modals } from "@/hooks/useModal";
import LessonListScreen from "./LessonListScreen";

const LessonListModal: React.FC = () => {
  const { isOpen, open, close } = useModal();

  // Connect the modal controls
  useEffect(() => {
    modals.lessonList = { open, close };
  }, [open, close]);

  if (!isOpen) return null;

  return <LessonListScreen onClose={close} onViewDetails={() => {}} />;
};

export default LessonListModal;
