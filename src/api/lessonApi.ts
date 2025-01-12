import { Lesson } from "@/types/lessons";

export interface LessonState {
  currentLesson: number;
  progressionMode: "firstPass" | "spacedRepetition" | "test";
  lessonData: Record<string, never>;
  lessons: Lesson[];
}

export const lessonApi = {
  loadLessons: async (): Promise<Lesson[]> => {
    try {
      const response = await fetch("/api/lessons");
      if (!response.ok) {
        throw new Error("Failed to fetch lessons");
      }
      const data = await response.json();
      return data.lessons;
    } catch (error) {
      console.error("Failed to load lessons:", error);
      return [];
    }
  },

  getInitialState: async (): Promise<LessonState> => {
    const lessons = await lessonApi.loadLessons();
    return {
      currentLesson: -1,
      progressionMode: "firstPass",
      lessonData: {},
      lessons,
    };
  },
};
