import React from "react";
import { useGameMode, useGameActions } from "@/hooks/game/useReadThaiGame";

const ProgressionSelector: React.FC = () => {
  const { progressionMode } = useGameMode();
  const { switchToFirstPass, switchToPractice } = useGameActions();

  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={switchToFirstPass}
        className={`flex-1 py-2 px-4 rounded ${
          progressionMode === "firstPass"
            ? "bg-blue-600 text-white"
            : "bg-gray-700 text-gray-300"
        }`}
      >
        First Pass
      </button>
      <button
        onClick={switchToPractice}
        className={`flex-1 py-2 px-4 rounded ${
          progressionMode === "practice"
            ? "bg-blue-600 text-white"
            : "bg-gray-700 text-gray-300"
        }`}
      >
        Practice
      </button>
    </div>
  );
};

export default ProgressionSelector;
