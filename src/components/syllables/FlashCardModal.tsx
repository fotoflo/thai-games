import React, { useEffect } from "react";
import ModalContainer from "../ui/ModalContainer";
import MasteryControls from "./MasteryControls";
import DetailCard from "./DetailCard";
import { useModal, modals } from "@/hooks/useModal";
import { SuperSetItem } from "@/types/lessons";

interface FlashCardData {
  activeItem: SuperSetItem;
}

const FlashCardModal: React.FC = () => {
  const { isOpen, data, open, close } = useModal<FlashCardData>();

  // Connect the modal controls
  useEffect(() => {
    modals.flashCard = { open, close };
  }, [open, close]);

  if (!isOpen) return null;

  return (
    <ModalContainer title="Flash Card" onClose={close}>
      <div
        className="fixed inset-0 flex flex-col justify-between bg-black bg-opacity-50 z-50"
        onClick={close}
      >
        <div className="flex-grow flex items-center justify-center p-4">
          {data?.activeItem && (
            <DetailCard
              vocabItem={data.activeItem.item}
              showExamples={true}
              onToggleExamples={() => {}}
              size="xl"
            />
          )}
          {!data?.activeItem && <div>No item selected</div>}
        </div>
        <MasteryControls className="mb-4" />
      </div>
    </ModalContainer>
  );
};

export default FlashCardModal;
