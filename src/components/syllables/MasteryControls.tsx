import React from "react";
import { useGameMode, useGameActions } from "@/hooks/game/useReadThaiGame";

interface MasteryControlsProps {
  className?: string;
}

const MasteryControls: React.FC<MasteryControlsProps> = ({
  className = "",
}) => {
  const { progressionMode } = useGameMode();
  const { markForPractice, markAsMastered, skipItem } = useGameActions();

  return (
    <div className={`flex justify-around gap-2 ${className}`}>
      {progressionMode === "firstPass" && (
        <>
          <button
            onClick={markForPractice}
            className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
          >
            Practice
          </button>
          <button
            onClick={markAsMastered}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Mastered
          </button>
          <button
            onClick={skipItem}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Skip
          </button>
        </>
      )}

      {progressionMode === "practice" && (
        <>
          <button
            onClick={markAsMastered}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Mastered
          </button>
          <button
            onClick={markForPractice}
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
