import { useModal } from "./useModal";
import { LessonItem } from "@/types/lessons";

export type FlashCardTrigger = "speak" | "mastery" | "CheckTranslationButton";

type FlashCardData = {
  vocabItem: LessonItem;
  trigger: FlashCardTrigger;
};

// Create a shared instance that can be imported anywhere
const useFlashCardModalInstance = () => {
  const modal = useModal<FlashCardData>();
  return modal;
};

// Export a singleton instance
export const flashCardModal = useFlashCardModalInstance();

// Export the hook for direct use in the modal component
export const useFlashCardModal = () => {
  return flashCardModal;
};
