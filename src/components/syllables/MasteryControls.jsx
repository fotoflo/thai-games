import React from 'react';
import { Check } from 'lucide-react';

const MasteryControls = ({ onRatingSelect }) => {
  return (
    <div className="space-y-2 mb-4">
      <div className="text-sm text-gray-400 text-center">Mastery level</div>
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map(rating => (
          <button
            key={rating}
            onClick={() => onRatingSelect(rating)}
            className="p-2 rounded transition-colors bg-gray-800 hover:bg-blue-950 active:bg-blue-800 animate-extended-active"
          >
            {rating === 5 ? <Check size={20} className="mx-auto" /> : rating}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MasteryControls;
