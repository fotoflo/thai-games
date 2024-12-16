// Modified src/components/syllables/WorkingSetDisplay.jsx
import React from 'react';
import WorkingSetCards from './WorkingSetCards';
import LessonCarousel from '../LessonCarousel';
import ProgressionSelector from './ProgressionSelector';
import ToggleInvertTranslationButton from './ToggleInvertTranslationButton';

const WorkingSetDisplay = ({
  currentLesson,
  setCurrentLesson,
  totalLessons,
  workingSet,
  current,
  addMoreSyllables,
  onCardSelect,
  progressionMode,
  setProgressionMode,
  lessons,
  invertTranslation,
  toggleInvertTranslation,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 bg-opacity-90 border-t p-4">
      <WorkingSetCards 
        workingSet={workingSet}
        current={current}
        onCardSelect={onCardSelect}
        addMoreSyllables={addMoreSyllables}
      />
      <div className="mt-4">
        <LessonCarousel 
          currentLesson={currentLesson}
          setCurrentLesson={setCurrentLesson}
          totalLessons={totalLessons}
          lessons={lessons}
        />
        
        <ProgressionSelector 
          progressionMode={progressionMode}
          onModeChange={setProgressionMode}
        />
        <ToggleInvertTranslationButton 
          toggleInvertTranslation={toggleInvertTranslation}
          invertTranslation={invertTranslation}
        />
      </div>
    </div>
  );
};

export default WorkingSetDisplay;