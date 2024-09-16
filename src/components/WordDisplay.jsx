import React from 'react';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';

const WordDisplay = ({ targetWord, showThaiWord, currentWord, speakText, IconComponent }) => (
  <div className="flex items-center justify-center mb-4">
    <IconComponent size={48} className="mr-4 text-blue-500" />
    <div>
      <p className="text-2xl font-bold">{targetWord.english}</p>
      {showThaiWord && (
        <div className="flex items-center">
          <p className="text-xl mr-2">
            {targetWord.thai.split('').map((letter, index) => (
              <span key={index} className={index === currentWord.length ? "bg-yellow-300 text-black" : ""}>
                {letter}
              </span>
            ))}
          </p>
          <Button 
            onClick={() => speakText(targetWord.thai)} 
            variant="ghost" 
            size="sm"
            className="p-1"
          >
            <Volume2 size={20} className="text-blue-500" />
          </Button>
        </div>
      )}
    </div>
  </div>
);

export default WordDisplay;
