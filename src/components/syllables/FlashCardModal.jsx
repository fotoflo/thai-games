import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ItemDisplay from './ItemDisplay';

const FlashCardModal = ({ current, onNext, trigger, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

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

  if (!trigger) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleBackdropClick}
    >
      <div className="relative">
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg min-w-[300px]">
          <div className="flex justify-between items-center mb-4">
            <ItemDisplay 
              current={current} 
              textSize="text-6xl"
              iconSize={24}
              speakOnMount={true} // Speak when showing translation
              speakOnUnmount={true}
            />
          </div>
          
          {isVisible && current.details && (
            <div className="mt-6 pt-6 border-t border-gray-600">
              <div className="flex justify-between items-center mb-2">
                <ItemDisplay 
                  current={{ text: current.details.translation }} 
                  textSize="text-2xl"
                  iconSize={20}
                />
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