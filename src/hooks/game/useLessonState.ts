import { useCallback, useEffect } from "react";
import useLocalStorage from "../useLocalStorage";
import {
  LessonState,
  LessonProgress,
  GameProgress,
  ItemState,
  WorkingSetItem,
} from "../../types/lessons";

type LessonStatesRecord = Record<number, LessonState>;
type ProgressionMode = "firstPass" | "spacedRepetition" | "test";

interface UseLessonState {
  currentLesson: number;
  setCurrentLesson: (newLesson: number) => void;
  lessonStates: LessonStatesRecord;
  updateLessonState: (
    lessonIndex: number,
    updates: Partial<LessonState>
  ) => void;
  getLessonProgress: (lessonIndex: number) => LessonProgress;
  getCurrentProgress: () => GameProgress;
  reportProblem: (type: "problem" | "possible") => void;
  updateItemState: (itemId: string, updates: Partial<ItemState>) => void;
  problemList: string[];
  possibleProblemList: string[];
  workingList: string[];
  progressionMode: ProgressionMode;
  setProgressionMode: (mode: ProgressionMode) => void;
  getWorkingSetItems: (count: number) => WorkingSetItem[];
  handleFirstPassChoice: (
    itemId: string,
    choice: "skip" | "mastered" | "practice"
  ) => void;
}

const createInitialLessonState = (): LessonState => ({
  progressionMode: "firstPass",
  itemStates: {},
  lastAddedIndex: -1,
  problemList: [],
  possibleProblemList: [],
  workingList: [],
});

