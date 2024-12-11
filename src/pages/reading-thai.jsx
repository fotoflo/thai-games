import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, AlertTriangle, Copy, CopyCheck, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { thaiToIPA } from '../utils/thaiToIPA';
import { initialConsonants, vowels, finalConsonants } from '../utils/thaiLanguage';
import useMastery from '../hooks/useMastery';

// Function to generate a syllable
const generateSyllable = () => {
  const initial = initialConsonants[Math.floor(Math.random() * initialConsonants.length)];
  const vowel = vowels[Math.floor(Math.random() * vowels.length)];
  const final = finalConsonants[Math.floor(Math.random() * finalConsonants.length)];
  
  const needsFinal = vowel === 'เ' || vowel === 'แ' || vowel === 'โ' || vowel === 'ไ';
  const actualFinal = needsFinal ? 
    finalConsonants.filter(f => f !== '')[Math.floor(Math.random() * (finalConsonants.length - 1))] : 
    final;
  
  const text = needsFinal ? 
    vowel + initial + actualFinal : 
    initial + vowel + final;
  
  return { text, mastery: 1 };
};

// Function to check for Thai voices
const checkThaiVoices = (setHasThai, setError) => {
  const voices = window.speechSynthesis.getVoices();
  const thaiVoice = voices.find(voice => voice.lang.includes('th'));
  setHasThai(!!thaiVoice);
  setError(thaiVoice ? '' : 'No Thai voice found');
};

// Component for rendering mastery buttons
const MasteryButtons = ({ current, rateMastery }) => (
  <div className="grid grid-cols-5 gap-2">
    {[1, 2, 3, 4, 5].map(rating => (
      <button
        key={rating}
        onClick={() => rateMastery(rating)}
        className={`
          p-2 rounded transition-colors 
          text-black
          ${current.mastery === rating ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}
        `}
      >
        {rating}
      </button>
    ))}
  </div>
);

// Main component
const ThaiSyllables = () => {
  const [workingSet, setWorkingSet] = useState([]);
  const [current, setCurrent] = useState(null);
  const [hasThai, setHasThai] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState('');
  const [problemList, setProblemList] = useState([]);
  const [possibleProblemList, setPossibleProblemList] = useState([]);
  const [copied, setCopied] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  const { workingList, rateMastery } = useMastery(workingSet, current);

  const speakThai = () => {
    if (!current) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(current.text);
    utterance.lang = "th-TH";
    utterance.rate = 0.8;

    const voices = window.speechSynthesis.getVoices();
    const thaiVoice = voices.find((voice) => voice.lang.includes("th"));
    if (thaiVoice) utterance.voice = thaiVoice;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = (e) => {
      setSpeaking(false);
      setError(`Speech error: ${e.error}`);
    };

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const initial = Array(5).fill(null).map(generateSyllable);
    setWorkingSet(initial);
    setCurrent(initial[0]);

    const checkVoices = () => checkThaiVoices(setHasThai, setError);
    window.speechSynthesis.onvoiceschanged = checkVoices;
    checkVoices();

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

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
    const newSyllable = generateSyllable();
    const updated = [...workingSet];
    const index = updated.findIndex(s => s.text === current.text);
    updated[index] = newSyllable;
    setWorkingSet(updated);
    setCurrent(newSyllable);
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

  return (
    <div className="p-4 relative min-h-screen">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">{current.text}</div>
        <button 
          onClick={speakThai}
          disabled={!hasThai || speaking}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded  ${
            hasThai ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
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
        <div className="text-sm text-gray-200 dark:text-black text-center">Mastery level</div>
        <MasteryButtons current={current} rateMastery={rateMastery} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-90 border-t p-4 dark:bg-gray-800 dark:bg-opacity-90">
        <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
          {workingSet.map((syllable, i) => (
            <div key={i} className={`
              text-center p-2 rounded
              ${syllable.text === current.text ? 'bg-blue-100' : ''}
            `}>
              <div>{syllable.text}</div>
              <div className="text-xs text-gray-500">[{thaiToIPA(syllable.text)}]</div>
              <div className="text-sm text-gray-600">({syllable.mastery})</div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setShowDebug(!showDebug)}
        className="fixed bottom-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-gray-500 bg-opacity-50 hover:bg-opacity-100 transition-all text-white shadow-lg"
      >
        {showDebug ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {showDebug && (
        <div className="fixed bottom-16 right-4 w-64 space-y-2 bg-white p-4 rounded-lg shadow-lg dark:bg-gray-800">
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
            <div className="p-4 bg-green-50 rounded">
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
            <div className="p-4 bg-yellow-50 rounded">
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
            <div className="p-4 bg-red-50 rounded">
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
    </div>
  );
};

export default ThaiSyllables;