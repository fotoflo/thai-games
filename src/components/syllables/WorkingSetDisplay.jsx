import React from 'react';
import { PlusCircle } from 'lucide-react';
import { thaiToIPA } from '../../utils/thaiToIPA';
import LessonSelector from '../LessonSelector';

const WorkingSetDisplay = ({
  currentLesson,
  setCurrentLesson,
  totalLessons,
  workingSet,
  current,
  addMoreSyllables,
  currentIndexInJson,
  totalSyllables,
  onCardSelect
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 bg-opacity-90 border-t p-4">
      <LessonSelector 
        currentLesson={currentLesson}
        setCurrentLesson={setCurrentLesson}
        totalLessons={totalLessons}
      />
      <div className="flex items-center justify-center gap-2">
        <div className="grid grid-cols-5 gap-2 w-[400px]">
          {workingSet.map((syllable, i) => (
            <div 
              key={i} 
              className={`
                text-center p-2 rounded cursor-pointer
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
        </div>
        {workingSet.length < 5 && (
          <button
            onClick={addMoreSyllables}
            className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white"
            title="Add One More Syllable"
          >
            <PlusCircle size={24} />
          </button>
        )}
      </div>
      <div className="text-center text-white mt-2">
        {current.text} - {currentIndexInJson} / {totalSyllables}
      </div>
    </div>
  );
};

export default WorkingSetDisplay;
