// src/hooks/useThaiSpeech.js
import { useState, useEffect, useCallback } from "react";

const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY = 100;
const MAX_RETRY_DELAY = 2000;

let globalThaiVoice = null;
let globalSpeaking = false;
let globalError = "";
let globalHasThai = false;
let subscribers = new Set();

const notifySubscribers = () => {
  subscribers.forEach((subscriber) => subscriber());
};

const ThaiSpeechController = {
  findThaiVoice: () => {
    return new Promise((resolve, reject) => {
      const checkForVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log("Available voices:", voices); // Debug log
        const thaiVoice = voices.find((voice) => voice.lang.includes("th"));

        if (thaiVoice) {
          globalThaiVoice = thaiVoice;
          globalHasThai = true;
          globalError = "";
          notifySubscribers();
          resolve(thaiVoice);
        } else {
          if (voices.length === 0) {
            window.speechSynthesis.addEventListener(
              "voiceschanged",
              checkForVoices,
              { once: true }
            );
          } else {
            // If no Thai voice found, try using any available voice
            const fallbackVoice = voices[0];
            globalThaiVoice = fallbackVoice;
            globalHasThai = true;
            notifySubscribers();
            resolve(fallbackVoice);
          }
        }
      };

      checkForVoices();
    });
  },
  speak: async (text) => {
    if (!text || globalSpeaking) return;

    try {
      console.log("Speaking", text);
      debugger;
      const thaiVoice =
        globalThaiVoice || (await ThaiSpeechController.findThaiVoice());

      // Cancel any ongoing speech
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
        notifySubscribers();

        utterance.onend = () => {
          globalSpeaking = false;
          notifySubscribers();
          resolve();
        };

        utterance.onerror = (event) => {
          console.error("Speech error:", event); // Debug log
          globalSpeaking = false;
          globalError = `Speech synthesis failed: ${event.error}`;
          notifySubscribers();
          resolve();
        };

        window.speechSynthesis.speak(utterance);
      });
    } catch (err) {
      console.error("Speech error:", err); // Debug log
      globalSpeaking = false;
      globalError = err.message;
      notifySubscribers();
    }
  },

  initialize: () => {
    const checkVoicesWithBackoff = async (retryCount = 0) => {
      try {
        await ThaiSpeechController.findThaiVoice();
        console.log("Thai voice found");
      } catch (err) {
        if (retryCount < MAX_RETRIES) {
          const delay = Math.min(
            INITIAL_RETRY_DELAY * Math.pow(2, retryCount),
            MAX_RETRY_DELAY
          );
          setTimeout(() => checkVoicesWithBackoff(retryCount + 1), delay);
        } else {
          globalHasThai = false;
          globalError = `No Thai voice found after ${MAX_RETRIES} attempts`;
          notifySubscribers();
        }
      }
    };

    window.speechSynthesis.onvoiceschanged = () => checkVoicesWithBackoff(0);
    checkVoicesWithBackoff(0);
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
    const subscriber = () => forceUpdate({});
    subscribers.add(subscriber);
    return () => {
      subscribers.delete(subscriber);
      if (speakOnUnmount && text) {
        ThaiSpeechController.speak(text);
      }
    };
  }, [speakOnUnmount, text]);

  useEffect(() => {
    if (speakOnMount && text) {
      ThaiSpeechController.speak(text);
    }
  }, [speakOnMount, text]);

  const handleSpeak = useCallback((textToSpeak) => {
    console.log("handleSpeak");
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
  };
};
