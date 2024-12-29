import React, { useEffect } from "react";
import { useThaiSpeech } from "../../hooks/useThaiSpeech";

import ModalContainer from "../ui/ModalContainer";
import MasteryControls from "./MasteryControls";
import DetailCard from "./DetailCard";
import { LessonItem } from "../../types/lessons";

interface FlashCardModalProps {
  vocabItem: LessonItem;
  onNext: () => void;
  trigger: string | null;
  onClose: () => void;
}

const FlashCardModal: React.FC<FlashCardModalProps> = ({
  vocabItem,
  onNext,
  trigger,
  onClose,
}) => {
  const { handleSpeak } = useThaiSpeech(false, false);

  useEffect(() => {
    if (trigger === "CheckTranslationButton") {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [trigger, onClose]);

  if (!trigger) return null;

  return (
    <ModalContainer title="Flash Card" onClose={onClose}>
      <div
        className="fixed inset-0 flex flex-col justify-between bg-black bg-opacity-50 z-50"
        onClick={onClose}
      >
        <div className="flex-grow flex items-center justify-center p-4">
          <DetailCard
            vocabItem={vocabItem}
            showExamples={true}
            onToggleExamples={() => {}}
            onSpeak={handleSpeak}
            size="xl"
          />
        </div>
        <MasteryControls
          onRatingSelect={onNext}
          className="mb-4"
          mode="spacedRepetition"
          workingSet={[]}
          lessonSubset={{
            unseenItems: [],
            practiceItems: [],
            masteredItems: [],
            skippedItems: [],
          }}
        />
      </div>
    </ModalContainer>
  );
};

export default FlashCardModal;
