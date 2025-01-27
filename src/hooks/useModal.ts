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
  isOpen: boolean;
  data?: T;
}

export const useModal = <T = void>() => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | undefined>();

  const controls = {
    isOpen,
    data,
    open: (data?: T) => {
      console.log("Opening modal with data:", data);
      setData(data);
      setIsOpen(true);
    },
    close: () => {
      console.log("Closing modal");
      setIsOpen(false);
      setData(undefined);
    },
  };

  return controls;
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
    isOpen: false,
    data: undefined,
  },
  lessonList: {
    open: () => {},
    close: () => {},
    isOpen: false,
    data: undefined,
  },
  lessonDetails: {
    open: () => {},
    close: () => {},
    isOpen: false,
    data: undefined,
  },
};
