import { createMocks } from "node-mocks-http";
import handler from "../lessons/index";
import { lessonService } from "@/services/lessonService";
import type { LessonWithRelations } from "@/services/lessonService";

// Mock the lessonService
jest.mock("@/services/lessonService", () => ({
  lessonService: {
    getAllLessons: jest.fn(),
  },
}));

describe("/api/lessons", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 405 for non-GET requests", async () => {
    const { req, res } = createMocks({
      method: "POST",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({
      error: "Method not allowed",
    });
  });

  it("should return lessons successfully", async () => {
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

    (lessonService.getAllLessons as jest.Mock).mockResolvedValueOnce(
      mockLessons
    );

    const { req, res } = createMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      lessons: mockLessons,
    });
    expect(lessonService.getAllLessons).toHaveBeenCalled();
  });

  it("should handle errors from getAllLessons", async () => {
    (lessonService.getAllLessons as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to load lessons")
    );

    const { req, res } = createMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: "Failed to load lessons",
    });
    expect(lessonService.getAllLessons).toHaveBeenCalled();
  });
});
