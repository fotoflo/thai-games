import React from 'react';
import { RefreshCcw, Check } from 'lucide-react';

const MasteryControls = ({ onRatingSelect }) => {
  const masteryLevels = [
    { level: 2, label: "Next", color: "bg-yellow-600 hover:bg-yellow-500", value: 3, icon: RefreshCcw },
    { level: 3, label: "Mastered", color: "bg-green-700 hover:bg-green-600", value: 5, icon: Check },
  ];

  return (
    <div className="space-y-2 mb-4">
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
              {Icon && <Icon size={24} style={{ fontWeight: 'bold' }} />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MasteryControls;
