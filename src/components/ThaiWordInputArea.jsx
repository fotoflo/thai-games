import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';

const ThaiWordInputArea = ({ inputRef, currentWord, handleInputChange, handleKeyPress, speakText, darkMode }) => (
  <div className="flex gap-2 mb-4">
    <Input 
      ref={inputRef}
      type="text" 
      value={currentWord} 
      onChange={handleInputChange}
      onKeyPress={handleKeyPress}
      className={`flex-grow p-4 rounded-lg border-2 border-gray-200 bg-gray-50 text-xl mr-2 ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-gray-100 border-gray-300 text-black'}`}
      placeholder="Type here..."
    />
    <Button 
      onClick={() => speakText(currentWord)} 
    >
      <Volume2 size={20} />
    </Button>
  </div>
);

export default ThaiWordInputArea;
