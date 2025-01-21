import React from "react";
import ModalContainer from "../ui/ModalContainer";
import MasteryControls from "./MasteryControls";
import DetailCard from "./DetailCard";
import { ReadThaiGameContext } from "@/machines/cardSetMachine";

interface FlashCardModalProps {
  trigger: "speak" | "mastery" | "CheckTranslationButton" | null;
  onClose: () => void;
}

const FlashCardModal: React.FC<FlashCardModalProps> = () => {
  const { activeItem, FlashCardModalOpen } = ReadThaiGameContext.useSelector(
    (snapshot) => {
      return {
        activeItem: snapshot.context.activeItem,
        FlashCardModalOpen: snapshot.context.FlashCardModalOpen,
      };
    }
  );

  const { send: sendToCardSetMachine } = ReadThaiGameContext.useActorRef();

  const onClose = () => {
    sendToCardSetMachine({ type: "CLOSE_FLASH_CARD_MODAL" });
  };

  if (FlashCardModalOpen) {
    return (
      <ModalContainer title="Flash Card" onClose={onClose}>
        <div
          className="fixed inset-0 flex flex-col justify-between bg-black bg-opacity-50 z-50"
          onClick={onClose}
        >
          <div className="flex-grow flex items-center justify-center p-4">
            {activeItem && (
              <DetailCard
                vocabItem={activeItem.item}
                showExamples={true}
                onToggleExamples={() => {}}
                size="xl"
              />
            )}
            {!activeItem && <div>No item selected</div>}
          </div>
          <MasteryControls className="mb-4" />
        </div>
      </ModalContainer>
    );
  }
};

export default FlashCardModal;
