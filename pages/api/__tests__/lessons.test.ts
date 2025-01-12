import { createMocks } from "node-mocks-http";
import handler from "../lessons/index";
import { loadLessons } from "../../../src/lessons/LessonLoader";

// Mock the LessonLoader
jest.mock("../../../src/lessons/LessonLoader", () => ({
  loadLessons: jest.fn(),
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
    const mockLessons = [
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
    ];

    (loadLessons as jest.Mock).mockReturnValueOnce(mockLessons);

    const { req, res } = createMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      lessons: mockLessons,
    });
    expect(loadLessons).toHaveBeenCalled();
  });

  it("should handle errors from loadLessons", async () => {
    (loadLessons as jest.Mock).mockImplementationOnce(() => {
      throw new Error("Failed to load lessons");
    });

    const { req, res } = createMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: "Failed to load lessons",
    });
    expect(loadLessons).toHaveBeenCalled();
  });
});
