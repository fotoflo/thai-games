import { useModal } from "./useModal";
import { LessonItem } from "@/types/lessons";
import { createContext, useContext, type ReactNode } from "react";

export type FlashCardTrigger = "speak" | "mastery" | "CheckTranslationButton";

type FlashCardData = {
  vocabItem: LessonItem;
  trigger: FlashCardTrigger;
};

type FlashCardModalContextType = ReturnType<typeof useModal<FlashCardData>>;

const FlashCardModalContext = createContext<FlashCardModalContextType | null>(
  null
);

interface FlashCardModalProviderProps {
  children: ReactNode;
}

export const FlashCardModalProvider = ({
  children,
}: FlashCardModalProviderProps) => {
  const modal = useModal<FlashCardData>();
  return (
    <FlashCardModalContext.Provider value={modal}>
      {children}
    </FlashCardModalContext.Provider>
  );
};

export const useFlashCardModal = (): FlashCardModalContextType => {
  const context = useContext(FlashCardModalContext);
  if (!context) {
    throw new Error(
      "useFlashCardModal must be used within a FlashCardModalProvider"
    );
  }
  return context;
};
