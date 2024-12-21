import { useCallback } from "react";
import { WorkingSetItem, Lesson } from "../types/lessons";
import { lessons } from "../lessons/LessonLoader";
import { useGameSettings } from "./game/useGameSettings";
import { useLessonState } from "./game/useLessonState";
import { useWorkingSet } from "./game/useWorkingSet";

type ProgressionMode = "firstPass" | "spacedRepetition" | "test";

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
    progressionMode: ProgressionMode;
    setProgressionMode: (mode: ProgressionMode) => void;
  };
}

export const useReadThaiGameState = (): UseReadThaiGameState => {
  const gameSettings = useGameSettings();
  const lessonState = useLessonState(lessons);
  const workingSetState = useWorkingSet();

  const addMoreItems = useCallback(
    (count: number = 5) => {
      const newItems = lessonState.getWorkingSetItems(count);
      workingSetState.addItems(newItems);
    },
    [lessonState, workingSetState]
  );

  const rateMastery = useCallback(
    async (rating: number, speakFunction?: Function) => {
      if (!workingSetState.activeVocabItem) return;

      lessonState.updateItemState(workingSetState.activeVocabItem.id, {
        mastery: rating,
        lastStudied: Date.now(),
      });

      if (speakFunction && gameSettings.settings.audio.enabled) {
        await speakFunction();
      }

      workingSetState.nextItem();
      gameSettings.updateProfile({ lastActive: Date.now() });
    },
    [workingSetState, lessonState, gameSettings]
  );

  return {
    ...gameSettings,
    ...workingSetState,
    addMoreItems,
    rateMastery,
    lessons,
    totalLessons: lessons.length,
    lessonState,
  };
};
