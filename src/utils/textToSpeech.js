export const speakText = (text, lang = "th-TH") => {
  if (typeof window === "undefined") return; // Guard for SSR

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = () => {
  if (typeof window === "undefined") return;
  window.speechSynthesis.cancel();
};

export const speakThai = ({ current, setSpeaking, setError, onEnd }) => {
  if (!current) return;

  const utterance = new SpeechSynthesisUtterance(current.text);
  const voices = window.speechSynthesis.getVoices();
  const thaiVoice = voices.find((voice) => voice.lang.includes("th"));

  if (thaiVoice) {
    utterance.voice = thaiVoice;
  }

  utterance.onstart = () => {
    setSpeaking(true);
  };

  utterance.onend = () => {
    setSpeaking(false);
    if (onEnd) onEnd();
  };

  utterance.onerror = (error) => {
    setSpeaking(false);
    setError("Speech synthesis failed");
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
};
