import React from "react";
import { Check, SkipForward, Brain } from "lucide-react";

type ProgressionMode = "firstPass" | "spacedRepetition" | "test";

interface LessonSubset {
  unseenItems: string[];
  practiceItems: string[];
  masteredItems: string[];
  skippedItems: string[];
}

interface MasteryControlsProps {
  onRatingSelect: (value: number) => void;
  handleMarkForPractice: () => void;
  handleMarkAsMastered: () => void;
  handleSkipItem: () => void;
  mode: ProgressionMode;
  className?: string;
  lessonSubset: LessonSubset;
}

const MasteryControls: React.FC<MasteryControlsProps> = ({
  handleMarkForPractice,
  handleMarkAsMastered,
  handleSkipItem,
  className,
  lessonSubset,
}) => {
  return (
    <div className={`space-y-2 mb-10 ${className}`}>
      <div className="grid grid-cols-3 gap-2">
        <div className="text-xs text-gray-400 absolute top-0 right-0">
          Unseen: {lessonSubset.unseenItems.length}
        </div>
        <button
          onClick={handleSkipItem}
          className="p-2 rounded transition-colors bg-gray-600 hover:bg-gray-500 flex flex-col items-center justify-center min-h-[60px] active:scale-95 transform animate-extended-active"
        >
          <div className="flex items-center gap-1">
            <span className="text-sm">Skip</span>
            <SkipForward size={24} />
          </div>
          <span className="text-xs text-gray-400 absolute bottom-1 right-1">
            {lessonSubset.skippedItems.length}
          </span>
        </button>
        <button
          onClick={handleMarkForPractice}
          className="p-2 rounded transition-colors bg-blue-600 hover:bg-blue-500 flex flex-col items-center justify-center min-h-[60px] active:scale-95 transform animate-extended-active"
        >
          <div className="flex items-center gap-1">
            <span className="text-sm">Practice</span>
            <Brain size={24} />
          </div>
          <span className="text-xs text-gray-400 absolute bottom-1 right-1">
            {lessonSubset.practiceItems.length}
          </span>
        </button>
        <button
          onClick={handleMarkAsMastered}
          className="p-2 rounded transition-colors bg-purple-600 hover:bg-purple-500 flex flex-col items-center justify-center min-h-[60px] active:scale-95 transform animate-extended-active"
        >
          <div className="flex items-center gap-1">
            <span className="text-sm">Know It</span>
            <Check size={24} />
          </div>
          <span className="text-xs text-gray-400 absolute bottom-1 right-1">
            {lessonSubset.masteredItems.length}
          </span>
        </button>
      </div>
    </div>
  );
};

export default MasteryControls;
