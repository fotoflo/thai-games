// New file: src/components/syllables/WorkingSetCards.jsx
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { thaiToIPA } from '../../utils/thaiToIPA';

const WorkingSetCards = ({ workingSet, current, onCardSelect, addMoreSyllables }) => {
  const getTextSizeClass = (text) => {
    if (text.length <= 3) return 'text-lg';
    if (text.length <= 5) return 'text-base';
    if (text.length <= 7) return 'text-sm';
    return 'text-xs';
  };

  const getPhoneticSizeClass = (text) => {
    if (text.length <= 5) return 'text-xs';
    if (text.length <= 8) return 'text-[10px]';
    return 'text-[8px]';
  };

  return (
    <div className="flex items-center justify-center gap-2 mb-4">
      <div className="flex gap-2 flex-wrap justify-center">
        {workingSet.map((item, i) => {
          const phoneticText = thaiToIPA(item.text);
          return (
            <div 
              key={i} 
              className={`
                text-center p-2 rounded cursor-pointer w-[60px] h-[80px]
                ${item.text === current?.text ? 'bg-blue-700' : 'bg-gray-800'}
                hover:bg-blue-600 transition-colors
                flex flex-col justify-center
              `}
              onClick={() => onCardSelect(item)}
              role="button"
              tabIndex={0}
            >
              <div className={`text-white ${getTextSizeClass(item.text)} leading-tight`}>
                {item.text}
              </div>
              <div className={`text-gray-400 ${getPhoneticSizeClass(phoneticText)} leading-tight`}>
                [{phoneticText.length > 10 ? `${phoneticText.substring(0, 10)}...` : phoneticText}]
              </div>
            </div>
          );
        })}
        {workingSet.length < 5 && (
          <div className="ml-auto">
            <button
              onClick={() => addMoreSyllables()}
              className="flex flex-col items-center justify-center p-2 rounded bg-green-600 hover:bg-green-500 transition-colors cursor-pointer w-[60px] h-[80px]"
              title="Add One More Item"
            >
              <PlusCircle size={24} className="text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkingSetCards;