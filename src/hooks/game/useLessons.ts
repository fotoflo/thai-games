import { useCallback, useEffect } from "react";
import useLocalStorage from "../useLocalStorage";
import { Lesson } from "../../types/lessons";
import { loadLessons } from "../../lessons/LessonLoader";

interface UseLessons {
  currentLesson: number;
  setCurrentLesson: (newLesson: number) => void;
  progressionMode: "firstPass" | "spacedRepetition" | "test";
  setProgressionMode: (mode: "firstPass" | "spacedRepetition" | "test") => void;
  lessons: Lesson[];
  totalLessons: number;
}

export const useLessons = (): UseLessons => {
  // Load lessons
  const lessons = loadLessons();

  // Initialize with first valid lesson or 0
  const initialLesson = lessons.length > 0 ? 0 : -1;
  const [currentLesson, setCurrentLesson] = useLocalStorage(
    "currentLesson",
    initialLesson
  );
  const [progressionMode, setProgressionMode] = useLocalStorage(
    "progressionMode",
    "firstPass" as const
  );

  // Ensure currentLesson is valid
  useEffect(() => {
    if (currentLesson >= lessons.length || currentLesson < 0) {
      setCurrentLesson(initialLesson);
    }
  }, [currentLesson, lessons.length, initialLesson, setCurrentLesson]);

  // Wrap setCurrentLesson to ensure proper initialization
  const setCurrentLessonAndInit = useCallback(
    (newLesson: number) => {
      setCurrentLesson(newLesson);
      setProgressionMode("firstPass"); // Reset progression mode when changing lessons
    },
    [setCurrentLesson, setProgressionMode]
  );

  return {
    currentLesson,
    setCurrentLesson: setCurrentLessonAndInit,
    progressionMode,
    setProgressionMode,
    lessons,
    totalLessons: lessons.length,
  };
};
