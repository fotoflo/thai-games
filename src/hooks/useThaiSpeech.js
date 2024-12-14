// src/hooks/useThaiSpeech.js
import { useState, useEffect, useCallback } from "react";

const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY = 100;
const MAX_RETRY_DELAY = 2000;

let globalThaiVoice = null;
let globalSpeaking = false;
let globalError = "";
let globalHasThai = false;
let globalFirstSpeechEvent = false; // Added this line
let subscribers = new Set();

const notifySubscribers = () => {
  subscribers.forEach((subscriber) => subscriber());
};

const ThaiSpeechController = {
  checkSpeechHealth: () => {
    try {
      if (!window.speechSynthesis) {
        return false;
      }
      const voices = window.speechSynthesis.getVoices();
      if (window.speechSynthesis.speaking && !globalSpeaking) {
        return false;
      }
      if (globalThaiVoice && voices.length === 0) {
        return false;
      }
      return true;
    } catch (err) {
      console.error("Speech health check failed:", err);
      return false;
    }
  },

  reset: () => {
    try {
      window.speechSynthesis.cancel();
      globalThaiVoice = null;
      globalSpeaking = false;
      globalError = "";
      globalHasThai = false;
      notifySubscribers();
      ThaiSpeechController.findThaiVoice();
    } catch (err) {
      console.error("Reset error:", err);
    }
  },

  findThaiVoice: () => {
    return new Promise((resolve) => {
      const voices = window.speechSynthesis.getVoices();
      const thaiVoice = voices.find((voice) => voice.lang.includes("th"));

      if (thaiVoice) {
        globalThaiVoice = thaiVoice;
        globalHasThai = true;
        globalError = "";
        notifySubscribers();
        resolve(thaiVoice);
      } else if (voices.length > 0) {
        const fallbackVoice = voices[0];
        globalThaiVoice = fallbackVoice;
        globalHasThai = true;
        notifySubscribers();
        resolve(fallbackVoice);
      } else {
        window.speechSynthesis.addEventListener(
          "voiceschanged",
          () => {
            const newVoices = window.speechSynthesis.getVoices();
            const newThaiVoice =
              newVoices.find((voice) => voice.lang.includes("th")) ||
              newVoices[0];
            if (newThaiVoice) {
              globalThaiVoice = newThaiVoice;
              globalHasThai = true;
              notifySubscribers();
              resolve(newThaiVoice);
            }
          },
          { once: true }
        );
      }
    });
  },

  speak: async (text) => {
    if (!text || globalSpeaking) return;

    try {
      const thaiVoice =
        globalThaiVoice || (await ThaiSpeechController.findThaiVoice());

      window.speechSynthesis.cancel();

      return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "th-TH";
        utterance.voice = thaiVoice;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        globalSpeaking = true;
        globalError = "";
        globalFirstSpeechEvent = true; // Set to true after the first speech event
        notifySubscribers();

        utterance.onend = () => {
          globalSpeaking = false;
          notifySubscribers();
          resolve();
        };

        utterance.onerror = (event) => {
          console.error("Speech error:", event);
          if (event.error === "not-allowed") {
            window.speechSynthesis.cancel();
            globalSpeaking = false;
            ThaiSpeechController.reset();
          } else {
            globalSpeaking = false;
            globalError = `Speech synthesis failed: ${event.error}`;
          }
          notifySubscribers();
          resolve();
        };

        window.speechSynthesis.speak(utterance);
      });
    } catch (err) {
      console.error("Speech error:", err);
      globalSpeaking = false;
      globalError = err.message;
      notifySubscribers();
    }
  },

  initialize: () => {
    if (!ThaiSpeechController.checkSpeechHealth()) {
      ThaiSpeechController.reset();
    } else {
      ThaiSpeechController.findThaiVoice();
    }
  },
};

if (typeof window !== "undefined") {
  ThaiSpeechController.initialize();
}

export const useThaiSpeech = (
  speakOnMount = false,
  speakOnUnmount = false,
  text = ""
) => {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const subscriber = () => {
      forceUpdate({});
    };
    subscribers.add(subscriber);
    return () => {
      subscribers.delete(subscriber);
      if (speakOnUnmount && text) {
        ThaiSpeechController.speak(text);
      }
    };
  }, [speakOnUnmount, text]);

  useEffect(() => {
    if (speakOnMount && text && globalFirstSpeechEvent) {
      // Check if first speech event has occurred
      ThaiSpeechController.speak(text);
    }
  }, [speakOnMount, text]);

  const handleSpeak = useCallback((textToSpeak) => {
    if (textToSpeak && !globalSpeaking) {
      ThaiSpeechController.speak(textToSpeak);
    }
  }, []);

  return {
    hasThai: globalHasThai,
    speaking: globalSpeaking,
    error: globalError,
    speak: ThaiSpeechController.speak,
    handleSpeak,
    canSpeak: globalFirstSpeechEvent, // Expose the ref state if needed
  };
};
