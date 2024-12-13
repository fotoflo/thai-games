import React, { useEffect, useState, useRef } from 'react';
import { X, RefreshCcw, Check, Volume2 } from 'lucide-react';
import { speakThai } from '../utils/textToSpeech';

const WelcomeModal = ({ isOpen, onClose }) => {
  const [speaking, setSpeaking] = useState(false);
  const hasPlayedRef = useRef(false);

  // Effect for initial play
  useEffect(() => {
    if (isOpen && !hasPlayedRef.current) {
      hasPlayedRef.current = true;
      speakThai({ 
        text: "สวัสดี",
        setSpeaking 
      });
    }

    // Reset the ref when modal closes
    if (!isOpen) {
      hasPlayedRef.current = false;
    }
  }, [isOpen]);

  // Handler for manual clicks
  const handleSpeak = () => {
    if (!speaking) {
      speakThai({ 
        text: "สวัสดี",
        setSpeaking 
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 text-white rounded-lg w-full max-w-2xl p-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>

        <h1 className="text-2xl font-bold mb-4">Welcome to Flash Thai - Reading!</h1>
        
        <p className="mb-6 text-gray-300">
          Your brain can only hold a few things at once - that's why we teach you to read just 5 syllables at a time.
        </p>

        <div className="space-y-6 mb-8">
          <div className="flex items-center gap-3 text-lg">
            <span className="bg-blue-600 p-2 rounded self-stretch flex items-center justify-center">1</span>
            <div>
              <span className="text-white">Listen, Repeat and Recall</span>
              <div className="text-gray-400">Tap on the word to hear it, then repeat it.</div>
              <div className="flex items-center mt-2">
                <span 
                  className="text-3xl cursor-pointer hover:text-blue-400 transition-colors" 
                  onClick={handleSpeak}
                >
                  สวัสดี
                </span>
                <button
                  onClick={handleSpeak}
                  disabled={speaking}
                  className="ml-2"
                >
                  <Volume2 
                    size={24} 
                    className={`${speaking ? 'text-blue-400' : 'text-gray-400 hover:text-blue-400'} transition-colors`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-stretch gap-3 text-lg">
            <div className="bg-blue-600 p-2 rounded self-stretch flex items-center justify-center">2</div>
            <div className="flex-1">
              <span className="text-white mb-2 block">Rate your mastery</span>
              <div className="flex items-center gap-2">
                <button className="bg-yellow-600 hover:bg-yellow-500 text-white py-1 px-2 rounded flex items-center">
                  <RefreshCcw size={24} style={{ fontWeight: 'bold' }} />
                  <span className="ml-1">Learning</span>
                </button>
                <span className="text-gray-500">→</span>
                <button className="bg-green-700 hover:bg-green-600 text-white py-1 px-2 rounded flex items-center">
                  <Check size={24} style={{ fontWeight: 'bold' }} />
                  <span className="ml-1">Mastered</span>
                </button>
              </div>
              <div className="text-gray-400 mt-2 text-sm">
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded text-xl"
        >
          Start Reading Thai
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal;