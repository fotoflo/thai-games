import React, {  useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Smile, Coffee, Sun, Apple, Home, Moon} from 'lucide-react';
import ThaiKeyboard from '@/components/ThaiKeyboard';
import WordDisplay from '@/components/WordDisplay';
import GameControls from '@/components/GameControls';
import ThaiWordInputArea from '@/components/ThaiWordInputArea';
import WinDialog from '@/components/WinDialog';
import { useTypeThaiGameState  } from '@/hooks/useTypeThaiGameState';
import GameHeader from '@/components/GameHeader';
import ThaiDesktopKeyboard from '@/components/ThaiDesktopKeyboard';

const thaiWords = [
  { thai: 'ขอบคุณ', english: 'Thank you', icon: Smile },
  { thai: 'สวัสดี', english: 'Hello', icon: Smile },
  { thai: 'ใช่', english: 'Yes', icon: Smile },
  { thai: 'ไม่', english: 'No', icon: Smile },
  { thai: 'กาแฟ', english: 'Coffee', icon: Coffee },
  { thai: 'น้ำ', english: 'Water', icon: Coffee },
  { thai: 'ร้อน', english: 'Hot', icon: Sun },
  { thai: 'เย็น', english: 'Cold', icon: Sun },
  { thai: 'อาหาร', english: 'Food', icon: Apple },
  { thai: 'บ้าน', english: 'Home', icon: Home }
];

const ThaiWordLearningGame = () => {
  const {
    currentWord,
    setCurrentWord,
    targetWord,
    score,
    message,
    showWinDialog,
    setShowWinDialog,
    hintActive,
    ttsAvailable,
    darkMode,
    showThaiWord,
    setShowThaiWord,
    checkWord,
    nextWord,
    toggleDarkMode,
    toggleHint
  } = useTypeThaiGameState(thaiWords);

  const speakingRef = useRef(false);
  const inputRef = useRef(null);

  const [useThaiKeyboard, setUseThaiKeyboard] = useState(true);

  const toggleKeyboard = () => setUseThaiKeyboard(!useThaiKeyboard);

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.speechSynthesis) {
      setTtsAvailable(false);
    }
  }, []);

  const speakText = useCallback((text) => {
    return new Promise((resolve) => {
      if (!ttsAvailable) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'th-TH';
      utterance.onend = resolve;
      utterance.onerror = () => {
        console.error('Speech synthesis error');
        resolve();
      };

      speakingRef.current = true;
      window.speechSynthesis.speak(utterance);
    }).finally(() => {
      speakingRef.current = false;
    });
  }, [ttsAvailable]);

  const handleInputChange = useCallback((e) => {
    const newWord = e.target.value;
    if (newWord.length > currentWord.length) {
      const newChar = newWord[newWord.length - 1];
      speakText(newChar);
    }
    setCurrentWord(newWord);
    checkWord(newWord);
  }, [checkWord, currentWord, speakText, setCurrentWord]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      checkWord(currentWord);
    }
  }, [currentWord, checkWord]);

  const handleLetterClick = useCallback((letter) => {
    if (speakingRef.current) return;

    speakText(letter);
    setCurrentWord(prev => {
      const newWord = prev + letter;
      checkWord(newWord);
      return newWord;
    });
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [checkWord, speakText, setCurrentWord]);

  const getNextLetter = useCallback(() => {
    return targetWord.thai[currentWord.length] || '';
  }, [targetWord, currentWord]);

  const mergeVowels = (word) => {
    const vowels = ['ะ', 'ั', 'า', 'ำ', 'ิ', 'ี', 'ึ', 'ื', 'ุ', 'ู', 'เ', 'แ', 'โ', 'ใ', 'ไ', '็', '์', '่', '้', '๊', '๋'];
    let merged = [];
    for (let i = 0; i < word.length; i++) {
      if (vowels.includes(word[i]) && i > 0 && !vowels.includes(word[i-1])) {
        merged[merged.length - 1] += word[i];
      } else {
        merged.push(word[i]);
      }
    }
    return merged;
  };


  return (
    <div className={`mt-6 p-4 max-w-md mx-auto rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
      <GameHeader title="Type Thai" darkMode={darkMode} />
      <h2 className="text-2xl font-bold mb-4 text-center">The Thai Alphabet and Keyboard Learning Game</h2>
      <div className={`p-4 rounded-lg mb-4 shadow ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
        <WordDisplay 
          targetWord={targetWord}
          showThaiWord={showThaiWord}
          currentWord={currentWord}
          speakText={speakText}
          IconComponent={targetWord.icon}
        />
        <GameControls 
          showThaiWord={showThaiWord}
          setShowThaiWord={setShowThaiWord}
          toggleHint={toggleHint}
          hintActive={hintActive}
          useThaiKeyboard={useThaiKeyboard}
          toggleKeyboard={toggleKeyboard}
        />
        <ThaiWordInputArea 
          inputRef={inputRef}
          currentWord={currentWord}
          handleInputChange={handleInputChange}
          handleKeyPress={handleKeyPress}
          speakText={speakText}
          darkMode={darkMode}
        />
        {useThaiKeyboard ? (
          <ThaiKeyboard 
            handleLetterClick={handleLetterClick}
            getNextLetter={getNextLetter}
            hintActive={hintActive}
            darkMode={darkMode}
          />
        ) : (
          <ThaiDesktopKeyboard 
            handleLetterClick={handleLetterClick}
            getNextLetter={getNextLetter}
            hintActive={hintActive}
            darkMode={darkMode}
          />
        )}
      </div>
      <Alert className={`mb-4 ${darkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800'}`}>
        <AlertTitle className="text-xl">Score: {score}</AlertTitle>
        <AlertDescription className="text-lg">{message}</AlertDescription>
      </Alert>
      {!ttsAvailable && (
        <Alert variant="destructive" className={`${darkMode ? 'bg-red-900 text-red-100' : 'bg-red-100 text-red-800'}`}>
          <AlertDescription>
            Speech synthesis is not available in your browser. 
            The game will work, but without sound.
          </AlertDescription>
        </Alert>
      )}
      <div className="flex justify-end mt-4">
        <Button onClick={toggleDarkMode} variant="outline" size="icon">
          {darkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
        </Button>
      </div>
      <WinDialog 
        showWinDialog={showWinDialog}
        setShowWinDialog={setShowWinDialog}
        targetWord={targetWord}
        speakText={speakText}
        nextWord={nextWord}
        mergeVowels={mergeVowels}
      />
    </div>
  );
};

export default ThaiWordLearningGame;