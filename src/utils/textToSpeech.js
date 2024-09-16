import { pronunciationMap } from "./pronunciationMap";

export const speakText = (text) => {
  let pronounceableText = text;

  // Check if the exact text exists in the pronunciation map
  if (pronunciationMap[text]) {
    pronounceableText = pronunciationMap[text];
  } else {
    // If not, check each character
    pronounceableText = text
      .split("")
      .map((char) => pronunciationMap[char] || char)
      .join("");
  }

  const utterance = new SpeechSynthesisUtterance(pronounceableText);
  utterance.lang = "th-TH";
  window.speechSynthesis.speak(utterance);
};
