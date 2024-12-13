import React from 'react';
import { AlertTriangle, Copy, CopyCheck, AlertCircle, Bug, MessageCircle } from 'lucide-react';

const DebugPanel = ({
  showDebug,
  setShowDebug,
  reportProblem,
  reportPossibleProblem,
  copyDebugInfo,
  copied,
  workingList,
  possibleProblemList,
  problemList
}) => {
  const clearLocalStorage = () => {
    if (window.confirm('Are you sure you want to clear all local storage? This will reset all progress.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <>
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="fixed bottom-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-gray-700 hover:bg-gray-600 transition-all text-white shadow-lg"
      >
        {showDebug ? <Bug size={16} /> : <Bug size={16} />}
      </button>

      {showDebug && (
        <div className="fixed bottom-16 right-4 w-80 space-y-2 bg-gray-800 p-4 rounded-lg shadow-lg text-white">
          <div className="flex gap-2">
            <button
              onClick={reportProblem}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
            >
              <AlertTriangle size={20} />
              Problem
            </button>
            <button
              onClick={reportPossibleProblem}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              <AlertCircle size={20} />
              Not Sure
            </button>
          </div>

          <button
            onClick={copyDebugInfo}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
          >
            {copied ? <CopyCheck size={20} /> : <Copy size={20} />}
            {copied ? 'Copied!' : 'Copy Debug'}
          </button>

          {workingList.length > 0 && (
            <div className="p-4 bg-gray-900 rounded">
              <h3 className="font-bold mb-2 text-gray-300">Working Syllables:</h3>
              <div className="flex flex-wrap gap-2">
                {workingList.map((syllable, index) => (
                  <div key={index} className="bg-gray-700 px-2 py-1 rounded text-white">
                    {syllable}
                  </div>
                ))}
              </div>
            </div>
          )}

          {possibleProblemList.length > 0 && (
            <div className="p-4 bg-yellow-900 rounded">
              <h3 className="font-bold mb-2 text-yellow-100">Possibly Problematic:</h3>
              <div className="flex flex-wrap gap-2">
                {possibleProblemList.map((syllable, index) => (
                  <div key={index} className="bg-yellow-800 px-2 py-1 rounded text-white">
                    {syllable}
                  </div>
                ))}
              </div>
            </div>
          )}

          {problemList.length > 0 && (
            <div className="p-4 bg-red-900 rounded">
              <h3 className="font-bold mb-2 text-red-100">Problem Syllables:</h3>
              <div className="flex flex-wrap gap-2">
                {problemList.map((syllable, index) => (
                  <div key={index} className="bg-red-800 px-2 py-1 rounded text-white">
                    {syllable}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 space-y-2">
            <a
              href="https://wa.me/6281717770552"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
            >
              <MessageCircle size={20} />
              WhatsApp Feedback
            </a>
            
            <button
              onClick={clearLocalStorage}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
            >
              <AlertTriangle size={20} />
              Reset All Progress
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DebugPanel;
