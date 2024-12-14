import React, { useState } from 'react';
import { useReadThaiGameState } from '../hooks/useReadThaiGameState';
import ItemDisplay from '../components/syllables/ItemDisplay';
import MasteryControls from '../components/syllables/MasteryControls';
import WorkingSetDisplay from '../components/syllables/WorkingSetDisplay';
import DebugPanel from '../components/syllables/DebugPanel';
import { useDebugMode } from '../hooks/useDebugMode';
import WelcomeModal from '../components/ReadThaiWelcomeModal';
import CheckTranslationButton from '../components/syllables/CheckTranslationButton';
import FlashCardModal from '../components/syllables/FlashCardModal';


const ThaiSyllables = () => {
  const gameState = useReadThaiGameState();
  const [displayTrigger, setDisplayTrigger] = useState(null); // 'speak' | 'mastery' | null

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


  const {
    copied,
    showDebug,
    setShowDebug,
    copyDebugInfo
  } = useDebugMode(workingList, possibleProblemList, problemList);

  const [showWelcome, setShowWelcome] = useState(true);

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

  const handleMastery = (level) => {
    gameState.rateMastery(level);
    setDisplayTrigger('mastery');
  };



  if (!current) {
    addMoreSyllables(5);
  }

  // Get the index of the current syllable in the original syllables array
  const currentIndexInJson = getCurrentProgress().currentIndex;
  const totalSyllables = getCurrentProgress().totalSyllables;

  return (
    <>
      <WelcomeModal 
        isOpen={showWelcome} 
        onClose={() => setShowWelcome(false)} 
      />
      
      <div className="p-4 pt-12 relative min-h-screen bg-gray-900 text-white">
        <ItemDisplay
          current={current}
          iconSize={52}
          textSize="text-6xl"
          className="flex items-center justify-center mb-10"
          speakOnUnmount={true}
          invertTranslation={invertTranslation}
        />
        
        <MasteryControls onRatingSelect={handleRateMastery} />


        <CheckTranslationButton 
          onClick={() => setDisplayTrigger('CheckTranslationButton')} 
          current={current}
          invertTranslation={invertTranslation}
          toggleInvertTranslation={toggleInvertTranslation}
        />


        <FlashCardModal 
          current={gameState.current}
          onNext={() => {
            gameState.addMoreSyllables();
            setDisplayTrigger(null);
          }}
          trigger={displayTrigger}
          onClose={() => setDisplayTrigger(null)}
        />

        <WorkingSetDisplay
          lessons={lessons}
          currentLesson={currentLesson}
          setCurrentLesson={setCurrentLesson}
          totalLessons={totalLessons}
          workingSet={workingSet}
          current={current}
          addMoreSyllables={addMoreSyllables}
          currentIndexInJson={currentIndexInJson}
          totalSyllables={totalSyllables}
          onCardSelect={handleCardSelect}
          progressionMode={progressionMode}
          setProgressionMode={setProgressionMode}
          onMastery={handleMastery}
          invertTranslation={invertTranslation}
          toggleInvertTranslation={toggleInvertTranslation}
        />  

        <DebugPanel
          showDebug={showDebug}
          setShowDebug={setShowDebug}
          reportProblem={reportProblem}
          reportPossibleProblem={reportPossibleProblem}
          copyDebugInfo={copyDebugInfo}
          copied={copied}
          workingList={workingList}
          possibleProblemList={possibleProblemList}
          problemList={problemList}
        />

      </div>
    </>
  );
};

export default ThaiSyllables;