export const useLessonState = (lessons: Lesson[]): UseLessonState => {
  const initialLesson = lessons.length > 0 ? 0 : -1;
  const [currentLesson, setCurrentLesson] = useLocalStorage(
    "currentLesson",
    initialLesson
  );

  useEffect(() => {
    if (currentLesson >= lessons.length || currentLesson < 0) {
      setCurrentLesson(initialLesson);
    }
  }, [currentLesson, lessons.length]);

  const [lessonStates, setLessonStates] = useLocalStorage<LessonStatesRecord>(
    "lessonStates",
    createInitialLessonStates(lessons)
  );

  const setProgressionMode = useCallback(
    (mode: ProgressionMode) => {
      updateLessonState(currentLesson, { progressionMode: mode });
    },
    [currentLesson]
  );

  const getWorkingSetItems = useCallback(
    (count: number): WorkingSetItem[] => {
      const currentState = lessonStates[currentLesson];
      const mode = currentState?.progressionMode || "firstPass";

      if (mode === "random") {
        const availableItems = lessons[currentLesson].items.filter(
          (item) => currentState?.itemStates[item.id]?.mastery !== 5
        );

        if (availableItems.length === 0) return [];

        return Array(Math.min(count, availableItems.length))
          .fill(null)
          .map(() => {
            const randomIndex = Math.floor(
              Math.random() * availableItems.length
            );
            const randomItem = availableItems[randomIndex];
            return {
              id: randomItem.id,
              mastery: currentState?.itemStates[randomItem.id]?.mastery || 1,
              vocabularyItem: randomItem,
            };
          });
      } else {
        const startIndex = currentState?.lastAddedIndex + 1 || 0;
        const remainingItems = lessons[currentLesson].items.length - startIndex;
        const itemsToAdd = Math.min(count, remainingItems);

        if (itemsToAdd <= 0) {
          setProgressionMode("random");
          return [];
        }

        const newItems = lessons[currentLesson].items
          .slice(startIndex, startIndex + itemsToAdd)
          .map((item) => ({
            id: item.id,
            mastery: currentState?.itemStates[item.id]?.mastery || 1,
            vocabularyItem: item,
          }));

        updateLessonState(currentLesson, {
          lastAddedIndex: startIndex + itemsToAdd - 1,
        });
        return newItems;
      }
    },
    [currentLesson, lessonStates, lessons, setProgressionMode]
  );

  const updateLessonState = useCallback(
    (lessonIndex: number, updates: Partial<LessonState>): void => {
      setLessonStates((prev: LessonStatesRecord) => ({
        ...prev,
        [lessonIndex]: {
          ...prev[lessonIndex],
          ...updates,
        },
      }));
    },
    [setLessonStates]
  );

  const updateItemState = useCallback(
    (itemId: string, updates: Partial<ItemState>): void => {
      setLessonStates((prev: LessonStatesRecord) => ({
        ...prev,
        [currentLesson]: {
          ...prev[currentLesson],
          itemStates: {
            ...prev[currentLesson].itemStates,
            [itemId]: {
              ...prev[currentLesson].itemStates[itemId],
              ...updates,
              lastStudied: Date.now(),
            },
          },
        },
      }));
    },
    [currentLesson, setLessonStates]
  );

  const getLessonProgress = useCallback(
    (lessonIndex: number): LessonProgress => {
      if (lessonIndex < 0 || !lessons[lessonIndex]) {
        return {
          total: 0,
          mastered: 0,
          inProgress: 0,
        };
      }

      const states: Record<string, ItemState> =
        lessonStates[lessonIndex]?.itemStates || {};
      const totalItems: number = lessons[lessonIndex].items.length;
      const masteredItems: number = Object.values(states).filter(
        (state: ItemState) => state.mastery === 5
      ).length;

      return {
        total: totalItems,
        mastered: masteredItems,
        inProgress: Object.keys(states).length - masteredItems,
      };
    },
    [lessonStates, lessons]
  );

  const getCurrentProgress = useCallback(
    (): GameProgress => ({
      currentIndex:
        lessons[currentLesson].items.findIndex(
          (item) => item.id === lessonStates[currentLesson]?.lastAddedIndex
        ) + 1,
      totalItems: lessons[currentLesson].items.length,
    }),
    [currentLesson, lessonStates]
  );

  const reportProblem = useCallback(
    (type: "problem" | "possible" = "problem"): void => {
      const listKey =
        type === "problem" ? "problemList" : "possibleProblemList";
      const currentItem = lessonStates[currentLesson]?.lastAddedIndex;

      if (currentItem === undefined) return;

      setLessonStates((prev: LessonStatesRecord) => ({
        ...prev,
        [currentLesson]: {
          ...prev[currentLesson],
          [listKey]: [...prev[currentLesson][listKey], currentItem],
        },
      }));
    },
    [currentLesson, setLessonStates]
  );

  const handleFirstPassChoice = useCallback(
    (itemId: string, choice: "skip" | "mastered" | "practice") => {
      const timestamp = Date.now();

      setLessonStates((prev) => ({
        ...prev,
        [currentLesson]: {
          ...prev[currentLesson],
          itemStates: {
            ...prev[currentLesson]?.itemStates,
            [itemId]: {
              ...prev[currentLesson]?.itemStates?.[itemId],
              lastStudied: timestamp,
              mastery:
                choice === "mastered" ? 5 : choice === "practice" ? 1 : 0,
              status: choice,
            },
          },
        },
      }));
    },
    [currentLesson, setLessonStates]
  );

  const setCurrentLessonAndInit = useCallback(
    (newLesson: number) => {
      setCurrentLesson(newLesson);
      updateLessonState(newLesson, {
        progressionMode: "firstPass",
        lastAddedIndex: -1,
      });
    },
    [setCurrentLesson, updateLessonState]
  );

  return {
    currentLesson,
    setCurrentLesson: setCurrentLessonAndInit,
    lessonStates,
    updateLessonState,
    getLessonProgress,
    getCurrentProgress,
    reportProblem,
    updateItemState,
    problemList: lessonStates[currentLesson]?.problemList || [],
    possibleProblemList: lessonStates[currentLesson]?.possibleProblemList || [],
    workingList: lessonStates[currentLesson]?.workingList || [],
    progressionMode:
      lessonStates[currentLesson]?.progressionMode || "firstPass",
    setProgressionMode,
    getWorkingSetItems,
    handleFirstPassChoice,
  };
};

const createInitialLessonStates = (lessons: Lesson[]): LessonStatesRecord => {
  return lessons.reduce((acc, _, index) => {
    acc[index] = createInitialLessonState();
    return acc;
  }, {} as LessonStatesRecord);
};
