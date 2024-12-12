import { useState, useEffect } from "react";
import useLocalStorage from "./useLocalStorage";
import testLessonData from "../lessons/0-lesson.json";
import syllablesData from "../lessons/1-lesson.json";
import lesson2Data from "../lessons/2-lesson.json";

export const useReadThaiGameState = () => {
  // Create lessons array based on environment
  const lessons =
    process.env.NODE_ENV === "development"
      ? [testLessonData, syllablesData, lesson2Data]
      : [syllablesData, lesson2Data];

  const [currentLesson, setCurrentLesson] = useLocalStorage(
    "currentLesson",
    process.env.NODE_ENV === "development" ? 0 : 1
  );
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

  // Initialize lesson progress based on environment
  const initialLessonProgress =
    process.env.NODE_ENV === "development"
      ? {
          0: { mode: "progression" },
          1: { mode: "progression" },
          2: { mode: "progression" },
        }
      : {
          1: { mode: "progression" },
          2: { mode: "progression" },
        };

  const [lessonProgress, setLessonProgress] = useLocalStorage(
    "lessonProgress",
    initialLessonProgress
  );

  const totalLessons = lessons.length;

  useEffect(() => {
    // Only initialize if there's no existing working set
    if (workingSet.length === 0) {
      const selectedSyllables = lessons[currentLesson - 1].syllables
        .slice(0, 5)
        .map((syllable) => ({ text: syllable, mastery: 1 }));

      setWorkingSet(selectedSyllables);
      setCurrent(selectedSyllables[0]);
      setLastAddedIndex(4);
      // Initialize lesson progress if it doesn't exist
      if (!lessonProgress[currentLesson]) {
        setLessonProgress((prev) => ({
          ...prev,
          [currentLesson]: { mode: "progression" },
        }));
      }
      setProblemList([]);
      setPossibleProblemList([]);
      setWorkingList([]);
    }
  }, [currentLesson]);

  useEffect(() => {
    console.log({
      gameState: {
        currentLesson,
        workingSetSize: workingSet.length,
        currentSyllable: current?.text,
        lastAddedIndex,
        problemListSize: problemList.length,
        possibleProblemListSize: possibleProblemList.length,
        workingListSize: workingList.length,
        progress: {
          currentIndex: current
            ? lessons[currentLesson - 1].syllables.indexOf(current.text) + 1
            : 0,
          totalSyllables: lessons[currentLesson - 1].syllables.length,
        },
      },
    });
  }, [
    currentLesson,
    workingSet,
    current,
    lastAddedIndex,
    problemList,
    possibleProblemList,
    workingList,
  ]);

  const setProgressionMode = (mode) => {
    if (mode !== lessonProgress[currentLesson]?.mode) {
      // First update the mode
      setLessonProgress((prev) => ({
        ...prev,
        [currentLesson]: { ...prev[currentLesson], mode },
      }));

      if (mode === "random") {
        // Reset working set
        setWorkingSet([]);
        setCurrent(null);

        // Reset used syllables for this lesson
        setUsedSyllables((prev) => ({
          ...prev,
          [currentLesson]: [],
        }));

        // Add initial random syllables WITHOUT checking mode again
        const currentLessonSyllables = lessons[currentLesson - 1].syllables;
        for (let i = 0; i < 5; i++) {
          const randomIndex = getRandomUnusedIndex();
          const newSyllable = currentLessonSyllables[randomIndex];
          const newSyllableObj = { text: newSyllable, mastery: 1 };
          setWorkingSet((prev) => [newSyllableObj, ...prev]);
          if (i === 0) setCurrent(newSyllableObj);
        }
      } else {
        // Reset for progression mode
        setWorkingSet([]);
        setCurrent(null);
        setLastAddedIndex(-1);

        // Initialize with first 5 syllables in order
        const selectedSyllables = lessons[currentLesson - 1].syllables
          .slice(0, 5)
          .map((syllable) => ({ text: syllable, mastery: 1 }));

        setWorkingSet(selectedSyllables);
        setCurrent(selectedSyllables[0]);
        setLastAddedIndex(4);
      }
    }
  };

  const getRandomUnusedIndex = () => {
    const currentLessonSyllables = lessons[currentLesson - 1].syllables;
    const used = usedSyllables[currentLesson] || [];

    // If all syllables have been used, reset the tracking
    if (used.length >= currentLessonSyllables.length) {
      setUsedSyllables((prev) => ({
        ...prev,
        [currentLesson]: [],
      }));
      return Math.floor(Math.random() * currentLessonSyllables.length);
    }

    // Find an unused index
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * currentLessonSyllables.length);
    } while (used.includes(randomIndex));

    // Add to used indices
    setUsedSyllables((prev) => ({
      ...prev,
      [currentLesson]: [...(prev[currentLesson] || []), randomIndex],
    }));

    return randomIndex;
  };

  const addMoreSyllables = (count = 1) => {
    const currentLessonSyllables = lessons[currentLesson - 1].syllables;
    const currentMode = lessonProgress[currentLesson]?.mode || "progression";

    if (currentMode === "random") {
      // Add random unused syllables
      for (let i = 0; i < count; i++) {
        const randomIndex = getRandomUnusedIndex();
        const newSyllable = currentLessonSyllables[randomIndex];
        const newSyllableObj = { text: newSyllable, mastery: 1 };
        setWorkingSet((prev) => [newSyllableObj, ...prev]);
        setCurrent(newSyllableObj);
      }
    } else {
      // Original progression logic
      if (lastAddedIndex + count >= currentLessonSyllables.length - 1) {
        setProgressionMode("random");
      }

      for (let i = 0; i < count; i++) {
        const index = lastAddedIndex + 1 + i;
        if (index < currentLessonSyllables.length) {
          const newSyllable = currentLessonSyllables[index];
          const newSyllableObj = { text: newSyllable, mastery: 1 };
          setWorkingSet((prev) => [newSyllableObj, ...prev]);
          setLastAddedIndex(index);
          setCurrent(newSyllableObj);
        }
      }
    }
  };

  const rateMastery = async (rating, speakFunction, targetIndex = null) => {
    if (!current) return;

    // If targetIndex is provided, we're just switching cards
    if (targetIndex !== null) {
      const targetCard = workingSet[targetIndex];
      if (targetCard) {
        setCurrent(targetCard);
      }
      return;
    }

    // Speak the current syllable before moving on
    if (speakFunction) {
      await new Promise((resolve) => {
        speakFunction({
          current,
          setSpeaking: () => {},
          setError: () => {},
          onEnd: resolve, // Add an onEnd callback to resolve the promise
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

  return {
    currentLesson,
    setCurrentLesson,
    totalLessons: lessons.length,
    workingSet,
    current,
    problemList,
    possibleProblemList,
    workingList,
    rateMastery,
    reportProblem,
    reportPossibleProblem,
    addMoreSyllables,
    getCurrentProgress: () => ({
      currentIndex:
        lessons[currentLesson - 1].syllables.indexOf(current?.text) + 1,
      totalSyllables: lessons[currentLesson - 1].syllables.length,
    }),
    setProgressionMode,
    currentMode: lessonProgress[currentLesson]?.mode || "progression",
  };
};
