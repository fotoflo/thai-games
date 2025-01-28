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

export const speakThai = ({
  text,
  current,
  setSpeaking = () => {},
  setError = () => {},
  onEnd = () => {},
}) => {
  if (current?.text) {
    text = current?.text;
  }
  if (!text) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "th-TH";

  // Function to set voice and speak
  const startSpeaking = (retryCount = 0) => {
    const voices = window.speechSynthesis.getVoices();
    const thaiVoice = voices.find((voice) => voice.lang.includes("th"));

    if (thaiVoice) {
      utterance.voice = thaiVoice;
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else if (retryCount < 5) {
      // Try up to 5 times
      setTimeout(() => startSpeaking(retryCount + 1), 500); // Wait 500ms between attempts
    }
  };

  utterance.onstart = () => {
    setSpeaking(true);
  };

  utterance.onend = () => {
    setSpeaking(false);
    onEnd();
  };

  utterance.onerror = () => {
    setSpeaking(false);
    setError("Speech synthesis failed");
    onEnd();
  };

  startSpeaking();
};
