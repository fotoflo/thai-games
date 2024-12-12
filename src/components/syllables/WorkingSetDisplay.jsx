import React from 'react';
import { PlusCircle } from 'lucide-react';
import { thaiToIPA } from '../../utils/thaiToIPA';
import LessonSelector from '../LessonSelector';
import ProgressionSelector from './ProgressionSelector';

const WorkingSetDisplay = ({
  currentLesson,
  setCurrentLesson,
  totalLessons,
  workingSet,
  current,
  addMoreSyllables,
  currentIndexInJson,
  totalSyllables,
  onCardSelect,
  currentMode,
  setProgressionMode
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 bg-opacity-90 border-t p-4">
      <LessonSelector 
        currentLesson={currentLesson}
        setCurrentLesson={setCurrentLesson}
        totalLessons={totalLessons}
      />
        
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="flex gap-2 w-[400px] flex-wrap">
          {workingSet.map((syllable, i) => (
            <div 
              key={i} 
              className={`
                text-center p-2 rounded cursor-pointer w-[72px] h-[80px]
                ${syllable.text === current.text ? 'bg-blue-700' : 'bg-gray-800'}
                hover:bg-blue-600 transition-colors
              `}
              onClick={() => onCardSelect(syllable)}
              role="button"
              tabIndex={0}
            >
              <div className="text-white text-lg">{syllable.text}</div>
              <div className="text-xs text-gray-400">[{thaiToIPA(syllable.text)}]</div>
              <div className="text-sm text-gray-300">({syllable.mastery})</div>
            </div>
          ))}
          {workingSet.length < 5 && (
            <div className="ml-auto">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Button clicked");
                  addMoreSyllables();
                }}
                className="flex flex-col items-center justify-center p-2 rounded bg-green-600 hover:bg-green-500 transition-colors cursor-pointer w-[72px] h-[80px]"
                title="Add One More Syllable"
              >
                <PlusCircle size={24} className="text-white" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <ProgressionSelector 
          mode={currentMode}
          onModeChange={setProgressionMode}
        />
      </div>
      
      <div className="text-center text-white mb-4">
        {current.text} - {currentIndexInJson} / {totalSyllables}
      </div>

    </div>
  );
};

export default WorkingSetDisplay;