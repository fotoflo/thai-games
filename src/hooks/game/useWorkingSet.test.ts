import { renderHook, act } from "@testing-library/react";
import { usePracticeSet } from "./usePracticeSet";
import { Lesson } from "../../types/lessons";

const mockLesson: Lesson = {
  id: "lesson-1",
  name: "Test Lesson",
  description: "Test Description",
  categories: ["test"],
  difficulty: "beginner",
  estimatedTime: 30,
  totalItems: 3,
  version: 1,
  items: [
    {
      id: "item-1",
      sides: [{ markdown: "Front 1" }, { markdown: "Back 1" }],
      categories: ["test"],
      tags: ["test"],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      intervalModifier: 1,
      practiceHistory: [],
      recallCategory: "unseen",
    },
    {
      id: "item-2",
      sides: [{ markdown: "Front 2" }, { markdown: "Back 2" }],
      categories: ["test"],
      tags: ["test"],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      intervalModifier: 1,
      practiceHistory: [],
      recallCategory: "unseen",
    },
    {
      id: "item-3",
      sides: [{ markdown: "Front 3" }, { markdown: "Back 3" }],
      categories: ["test"],
      tags: ["test"],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      intervalModifier: 1,
      practiceHistory: [],
      recallCategory: "unseen",
    },
  ],
};

describe("usePracticeSet", () => {
  it("should auto-fill practice set when space is available", () => {
    const { result } = renderHook(() =>
      usePracticeSet({
        currentLesson: 0,
        lessons: [mockLesson],
        progressionMode: "firstPass",
      })
    );

    act(() => {
      result.current.addToPracticeSet([
        {
          id: "item-1",
          mastery: 1,
          lessonItem: mockLesson.items[0],
          lastReviewed: new Date(),
        },
      ]);
    });

    expect(result.current.practiceSet.length).toBe(1);
  });

  it("should maintain set exclusivity", () => {
    const { result } = renderHook(() =>
      usePracticeSet({
        currentLesson: 0,
        lessons: [mockLesson],
        progressionMode: "firstPass",
      })
    );

    act(() => {
      result.current.addToPracticeSet([
        {
          id: "item-1",
          mastery: 1,
          lessonItem: mockLesson.items[0],
          lastReviewed: new Date(),
        },
      ]);
    });

    act(() => {
      result.current.addToPracticeSet([
        {
          id: "item-1",
          mastery: 1,
          lessonItem: mockLesson.items[0],
          lastReviewed: new Date(),
        },
      ]);
    });

    expect(result.current.practiceSet.length).toBe(1);
  });

  it("should cycle through practice set correctly", () => {
    const { result } = renderHook(() =>
      usePracticeSet({
        currentLesson: 0,
        lessons: [mockLesson],
        progressionMode: "firstPass",
      })
    );

    act(() => {
      result.current.addToPracticeSet([
        {
          id: "item-1",
          mastery: 1,
          lessonItem: mockLesson.items[0],
          lastReviewed: new Date(),
        },
        {
          id: "item-2",
          mastery: 1,
          lessonItem: mockLesson.items[1],
          lastReviewed: new Date(),
        },
        {
          id: "item-3",
          mastery: 1,
          lessonItem: mockLesson.items[2],
          lastReviewed: new Date(),
        },
      ]);
    });

    act(() => {
      result.current.nextItem();
    });

    act(() => {
      result.current.nextItem();
    });

    act(() => {
      result.current.nextItem();
    });

    // Should be back to the first item
    expect(result.current.activeItem?.id).toBe("item-1");
  });
});
