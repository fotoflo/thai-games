import React from "react";
import { LessonState } from "../../types/lessons";
import { LessonSubset } from "../../hooks/game/useWorkingSet";

interface LessonProgressProps {
  workingSetLength: number;
  lessonState: LessonState;
  lessonSubset: LessonSubset;
  className?: string;
}

const LessonProgress: React.FC<LessonProgressProps> = ({
  workingSetLength,
  lessonState,
  lessonSubset = {
    unseenItems: [],
    currentItem: null,
    practiceItems: [],
    masteredItems: [],
    skippedItems: [],
  },
  className = "",
}) => {
  const { itemStates = {} } = lessonState;
  const {
    unseenItems = [],
    masteredItems = [],
    skippedItems = [],
  } = lessonSubset;

  return (
    <div className={`text-xs text-gray-500 mb-2 px-2 ${className}`}>
      <div className="flex justify-between gap-4">
        <div>
          <span className="text-blue-400">Practice:</span> {workingSetLength}
        </div>
        <div>
          <span className="text-purple-400">Know It:</span>{" "}
          {masteredItems.length}
        </div>
        <div>
          <span className="text-gray-400">Skipped:</span> {skippedItems.length}
        </div>
        <div>
          <span className="text-yellow-400">Unseen:</span> {unseenItems.length}
        </div>
      </div>
    </div>
  );
};

export default LessonProgress;