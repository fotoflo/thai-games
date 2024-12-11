import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, AlertTriangle, Copy, CopyCheck, AlertCircle, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { thaiToIPA } from '../utils/thaiToIPA';
import { speakThai } from '../utils/textToSpeech';
import syllablesData from '../lessons/1-lesson.json';

const ThaiSyllables = () => {
  const [workingSet, setWorkingSet] = useState([]);
  const [current, setCurrent] = useState(null);
  const [hasThai, setHasThai] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState('');
  const [problemList, setProblemList] = useState([]);
  const [possibleProblemList, setPossibleProblemList] = useState([]);
  const [workingList, setWorkingList] = useState([]);
  const [copied, setCopied] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [lastAddedIndex, setLastAddedIndex] = useState(-1);

  useEffect(() => {
    const selectedSyllables = syllablesData.syllables.slice(0, 5).map(syllable => ({ text: syllable, mastery: 1 }));
    setWorkingSet(selectedSyllables);
    setCurrent(selectedSyllables[0]);
    setLastAddedIndex(4);

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

  const addMoreSyllables = () => {
    const nextIndex = lastAddedIndex + 1;
    if (nextIndex < syllablesData.syllables.length) {
      const newSyllable = syllablesData.syllables[nextIndex];
      setWorkingSet(prev => [{ text: newSyllable, mastery: 1 }, ...prev]);
      setLastAddedIndex(nextIndex);
    } else {
      console.log("No more syllables to add from the list.");
    }
  };

  const rateMastery = (rating) => {
    if (!current) return;

    // Single animation trigger
    const container = document.querySelector('.grid-cols-5');
    container.classList.remove('flash-blue');
    void container.offsetWidth;
    container.classList.add('flash-blue');
    setTimeout(() => {
      container.classList.remove('flash-blue');
    }, 500);

    if (!workingList.includes(current.text)) {
      setWorkingList([...workingList, current.text]);
    }

    const updated = workingSet.map(s => 
      s.text === current.text ? { ...s, mastery: rating } : s
    );

    if (rating === 5) {
      const currentIndex = workingSet.indexOf(current);
      updated.splice(currentIndex, 1);

      if (updated.length > 0) {
        setCurrent(updated[0]);
      } else {
        console.log("No more syllables left in the working set.");
        setLastAddedIndex(-1);
        setWorkingSet(syllablesData.syllables.map(syllable => ({ text: syllable, mastery: 1 })));
      }
    } else {
      const nextIndex = (workingSet.indexOf(current) + 1) % workingSet.length;
      setCurrent(updated[nextIndex]);
    }

    setWorkingSet(updated);
    setError('');
  };

  const reportProblem = () => {
    if (current && !problemList.includes(current.text)) {
      setProblemList([...problemList, current.text]);
      nextSyllable();
    }
  };

  const reportPossibleProblem = () => {
    if (current && !possibleProblemList.includes(current.text)) {
      setPossibleProblemList([...possibleProblemList, current.text]);
      nextSyllable();
    }
  };

  const nextSyllable = () => {
    const nextIndex = (workingSet.indexOf(current) + 1) % workingSet.length;
    setCurrent(workingSet[nextIndex]);
  };

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

  if (!current) return <div>Loading...</div>;

  
  // Get the index of the current syllable in the original syllables array
  const currentIndexInJson = syllablesData.syllables.indexOf(current.text) + 1; // +1 for 1-based index

  return (
    <div className="p-4 relative min-h-screen bg-gray-900 text-white">
      <style jsx>{`
        @keyframes flashBlue {
          0% { background-color: inherit; }
        }
        .flash-blue button {
          animation: flashBlue 0.5s ease;
        }
      `}</style>

      <div className="text-center mb-8">
        <div className="text-6xl mb-4">{current.text}</div>
        <button 
          onClick={() => speakThai({ current, setSpeaking, setError })}
          disabled={!hasThai || speaking}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded ${
            hasThai ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-700 text-gray-400'
          }`}
        >
          {speaking ? <Volume2 className="animate-pulse" size={20} /> : <Volume2 size={20} />}
          {speaking ? 'Speaking...' : 'Speak'}
        </button>
        {error && (
          <div className="flex items-center justify-center gap-2 mt-2 text-red-500">
            <VolumeX size={16} />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="text-sm text-gray-400 text-center">Mastery level</div>
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 'check'].map(rating => (
            <button
              key={rating}
              onClick={() => rateMastery(rating === 'check' ? 5 : rating)}
              className="p-2 rounded transition-colors bg-gray-800 hover:bg-blue-600 active:bg-blue-800"
            >
              {rating === 'check' ? <Check size={20} className="mx-auto" /> : rating}
            </button>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 bg-opacity-90 border-t p-4">
        <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
          {workingSet.map((syllable, i) => (
            <div key={i} className={`
              text-center p-2 rounded
              ${syllable.text === current.text ? 'bg-blue-700' : 'bg-gray-800'}
            `}>
              <div className="text-white">{syllable.text}</div>
              <div className="text-xs text-gray-400">[{thaiToIPA(syllable.text)}]</div>
              <div className="text-sm text-gray-300">({syllable.mastery})</div>
            </div>
          ))}
        </div>
        <div className="text-center text-white mt-2">
          {current.text} - {currentIndexInJson} / {syllablesData.syllables.length}
        </div>
      </div>

      <button
        onClick={() => setShowDebug(!showDebug)}
        className="fixed bottom-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-gray-500 bg-opacity-50 hover:bg-opacity-100 transition-all text-white shadow-lg"
      >
        {showDebug ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {showDebug && (
        <div className="fixed bottom-16 right-4 w-64 space-y-2 bg-white p-4 rounded-lg shadow-lg">
          <div className="flex gap-2">
            <button
              onClick={reportProblem}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
            >
              <AlertTriangle size={20} />
              Problem
            </button>
            <button
              onClick={reportPossibleProblem}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              <AlertCircle size={20} />
              Not Sure
            </button>
          </div>

          <button
            onClick={copyDebugInfo}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            {copied ? <CopyCheck size={20} /> : <Copy size={20} />}
            {copied ? 'Copied!' : 'Copy Debug Info'}
          </button>

          {workingList.length > 0 && (
            <div className="p-4 bg-gray-800 rounded">
              <h3 className="font-bold mb-2">Working Syllables:</h3>
              <div className="flex flex-wrap gap-2">
                {workingList.map((syllable, index) => (
                  <div key={index} className="bg-white px-2 py-1 rounded border">
                    {syllable}
                  </div>
                ))}
              </div>
            </div>
          )}

          {possibleProblemList.length > 0 && (
            <div className="p-4 bg-yellow-600 rounded">
              <h3 className="font-bold mb-2">Possibly Problematic:</h3>
              <div className="flex flex-wrap gap-2">
                {possibleProblemList.map((syllable, index) => (
                  <div key={index} className="bg-white px-2 py-1 rounded border">
                    {syllable}
                  </div>
                ))}
              </div>
            </div>
          )}

          {problemList.length > 0 && (
            <div className="p-4 bg-red-600 rounded">
              <h3 className="font-bold mb-2">Problem Syllables:</h3>
              <div className="flex flex-wrap gap-2">
                {problemList.map((syllable, index) => (
                  <div key={index} className="bg-white px-2 py-1 rounded border">
                    {syllable}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {workingSet.length < 5 && (
        <button
          onClick={addMoreSyllables}
          className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
        >
          Add One More Syllable
        </button>
      )}
    </div>
  );
};

export default ThaiSyllables;