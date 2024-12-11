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
