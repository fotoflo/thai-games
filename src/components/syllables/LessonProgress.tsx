import React from "react";
import { LessonState } from "../../types/lessons";
import { LessonSubset } from "../../hooks/game/useWorkingSet";

interface LessonProgressProps {
  workingSetLength: number;
  lessonState?: LessonState;
  lessonSubset?: LessonSubset;
  className?: string;
}

const LessonProgress: React.FC<LessonProgressProps> = ({
  workingSetLength,
  lessonState = {
    progressionMode: "firstPass",
    itemStates: {},
    lastAddedIndex: -1,
    problemList: [],
    possibleProblemList: [],
    workingList: [],
  },
  lessonSubset = {
    unseenItems: [],
    activeItem: null,
    practiceItems: [],
    masteredItems: [],
    skippedItems: [],
  },
  className = "",
}) => {
  return (
    <div className={`text-xs text-gray-500 mb-2 px-2 ${className}`}>
      <div className="flex justify-between gap-4">
        <div>
          <span className="text-gray-400">Skipped:</span>{" "}
          {lessonSubset.skippedItems.length}
        </div>
        <div>
          <span className="text-blue-400">Practice:</span> {workingSetLength}
        </div>
        <div>
          <span className="text-purple-400">Know It:</span>{" "}
          {lessonSubset.masteredItems.length}
        </div>
        <div>
          <span className="text-yellow-400">Unseen:</span>{" "}
          {lessonSubset.unseenItems.length}
        </div>
      </div>
    </div>
  );
};

export default LessonProgress;
