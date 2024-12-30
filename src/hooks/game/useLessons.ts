import { useCallback, useEffect, useState, useMemo } from "react";
import {
  Lesson,
  LessonItem,
  GameState,
  RecallCategory,
} from "../../types/lessons";
import { loadLessons } from "../../lessons/LessonLoader";

interface UseLessons {
  currentLesson: number;
  setCurrentLesson: (newLesson: number) => void;
  progressionMode: "firstPass" | "spacedRepetition" | "test";
  setProgressionMode: (mode: "firstPass" | "spacedRepetition" | "test") => void;
  lessons: Lesson[];
  totalLessons: number;
  lessonData: GameState["lessonData"];
  handleFirstPassChoice: (itemId: string, choice: RecallCategory) => void;
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

  // Handle first pass choices
  const handleFirstPassChoice = useCallback(
    (itemId: string, choice: RecallCategory) => {
      setLessonData((prev) => {
        const currentLessonId = currentLesson.toString();
        const lesson = prev[currentLessonId];
        if (!lesson?.items) return prev;

        const item = lesson.items.find((i) => i.id === itemId);
        if (!item) return prev;

        return {
          ...prev,
          [currentLessonId]: {
            ...lesson,
            items: lesson.items.map((i) =>
              i.id === itemId
                ? {
                    ...i,
                    recallCategory: choice,
                    practiceHistory: [
                      ...i.practiceHistory,
                      {
                        timestamp: Date.now(),
                        result: choice,
                        timeSpent: 0,
                        recalledSide: 0,
                        confidenceLevel: 5,
                        isCorrect: choice === "mastered",
                        attemptCount: 1,
                        sourceCategory: "unseen",
                      },
                    ],
                  }
                : i
            ),
          },
        };
      });
    },
    [currentLesson]
  );

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
    totalLessons: lessons.length,
    lessonData,
    handleFirstPassChoice,
  };
};
