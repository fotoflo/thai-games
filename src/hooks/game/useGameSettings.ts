import { useCallback, useState, useEffect } from "react";
import { GameSettings, PlayerProfile } from "../../types/lessons";

// Simple UUID generator
const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const DEFAULT_SETTINGS: GameSettings = {
  invertTranslation: false,
  showRomanization: true,
  showExamples: true,
  audio: {
    enabled: true,
    volume: 1.0,
    autoPlay: false,
  },
  profile: {
    id: generateUUID(),
    name: "Guest",
    createdAt: Date.now(),
    lastActive: Date.now(),
  },
};

export interface UseGameSettings {
  settings: GameSettings;
  updateSettings: (updates: Partial<Omit<GameSettings, "profile">>) => void;
  updateProfile: (updates: Partial<PlayerProfile>) => void;
  toggleInvertTranslation: () => void;
  invertTranslation: boolean;
}

export const useGameSettings = (): UseGameSettings => {
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("gameSettings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
      } catch (error) {
        console.error("Failed to parse saved settings:", error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("gameSettings", JSON.stringify(settings));
  }, [settings]);

  const updateSettings = useCallback(
    (updates: Partial<Omit<GameSettings, "profile">>): void => {
      setSettings((prev) => ({
        ...prev,
        ...updates,
      }));
    },
    []
  );

  const updateProfile = useCallback((updates: Partial<PlayerProfile>): void => {
    setSettings((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...updates,
        lastActive: Date.now(),
      },
    }));
  }, []);

  const toggleInvertTranslation = useCallback((): void => {
    setSettings((prev) => ({
      ...prev,
      invertTranslation: !prev.invertTranslation,
    }));
  }, []);

  return {
    settings,
    updateSettings,
    updateProfile,
    toggleInvertTranslation,
    invertTranslation: settings.invertTranslation,
  };
};
