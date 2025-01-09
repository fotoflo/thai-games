import React from "react";
import ModalContainer from "../ui/ModalContainer";
import MasteryControls from "./MasteryControls";
import DetailCard from "./DetailCard";
import { useReadThaiGame } from "@/context/ReadThaiGameContext";

interface FlashCardModalProps {
  trigger: "speak" | "mastery" | "CheckTranslationButton" | null;
  onClose: () => void;
}

const FlashCardModal: React.FC<FlashCardModalProps> = ({
  trigger,
  onClose,
}) => {
  const { activeItem } = useReadThaiGame();

  if (!trigger || !activeItem) return null;

  return (
    <ModalContainer title="Flash Card" onClose={onClose}>
      <div
        className="fixed inset-0 flex flex-col justify-between bg-black bg-opacity-50 z-50"
        onClick={onClose}
      >
        <div className="flex-grow flex items-center justify-center p-4">
          <DetailCard
            vocabItem={activeItem.item}
            showExamples={true}
            onToggleExamples={() => {}}
            size="xl"
          />
        </div>
        <MasteryControls className="mb-4" />
      </div>
    </ModalContainer>
  );
};

export default FlashCardModal;
