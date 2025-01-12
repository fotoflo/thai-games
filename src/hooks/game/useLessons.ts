import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Lesson, GameState } from "@/types/lessons";
import { lessonApi } from "@/api/lessonApi";

interface UseLessons {
  currentLesson: number;
  setCurrentLesson: (newLesson: number) => void;
  progressionMode: "firstPass" | "spacedRepetition" | "test";
  setProgressionMode: (mode: "firstPass" | "spacedRepetition" | "test") => void;
  lessons: Lesson[]; // from the api
  lessonsLoading: boolean;
  lessonsError: Error | null;
}

export const useLessons = (): UseLessons => {
  const [currentLesson, setCurrentLesson] = useState<number>(-1);
  const [progressionMode, setProgressionMode] = useState<
    "firstPass" | "spacedRepetition" | "test"
  >("firstPass");

  // Load lessons using React Query
  const {
    data: lessons = [] as Lesson[],
    isLoading: lessonsLoading,
    error: lessonsError,
  } = useQuery({
    queryKey: ["lessons"],
    queryFn: lessonApi.loadLessons,
  });

  if (!lessonsLoading) {
    console.log("loaded lesson2222", lessons);
  }

  return {
    currentLesson,
    setCurrentLesson,
    progressionMode,
    setProgressionMode,
    lessons,
    lessonsLoading,
    lessonsError,
  };
};
