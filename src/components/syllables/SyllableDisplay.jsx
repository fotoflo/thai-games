import React from 'react';
import { Volume2 } from 'lucide-react';

const SyllableDisplay = ({
  current,
  hasThai,
  speaking,
  error,
  onSpeak,
}) => {
  return (
    <div className="flex flex-col items-center justify-center mb-8">
      <div className="flex items-center gap-4 mb-4">
        <div 
          className="text-6xl cursor-pointer" 
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
          <Volume2 size={32} className="text-gray-400 hover:text-white" />
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

export default SyllableDisplay;
