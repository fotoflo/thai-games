import React from 'react';

const ProgressionSelector = ({ progressionMode, onModeChange }) => {
  return (
    <div className="flex justify-center gap-2 mb-4">
      <button
        onClick={() => onModeChange('progression')}
        className={`px-4 py-2 rounded-lg transition-colors ${
          progressionMode === 'progression'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
        disabled={progressionMode === 'progression'}
      >
        Progression
      </button>
      <button
        onClick={() => onModeChange('random')}
        className={`px-4 py-2 rounded-lg transition-colors ${
          progressionMode === 'random'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
        disabled={progressionMode === 'random'}
      >
        Random
      </button>
    </div>
  );
};

export default ProgressionSelector; 