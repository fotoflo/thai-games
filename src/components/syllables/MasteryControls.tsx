import React from "react";
import { ReadThaiGameContext } from "@/machines/cardSetMachine";

interface MasteryControlsProps {
  className?: string;
}

const MasteryControls: React.FC<MasteryControlsProps> = ({
  className = "",
}) => {
  const { progressionMode } = ReadThaiGameContext.useSelector(
    ({ context }) => context.progressionMode
  );

  const { send: sendToCardSetMachine } = ReadThaiGameContext.useActorRef();

  const handleMarkForPractice = () =>
    sendToCardSetMachine({ type: "MARK_FOR_PRACTICE" });
  const handleMarkAsMastered = () =>
    sendToCardSetMachine({ type: "MARK_AS_MASTERED" });
  const handleSkipItem = () => sendToCardSetMachine({ type: "SKIP_ITEM" });

  return (
    <div className={`flex justify-around gap-2 ${className}`}>
      {progressionMode === "firstPass" && (
        <>
          <button
            onClick={handleMarkForPractice}
            className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
          >
            Practice
          </button>
          <button
            onClick={handleMarkAsMastered}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Mastered
          </button>
          <button
            onClick={handleSkipItem}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Skip
          </button>
        </>
      )}

      {progressionMode === "practice" && (
        <>
          <button
            onClick={handleMarkAsMastered}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Mastered
          </button>
          <button
            onClick={handleMarkForPractice}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Keep Practicing
          </button>
        </>
      )}
    </div>
  );
};

export default MasteryControls;
