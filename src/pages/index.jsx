import React, { useState } from 'react';
import { useReadThaiGameState } from '../hooks/useReadThaiGameState';
import ItemDisplay from '../components/syllables/ItemDisplay';
import MasteryControls from '../components/syllables/MasteryControls';

import WelcomeModal from '../components/ReadThaiWelcomeModal';
import CheckTranslationButton from '../components/syllables/CheckTranslationButton';
import FlashCardModal from '../components/syllables/FlashCardModal';
import SettingsModalContainer from '../components/SettingsModalContainer';
import WorkingSetCards from '../components/syllables/WorkingSetCards';
import LessonCarousel from '../components/LessonCarousel';
import ProgressionSelector from '../components/syllables/ProgressionSelector';
import ToggleInvertTranslationButton from '../components/syllables/ToggleInvertTranslationButton';
import SettingsHamburger from '../components/ui/SettingsHamburger';
import Divider from '../components/ui/divider';
import SettingsMenuButton from '../components/SettingsMenuButton';
import LessonDetails from '../components/syllables/LessonDetailScreen';

const ThaiSyllables = () => {
  const gameState = useReadThaiGameState();
  const [displayTrigger, setDisplayTrigger] = useState(null); // 'speak' | 'mastery' | null
  const [showWelcome, setShowWelcome] = useState(true);
  const [showSettingsContainer, setShowSettingsContainer] = useState(false); // State for SettingsModalContainer
  const [lessonDetailsSelectedLesson, setLessonDetailsSelectedLesson] = useState(null);

  const {
    currentLesson,
    setCurrentLesson,
    totalLessons,
    workingSet,
    current,
    problemList,
    possibleProblemList,
    workingList,
    rateMastery,
    reportProblem,
    reportPossibleProblem,
    addMoreSyllables,
    getCurrentProgress,
    setProgressionMode,
    progressionMode,
    lessons,
    invertTranslation,
    toggleInvertTranslation,
  } = gameState;

  console.log('Render ThaiSyllables:', { currentLesson, totalLessons });

  const handleRateMastery = async (rating) => {
    const button = event.target.closest('button');
    button.classList.add('clicked');
    
    setTimeout(() => {
      button.classList.remove('clicked');
    }, 1000);

    await rateMastery(rating);
  };

  const handleCardSelect = (syllable) => {
    const targetIndex = workingSet.findIndex(s => s.text === syllable.text);
    if (targetIndex !== -1) {
      rateMastery(0, null, targetIndex);
    }
  };

  if (!current) {
    addMoreSyllables(5);
  }

  const openSettings = () => {
    setShowSettingsContainer(true); // Show the SettingsModalContainer
  };

  const closeSettings = () => {
    setShowSettingsContainer(false); // Hide the SettingsModalContainer
  };

  const handleViewLessonDetails = (lesson, index) => {
    setLessonDetailsSelectedLesson({ lesson, index });
  };

  const handleStudyLesson = (index) => {
    setCurrentLesson(index);
  };

  return (
    <>
      <WelcomeModal 
        isOpen={showWelcome} 
        onClose={() => setShowWelcome(false)} 
      />
      
      <div className="p-4 pt-12 relative min-h-screen bg-gray-900 text-white">
        


        <SettingsHamburger onClick={openSettings} />

        <ItemDisplay
          current={current}
          iconSize={52}
          textSize="text-6xl"
          className="flex items-center justify-center mb-10"
          speakOnUnmount={true}
          invertTranslation={invertTranslation}
        />

        <CheckTranslationButton 
          onClick={() => setDisplayTrigger('CheckTranslationButton')} 
          current={current}
          invertTranslation={invertTranslation}
          toggleInvertTranslation={toggleInvertTranslation}
        />

        <FlashCardModal 
          vocabItem={current}
          onNext={() => {
            gameState.addMoreSyllables();
            setDisplayTrigger(null);
          }}
          trigger={displayTrigger}
          onClose={() => setDisplayTrigger(null)}
        />

      <div className="fixed
      bottom-0
      left-0
      right-0
      bg-gray-900
      bg-opacity-90  p-4">

        <Divider className="mb-10 -mx-4" borderClass="border-slate-700"/>

          <MasteryControls onRatingSelect={handleRateMastery} className="mb-10"/>


        <Divider className="mb-4 -mx-4" borderClass="border-slate-700"/>

        <WorkingSetCards 
          workingSet={workingSet}
          current={current}
          onCardSelect={handleCardSelect}
          addMoreSyllables={addMoreSyllables}
          />

<Divider className="mb-4 -mx-4" borderClass="border-slate-700"/>

          <div className="mt-4">
            <LessonCarousel 
              currentLesson={currentLesson}
              setCurrentLesson={setCurrentLesson}
              totalLessons={totalLessons}
              lessons={lessons}
              onViewDetails={handleViewLessonDetails}
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

        {/* Render SettingsModalContainer if showSettingsContainer is true */}
        {showSettingsContainer && <SettingsModalContainer onClose={closeSettings} />}
        
        {/* Add LessonDetails as a modal overlay */}
        {lessonDetailsSelectedLesson && (
          <div className="fixed inset-0 z-50">
            <LessonDetails 
              lesson={lessonDetailsSelectedLesson.lesson}
              lessonIndex={lessonDetailsSelectedLesson.index}
              onClose={() => setLessonDetailsSelectedLesson(null)}
              onStudyLesson={handleStudyLesson}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ThaiSyllables;