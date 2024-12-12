import React, { useState } from 'react';
import { speakThai } from '../utils/textToSpeech';
import { useReadThaiGameState as useGameState } from '../hooks/useReadThaiGameState';
import SyllableDisplay from '../components/syllables/SyllableDisplay';
import MasteryControls from '../components/syllables/MasteryControls';
import WorkingSetDisplay from '../components/syllables/WorkingSetDisplay';
import DebugPanel from '../components/syllables/DebugPanel';
import CompletionScreen from '../components/syllables/CompletionScreen';
import { useThaiSpeech } from '../hooks/useThaiSpeech';
import { useDebugMode } from '../hooks/useDebugMode';
import WelcomeModal from '../components/ReadThaiWelcomeModal';
import CurrentDisplay from '../components/syllables/CurrentDisplay';

const ThaiSyllables = () => {
  const gameState = useGameState();
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
    currentMode,
    lessons
  } = gameState;


  const {
    hasThai,
    speaking,
    setSpeaking,
    error,
    setError,
    speak
  } = useThaiSpeech();

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

    await rateMastery(rating, speakThai);
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

  const handleSpeak = () => {
    setDisplayTrigger('speak');
  };

  if (!current) {
    return <CompletionScreen addMoreSyllables={addMoreSyllables} />;
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
        <SyllableDisplay
          current={current}
          hasThai={hasThai}
          speaking={speaking}
          setSpeaking={setSpeaking}
          error={error}
          setError={setError}
          onSpeak={() => {
            setDisplayTrigger('speak');
            speak(current);
          }}
        />
        
        <MasteryControls onRatingSelect={handleRateMastery} />

        <CurrentDisplay 
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
          currentMode={currentMode}
          setProgressionMode={setProgressionMode}
          onSpeak={handleSpeak}
          onMastery={handleMastery}
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