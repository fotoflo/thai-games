import React, { useEffect } from 'react';
import { Button } from './ui/button';

const ThaiDesktopKeyboard = ({ handleLetterClick, getNextLetter, hintActive, darkMode }) => {
  // This maps QWERTY keys to their Thai equivalents - verified from screenshot
  const thaiKeyMap = {
    // Numbers row
    '1': 'ๅ', '2': '/', '3': '-', '4': 'ภ', '5': 'ถ', '6': 'ุ', '7': 'ึ', '8': 'ค', '9': 'ต', '0': 'จ', '-': 'ข', '=': 'ช',
    // Top row
    'q': 'ๆ', 'w': 'ไ', 'e': 'ำ', 'r': 'พ', 't': 'ะ', 'y': 'ั', 'u': 'ี', 'i': 'ร', 'o': 'น', 'p': 'ย', '[': 'บ', ']': 'ล',
    // Home row
    'a': 'ฟ', 's': 'ห', 'd': 'ก', 'f': 'ด', 'g': 'เ', 'h': '้', 'j': '่', 'k': 'า', 'l': 'ส', ';': 'ว', "'": 'ง',
    // Bottom row
    'z': 'ผ', 'x': 'ป', 'c': 'แ', 'v': 'อ', 'b': 'ิ', 'n': 'ื', 'm': 'ท', ',': 'ม', '.': 'ใ', '/': 'ฝ'
  };

  const keyboardLayout = [
    // Numbers row - full width
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
    // Letter rows with proper staggering
    ['', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
    ['', '', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
    ['', '', '', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
  ];

  const nextLetter = getNextLetter();

  // Add keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (thaiKeyMap[key]) {
        e.preventDefault();
        handleLetterClick(thaiKeyMap[key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleLetterClick]);

  return (
    <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
      {keyboardLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1 mb-1">
          {row.map((qwertyKey, keyIndex) => {
            if (qwertyKey === '') {
              return <div key={keyIndex} className="w-5" />; // Spacer for staggering
            }
            
            const thaiChar = thaiKeyMap[qwertyKey];
            const isNextLetter = hintActive && thaiChar === nextLetter;
            
            return (
              <Button
                key={keyIndex}
                onClick={() => handleLetterClick(thaiChar)}
                variant="outline"
                style={{
                  backgroundColor: isNextLetter 
                    ? "#22c55e" 
                    : darkMode ? "#374151" : "#ffffff",
                  color: darkMode ? "white" : "black",
                  width: "40px",
                  height: "40px",
                  margin: "0 2px",
                  padding: "0",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                className="hover:opacity-80"
              >
                <span style={{ fontSize: "10px", opacity: 0.5 }}>{qwertyKey}</span>
                <span style={{ fontSize: "16px" }}>{thaiChar}</span>
              </Button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default ThaiDesktopKeyboard;