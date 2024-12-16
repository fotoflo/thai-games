import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";
import {
  Lesson,
  LessonItem,
  WorkingSetItem,
  LessonState,
  GameProgress,
  LessonProgress,
} from "../types/lessons";

// Import lesson data
import numbersLesson from "../lessons/numbers.json";
import syllables1Data from "../lessons/syllables1.json";
import syllables2Data from "../lessons/syllables2.json";
import combos1Data from "../lessons/combos1.json";
import combos2Data from "../lessons/combos2.json";
import words1Data from "../lessons/words1.json";
import verbsData from "../lessons/verbs.json";
import languageLearning2Data from "../lessons/language-learning-2.json";
import food1Data from "../lessons/food1.json";
import food2VegData from "../lessons/food2veg.json";
import atTheRestrauntData from "../lessons/at-the-restraunt.json";
import languageLearningData from "../lessons/language-learning.json";
import lessonForKids1Data from "../lessons/lesson-for-kids1.json";
import greetingsData from "../lessons/greetings.json";
import envirenmentalSignsData from "../lessons/envirenmental-signs.json";
import atTheBarData from "../lessons/at-the-bar.json";
import pronunciationAndSpellingData from "../lessons/pronounciation-and-spelling.json";

interface SpeakFunctionParams {
  current: WorkingSetItem;
  setSpeaking: () => void;
  setError: () => void;
  onEnd: () => void;
}

