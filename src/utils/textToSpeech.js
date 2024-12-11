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

export const useSpeakThai = () => {
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
