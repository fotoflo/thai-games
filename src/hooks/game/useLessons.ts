import { useCallback, useEffect, useState } from "react";
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
  // Load lessons
  const lessons = loadLessons();

  // Initialize with first valid lesson or 0
  const initialLesson = lessons.length > 0 ? 0 : -1;
  const [currentLesson, setCurrentLesson] = useState(initialLesson);
  const [progressionMode, setProgressionMode] = useState<
    "firstPass" | "spacedRepetition" | "test"
  >("firstPass");

  // Initialize lesson data
  const [lessonData, setLessonData] = useState<GameState["lessonData"]>({});

  // Persist state to localStorage
  useEffect(() => {
    const savedLesson = localStorage.getItem("currentLesson");
    if (savedLesson) {
      setCurrentLesson(parseInt(savedLesson, 10));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("currentLesson", currentLesson.toString());
  }, [currentLesson]);

  useEffect(() => {
    const savedMode = localStorage.getItem("progressionMode");
    if (savedMode) {
      setProgressionMode(
        savedMode as "firstPass" | "spacedRepetition" | "test"
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("progressionMode", progressionMode);
  }, [progressionMode]);

  useEffect(() => {
    const savedData = localStorage.getItem("lessonData");
    if (savedData) {
      setLessonData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("lessonData", JSON.stringify(lessonData));
  }, [lessonData]);

  // Ensure currentLesson is valid
  useEffect(() => {
    if (currentLesson >= lessons.length || currentLesson < 0) {
      setCurrentLesson(initialLesson);
    }
  }, [currentLesson, lessons.length, initialLesson]);

  // Wrap setCurrentLesson to ensure proper initialization
  const setCurrentLessonAndInit = useCallback(
    (newLesson: number) => {
      setCurrentLesson(newLesson);
      setProgressionMode("firstPass"); // Reset progression mode when changing lessons
    },
    [setCurrentLesson, setProgressionMode]
  );

  // Handle first pass choices
  const handleFirstPassChoice = useCallback(
    (itemId: string, choice: RecallCategory) => {
      if (currentLesson < 0 || !lessons[currentLesson]) return;

      const lesson = lessons[currentLesson];
      const item = lesson.items.find((i: LessonItem) => i.id === itemId);
      if (!item) return;

      setLessonData((prev: GameState["lessonData"]) => {
        const newData = { ...prev };
        const lessonId = lesson.id;

        if (!newData[lessonId]) {
          newData[lessonId] = {
            metadata: {
              id: lesson.id,
              name: lesson.title,
              description: "",
              categories: [],
              difficulty: "beginner",
              estimatedTime: 0,
              totalItems: lesson.items.length,
              version: 1,
            },
            items: lesson.items,
          };
        }

        if (newData[lessonId].items) {
          const itemIndex = newData[lessonId].items!.findIndex(
            (i: LessonItem) => i.id === itemId
          );
          if (itemIndex >= 0) {
            newData[lessonId].items![itemIndex] = {
              ...newData[lessonId].items![itemIndex],
              recallCategory: choice,
              practiceHistory: [
                ...newData[lessonId].items![itemIndex].practiceHistory,
                {
                  timestamp: Date.now(),
                  result: choice,
                  timeSpent: 0,
                  recalledSide: 0,
                  confidenceLevel: 1,
                  isCorrect: true,
                  attemptCount: 1,
                  sourceCategory: "unseen",
                },
              ],
            };
          }
        }

        return newData;
      });
    },
    [currentLesson, lessons]
  );

  return {
    currentLesson,
    setCurrentLesson: setCurrentLessonAndInit,
    progressionMode,
    setProgressionMode,
    lessons,
    totalLessons: lessons.length,
    lessonData,
    handleFirstPassChoice,
  };
};
