import React from 'react';

const CompletionScreen = ({ addMoreSyllables }) => {
  return (
    <div className="p-4 relative min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl mb-4">Great job! All syllables completed.</h2>
        <button
          onClick={addMoreSyllables}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
        >
          Add More Syllables
        </button>
      </div>
    </div>
  );
};

export default CompletionScreen; 