import React from 'react';

const ProgressionSelector = ({ progressionMode, onModeChange }) => {
  return (
    <div className="flex justify-center gap-2 mb-4">
      <button
        onClick={() => onModeChange('firstPass')}
        className={`px-4 py-2 rounded-lg transition-colors ${
          progressionMode === 'firstPass'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
        disabled={progressionMode === 'firstPass'}
      >
        First Pass
      </button>
      <button
        onClick={() => onModeChange('spacedRepetition')}
        className={`px-4 py-2 rounded-lg transition-colors ${
          progressionMode === 'spacedRepetition'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
        disabled={progressionMode === 'spacedRepetition'}
      >
        Practice Set
      </button>
      <button
        onClick={() => onModeChange('test')}
        className={`px-4 py-2 rounded-lg transition-colors ${
          progressionMode === 'test'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
        disabled={progressionMode === 'test'}
      >
        Test
      </button>
    </div>
  );
};

export default ProgressionSelector; 