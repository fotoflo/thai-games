import React from "react";
import { Button } from "@/components/ui/button";
import { Volume2 } from 'lucide-react';
import { speakText } from '@/utils/textToSpeech';

const thaiKeyboard = [
  ["ๅ", "/", "-", "ภ", "ถ", "ุ", "ึ", "ค", "ต", "จ", "ข", "ช"],
  ["ๆ", "ไ", "ำ", "พ", "ะ", "ั", "ี", "ร", "น", "ย", "บ", "ล", "ฃ"],
  ["ฟ", "ห", "ก", "ด", "เ", "้", "่", "า", "ส", "ว", "ง"],
  ["ผ", "ป", "แ", "อ", "ิ", "ื", "ท", "ม", "ใ", "ฝ", "ฦ"],
  ["", "ฐ", "ฑ", "ธ", "ณ", "ญ", "ฎ", "ฏ", "ฐ", ",", "."],
  ["๐", "๑", "๒", "๓", "๔", "๕", "๖", "๗", "๘", "๙"],
];

const ThaiKeyboard = ({
  handleLetterClick,
  getNextLetter,
  hintActive,
  darkMode,
}) => (
  <div className="mb-4">
    {thaiKeyboard.map((row, rowIndex) => (
      <div key={rowIndex} className="flex justify-center mb-2">
        {row.map((key, keyIndex) => {
          const isNextLetter = key === getNextLetter();
          return (
            <Button
              key={keyIndex}
              onClick={() => {
                if (key) {
                  handleLetterClick(key);
                  speakText(key);
                }
              }}
              style={{
                backgroundColor:
                  hintActive && isNextLetter
                    ? "#22c55e"
                    : darkMode
                    ? "#374151"
                    : "#e5e7eb",
                color: darkMode ? "white" : "black",
                fontWeight: hintActive && isNextLetter ? "bold" : "normal",
                width: "30px",
                height: "40px",
                margin: "0 2px",
                padding: "0",
                fontSize: "16px",
              }}
              className="hover:opacity-80 relative"
              disabled={!key}
            >
              {key}
              {key && (
                <Volume2 size={12} className="absolute bottom-0 right-0 text-blue-500" />
              )}
            </Button>
          );
        })}
      </div>
    ))}
  </div>
);

export default ThaiKeyboard;
