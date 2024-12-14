import React, { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { useThaiSpeech } from '../../hooks/useThaiSpeech';
import ItemDisplay from './ItemDisplay';

const FlashCardModal = ({ current, onNext, trigger, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { speaking, hasThai, handleSpeak } = useThaiSpeech(false, false);

  useEffect(() => {
    if (trigger === 'CheckTranslationButton') {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [trigger, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const details = current?.details || current;
  const example = details?.examples?.[0];

  if (!trigger) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleBackdropClick}
    >
      <div className="relative">
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg min-w-[300px]">
          {/* Main word */}
          <div className="flex justify-between items-center mb-4">
            <ItemDisplay 
              current={current} 
              textSize="text-6xl"
              iconSize={24}
              speakOnMount={true}
            />
          </div>
          
          {isVisible && (
            <div className="mt-6 pt-6 border-t border-gray-600 space-y-4">
              {/* Translation and Romanization */}
              <div>
                <div className="text-2xl text-gray-200">{details.translation}</div>
                <div className="text-gray-400">{details.romanization}</div>
              </div>

              {/* Notes */}
              {details.notes && (
                <div className="text-gray-400 text-sm bg-gray-700 p-3 rounded">
                  {details.notes}
                </div>
              )}

              {/* Example */}
              {example && (
                <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="text-lg text-white">{example.text}</div>
                    <button
                      className="p-2 rounded-full hover:bg-gray-600 transition-colors"
                      title="Speak Example"
                      disabled={!hasThai || speaking}
                      onClick={() => handleSpeak(example.text)}
                    >
                      <Volume2 size={16} className="text-gray-400 hover:text-white" />
                    </button>
                  </div>
                  <div className="text-gray-300 mt-1">{example.translation}</div>
                  <div className="text-sm text-gray-400">{example.romanization}</div>
                </div>
              )}

              {/* Tags */}
              {details.tags && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {details.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
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