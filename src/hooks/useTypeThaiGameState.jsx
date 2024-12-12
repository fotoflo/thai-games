import { useState, useCallback, useEffect } from 'react';

export const useTypeThaiGameState = (initialWords) => {
  const [currentWord, setCurrentWord] = useState('');
  const [targetWord, setTargetWord] = useState(initialWords[0]);
  const [wordIndex, setWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [showWinDialog, setShowWinDialog] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [hintActive, setHintActive] = useState(true);
  const [ttsAvailable, setTtsAvailable] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showThaiWord, setShowThaiWord] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.speechSynthesis) {
      setTtsAvailable(false);
    }
  }, []);

  const checkWord = useCallback((word) => {
    if (word === targetWord.thai) {
      setScore(prev => prev + (hintUsed ? 0.5 : 1));
      setMessage(`Correct! "${word}" means "${targetWord.english}" in English.`);
      setShowWinDialog(true);
      return true;
    } else if (targetWord.thai.startsWith(word)) {
      setMessage('Keep going...');
      return false;
    } else {
      setMessage(`Incorrect. Try again!`);
      setTimeout(() => setCurrentWord(''), 1000);
      return false;
    }
  }, [targetWord, hintUsed]);

  const nextWord = useCallback(() => {
    setCurrentWord('');
    setWordIndex(prev => (prev + 1) % initialWords.length);
    setTargetWord(initialWords[(wordIndex + 1) % initialWords.length]);
    setMessage('');
    setHintUsed(false);
    setShowWinDialog(false);
  }, [initialWords, wordIndex]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  const toggleHint = useCallback(() => {
    setHintActive(prev => !prev);
  }, []);

  return {
    currentWord,
    setCurrentWord,
    targetWord,
    setTargetWord,
    wordIndex,
    score,
    message,
    showWinDialog,
    setShowWinDialog,
    hintUsed,
    setHintUsed,
    hintActive,
    setHintActive,
    ttsAvailable,
    darkMode,
    showThaiWord,
    setShowThaiWord,
    checkWord,
    nextWord,
    toggleDarkMode,
    toggleHint
  };
};