export const useReadThaiGameState = () => {
  const lessons: Lesson[] = [
    words1Data,
    numbersLesson,
    lessonForKids1Data,
    verbsData,
    syllables1Data,
    combos1Data,
    syllables2Data,
    combos2Data,
    languageLearning2Data,
    food1Data,
    food2VegData,
    atTheRestrauntData,
    languageLearningData,
    greetingsData,
    envirenmentalSignsData,
    pronunciationAndSpellingData,
  ];

  const [currentLesson, setCurrentLesson] = useLocalStorage("currentLesson", 0);
  const [workingSet, setWorkingSet] = useLocalStorage("workingSet", []);
  const [current, setCurrent] = useLocalStorage("current", null);
  const [invertTranslation, setInvertTranslation] = useLocalStorage<boolean>(
    "invertTranslation",
    false
  );

  const toggleInvertTranslation = (): void => {
    setInvertTranslation((prevState) => !prevState);
  };

  const initialLessonStates: Record<number, LessonState> = lessons.reduce(
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
    {} as Record<number, LessonState>
  );

  const [lessonStates, setLessonStates] = useLocalStorage(
    "lessonStates",
    initialLessonStates
  );

  const setCurrentLessonAndReset = (newLesson: number): void => {
    setCurrentLesson(newLesson);
    initializeWorkingSet(newLesson);
  };

  const totalLessons = lessons.length;

  const getItemText = (item: string | LessonItem): string => {
    return typeof item === "string" ? item : item?.text;
  };

  const initializeWorkingSet = (lessonIndex: number): void => {
    if (!lessons[lessonIndex]) {
      console.error(`Lesson ${lessonIndex} is undefined`);
      return;
    }

    const currentState = lessonStates[lessonIndex];
    const mode = currentState?.progressionMode || "progression";

    if (mode === "random") {
      const availableItems = lessons[lessonIndex].items.filter((item) => {
        const itemText = getItemText(item);
        return currentState?.itemStates[itemText]?.mastery !== 5;
      });

      const randomWorkingSet: WorkingSetItem[] = Array(5)
        .fill(null)
        .map(() => {
          const randomIndex = Math.floor(Math.random() * availableItems.length);
          const randomItem = availableItems[randomIndex];
          const itemText = getItemText(randomItem);
          return {
            text: itemText,
            mastery: currentState?.itemStates[itemText]?.mastery || 1,
            details: typeof randomItem === "object" ? randomItem : null,
          };
        });

      setWorkingSet(randomWorkingSet);
      setCurrent(randomWorkingSet[0]);
    } else {
      const startIndex = currentState?.lastAddedIndex + 1 || 0;
      const selectedItems = lessons[lessonIndex].items
        .slice(startIndex, startIndex + 5)
        .map((item) => {
          const itemText = getItemText(item);
          return {
            text: itemText,
            mastery: currentState?.itemStates[itemText]?.mastery || 1,
            details: typeof item === "object" ? item : null,
          };
        });

      setWorkingSet(selectedItems);
      setCurrent(selectedItems[0]);

      setLessonStates((prev) => ({
        ...prev,
        [lessonIndex]: {
          ...prev[lessonIndex],
          lastAddedIndex: startIndex + 4,
        },
      }));
    }
  };

  useEffect(() => {
    if (workingSet.length === 0) {
      initializeWorkingSet(currentLesson);
    }
  }, []);

  const getRandomUnusedIndex = (): number => {
    const currentLessonItems = lessons[currentLesson - 1].items;
    const used = lessonStates[currentLesson - 1]?.itemStates || {};

    if (Object.keys(used).length >= currentLessonItems.length) {
      setLessonStates((prev) => ({
        ...prev,
        [currentLesson - 1]: {
          ...prev[currentLesson - 1],
          itemStates: {},
        },
      }));
      return Math.floor(Math.random() * currentLessonItems.length);
    }

    let randomIndex: number;
    do {
      randomIndex = Math.floor(Math.random() * currentLessonItems.length);
    } while (Object.keys(used).includes(currentLessonItems[randomIndex].text));

    setLessonStates((prev) => ({
      ...prev,
      [currentLesson - 1]: {
        ...prev[currentLesson - 1],
        itemStates: {
          ...prev[currentLesson - 1].itemStates,
          [currentLessonItems[randomIndex].text]: {
            mastery: 1,
            lastStudied: Date.now(),
          },
        },
      },
    }));

    return randomIndex;
  };

  const addMoreSyllables = (count: number = 1): void => {
    const currentLessonItems = lessons[currentLesson].items;
    const mode = lessonStates[currentLesson]?.progressionMode || "progression";

    if (mode === "random") {
      for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(
          Math.random() * currentLessonItems.length
        );
        const newItem = currentLessonItems[randomIndex];
        const newItemObj: WorkingSetItem = {
          text: getItemText(newItem),
          mastery: 1,
          details: typeof newItem === "object" ? newItem : null,
        };
        setWorkingSet((prev) => [newItemObj, ...prev]);
        setCurrent(newItemObj);
      }
    } else {
      const lastIndex = lessonStates[currentLesson]?.lastAddedIndex || -1;
      if (lastIndex + count >= currentLessonItems.length - 1) {
        setLessonStates((prev) => ({
          ...prev,
          [currentLesson]: {
            ...prev[currentLesson],
            progressionMode: "random",
            itemStates: {},
          },
        }));
        return;
      }

      const newItems: WorkingSetItem[] = [];
      for (let i = 0; i < count; i++) {
        const index = lastIndex + 1 + i;
        if (index < currentLessonItems.length) {
          const newItem = currentLessonItems[index];
          const newItemObj: WorkingSetItem = {
            text: getItemText(newItem),
            mastery: 1,
            details: typeof newItem === "object" ? newItem : null,
          };
          newItems.push(newItemObj);
        }
      }

      if (newItems.length > 0) {
        setWorkingSet((prev) => [...newItems, ...prev]);
        setCurrent(newItems[0]);

        setLessonStates((prev) => ({
          ...prev,
          [currentLesson]: {
            ...prev[currentLesson],
            lastAddedIndex: lastIndex + newItems.length,
            itemStates: {
              ...prev[currentLesson].itemStates,
              ...Object.fromEntries(
                newItems.map((item) => [
                  item.text,
                  { mastery: 1, lastStudied: Date.now() },
                ])
              ),
            },
          },
        }));
      }
    }
  };

  const rateMastery = async (
    rating: number,
    speakFunction?: (params: SpeakFunctionParams) => void,
    targetIndex: number | null = null
  ): Promise<void> => {
    if (!current) return;

    if (targetIndex !== null) {
      const targetCard = workingSet[targetIndex];
      if (targetCard) {
        setCurrent(targetCard);
      }
      return;
    }

    if (speakFunction) {
      await new Promise<void>((resolve) => {
        speakFunction({
          current,
          setSpeaking: () => {},
          setError: () => {},
          onEnd: resolve,
        });
      });
    }

    setLessonStates((prev) => ({
      ...prev,
      [currentLesson]: {
        ...prev[currentLesson],
        itemStates: {
          ...prev[currentLesson].itemStates,
          [current.text]: {
            mastery: rating,
            lastStudied: Date.now(),
          },
        },
        workingList: !prev[currentLesson].workingList.includes(current.text)
          ? [...prev[currentLesson].workingList, current.text]
          : prev[currentLesson].workingList,
      },
    }));

    const updated = workingSet.map((s) =>
      s.text === current.text ? { ...s, mastery: rating } : s
    );

    if (rating === 5) {
      const currentIndex = workingSet.indexOf(current);
      updated.splice(currentIndex, 1);

      if (updated.length > 0) {
        setCurrent(updated[0]);
      } else {
        setCurrent(null);
        setWorkingSet([]);
      }
    } else {
      const nextIndex = (workingSet.indexOf(current) + 1) % workingSet.length;
      setCurrent(updated[nextIndex]);
    }

    setWorkingSet(updated);
  };

  const reportProblem = (): void => {
    if (current) {
      setLessonStates((prev) => ({
        ...prev,
        [currentLesson]: {
          ...prev[currentLesson],
          problemList: [...prev[currentLesson].problemList, current.text],
        },
      }));
      nextSyllable();
    }
  };

  const reportPossibleProblem = (): void => {
    if (current) {
      setLessonStates((prev) => ({
        ...prev,
        [currentLesson]: {
          ...prev[currentLesson],
          possibleProblemList: [
            ...prev[currentLesson].possibleProblemList,
            current.text,
          ],
        },
      }));
      nextSyllable();
    }
  };

  const nextSyllable = (): void => {
    const nextIndex = (workingSet.indexOf(current!) + 1) % workingSet.length;
    setCurrent(workingSet[nextIndex]);
  };

  const getCurrentProgress = (): GameProgress => ({
    currentIndex: current
      ? lessons[currentLesson].items.findIndex(
          (item) => getItemText(item) === current.text
        ) + 1
      : 0,
    totalItems: lessons[currentLesson].items.length,
  });

  const setProgressionMode = (
    newMode: LessonState["progressionMode"]
  ): LessonState["progressionMode"] => {
    setLessonStates((prev) => ({
      ...prev,
      [currentLesson]: {
        ...prev[currentLesson],
        progressionMode: newMode,
      },
    }));

    if (newMode === "random") {
      const currentLessonItems = lessons[currentLesson].items;
      const randomWorkingSet = Array(5)
        .fill(null)
        .map(() => {
          const randomIndex = Math.floor(
            Math.random() * currentLessonItems.length
          );
          const randomItem = currentLessonItems[randomIndex];
          return {
            text: getItemText(randomItem),
            mastery: 1,
            details: typeof randomItem === "object" ? randomItem : null,
          };
        });

      setWorkingSet(randomWorkingSet);
      setCurrent(randomWorkingSet[0]);
    } else {
      initializeWorkingSet(currentLesson);
    }

    return newMode;
  };

  const getLessonProgress = (lessonIndex: number): LessonProgress => {
    const states = lessonStates[lessonIndex]?.itemStates || {};
    const totalItems = lessons[lessonIndex].items.length;
    const masteredItems = Object.values(states).filter(
      (state) => state.mastery === 5
    ).length;

    return {
      total: totalItems,
      mastered: masteredItems,
      inProgress: Object.keys(states).length - masteredItems,
    };
  };

  return {
    currentLesson,
    setCurrentLesson: setCurrentLessonAndReset,
    totalLessons,
    workingSet,
    current,
    problemList: lessonStates[currentLesson]?.problemList || [],
    possibleProblemList: lessonStates[currentLesson]?.possibleProblemList || [],
    workingList: lessonStates[currentLesson]?.workingList || [],
    rateMastery,
    reportProblem,
    reportPossibleProblem,
    addMoreSyllables,
    getCurrentProgress,
    setProgressionMode,
    progressionMode: lessonStates[currentLesson]?.progressionMode,
    lessons,
    getLessonProgress,
    invertTranslation,
    toggleInvertTranslation,
  };
};
