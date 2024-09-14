import React, { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import {
  Smile,
  Coffee,
  Sun,
  Apple,
  Home,
  Volume2,
  Lightbulb,
  Moon,
} from "lucide-react";

const thaiKeyboard = [
  [
    { thai: "ๅ", phonetic: "" },
    { thai: "/", phonetic: "" },
    { thai: "-", phonetic: "" },
    { thai: "ภ", phonetic: "ph" },
    { thai: "ถ", phonetic: "th" },
    { thai: "ุ", phonetic: "u" },
    { thai: "ึ", phonetic: "ue" },
    { thai: "ค", phonetic: "kh" },
    { thai: "ต", phonetic: "t" },
    { thai: "จ", phonetic: "ch" },
    { thai: "ข", phonetic: "kh" },
    { thai: "ช", phonetic: "ch" },
  ],
  [
    { thai: "ๆ", phonetic: "" },
    { thai: "ไ", phonetic: "ai" },
    { thai: "ำ", phonetic: "am" },
    { thai: "พ", phonetic: "ph" },
    { thai: "ะ", phonetic: "a" },
    { thai: "ั", phonetic: "a" },
    { thai: "ี", phonetic: "i" },
    { thai: "ร", phonetic: "r" },
    { thai: "น", phonetic: "n" },
    { thai: "ย", phonetic: "y" },
    { thai: "บ", phonetic: "b" },
    { thai: "ล", phonetic: "l" },
  ],
  [
    { thai: "ฟ", phonetic: "f" },
    { thai: "ห", phonetic: "h" },
    { thai: "ก", phonetic: "k" },
    { thai: "ด", phonetic: "d" },
    { thai: "เ", phonetic: "e" },
    { thai: "้", phonetic: "" },
    { thai: "่", phonetic: "" },
    { thai: "า", phonetic: "a" },
    { thai: "ส", phonetic: "s" },
    { thai: "ว", phonetic: "w" },
    { thai: "ง", phonetic: "ng" },
  ],
  [
    { thai: "ผ", phonetic: "ph" },
    { thai: "ป", phonetic: "p" },
    { thai: "แ", phonetic: "ae" },
    { thai: "อ", phonetic: "" },
    { thai: "ิ", phonetic: "i" },
    { thai: "ื", phonetic: "ue" },
    { thai: "ท", phonetic: "th" },
    { thai: "ม", phonetic: "m" },
    { thai: "ใ", phonetic: "ai" },
    { thai: "ฝ", phonetic: "f" },
  ],
  [
    { thai: "", phonetic: "" },
    { thai: "ฐ", phonetic: "th" },
    { thai: "ฆ", phonetic: "kh" },
    { thai: "ฏ", phonetic: "t" },
    { thai: "โ", phonetic: "o" },
    { thai: "ฌ", phonetic: "ch" },
    { thai: "็", phonetic: "" },
    { thai: "๋", phonetic: "" },
    { thai: "ษ", phonetic: "s" },
    { thai: "์", phonetic: "" },
  ],
  [
    { thai: "", phonetic: "" },
    { thai: "ณ", phonetic: "n" },
    { thai: "ฯ", phonetic: "" },
    { thai: "ญ", phonetic: "y" },
    { thai: "ฐ", phonetic: "th" },
    { thai: ",", phonetic: "" },
    { thai: "฿", phonetic: "" },
    { thai: "?", phonetic: "" },
    { thai: "", phonetic: "" },
    { thai: "", phonetic: "" },
  ],
];

const thaiWords = [
  { thai: "สวัสดี", english: "Hello", icon: Smile },
  { thai: "ขอบคุณ", english: "Thank you", icon: Smile },
  { thai: "ใช่", english: "Yes", icon: Smile },
  { thai: "ไม่", english: "No", icon: Smile },
  { thai: "กาแฟ", english: "Coffee", icon: Coffee },
  { thai: "น้ำ", english: "Water", icon: Coffee },
  { thai: "ร้อน", english: "Hot", icon: Sun },
  { thai: "เย็น", english: "Cold", icon: Sun },
  { thai: "อาหาร", english: "Food", icon: Apple },
  { thai: "บ้าน", english: "Home", icon: Home },
];

const ThaiWordLearningGame = () => {
  const [currentWord, setCurrentWord] = useState("");
  const [targetWord, setTargetWord] = useState(thaiWords[0]);
  const [wordIndex, setWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [showThaiWord, setShowThaiWord] = useState(true);
  const [ttsAvailable, setTtsAvailable] = useState(true);
  const [hintUsed, setHintUsed] = useState(false);
  const [hintActive, setHintActive] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const speakingRef = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.speechSynthesis) {
      setTtsAvailable(false);
    }
  }, []);

  const speakText = useCallback(
    (text) => {
      return new Promise((resolve) => {
        if (!ttsAvailable) {
          resolve();
          return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "th-TH";
        utterance.onend = resolve;
        utterance.onerror = () => {
          console.error("Speech synthesis error");
          resolve();
        };

        speakingRef.current = true;
        window.speechSynthesis.speak(utterance);
      }).finally(() => {
        speakingRef.current = false;
      });
    },
    [ttsAvailable]
  );

  const checkWord = useCallback(() => {
    if (currentWord === targetWord.thai) {
      setScore((prev) => prev + (hintUsed ? 0.5 : 1));
      setMessage(
        `Correct! "${currentWord}" means "${targetWord.english}" in English.`
      );
      setTimeout(() => {
        setCurrentWord("");
        setWordIndex((prev) => (prev + 1) % thaiWords.length);
        setMessage("");
        setHintUsed(false);
      }, 2000);
      return true;
    }
    return false;
  }, [currentWord, targetWord, hintUsed]);

  const handleLetterClick = useCallback(
    async (letter) => {
      if (speakingRef.current) return;

      await speakText(letter);

      const nextLetter = targetWord.thai[currentWord.length];
      if (letter === nextLetter) {
        setCurrentWord((prev) => {
          const newWord = prev + letter;
          if (newWord === targetWord.thai) {
            checkWord();
          } else {
            setMessage("Correct! Keep going...");
          }
          return newWord;
        });
      } else {
        setMessage(
          `Incorrect. You typed "${letter}", but the correct letter is "${nextLetter}".`
        );
      }
    },
    [speakText, currentWord, targetWord, checkWord]
  );

  const getNextLetter = useCallback(() => {
    return targetWord.thai[currentWord.length] || "";
  }, [targetWord, currentWord]);

  const toggleHint = useCallback(() => {
    setHintActive((prev) => !prev);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  useEffect(() => {
    setTargetWord(thaiWords[wordIndex]);
  }, [wordIndex]);

  const IconComponent = targetWord.icon;

  return (
    <div
      className={`p-4 max-w-md mx-auto rounded-lg shadow-lg ${
        darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <h1 className="text-3xl font-bold mb-4 text-center">
        Thai Word Learning Game
      </h1>
      <div
        className={`p-4 rounded-lg mb-4 shadow ${
          darkMode ? "bg-gray-700" : "bg-white"
        }`}
      >
        <div className="flex items-center justify-center mb-4">
          <IconComponent size={48} className="mr-4 text-blue-500" />
          <div>
            <p className="text-2xl font-bold">{targetWord.english}</p>
            {showThaiWord && (
              <div className="flex items-center">
                <p className="text-xl mr-2">
                  {targetWord.thai.split("").map((letter, index) => (
                    <span
                      key={index}
                      className={
                        index === currentWord.length
                          ? "bg-yellow-300 text-black"
                          : ""
                      }
                    >
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
            <label htmlFor="show-thai" className="ml-2">
              Show Thai Word
            </label>
          </div>
          <Button
            onClick={toggleHint}
            className={`flex items-center ${
              hintActive ? "bg-green-500" : "bg-yellow-500"
            } hover:opacity-80 text-white`}
          >
            <Lightbulb className="mr-2" size={16} />
            {hintActive ? "Hint On" : "Hint Off"}
          </Button>
        </div>
        <Input
          type="text"
          value={currentWord}
          readOnly
          className={`w-full p-2 text-lg mb-4 border-2 rounded ${
            darkMode
              ? "bg-gray-600 border-gray-500 text-white"
              : "bg-gray-100 border-gray-300 text-black"
          }`}
          placeholder="Type here..."
        />
        <div className="mb-4">
          {thaiKeyboard.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center mb-2">
              {row.map((key, keyIndex) => {
                const isNextLetter = key.thai === getNextLetter();
                return (
                  <Button
                    key={keyIndex}
                    onClick={() => key.thai && handleLetterClick(key.thai)}
                    style={{
                      backgroundColor:
                        hintActive && isNextLetter
                          ? "#22c55e"
                          : darkMode
                          ? "#374151"
                          : "#e5e7eb",
                      color: darkMode ? "white" : "black",
                      fontWeight:
                        hintActive && isNextLetter ? "bold" : "normal",
                      width: "40px",
                      height: "50px",
                      margin: "0 2px",
                      padding: "2px",
                      fontSize: "16px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    className="hover:opacity-80"
                    disabled={!key.thai}
                  >
                    <span>{key.thai}</span>
                    <span style={{ fontSize: "10px", marginTop: "2px" }}>
                      {key.phonetic}
                    </span>
                  </Button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <Alert
        className={`mb-4 ${
          darkMode ? "bg-blue-900 text-blue-100" : "bg-blue-100 text-blue-800"
        }`}
      >
        <AlertTitle className="text-xl">Score: {score}</AlertTitle>
        <AlertDescription className="text-lg">{message}</AlertDescription>
      </Alert>
      {!ttsAvailable && (
        <Alert
          variant="destructive"
          className={`${
            darkMode ? "bg-red-900 text-red-100" : "bg-red-100 text-red-800"
          }`}
        >
          <AlertDescription>
            Speech synthesis is not available in your browser. The game will
            work, but without sound.
          </AlertDescription>
        </Alert>
      )}
      <div className="flex justify-end mt-4">
        <Button onClick={toggleDarkMode} variant="outline" size="icon">
          {darkMode ? (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ThaiWordLearningGame;
