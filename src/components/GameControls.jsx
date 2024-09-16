import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';

const GameControls = ({ showThaiWord, setShowThaiWord, toggleHint, hintActive }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center">
      <Switch
        id="show-thai"
        checked={showThaiWord}
        onCheckedChange={setShowThaiWord}
      />
      <label htmlFor="show-thai" className="ml-2">Show Thai Word</label>
    </div>
    <Button onClick={toggleHint} className={`flex items-center ${hintActive ? 'bg-green-500' : 'bg-yellow-500'} hover:opacity-80 text-white`}>
      <Lightbulb className="mr-2" size={16} />
      {hintActive ? 'Hint On' : 'Hint Off'}
    </Button>
  </div>
);

export default GameControls;
