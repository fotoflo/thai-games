import React from 'react';
import { X, Volume2, Check, PlusCircle, Star } from 'lucide-react';

const WelcomeModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 text-white rounded-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>

        <h1 className="text-2xl font-bold mb-4">Welcome to Thai Syllables</h1>
        
        <p className="mb-6 text-gray-300">
          Your brain can only hold a few things at once - that's why we teach you to read just 5 syllables at a time.
        </p>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <div className="text-blue-500 text-3xl mb-4 flex items-center justify-start gap-4 flex-wrap">
            <span className="flex items-center gap-2">See <Volume2 size={32} /></span>
            <span className="text-gray-500">→</span>
            <span>Recall & Say</span>
            <span className="text-gray-500">→</span>
            <span className="flex items-center gap-2">Rate <Star size={32} /></span>
            <span className="text-gray-500">→</span>
            <span>Repeat</span>
          </div>
          <p className="text-gray-400 text-xl">
            Each time you go through this cycle, you're pushing both the sounds and active reading skill into your long-term memory. 
            With practice, you'll start recognizing these syllables instantly when you see them.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Managing Your Stack</h2>
          <ul className="space-y-4 text-xl text-gray-400">
            <li className="flex items-center gap-3">
              <Check className="text-green-500 flex-shrink-0" size={32} />
              Check the box when you've mastered a syllable
            </li>
            <li className="flex items-center gap-3">
              <Star className="text-yellow-500 flex-shrink-0" size={32} />
              This removes it from your active learning stack
            </li>
            <li className="flex items-center gap-3">
              <PlusCircle className="text-blue-500 flex-shrink-0" size={32} />
              Click the plus when you're ready to add new syllables
            </li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Quick Tips</h2>
          <ul className="space-y-4 text-xl text-gray-400">
            <li className="flex items-center gap-3">
              <Volume2 className="text-blue-500 flex-shrink-0" size={32} />
              Listen and repeat each syllable in sync with the voice
            </li>
            <li className="flex items-center gap-3">
              <Star className="text-yellow-500 flex-shrink-0" size={32} />
              Match both the sound and tone exactly
            </li>
            <li className="flex items-center gap-3">
              <Check className="text-green-500 flex-shrink-0" size={32} />
              Rate honestly - it helps you learn faster
            </li>
          </ul>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded text-2xl"
        >
          Let's Learn Thai!
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal; 