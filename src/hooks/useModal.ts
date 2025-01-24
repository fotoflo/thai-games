import { useState } from "react";
import { SuperSetItem } from "@/types/lessons";
import { Lesson } from "@/types/lessons";

interface FlashCardData {
  activeItem: SuperSetItem;
}

interface LessonDetailsData {
  lesson: Lesson;
  index: number;
}

interface ModalControls<T> {
  open: (data?: T) => void;
  close: () => void;
}

export const useModal = <T = void>() => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | undefined>();

  return {
    isOpen,
    data,
    open: (data?: T) => {
      setData(data);
      setIsOpen(true);
    },
    close: () => {
      setIsOpen(false);
      setData(undefined);
    },
  };
};

// Simple global reference to control modals
export const modals: {
  flashCard: ModalControls<FlashCardData>;
  lessonList: ModalControls<void>;
  lessonDetails: ModalControls<LessonDetailsData>;
} = {
  flashCard: {
    open: () => {},
    close: () => {},
  },
  lessonList: {
    open: () => {},
    close: () => {},
  },
  lessonDetails: {
    open: () => {},
    close: () => {},
  },
};
