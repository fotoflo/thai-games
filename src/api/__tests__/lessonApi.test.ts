import "isomorphic-fetch";
import { LessonWithRelations } from "@/services/lessonService";

// Import setup
import "../../../jest.setup.js";

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("lessonApi", () => {
  beforeEach(() => {
    // Set environment variable
    process.env.NEXT_PUBLIC_API_BASE_URL = "http://localhost:3000";
    // Clear mock
    mockFetch.mockClear();
  });

  it("should load lessons from the API", async () => {
    // Mock response data
    const mockLessons: LessonWithRelations[] = [
      {
        id: "1",
        name: "Test Lesson 1",
        description: "Test Description 1",
        categories: [{ id: "1", name: "test" }],
        subject: "test",
        difficulty: "BEGINNER",
        estimatedTime: 30,
        totalItems: 0,
        version: 1,
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Setup mock response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ lessons: mockLessons }),
    });

    // Re-import the module to get the updated environment variable
    const { lessonApi } = await import("../lessonApi");

    const lessons = await lessonApi.loadLessons();

    // Verify fetch was called correctly
    expect(mockFetch).toHaveBeenCalledWith("http://localhost:3000/api/lessons");

    // Verify we got an array of lessons
    expect(Array.isArray(lessons)).toBe(true);
    expect(lessons.length).toBeGreaterThan(0);

    // Verify each lesson has required properties
    lessons.forEach((lesson) => {
      expect(lesson).toHaveProperty("id");
      expect(lesson).toHaveProperty("name");
      expect(lesson).toHaveProperty("description");
      expect(lesson).toHaveProperty("categories");
      expect(lesson).toHaveProperty("difficulty");
      expect(lesson).toHaveProperty("items");
    });
  });
});
