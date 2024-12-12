import { useState, useEffect } from "react";
import useLocalStorage from "./useLocalStorage";
import syllablesData from "../lessons/1-lesson.json";
import lesson2Data from "../lessons/2-lesson.json";

export const useReadThaiGameState = () => {
  const [currentLesson, setCurrentLesson] = useLocalStorage("currentLesson", 1);
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

  const lessons = [syllablesData, lesson2Data];
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

  const addMoreSyllables = (count = 1) => {
    const nextIndex = lastAddedIndex + count;
    const currentLessonSyllables = lessons[currentLesson - 1].syllables;

    // Check if we've reached the end of available syllables
    if (lastAddedIndex >= currentLessonSyllables.length - 1) {
      // Reset lastAddedIndex to start over
      setLastAddedIndex(-1);
      return; // Exit the function as there are no more syllables to add
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
    getCurrentProgress: () => ({
      currentIndex:
        lessons[currentLesson - 1].syllables.indexOf(current?.text) + 1,
      totalSyllables: lessons[currentLesson - 1].syllables.length,
    }),
  };
};
