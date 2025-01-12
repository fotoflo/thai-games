import { lessonApi } from "../lessonApi";
import { Lesson } from "@/types/lessons";

const mockLessons: Lesson[] = [
  {
    id: "1",
    name: "Test Lesson 1",
    description: "Test Description 1",
    categories: ["test"],
    subject: "test",
    difficulty: "beginner",
    estimatedTime: 30,
    totalItems: 0,
    version: 1,
    items: [],
  },
  {
    id: "2",
    name: "Test Lesson 2",
    description: "Test Description 2",
    categories: ["test"],
    subject: "test",
    difficulty: "beginner",
    estimatedTime: 30,
    totalItems: 0,
    version: 1,
    items: [],
  },
];

// Mock fetch globally
global.fetch = jest.fn();

describe("lessonApi", () => {
  beforeEach(() => {
    // Clear mock before each test
    (global.fetch as jest.Mock).mockClear();
  });

  describe("loadLessons", () => {
    it("should fetch lessons successfully", async () => {
      // Mock successful response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ lessons: mockLessons }),
      });

      const lessons = await lessonApi.loadLessons();
      expect(lessons).toEqual(mockLessons);
      expect(global.fetch).toHaveBeenCalledWith("/api/lessons");
    });

    it("should handle fetch errors", async () => {
      // Mock failed response
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Failed to fetch")
      );

      const lessons = await lessonApi.loadLessons();
      expect(lessons).toEqual([]);
      expect(global.fetch).toHaveBeenCalledWith("/api/lessons");
    });

    it("should handle non-ok response", async () => {
      // Mock non-ok response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      const lessons = await lessonApi.loadLessons();
      expect(lessons).toEqual([]);
      expect(global.fetch).toHaveBeenCalledWith("/api/lessons");
    });
  });

  describe("getInitialState", () => {
    it("should return initial state with lessons", async () => {
      // Mock successful response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ lessons: mockLessons }),
      });

      const state = await lessonApi.getInitialState();
      expect(state).toEqual({
        currentLesson: -1,
        progressionMode: "firstPass",
        lessonData: {},
        lessons: mockLessons,
      });
    });

    it("should handle errors in initial state", async () => {
      // Mock failed response
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Failed to fetch")
      );

      const state = await lessonApi.getInitialState();
      expect(state).toEqual({
        currentLesson: -1,
        progressionMode: "firstPass",
        lessonData: {},
        lessons: [],
      });
    });
  });
});
