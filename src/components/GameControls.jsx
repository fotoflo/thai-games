import React from 'react';
import { Button } from '@/components/ui/button';

const GameControls = ({ 
  showThaiWord, 
  setShowThaiWord, 
  toggleHint, 
  hintActive,
  useThaiKeyboard,
  toggleKeyboard
}) => (
  <div className="flex justify-center gap-2 mb-4">
    <Button onClick={() => setShowThaiWord(!showThaiWord)} variant="outline">
      {showThaiWord ? 'Hide Thai' : 'Show Thai'}
    </Button>
    <Button onClick={toggleHint} variant="outline">
      {hintActive ? 'Hide Hint' : 'Show Hint'}
    </Button>
    <Button onClick={toggleKeyboard} variant="outline">
      {useThaiKeyboard ? 'Use Desktop' : 'Use Mobile'}
    </Button>
  </div>
);

export default GameControls;
