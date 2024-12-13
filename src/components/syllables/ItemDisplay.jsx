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
  className = '',
  textColor = 'text-white',
  iconColor = 'text-gray-400',
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center gap-4 mb-0">
        <div 
          className={`${textSize} ${textColor} cursor-pointer`}
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
          <Volume2 size={iconSize} className={`${iconColor} hover:text-white`} />
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
