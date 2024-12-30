import { useEffect, useState, useMemo } from "react";
import { Lesson, GameState } from "../../types/lessons";
import { loadLessons } from "../../lessons/LessonLoader";

interface UseLessons {
  currentLesson: number;
  setCurrentLesson: (newLesson: number) => void;
  progressionMode: "firstPass" | "spacedRepetition" | "test";
  setProgressionMode: (mode: "firstPass" | "spacedRepetition" | "test") => void;
  lessons: Lesson[];
  lessonData: GameState["lessonData"];
}

export const useLessons = (): UseLessons => {
  const [currentLesson, setCurrentLesson] = useState<number>(-1);
  const [progressionMode, setProgressionMode] = useState<
    "firstPass" | "spacedRepetition" | "test"
  >("firstPass");
  const [lessonData, setLessonData] = useState<GameState["lessonData"]>({});

  // Load lessons from the lesson loader
  const lessons = useMemo(() => {
    try {
      return loadLessons();
    } catch (error) {
      console.error("Failed to load lessons:", error);
      return [];
    }
  }, []);

  // Save lesson data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("lessonData", JSON.stringify(lessonData));
  }, [lessonData]);

  // Load lesson data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("lessonData");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setLessonData(parsed);
        if (parsed.currentLesson !== undefined) {
          setCurrentLesson(parsed.currentLesson);
        }
      } catch (error) {
        console.error("Failed to parse saved lesson data:", error);
      }
    }
  }, []);

  return {
    currentLesson,
    setCurrentLesson,
    progressionMode,
    setProgressionMode,
    lessons,
    lessonData,
  };
};
