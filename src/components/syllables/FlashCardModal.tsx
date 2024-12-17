import React, { useState, useEffect } from "react";
import { useThaiSpeech } from "../../hooks/useThaiSpeech";
import FlashCard from "./FlashCard";
import ModalContainer from "../ui/ModalContainer";

interface FlashCardModalProps {
  current: any; // Replace with the appropriate type
  onNext: () => void;
  trigger: string;
  onClose: () => void;
}

const FlashCardModal: React.FC<FlashCardModalProps> = ({
  current,
  onNext,
  trigger,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { handleSpeak } = useThaiSpeech(false, false);

  useEffect(() => {
    if (trigger === "CheckTranslationButton") {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [trigger, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!trigger) return null;

  return (
    <ModalContainer title="Flash Card" onClose={onClose}>
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        onClick={handleBackdropClick}
      >
        <FlashCard
          current={current}
          isVisible={isVisible}
          onSpeak={handleSpeak}
        />
      </div>
    </ModalContainer>
  );
};

export default FlashCardModal;
