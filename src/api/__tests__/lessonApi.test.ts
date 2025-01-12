import "isomorphic-fetch";
import { LessonSchema } from "@/types/lessons";

// Import setup
import "./setup";

describe("lessonApi", () => {
  it("should load lessons from the API", async () => {
    // Re-import the module to get the updated environment variable
    const { lessonApi } = await import("../lessonApi");

    const lessons = await lessonApi.loadLessons();

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

    // Verify the lessons match our schema
    const result = LessonSchema.array().safeParse(lessons);
    expect(result.success).toBe(true);
  });
});
