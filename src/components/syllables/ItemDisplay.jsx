import React from 'react';
import { Volume2 } from 'lucide-react';
import { useThaiSpeech } from '../../hooks/useThaiSpeech';

const ItemDisplay = ({
  current,
  textSize = 'text-6xl',
  iconSize = 24,
  className = '',
  textColor = 'text-white',
  iconColor = 'text-gray-400',
  speakOnMount = false,
  speakOnUnmount = false,
}) => {
  const { speaking, hasThai, error, handleSpeak } = useThaiSpeech(
    speakOnMount,
    speakOnUnmount,
    current?.text
  );

  if (!current) return null;

  const displayText = current.text;

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center justify-center gap-4">
        <div className={`${textSize} ${textColor}`}>
          {displayText}
        </div>
        <button
          className="p-2 rounded-full hover:bg-gray-800 transition-colors"
          title="Speak"
          disabled={!hasThai || speaking}
          onClick={() => handleSpeak(displayText)}
        >
          <Volume2 
            size={iconSize} 
            className={`${iconColor} hover:text-white ${speaking ? 'opacity-50' : ''}`} 
          />
        </button>
      </div>

      {error && (
        <div className="text-red-500 text-sm mt-1">
          {error}
        </div>
      )}
    </div>
  );
};

export default ItemDisplay;