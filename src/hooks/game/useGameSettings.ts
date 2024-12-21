import { useCallback } from "react";
import useLocalStorage from "../useLocalStorage";
import { GameSettings, PlayerProfile } from "../../types/lessons";

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
    id: "",
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
  const [settings, setSettings] = useLocalStorage(
    "gameSettings",
    DEFAULT_SETTINGS
  );

  const updateSettings = useCallback(
    (updates: Partial<Omit<GameSettings, "profile">>): void => {
      setSettings((prev: GameSettings) => ({
        ...prev,
        ...updates,
      }));
    },
    [setSettings]
  );

  const updateProfile = useCallback(
    (updates: Partial<PlayerProfile>): void => {
      setSettings((prev: GameSettings) => ({
        ...prev,
        profile: {
          ...prev.profile,
          ...updates,
          lastActive: Date.now(),
        },
      }));
    },
    [setSettings]
  );

  const toggleInvertTranslation = useCallback((): void => {
    setSettings((prev: GameSettings) => ({
      ...prev,
      invertTranslation: !prev.invertTranslation,
    }));
  }, [setSettings]);

  return {
    settings,
    updateSettings,
    updateProfile,
    toggleInvertTranslation,
    invertTranslation: settings.invertTranslation,
  };
};
