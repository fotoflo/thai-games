import React, { useState, useEffect } from 'react';
import { ArrowRight, X, Volume2 } from 'lucide-react';
import { thaiToIPA } from '../../utils/thaiToIPA';
import { speakThai } from '../../utils/textToSpeech';

const FlashCardModal = ({ current, onNext, trigger, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (trigger === 'CheckTranslationButton') {
      handleSpeak();
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  const handleSpeak = (text) => {
    speakThai({
      text,
      setSpeaking,
      setError,
      onEnd: () => setIsVisible(true)
    });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!trigger) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleBackdropClick}
    >
      <div className="relative">
        <button 
          onClick={onClose}
          className="absolute -top-2 -right-2 p-1 bg-gray-700 rounded-full hover:bg-gray-600"
        >
          <X size={20} />
        </button>
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg min-w-[300px]">
          <div className="flex justify-between items-center mb-4">
            <div className="text-6xl">{current.text}</div>
            <button
              onClick={() => handleSpeak(current.text)}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
              disabled={speaking}
              title="Speak Thai"
            >
              <Volume2 size={24} className={`${speaking ? 'text-gray-500' : 'text-white'}`} />
            </button>
          </div>
          
          {isVisible && current.details && (
            <div className="mt-6 pt-6 border-t border-gray-600">
              <div className="flex justify-between items-center mb-2">
                <div className="text-2xl text-blue-300">
                  {current.details.translation}
                </div>
                <button
                  onClick={() => handleSpeak(current.details.translation)}
                  className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                  disabled={speaking}
                  title="Speak Translation"
                >
                  <Volume2 size={20} className={`${speaking ? 'text-gray-500' : 'text-white'}`} />
                </button>
              </div>
              {current.details.notes && (
                <div className="text-gray-400 text-sm">
                  {current.details.notes}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashCardModal; 