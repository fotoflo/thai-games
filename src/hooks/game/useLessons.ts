import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { lessonApi } from "@/api/lessonApi";
import { LessonWithRelations } from "@/services/lessonService";

interface UseLessons {
  currentLesson: number;
  setCurrentLesson: (newLesson: number) => void;
  progressionMode: "firstPass" | "spacedRepetition" | "test";
  setProgressionMode: (mode: "firstPass" | "spacedRepetition" | "test") => void;
  lessons: LessonWithRelations[]; // from the api
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
    data: lessons = [] as LessonWithRelations[],
    isLoading: lessonsLoading,
    error: lessonsError,
  } = useQuery({
    queryKey: ["lessons"],
    queryFn: lessonApi.loadLessons,
  });

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
