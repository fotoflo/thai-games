import { useEffect, useState } from "react";
import useLocalStorage from "./useLocalStorage";
import testLessonData from "../lessons/0-lesson.json";
import syllablesData from "../lessons/1-lesson.json";
import lesson2Data from "../lessons/2-lesson.json";
import firstWordsData from "../lessons/3-lesson.json";

export const useReadThaiGameState = () => {
  const lessons = [testLessonData, syllablesData, lesson2Data, firstWordsData];

  const [currentLesson, setCurrentLesson] = useLocalStorage("currentLesson", 0);
  const [workingSet, setWorkingSet] = useLocalStorage("workingSet", []);
  const [current, setCurrent] = useLocalStorage("current", null);
  const [lastAddedIndex, setLastAddedIndex] = useLocalStorage(
    "lastAddedIndex",
    -1
  );
  const [problemList, setProblemList] = useLocalStorage("problemList", []);
  const [possibleProblemList, setPossibleProblemList] = useLocalStorage(
    "possibleProblemList",
    []
  );
  const [workingList, setWorkingList] = useLocalStorage("workingList", []);
  const [usedSyllables, setUsedSyllables] = useLocalStorage("usedSyllables", {
    1: [], // Array of indices that have been used in lesson 1
    2: [], // Array of indices that have been used in lesson 2
  });

  const initialLessonProgress = {
    0: { progressionMode: "progression" },
    1: { progressionMode: "progression" },
    2: { progressionMode: "progression" },
  };

  const [lessonProgress, setLessonProgress] = useLocalStorage(
    "lessonProgress",
    initialLessonProgress
  );

  const totalLessons = lessons.length;

  const getItemText = (item) => {
    return typeof item === "string" ? item : item.text;
  };

  const initializeWorkingSet = (lessonIndex) => {
    if (lessons[lessonIndex]) {
      const selectedItems = lessons[lessonIndex].items
        .slice(0, 5)
        .map((item) => ({
          text: getItemText(item),
          mastery: 1,
          details: typeof item === "object" ? item : null,
        }));

      setWorkingSet(selectedItems);
      setCurrent(selectedItems[0]);
      setLastAddedIndex(4);

      if (!lessonProgress[lessonIndex]) {
        setLessonProgress((prev) => ({
          ...prev,
          [lessonIndex]: { progressionMode: "progression" },
        }));
      }
      setProblemList([]);
      setPossibleProblemList([]);
      setWorkingList([]);
    } else {
      console.error(`Lesson ${lessonIndex} is undefined`);
    }
  };

  const setCurrentLessonAndReset = (newLesson) => {
    setCurrentLesson(newLesson);
    initializeWorkingSet(newLesson);
  };

  useEffect(() => {
    if (workingSet.length === 0) {
      initializeWorkingSet(currentLesson);
    }
  }, []);

  const getRandomUnusedIndex = () => {
    const currentLessonItems = lessons[currentLesson - 1].items;
    const used = usedSyllables[currentLesson] || [];

    if (used.length >= currentLessonItems.length) {
      setUsedSyllables((prev) => ({
        ...prev,
        [currentLesson]: [],
      }));
      return Math.floor(Math.random() * currentLessonItems.length);
    }

    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * currentLessonItems.length);
    } while (used.includes(randomIndex));

    setUsedSyllables((prev) => ({
      ...prev,
      [currentLesson]: [...(prev[currentLesson] || []), randomIndex],
    }));

    return randomIndex;
  };

  const addMoreSyllables = (count = 1) => {
    const currentLessonItems = lessons[currentLesson].items;
    const mode =
      lessonProgress[currentLesson]?.progressionMode || "progression";

    if (mode === "random") {
      for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(
          Math.random() * currentLessonItems.length
        );
        const newItem = currentLessonItems[randomIndex];
        const newItemObj = {
          text: getItemText(newItem),
          mastery: 1,
          details: typeof newItem === "object" ? newItem : null,
        };
        setWorkingSet((prev) => [newItemObj, ...prev]);
        setCurrent(newItemObj);
      }
    } else {
      if (lastAddedIndex + count >= currentLessonItems.length - 1) {
        setLessonProgress((prev) => ({
          ...prev,
          [currentLesson]: {
            ...prev[currentLesson],
            progressionMode: "random",
          },
        }));
        return;
      }

      for (let i = 0; i < count; i++) {
        const index = lastAddedIndex + 1 + i;
        if (index < currentLessonItems.length) {
          const newItem = currentLessonItems[index];
          const newItemObj = {
            text: getItemText(newItem),
            mastery: 1,
            details: typeof newItem === "object" ? newItem : null,
          };
          setWorkingSet((prev) => [newItemObj, ...prev]);
          setLastAddedIndex(index);
          setCurrent(newItemObj);
        }
      }
    }
  };

  const rateMastery = async (rating, speakFunction, targetIndex = null) => {
    if (!current) return;

    if (targetIndex !== null) {
      const targetCard = workingSet[targetIndex];
      if (targetCard) {
        setCurrent(targetCard);
      }
      return;
    }

    if (speakFunction) {
      await new Promise((resolve) => {
        speakFunction({
          current,
          setSpeaking: () => {},
          setError: () => {},
          onEnd: resolve,
        });
      });
    }

    if (!workingList.includes(current.text)) {
      setWorkingList((prev) => [...prev, current.text]);
    }

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

  const reportProblem = () => {
    if (current && !problemList.includes(current.text)) {
      setProblemList((prev) => [...prev, current.text]);
      nextSyllable();
    }
  };

  const reportPossibleProblem = () => {
    if (current && !possibleProblemList.includes(current.text)) {
      setPossibleProblemList((prev) => [...prev, current.text]);
      nextSyllable();
    }
  };

  const nextSyllable = () => {
    const nextIndex = (workingSet.indexOf(current) + 1) % workingSet.length;
    setCurrent(workingSet[nextIndex]);
  };

  const getCurrentProgress = () => ({
    currentIndex: current
      ? lessons[currentLesson].items.findIndex(
          (item) => getItemText(item) === current.text
        ) + 1
      : 0,
    totalItems: lessons[currentLesson].items.length,
  });

  const setProgressionMode = (newMode) => {
    // Update the mode in lessonProgress for the current lesson
    setLessonProgress((prev) => ({
      ...prev,
      [currentLesson]: { ...prev[currentLesson], progressionMode: newMode },
    }));

    // If switching to random mode, regenerate working set with random items
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
      // If switching back to progression, reinitialize from the beginning
      initializeWorkingSet(currentLesson);
    }

    return newMode;
  };

  return {
    currentLesson,
    setCurrentLesson: setCurrentLessonAndReset,
    totalLessons,
    workingSet,
    current,
    problemList,
    possibleProblemList,
    workingList,
    rateMastery,
    reportProblem,
    reportPossibleProblem,
    addMoreSyllables,
    getCurrentProgress,
    setProgressionMode,
    progressionMode: lessonProgress[currentLesson]?.progressionMode,
    lessons,
  };
};
