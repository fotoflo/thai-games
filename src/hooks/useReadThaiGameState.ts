import { useEffect, useCallback } from "react";
import useLocalStorage from "./useLocalStorage";
import { WorkingSetItem, SpeakFunctionParams, Lesson } from "../types/lessons";
import { lessons } from "../lessons/LessonLoader";
import { useGameSettings } from "./game/useGameSettings";
import { useLessonState } from "./game/useLessonState";

interface UseReadThaiGameState {
  // Game Settings
  settings: GameSettings;
  updateSettings: (updates: Partial<GameSettings>) => void;
  updateProfile: (updates: Partial<PlayerProfile>) => void;
  invertTranslation: boolean;
  toggleInvertTranslation: () => void;

  // Active Item
  activeVocabItem: WorkingSetItem | null;
  setActiveVocabItem: (item: WorkingSetItem | null) => void;

  // Working Set
  workingSet: WorkingSetItem[];
  addMoreItems: (count?: number) => void;
  nextItem: () => void;
  rateMastery: (rating: number, speakFunction?: Function) => Promise<void>;

  // Lesson Data
  lessons: Lesson[];
  totalLessons: number;

  // Lesson State
  lessonState: {
    currentLesson: number;
    setCurrentLesson: (lessonIndex: number) => void;
    problemList: string[];
    possibleProblemList: string[];
    workingList: string[];
    reportProblem: (type: "problem" | "possible") => void;
    getCurrentProgress: () => GameProgress;
    progressionMode: "firstPass" | "spacedRepetition" | "random";
    setProgressionMode: (
      mode: "firstPass" | "spacedRepetition" | "random"
    ) => void;
  };
}

export const useReadThaiGameState = (): UseReadThaiGameState => {
  const gameSettings = useGameSettings();
  const lessonState = useLessonState(lessons);

  const nextItem = useCallback(() => {
    if (!lessonState.activeVocabItem || lessonState.workingSet.length === 0)
      return;

    const currentIndex = lessonState.workingSet.findIndex(
      (item) => item.id === lessonState.activeVocabItem.id
    );
    const nextIndex = (currentIndex + 1) % lessonState.workingSet.length;
    lessonState.setActiveVocabItem(lessonState.workingSet[nextIndex]);
  }, [lessonState]);

  const addMoreItems = useCallback(
    (count: number = 5) => {
      lessonState.getWorkingSetItems(count);
    },
    [lessonState]
  );

  const rateMastery = useCallback(
    async (rating: number, speakFunction?: Function) => {
      if (!lessonState.activeVocabItem) return;

      lessonState.updateItemState(lessonState.activeVocabItem.id, {
        mastery: rating,
        lastStudied: Date.now(),
      });

      if (speakFunction && gameSettings.settings.audio.enabled) {
        await speakFunction();
      }

      nextItem();
      gameSettings.updateProfile({ lastActive: Date.now() });
    },
    [lessonState, gameSettings, nextItem]
  );

  return {
    ...gameSettings,
    activeVocabItem: lessonState.activeVocabItem,
    setActiveVocabItem: lessonState.setActiveVocabItem,
    workingSet: lessonState.workingSet,
    addMoreItems,
    nextItem,
    rateMastery,
    lessons,
    totalLessons: lessons.length,
    lessonState,
  };
};
