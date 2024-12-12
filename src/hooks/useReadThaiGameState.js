import { useState, useEffect } from "react";
import syllablesData from "../lessons/1-lesson.json";
import lesson2Data from "../lessons/2-lesson.json";

export const useReadThaiGameState = () => {
  const [currentLesson, setCurrentLesson] = useState(1);
  const [workingSet, setWorkingSet] = useState([]);
  const [current, setCurrent] = useState(null);
  const [lastAddedIndex, setLastAddedIndex] = useState(-1);
  const [problemList, setProblemList] = useState([]);
  const [possibleProblemList, setPossibleProblemList] = useState([]);
  const [workingList, setWorkingList] = useState([]);

  const lessons = [syllablesData, lesson2Data];
  const totalLessons = lessons.length;

  useEffect(() => {
    // Reset game state when lesson changes
    const selectedSyllables = lessons[currentLesson - 1].syllables
      .slice(0, 5)
      .map((syllable) => ({ text: syllable, mastery: 1 }));

    setWorkingSet(selectedSyllables);
    setCurrent(selectedSyllables[0]);
    setLastAddedIndex(4);
    setProblemList([]);
    setPossibleProblemList([]);
    setWorkingList([]);
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

  const addMoreSyllables = () => {
    const nextIndex = lastAddedIndex + 1;
    const currentLessonSyllables = lessons[currentLesson - 1].syllables;

    if (nextIndex < currentLessonSyllables.length) {
      const newSyllable = currentLessonSyllables[nextIndex];
      const newSyllableObj = { text: newSyllable, mastery: 1 };
      setWorkingSet((prev) => [newSyllableObj, ...prev]);
      setLastAddedIndex(nextIndex);
      setCurrent(newSyllableObj);
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
        setLastAddedIndex(-1);
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
