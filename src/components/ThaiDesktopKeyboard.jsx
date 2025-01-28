import React, { useEffect, useMemo } from 'react';
import { Button } from './ui/button';

const ThaiDesktopKeyboard = ({ handleLetterClick, getNextLetter, hintActive, darkMode }) => {
  // This maps QWERTY keys to their Thai equivalents - verified from screenshot
  const thaiKeyMap = useMemo(() => ({
    // Numbers row
    '1': 'ๅ', '2': '/', '3': '-', '4': 'ภ', '5': 'ถ', '6': 'ุ', '7': 'ึ', '8': 'ค', '9': 'ต', '0': 'จ', '-': 'ข', '=': 'ช',
    // Top row
    'q': 'ๆ', 'w': 'ไ', 'e': 'ำ', 'r': 'พ', 't': 'ะ', 'y': 'ั', 'u': 'ี', 'i': 'ร', 'o': 'น', 'p': 'ย', '[': 'บ', ']': 'ล',
    // Home row
    'a': 'ฟ', 's': 'ห', 'd': 'ก', 'f': 'ด', 'g': 'เ', 'h': '้', 'j': '่', 'k': 'า', 'l': 'ส', ';': 'ว', "'": 'ง',
    // Bottom row
    'z': 'ผ', 'x': 'ป', 'c': 'แ', 'v': 'อ', 'b': 'ิ', 'n': 'ื', 'm': 'ท', ',': 'ม', '.': 'ใ', '/': 'ฝ', ']': 'ณ'
  }), []);

  const keyboardLayout = [
    // Numbers row (12 keys)
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
    // Top row (12 keys)
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
    // Home row (11 keys)
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
    // Bottom row (10 keys)
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
  ];

  const nextLetter = getNextLetter();

  // Add keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't prevent default if modifier keys are pressed
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      
      const key = e.key.toLowerCase();
      if (thaiKeyMap[key]) {
        e.preventDefault();
        handleLetterClick(thaiKeyMap[key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleLetterClick, thaiKeyMap]);

  // Calculate offsets to center each row
  const getRowStyle = (rowIndex) => {
    // Calculate stagger based on viewport width
    const baseStagger = Math.min(window.innerWidth * 0.02, 20); // Max 20px
    const staggerOffset = rowIndex === 1 ? baseStagger : 
                         rowIndex === 2 ? baseStagger * 1.4 : 
                         rowIndex === 3 ? baseStagger * 2.2 : 0;
    
    return {
      marginLeft: `${staggerOffset}px`,
      width: 'fit-content'
    };
  };

  return (
    <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} w-full max-w-[95vw] md:max-w-[600px] mx-auto`}>
      <div className="flex flex-col items-center">
        {keyboardLayout.map((row, rowIndex) => (
          <div 
            key={rowIndex} 
            className="flex gap-[0.15rem] sm:gap-1 mb-[0.15rem] sm:mb-1"
            style={getRowStyle(rowIndex)}
          >
            {row.map((qwertyKey, keyIndex) => (
              <Button
                key={keyIndex}
                onClick={() => handleLetterClick(thaiKeyMap[qwertyKey])}
                variant="outline"
                style={{
                  backgroundColor: hintActive && thaiKeyMap[qwertyKey] === nextLetter
                    ? "#22c55e" 
                    : darkMode ? "#374151" : "#ffffff",
                  color: darkMode ? "white" : "black",
                  width: "clamp(1.5rem, 3vw, 2rem)",
                  height: "clamp(1.5rem, 3vw, 2rem)",
                  margin: "0 1px",
                  padding: "2px 0 0 0",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  position: "relative"
                }}
                className="hover:opacity-80"
              >
                <span style={{ 
                  fontSize: "clamp(0.4rem, 1vw, 0.5rem)",
                  opacity: 0.7,
                  lineHeight: 1
                }}>
                  {qwertyKey}
                </span>
                <span style={{ 
                  fontSize: "clamp(0.5rem, 1.2vw, 0.6rem)",
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-40%)"
                }}>
                  {thaiKeyMap[qwertyKey]}
                </span>
              </Button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThaiDesktopKeyboard;