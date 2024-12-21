import React from "react";
import { LessonState } from "../../types/lessons";

interface LessonProgressProps {
  workingSetLength: number;
  lessonState: LessonState;
  className?: string;
}

const LessonProgress: React.FC<LessonProgressProps> = ({
  workingSetLength,
  lessonState,
  className = "",
}) => {
  const { itemStates = {} } = lessonState;

  const masteredCount = Object.values(itemStates).filter(
    (state) => state.mastery === 5
  ).length;

  const skippedCount = Object.values(itemStates).filter(
    (state) => state.lastSeen && state.mastery === 0
  ).length;

  return (
    <div className={`text-xs text-gray-500 mb-2 px-2 ${className}`}>
      <div className="flex justify-between gap-4">
        <div>
          <span className="text-blue-400">Practice:</span> {workingSetLength}
        </div>
        <div>
          <span className="text-purple-400">Know It:</span> {masteredCount}
        </div>
        <div>
          <span className="text-gray-400">Skipped:</span> {skippedCount}
        </div>
      </div>
    </div>
  );
};

export default LessonProgress;
