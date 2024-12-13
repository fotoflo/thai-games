import React from 'react';
import { X } from 'lucide-react';

const WelcomeModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-3 z-50">
      <div className="bg-gray-900 text-white rounded-lg w-full max-w-2xl p-3 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>

        <h1 className="text-2xl font-bold mb-3">Welcome to Read Thai!</h1>
        
        <p className="mb-5 text-gray-300">
          Your brain can only hold a few things at once - that's why we teach you to read just 5 syllables at a time.
        </p>

        <div className="space-y-5 mb-7">
          <div className="flex items-center gap-3 text-lg">
            <span className="bg-blue-600 p-2 rounded">1</span>
            <div>
              <span className="text-white">Read and speak the syllable</span>
              <div className="text-gray-400">Use the speak button if you need help</div>
            </div>
          </div>

          <div className="flex items-stretch gap-3 text-lg">
            <div className="bg-blue-600 p-2 rounded self-stretch flex items-center justify-center">2</div>
            <div className="flex-1">
              <span className="text-white mb-1 block">Rate your mastery</span>
              <div className="flex items-center gap-2">
                <button className="bg-red-600 text-white py-1 px-2 rounded">Learning</button>
                <span className="text-gray-500">→</span>
                <button className="bg-yellow-500 text-white py-1 px-2 rounded">Getting It</button>
                <span className="text-gray-500">→</span>
                <button className="bg-green-600 text-white py-1 px-2 rounded">Mastered ✓</button>
              </div>
              <div className="text-gray-400 mt-1 text-sm">
                Mastered syllables are removed from your working set, helping you focus on what's left to learn
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-lg">
            <span className="bg-blue-600 p-2 rounded">3</span>
            <div>
              <span className="text-white">Add more syllables</span>
              <div className="text-gray-400">Once you've mastered your current set</div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded text-xl"
        >
          Start Reading Thai
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal; 