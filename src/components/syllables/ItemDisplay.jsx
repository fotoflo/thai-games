import React from 'react';
import { Volume2 } from 'lucide-react';

const ItemDisplay = ({
  current,
  hasThai,
  speaking,
  error,
  onSpeak,
  textSize = 'text-6xl',
  iconSize = 24,
  className = 'flex flex-col items-center justify-center mb-8',
}) => {
  return (
    <div className={className}>
      <div className="flex items-center gap-4">
        <div 
          className={`${textSize} cursor-pointer`} 
          onClick={() => onSpeak(current.text)}
        >
          {current.text}
        </div>
        <button
          onClick={() => onSpeak(current.text)}
          className="p-2 rounded-full hover:bg-gray-800 transition-colors"
          title="Speak"
          disabled={!hasThai || speaking}
        >
          <Volume2 size={iconSize} className="text-gray-400 hover:text-white" />
        </button>
      </div>

      {error && (
        <div className="text-red-500 mt-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default ItemDisplay;
