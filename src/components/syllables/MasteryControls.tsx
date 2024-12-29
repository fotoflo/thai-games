import React from "react";
import { RefreshCcw, Check, SkipForward, Brain } from "lucide-react";

type ProgressionMode = "firstPass" | "spacedRepetition" | "test";

interface LessonSubset {
  unseenItems: string[];
  practiceItems: string[];
  masteredItems: string[];
  skippedItems: string[];
}

interface MasteryControlsProps {
  onRatingSelect: (value: number) => void;
  onFirstPassChoice?: (choice: "skip" | "mastered" | "practice") => void;
  mode: ProgressionMode;
  className?: string;
  lessonSubset: LessonSubset;
}

const MasteryControls: React.FC<MasteryControlsProps> = ({
  onRatingSelect,
  onFirstPassChoice,
  mode,
  className,
  lessonSubset,
}) => {
  const renderFirstPassControls = () => (
    <div className="grid grid-cols-3 gap-2">
      <div className="text-xs text-gray-400 absolute top-0 right-0">
        Unseen: {lessonSubset.unseenItems.length}
      </div>
      <button
        onClick={() => onFirstPassChoice?.("skip")}
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
        onClick={() => onFirstPassChoice?.("practice")}
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
        onClick={() => onFirstPassChoice?.("mastered")}
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
  );

  const renderPracticeControls = () => {
    const masteryLevels = [
      {
        level: 2,
        label: "Next",
        color: "bg-blue-600 hover:bg-blue-500",
        value: 3,
        icon: RefreshCcw,
      },
      {
        level: 3,
        label: "Mastered",
        color: "bg-purple-600 hover:bg-purple-500",
        value: 5,
        icon: Check,
      },
    ];

    return (
      <div className="grid grid-cols-2 gap-2">
        {masteryLevels.map(({ level, label, color, value, icon: Icon }) => (
          <button
            key={level}
            onClick={() => onRatingSelect(value)}
            className={`
              p-2 rounded transition-colors
              ${color}
              flex flex-col items-center justify-center
              min-h-[60px]
              active:scale-95 transform
              animate-extended-active
            `}
          >
            <div className="flex items-center gap-1">
              <span className="text-sm">{label}</span>
              {Icon && <Icon size={24} />}
            </div>
            <span className="text-xs text-gray-400 absolute bottom-1 right-1">
              {level}
            </span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className={`space-y-2 mb-10 ${className}`}>
      {mode === "firstPass" && renderFirstPassControls()}
      {(mode === "spacedRepetition" || mode === "test") &&
        renderPracticeControls()}
    </div>
  );
};

export default MasteryControls;
