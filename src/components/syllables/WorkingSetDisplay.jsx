import React from 'react';
import { PlusCircle } from 'lucide-react';
import { thaiToIPA } from '../../utils/thaiToIPA';
import LessonCarousel from '../LessonCarousel';
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
  progressionMode,
  setProgressionMode,
  lessons
}) => {

  const getTextSizeClass = (text) => {
    if (text.length <= 3) return 'text-lg';
    if (text.length <= 5) return 'text-base';
    if (text.length <= 7) return 'text-sm';
    return 'text-xs';
  };

  const getPhoneticSizeClass = (text) => {
    if (text.length <= 5) return 'text-xs';
    if (text.length <= 8) return 'text-[10px]';
    return 'text-[8px]';
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 bg-opacity-90 border-t p-4">
      <LessonCarousel 
        currentLesson={currentLesson}
        setCurrentLesson={setCurrentLesson}
        totalLessons={totalLessons}
        lessons={lessons}
      />
        
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="flex gap-2 flex-wrap justify-center">
          {workingSet.map((item, i) => {
            const phoneticText = thaiToIPA(item.text);
            return (
              <div 
                key={i} 
                className={`
                  text-center p-2 rounded cursor-pointer w-[60px] h-[80px]
                  ${item.text === current.text ? 'bg-blue-700' : 'bg-gray-800'}
                  hover:bg-blue-600 transition-colors
                  flex flex-col justify-center
                `}
                onClick={() => onCardSelect(item)}
                role="button"
                tabIndex={0}
              >
                <div className={`text-white ${getTextSizeClass(item.text)} leading-tight`}>
                  {item.text}
                </div>
                <div className={`text-gray-400 ${getPhoneticSizeClass(phoneticText)} leading-tight`}>
                  [{phoneticText}]
                </div>
                <div className="text-sm text-gray-300">({item.mastery})</div>
              </div>
            );
          })}
          {workingSet.length < 5 && (
            <div className="ml-auto">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addMoreSyllables();
                }}
                className="flex flex-col items-center justify-center p-2 rounded bg-green-600 hover:bg-green-500 transition-colors cursor-pointer w-[60px] h-[80px]"
                title="Add One More Item"
              >
                <PlusCircle size={24} className="text-white" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="text-center text-white mb-4">
        {current.text} - {currentIndexInJson} / {totalSyllables}
        {current.details?.translation && (
          <span className="ml-2 text-gray-400">({current.details.translation})</span>
        )}
      </div>

      <div className="mt-4">
        <ProgressionSelector 
          progressionMode={progressionMode}
          onModeChange={setProgressionMode}
        />
      </div>
    </div>
  );
};

export default WorkingSetDisplay;