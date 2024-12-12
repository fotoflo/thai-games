import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const SyllableDisplay = ({ 
  current,
  hasThai,
  speaking,
  error,
  onSpeak
}) => {
  return (
    <div className="text-center mb-8">
      <div className="text-6xl mb-4">{current.text}</div>
      <button 
        onClick={onSpeak}
        disabled={!hasThai || speaking}
        className={`flex items-center justify-center gap-2 px-4 py-2 rounded ${
          hasThai ? 'bg-blue-600 hover:bg-blue-950 text-white' : 'bg-gray-700 text-gray-400'
        }`}
      >
        {speaking ? <Volume2 className="animate-pulse" size={20} /> : <Volume2 size={20} />}
        {speaking ? 'Speaking...' : 'Speak'}
      </button>
      {error && (
        <div className="flex items-center justify-center gap-2 mt-2 text-red-500">
          <VolumeX size={16} />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
};

export default SyllableDisplay;
