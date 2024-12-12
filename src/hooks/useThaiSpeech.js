import { useState, useEffect } from "react";
import { speakThai } from "../utils/textToSpeech";

export const useThaiSpeech = () => {
  const [hasThai, setHasThai] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const thaiVoice = voices.find((voice) => voice.lang.includes("th"));
      setHasThai(!!thaiVoice);
      setError(thaiVoice ? "" : "No Thai voice found");
    };

    window.speechSynthesis.onvoiceschanged = checkVoices;
    checkVoices();

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = (current) => {
    speakThai({
      current,
      setSpeaking,
      setError,
    });
  };

  return {
    hasThai,
    speaking,
    setSpeaking,
    error,
    setError,
    speak,
  };
};
