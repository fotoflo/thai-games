import { useEffect, useCallback } from "react";
import useLocalStorage from "./useLocalStorage";
import {
  Lesson,
  VocabularyItem,
  WorkingSetItem,
  LessonState,
  GameProgress,
  LessonProgress,
  GameSettings,
  PlayerProfile,
  SpeakFunctionParams,
  ItemState,
} from "../types/lessons";
import { lessons } from "../lessons/LessonLoader";

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

type LessonStatesRecord = Record<number, LessonState>;

export const useReadThaiGameState = () => {
  // Core game state
  const [currentLesson, setCurrentLesson] = useLocalStorage("currentLesson", 0);
  const [workingSet, setWorkingSet] = useLocalStorage("workingSet", []);
  const [selectedItem, setSelectedItem] = useLocalStorage("selectedItem", null);
  const [settings, setSettings] = useLocalStorage(
    "gameSettings",
    DEFAULT_SETTINGS
  );

  // Initialize lesson states
  const initialLessonStates: LessonStatesRecord = lessons.reduce(
    (acc, _, index) => {
      acc[index] = {
        progressionMode: "progression",
        itemStates: {},
        lastAddedIndex: -1,
        problemList: [],
        possibleProblemList: [],
        workingList: [],
      };
      return acc;
    },
    {} as LessonStatesRecord
  );

  const [lessonStates, setLessonStates] = useLocalStorage(
    "lessonStates",
    initialLessonStates
  );

  // Profile management
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

  // Settings management
  const updateSettings = useCallback(
    (updates: Partial<Omit<GameSettings, "profile">>): void => {
      setSettings((prev: GameSettings) => ({
        ...prev,
        ...updates,
      }));
    },
    [setSettings]
  );

  const initializeWorkingSet = useCallback(
    (lessonIndex: number = 0): void => {
      if (!lessons[lessonIndex]) {
        console.error(`Lesson ${lessonIndex} is undefined`);
        return;
      }

      const currentState = lessonStates[lessonIndex];
      const mode = currentState?.progressionMode || "progression";
      const MAX_WORKING_SET_SIZE = 5;

      if (mode === "random") {
        const availableItems = lessons[lessonIndex].items.filter(
          (item) => currentState?.itemStates[item.id]?.mastery !== 5
        );

        if (availableItems.length === 0) {
          console.log("All items mastered in random mode");
          return;
        }

        const randomWorkingSet: WorkingSetItem[] = Array(
          Math.min(MAX_WORKING_SET_SIZE, availableItems.length)
        )
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
              text: randomItem.text,
            };
          });

        setWorkingSet(randomWorkingSet);
        setSelectedItem(randomWorkingSet[0]);
      } else {
        const startIndex = currentState?.lastAddedIndex + 1 || 0;
        const remainingItems = lessons[lessonIndex].items.length - startIndex;
        const itemsToAdd = Math.min(MAX_WORKING_SET_SIZE, remainingItems);

        if (itemsToAdd <= 0) {
          setProgressionMode("random");
          return;
        }

        const selectedItems = lessons[lessonIndex].items
          .slice(startIndex, startIndex + itemsToAdd)
          .map((item) => ({
            id: item.id,
            mastery: currentState?.itemStates[item.id]?.mastery || 1,
            vocabularyItem: item,
          }));

        setWorkingSet(selectedItems);
        setSelectedItem(selectedItems[0]);

        setLessonStates((prev: LessonStatesRecord) => ({
          ...prev,
          [lessonIndex]: {
            ...prev[lessonIndex],
            lastAddedIndex: startIndex + itemsToAdd - 1,
          },
        }));
      }
    },
    [lessonStates, setWorkingSet, setSelectedItem, setLessonStates]
  );

  const setCurrentLessonAndReset = useCallback(
    (newLesson: number): void => {
      if (newLesson < 0 || newLesson >= lessons.length) {
        console.error(`Invalid lesson index: ${newLesson}`);
        return;
      }
      setCurrentLesson(newLesson);
      initializeWorkingSet(newLesson);
      updateProfile({ lastActive: Date.now() });
    },
    [setCurrentLesson, initializeWorkingSet, updateProfile]
  );

  const addMoreItems = useCallback(
    (count: number = 1): void => {
      const currentLessonItems = lessons[currentLesson].items;
      const mode =
        lessonStates[currentLesson]?.progressionMode || "progression";

      if (mode === "random") {
        const availableItems = currentLessonItems.filter(
          (item) =>
            !workingSet.some((w: WorkingSetItem) => w.id === item.id) &&
            lessonStates[currentLesson]?.itemStates[item.id]?.mastery !== 5
        );

        const newItems: WorkingSetItem[] = [];
        for (let i = 0; i < count && availableItems.length > 0; i++) {
          const randomIndex = Math.floor(Math.random() * availableItems.length);
          const newItem = availableItems[randomIndex];
          newItems.push({
            id: newItem.id,
            text: newItem.text,
            mastery: 1,
            vocabularyItem: newItem,
          });
          availableItems.splice(randomIndex, 1);
        }

        if (newItems.length > 0) {
          setWorkingSet((prev: WorkingSetItem[]) => [...newItems, ...prev]);
          setSelectedItem(newItems[0]);
        }
      } else {
        const lastIndex = lessonStates[currentLesson]?.lastAddedIndex || -1;
        const remainingItems = currentLessonItems.length - (lastIndex + 1);
        const itemsToAdd = Math.min(count, remainingItems);

        if (itemsToAdd <= 0) {
          setProgressionMode("random");
          return;
        }

        const newItems: WorkingSetItem[] = [];
        for (let i = 0; i < itemsToAdd; i++) {
          const index = lastIndex + 1 + i;
          const newItem = currentLessonItems[index];
          newItems.push({
            id: newItem.id,
            mastery: 1,
            vocabularyItem: newItem,
            text: newItem.text,
          });
        }

        if (newItems.length > 0) {
          setWorkingSet((prev: WorkingSetItem[]) => [...newItems, ...prev]);
          setSelectedItem(newItems[0]);

          setLessonStates((prev: LessonStatesRecord) => ({
            ...prev,
            [currentLesson]: {
              ...prev[currentLesson],
              lastAddedIndex: lastIndex + itemsToAdd,
              itemStates: {
                ...prev[currentLesson].itemStates,
                ...Object.fromEntries(
                  newItems.map((item) => [
                    item.id,
                    { mastery: 1, lastStudied: Date.now() },
                  ])
                ),
              },
            },
          }));
        }
      }
    },
    [
      currentLesson,
      lessonStates,
      workingSet,
      setWorkingSet,
      setSelectedItem,
      setLessonStates,
    ]
  );

  const setProgressionMode = useCallback(
    (newMode: LessonState["progressionMode"]): void => {
      setLessonStates((prev: LessonStatesRecord) => ({
        ...prev,
        [currentLesson]: {
          ...prev[currentLesson],
          progressionMode: newMode,
        },
      }));

      initializeWorkingSet(currentLesson);
      updateProfile({ lastActive: Date.now() });
    },
    [currentLesson, setLessonStates, initializeWorkingSet, updateProfile]
  );

  const nextItem = useCallback((): void => {
    if (!selectedItem || workingSet.length === 0) return;

    const nextIndex =
      (workingSet.indexOf(selectedItem) + 1) % workingSet.length;
    setSelectedItem(workingSet[nextIndex]);
  }, [selectedItem, workingSet, setSelectedItem]);

  const rateMastery = useCallback(
    async (
      rating: number,
      speakFunction?: (params: SpeakFunctionParams) => void
    ): Promise<void> => {
      if (!selectedItem) return;

      if (speakFunction && settings.audio.enabled) {
        try {
          await new Promise<void>((resolve, reject) => {
            speakFunction({
              item: selectedItem,
              setSpeaking: () => {},
              setError: () => reject(new Error("Speech failed")),
              onEnd: resolve,
            });
          });
        } catch (error) {
          console.error("Speech error:", error);
        }
      }

      setLessonStates((prev: LessonStatesRecord) => ({
        ...prev,
        [currentLesson]: {
          ...prev[currentLesson],
          itemStates: {
            ...prev[currentLesson].itemStates,
            [selectedItem.id]: {
              mastery: rating,
              lastStudied: Date.now(),
            },
          },
          workingList: !prev[currentLesson].workingList.includes(
            selectedItem.id
          )
            ? [...prev[currentLesson].workingList, selectedItem.id]
            : prev[currentLesson].workingList,
        },
      }));

      const updated = workingSet.map((item: WorkingSetItem) =>
        item.id === selectedItem.id ? { ...item, mastery: rating } : item
      );

      if (rating === 5) {
        const currentIndex = workingSet.indexOf(selectedItem);
        updated.splice(currentIndex, 1);

        if (updated.length > 0) {
          setSelectedItem(updated[0]);
        } else {
          setSelectedItem(null);
          setWorkingSet([]);
          addMoreItems(5);
        }
      } else {
        const nextIndex =
          (workingSet.indexOf(selectedItem) + 1) % workingSet.length;
        setSelectedItem(updated[nextIndex]);
      }

      setWorkingSet(updated);
      updateProfile({ lastActive: Date.now() });
    },
    [
      selectedItem,
      currentLesson,
      workingSet,
      settings.audio.enabled,
      setLessonStates,
      setWorkingSet,
      setSelectedItem,
      addMoreItems,
      updateProfile,
    ]
  );

  const reportProblem = useCallback(
    (type: "problem" | "possible" = "problem"): void => {
      if (!selectedItem) return;

      setLessonStates((prev: LessonStatesRecord) => ({
        ...prev,
        [currentLesson]: {
          ...prev[currentLesson],
          [type === "problem" ? "problemList" : "possibleProblemList"]: [
            ...prev[currentLesson][
              type === "problem" ? "problemList" : "possibleProblemList"
            ],
            selectedItem.id,
          ],
        },
      }));

      nextItem();
      updateProfile({ lastActive: Date.now() });
    },
    [selectedItem, currentLesson, setLessonStates, nextItem, updateProfile]
  );

  const getCurrentProgress = useCallback(
    (): GameProgress => ({
      currentIndex: selectedItem
        ? lessons[currentLesson].items.findIndex(
            (item) => item.id === selectedItem.id
          ) + 1
        : 0,
      totalItems: lessons[currentLesson].items.length,
    }),
    [currentLesson, selectedItem]
  );

  const getLessonProgress = useCallback(
    (lessonIndex: number): LessonProgress => {
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

  useEffect(() => {
    if (workingSet.length === 0) {
      initializeWorkingSet(currentLesson);
    }
  }, [workingSet.length, currentLesson, initializeWorkingSet]);

  // Toggle invertTranslation setting
  const toggleInvertTranslation = useCallback((): void => {
    setSettings((prev: GameSettings) => ({
      ...prev,
      invertTranslation: !prev.invertTranslation,
    }));
  }, [setSettings]);

  return {
    currentLesson,
    setCurrentLesson: setCurrentLessonAndReset,
    workingSet,
    selectedItem, // renamed from current
    totalLessons: lessons.length,
    rateMastery,
    reportProblem: () => reportProblem("problem"),
    reportPossibleProblem: () => reportProblem("possible"),
    addMoreItems,
    nextItem,
    getCurrentProgress,
    getLessonProgress,
    settings,
    updateSettings,
    updateProfile,
    setProgressionMode,
    progressionMode: lessonStates[currentLesson]?.progressionMode,
    lessons,
    problemList: lessonStates[currentLesson]?.problemList || [],
    possibleProblemList: lessonStates[currentLesson]?.possibleProblemList || [],
    workingList: lessonStates[currentLesson]?.workingList || [],
    toggleInvertTranslation,
    invertTranslation: settings.invertTranslation,
  };
};
