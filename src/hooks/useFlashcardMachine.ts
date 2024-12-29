import { useCallback, useState, useEffect } from "react";
import { GameState } from "../types/lessons";

const DEFAULT_GAME_STATE: GameState = {
  lessonData: {},
  currentLesson: null,
  completedLessons: [],
  settings: {
    defaultPracticeSetSize: 4,
    audioEnabled: true,
    interleaving: {
      enabled: false,
      strategy: "balanced",
      minCategorySpacing: 2,
    },
    srsSettings: {
      baseInterval: 24 * 60 * 60 * 1000, // 24 hours in ms
      intervalModifier: 1,
      failureSetback: 0.5,
    },
    offlineMode: {
      enabled: false,
      maxCacheSize: 100,
    },
  },
};

export const useFlashcardMachine = () => {
  const [gameState, setGameState] = useState<GameState>(DEFAULT_GAME_STATE);

  // Load game state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("flashcardGameState");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setGameState(parsed);
      } catch (error) {
        console.error("Failed to parse saved game state:", error);
      }
    }
  }, []);

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("flashcardGameState", JSON.stringify(gameState));
  }, [gameState]);

  const updateGameState = useCallback((updater: (draft: GameState) => void) => {
    setGameState((prev) => {
      const draft = { ...prev };
      updater(draft);
      return draft;
    });
  }, []);

  // Reset game state to default
  const resetGameState = useCallback(() => {
    setGameState(DEFAULT_GAME_STATE);
  }, []);

  return {
    gameState,
    updateGameState,
    resetGameState,
  };
};
