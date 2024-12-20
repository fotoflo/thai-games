import React from "react";
import { RefreshCcw, Check } from "lucide-react";

const MasteryControls = ({
  onRatingSelect,
  className,
}: {
  onRatingSelect: (value: number) => void;
  className?: string;
}) => {
  const masteryLevels = [
    {
      level: 2,
      label: "Next",
      color: "bg-blue-400 hover:bg-blue-300",
      value: 3,
      icon: RefreshCcw,
    },
    {
      level: 3,
      label: "Mastered",
      color: "bg-purple-400 hover:bg-purple-300",
      value: 5,
      icon: Check,
    },
  ];

  return (
    <div className={`space-y-2 mb-10 ${className}`}>
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
              {Icon && <Icon size={24} style={{ fontWeight: "bold" }} />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MasteryControls;
