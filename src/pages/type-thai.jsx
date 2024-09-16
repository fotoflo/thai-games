import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Smile, Coffee, Sun, Apple, Home, Volume2, Lightbulb, Moon} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import ThaiKeyboard from '@/components/ThaiKeyboard';

const thaiWords = [
  { thai: 'สวัสดี', english: 'Hello', icon: Smile },
  { thai: 'ขอบคุณ', english: 'Thank you', icon: Smile },
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
  const [currentWord, setCurrentWord] = useState('');
  const [targetWord, setTargetWord] = useState(thaiWords[0]);
  const [wordIndex, setWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [showThaiWord, setShowThaiWord] = useState(true);
  const [ttsAvailable, setTtsAvailable] = useState(true);
  const [hintUsed, setHintUsed] = useState(false);
  const [hintActive, setHintActive] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showWinDialog, setShowWinDialog] = useState(false);
  const speakingRef = useRef(false);
  const inputRef = useRef(null);

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

  const checkWord = useCallback((word) => {
    if (word === targetWord.thai) {
      setScore(prev => prev + (hintUsed ? 0.5 : 1));
      setMessage(`Correct! &quot;${word}&quot; means &quot;${targetWord.english}&quot; in English.`);
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

  const handleInputChange = useCallback((e) => {
    const newWord = e.target.value;
    if (newWord.length > currentWord.length) {
      const newChar = newWord[newWord.length - 1];
      speakText(newChar);
    }
    setCurrentWord(newWord);
    checkWord(newWord);
  }, [checkWord, currentWord, speakText]);

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
  }, [checkWord, speakText]);

  const getNextLetter = useCallback(() => {
    return targetWord.thai[currentWord.length] || '';
  }, [targetWord, currentWord]);

  const toggleHint = useCallback(() => {
    setHintActive(prev => !prev);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  const nextWord = useCallback(() => {
    setCurrentWord('');
    setWordIndex(prev => (prev + 1) % thaiWords.length);
    setMessage('');
    setHintUsed(false);
    setShowWinDialog(false);
  }, []);

  useEffect(() => {
    setTargetWord(thaiWords[wordIndex]);
    speakText(thaiWords[wordIndex].thai);
  }, [wordIndex, speakText]);

  const IconComponent = targetWord.icon;

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
      <h1 className="text-3xl font-bold mb-4 text-center">Type Thai</h1>
      <h2 className="text-2xl font-bold mb-4 text-center">The Thai Alphabet and Keyboard Learning Game</h2>
      <div className={`p-4 rounded-lg mb-4 shadow ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
        <div className="flex items-center justify-center mb-4">
          <IconComponent size={48} className="mr-4 text-blue-500" />
          <div>
            <p className="text-2xl font-bold">{targetWord.english}</p>
            {showThaiWord && (
              <div className="flex items-center">
                <p className="text-xl mr-2">
                  {targetWord.thai.split('').map((letter, index) => (
                    <span key={index} className={index === currentWord.length ? "bg-yellow-300 text-black" : ""}>
                      {letter}
                    </span>
                  ))}
                </p>
                <Button 
                  onClick={() => speakText(targetWord.thai)} 
                  variant="ghost" 
                  size="sm"
                  className="p-1"
                >
                  <Volume2 size={20} className="text-blue-500" />
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Switch
              id="show-thai"
              checked={showThaiWord}
              onCheckedChange={setShowThaiWord}
            />
            <label htmlFor="show-thai" className="ml-2">Show Thai Word</label>
          </div>
          <Button onClick={toggleHint} className={`flex items-center ${hintActive ? 'bg-green-500' : 'bg-yellow-500'} hover:opacity-80 text-white`}>
            <Lightbulb className="mr-2" size={16} />
            {hintActive ? 'Hint On' : 'Hint Off'}
          </Button>
        </div>
        <div className="flex mb-4">
          <Input 
            ref={inputRef}
            type="text" 
            value={currentWord} 
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className={`flex-grow p-2 text-lg border-2 rounded-l ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-gray-100 border-gray-300 text-black'}`}
            placeholder="Type here..."
          />
          <Button 
            onClick={() => speakText(currentWord)} 
            className="rounded-r"
          >
            <Volume2 size={20} />
          </Button>
        </div>
        <ThaiKeyboard 
  handleLetterClick={handleLetterClick}
  getNextLetter={getNextLetter}
  hintActive={hintActive}
  darkMode={darkMode}
/>
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
      <AlertDialog open={showWinDialog} onOpenChange={setShowWinDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Correct!</AlertDialogTitle>
            <AlertDialogDescription>
              <p className="text-2xl mb-4">{targetWord.thai}</p>
              <p className="mb-4">&quot;{targetWord.english}&quot; in English</p>
              <div className="flex justify-between mb-4">
                <Button onClick={() => speakText(targetWord.thai)}>
                  Play Full Word
                </Button>
                <Button onClick={() => nextWord()}>
                  Next Word
                </Button>
              </div>
              <div className="flex flex-wrap justify-center">
                {mergeVowels(targetWord.thai).map((char, index) => (
                  <Button 
                    key={index} 
                    onClick={() => speakText(char)} 
                    className="m-1"
                  >
                    {char}
                  </Button>
                ))}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={nextWord}>Next Word</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ThaiWordLearningGame;