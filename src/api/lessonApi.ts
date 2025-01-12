import { Lesson, LessonSchema } from "@/types/lessons";
import { z } from "zod";

export interface LessonState {
  currentLesson: number;
  progressionMode: "firstPass" | "spacedRepetition" | "test";
  lessonData: Record<string, never>;
  lessons: Lesson[];
}

// Default to empty string for browser, can be overridden for testing
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// Ensure URL is absolute
const getApiUrl = (path: string) => {
  if (API_BASE_URL) {
    // Remove any trailing slash from base URL and leading slash from path
    const base = API_BASE_URL.replace(/\/$/, "");
    const cleanPath = path.replace(/^\//, "");
    return `${base}/${cleanPath}`;
  }
  // In browser, use relative path
  return path;
};

export const lessonApi = {
  loadLessons: async (): Promise<Lesson[]> => {
    try {
      const response = await fetch(getApiUrl("/api/lessons"));
      if (!response.ok) {
        throw new Error("Failed to fetch lessons");
      }
      const data = await response.json();

      // Validate the response data
      const result = z.array(LessonSchema).safeParse(data.lessons);
      if (!result.success) {
        throw new Error("Invalid lesson data");
      }

      return result.data;
    } catch (error) {
      console.error("Failed to load lessons:", error);
      throw error;
    }
  },

  getInitialState: async (): Promise<LessonState> => {
    const lessons = await lessonApi.loadLessons();
    return {
      currentLesson: lessons.length > 0 ? 0 : -1, // Set to first lesson if available
      progressionMode: "firstPass",
      lessonData: {},
      lessons,
    };
  },
};
