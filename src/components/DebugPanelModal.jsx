import React, { useRef, useEffect } from 'react';
import { AlertTriangle, Copy, CopyCheck, AlertCircle, Bug, MessageCircle } from 'lucide-react';

const DebugPanelModal = ({ onClose, reportProblem, reportPossibleProblem, copyDebugInfo, copied, workingList, possibleProblemList, problemList }) => {
  const modalRef = useRef();

  const clearLocalStorage = () => {
    if (window.confirm('Are you sure you want to clear all local storage? This will reset all progress.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-100 flex items-center justify-center z-50">
      <div ref={modalRef} className="w-full max-w-4xl bg-gray-900 rounded-lg overflow-hidden shadow-lg m-20">
        <div className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-4xl mx-auto px-4">
            <div className="h-16 flex items-center gap-4">
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700 text-gray-300">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-white">Debug Panel</h1>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 pt-5 pb-8">
          <div className="space-y-2">
            <button onClick={copyDebugInfo} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white">
              {copied ? <CopyCheck size={20} /> : <Copy size={20} />}
              {copied ? 'Copied!' : 'Copy Debug'}
            </button>

            {/* Display Lists */}
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
              <a href="https://wa.me/6281717770552" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white">
                <MessageCircle size={20} />
                WhatsApp Feedback
              </a>
              
              <button onClick={clearLocalStorage} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white">
                <AlertTriangle size={20} />
                Reset All Progress
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPanelModal; 