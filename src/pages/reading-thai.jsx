import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, AlertTriangle, Copy, CopyCheck, AlertCircle, ChevronDown, ChevronUp, Check, PlusCircle } from 'lucide-react';
import { thaiToIPA } from '../utils/thaiToIPA';
import { speakThai } from '../utils/textToSpeech';
import { useGameState } from '../hooks/useGameState';
import LessonSelector from '../components/LessonSelector';
import SyllableDisplay from '../components/syllables/SyllableDisplay';
import MasteryControls from '../components/syllables/MasteryControls';
import WorkingSetDisplay from '../components/syllables/WorkingSetDisplay';
import DebugPanel from '../components/syllables/DebugPanel';
import CompletionScreen from '../components/syllables/CompletionScreen';

const ThaiSyllables = () => {
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
    getCurrentProgress
  } = useGameState();

  console.log('Render ThaiSyllables:', { currentLesson, totalLessons });

  const [hasThai, setHasThai] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    const checkVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const thaiVoice = voices.find(voice => voice.lang.includes('th'));
      setHasThai(!!thaiVoice);
      setError(thaiVoice ? '' : 'No Thai voice found');
    };

    window.speechSynthesis.onvoiceschanged = checkVoices;
    checkVoices();

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const copyDebugInfo = async () => {
    try {
      const debugInfo = `Working syllables: ${workingList.join(', ')}\nPossibly problematic: ${possibleProblemList.join(', ')}\nProblem syllables: ${problemList.join(', ')}`;
      await navigator.clipboard.writeText(debugInfo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  const handleRateMastery = async (rating) => {
    const button = event.target.closest('button');
    button.classList.add('clicked');
    
    setTimeout(() => {
      button.classList.remove('clicked');
    }, 1000);

    await rateMastery(rating, speakThai);
  };

  if (!current) {
    return <CompletionScreen addMoreSyllables={addMoreSyllables} />;
  }

  // Get the index of the current syllable in the original syllables array
  const currentIndexInJson = getCurrentProgress().currentIndex;
  const totalSyllables = getCurrentProgress().totalSyllables;

  return (
    <div className="p-4 relative min-h-screen bg-gray-900 text-white">
      <SyllableDisplay
        current={current}
        hasThai={hasThai}
        speaking={speaking}
        setSpeaking={setSpeaking}
        error={error}
        setError={setError}
      />
      
      <MasteryControls onRatingSelect={handleRateMastery} />
      
      <WorkingSetDisplay
        currentLesson={currentLesson}
        setCurrentLesson={setCurrentLesson}
        totalLessons={totalLessons}
        workingSet={workingSet}
        current={current}
        addMoreSyllables={addMoreSyllables}
        currentIndexInJson={currentIndexInJson}
        totalSyllables={totalSyllables}
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
  );
};

export default ThaiSyllables;