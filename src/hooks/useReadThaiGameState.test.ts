import { renderHook, act } from "@testing-library/react";
import { useReadThaiGameState } from "./useReadThaiGameState";
import { LessonMetadata, LessonItem, CardSide } from "../types/lessons";
import * as LessonLoader from "../lessons/LessonLoader";

// Mock the loadLessons function
jest.mock("../lessons/LessonLoader", () => ({
  loadLessons: jest.fn(),
}));

describe("useReadThaiGameState", () => {
  const mockLessonMetadata: LessonMetadata = {
    id: "lesson-1",
    name: "Basic Thai Greetings",
    description: "Learn common Thai greetings",
    categories: ["thai", "greetings"],
    difficulty: "beginner",
    estimatedTime: 15,
    totalItems: 3,
    version: 1,
  };

  const mockLessonItems: LessonItem[] = [
    {
      id: "card-1",
      sides: [
        { markdown: "Hello" },
        { markdown: "สวัสดี", metadata: { pronunciation: "sa-wat-dee" } },
      ] as [CardSide, CardSide],
      practiceHistory: [],
      recallCategory: "unseen",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tags: ["greeting"],
      categories: ["basic"],
      intervalModifier: 1,
    },
    {
      id: "card-2",
      sides: [
        { markdown: "Thank you" },
        { markdown: "ขอบคุณ", metadata: { pronunciation: "khop-khun" } },
      ] as [CardSide, CardSide],
      practiceHistory: [],
      recallCategory: "unseen",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tags: ["courtesy"],
      categories: ["basic"],
      intervalModifier: 1,
    },
    {
      id: "card-3",
      sides: [
        { markdown: "Goodbye" },
        { markdown: "ลาก่อน", metadata: { pronunciation: "la-gorn" } },
      ] as [CardSide, CardSide],
      practiceHistory: [],
      recallCategory: "unseen",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tags: ["greeting"],
      categories: ["basic"],
      intervalModifier: 1,
    },
  ];

  const mockLesson = {
    ...mockLessonMetadata,
    items: mockLessonItems,
  };

  beforeEach(() => {
    localStorage.clear();
    // Mock loadLessons to return our test data
    (LessonLoader.loadLessons as jest.Mock).mockReturnValue([mockLesson]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with default settings", () => {
    const { result } = renderHook(() => useReadThaiGameState());

    expect(result.current.progressionMode).toBe("firstPass");
    expect(result.current.currentLesson).toBe(-1);
    expect(result.current.workingSet).toHaveLength(0);
    expect(result.current.lessonSubset).toEqual({
      unseenItems: [],
      practiceItems: [],
      masteredItems: [],
      skippedItems: [],
    });
  });

  it("should handle lesson selection", () => {
    const { result } = renderHook(() => useReadThaiGameState());

    act(() => {
      result.current.setCurrentLesson(0);
    });

    expect(result.current.currentLesson).toBe(0);
    expect(result.current.lessons[0].items).toHaveLength(3);
  });

  it("should handle progression mode changes", () => {
    const { result } = renderHook(() => useReadThaiGameState());

    // Setup initial state
    act(() => {
      result.current.updateGameState((draft) => {
        draft.lessonData[mockLessonMetadata.id] = {
          metadata: mockLessonMetadata,
          items: mockLessonItems,
        };
      });
      result.current.setCurrentLesson(0);
    });

    // Change to spaced repetition mode
    act(() => {
      result.current.setProgressionMode("spacedRepetition");
    });

    expect(result.current.progressionMode).toBe("spacedRepetition");
    expect(result.current.workingSet).toHaveLength(0); // Should clear working set on mode change

    // Change to test mode
    act(() => {
      result.current.setProgressionMode("test");
    });

    expect(result.current.progressionMode).toBe("test");
  });

  it("should handle first pass choices and update game state", () => {
    const { result } = renderHook(() => useReadThaiGameState());

    act(() => {
      result.current.setCurrentLesson(0);
      result.current.setProgressionMode("firstPass");
      result.current.handleFirstPassChoice("card-1", "practice");
    });

    expect(result.current.lessonSubset.practiceItems).toContain("card-1");
    expect(
      result.current.workingSet.some((item) => item.id === "card-1")
    ).toBeTruthy();

    act(() => {
      result.current.handleFirstPassChoice("card-2", "mastered");
    });

    expect(result.current.lessonSubset.masteredItems).toContain("card-2");
    expect(
      result.current.workingSet.some((item) => item.id === "card-2")
    ).toBeFalsy();
  });

  it("should handle working set management", () => {
    const { result } = renderHook(() => useReadThaiGameState());

    // Setup initial state
    act(() => {
      result.current.updateGameState((draft) => {
        draft.lessonData[mockLessonMetadata.id] = {
          metadata: mockLessonMetadata,
          items: mockLessonItems.map((item) => ({ ...item })),
        };
      });
      result.current.setCurrentLesson(0);
      result.current.setProgressionMode("firstPass");
    });

    // Add items to working set
    act(() => {
      result.current.handleFirstPassChoice("card-1", "practice");
      result.current.handleFirstPassChoice("card-2", "practice");
    });

    expect(result.current.workingSet.length).toBe(2);
    expect(result.current.activeItem).not.toBeNull();

    // Select a specific item
    const firstItem = result.current.workingSet[0];
    act(() => {
      result.current.setActiveItem({ ...firstItem });
    });

    expect(result.current.activeItem).toEqual(firstItem);
  });

  it("should persist game state between sessions", () => {
    // First session
    const { result: firstSession, unmount } = renderHook(() =>
      useReadThaiGameState()
    );

    act(() => {
      firstSession.current.setCurrentLesson(0);
      firstSession.current.setProgressionMode("firstPass");
      firstSession.current.handleFirstPassChoice("card-1", "practice");
    });

    // Unmount first session
    unmount();

    // Second session should have the same state
    const { result: secondSession } = renderHook(() => useReadThaiGameState());

    expect(secondSession.current.lessonSubset.practiceItems).toContain(
      "card-1"
    );
    expect(secondSession.current.currentLesson).toBe(0);
  });

  it("should advance cards after first pass choices", () => {
    const { result } = renderHook(() => useReadThaiGameState());

    act(() => {
      result.current.setCurrentLesson(0);
      result.current.setProgressionMode("firstPass");
      result.current.handleFirstPassChoice("card-1", "practice");
      result.current.handleFirstPassChoice("card-2", "practice");
    });

    const initialItem = result.current.activeItem;
    expect(initialItem).not.toBeNull();

    act(() => {
      result.current.nextItem();
    });
    expect(result.current.activeItem).not.toEqual(initialItem);

    const secondItem = result.current.activeItem;
    expect(secondItem).not.toEqual(initialItem);
  });

  it("should advance cards in practice mode", () => {
    const { result } = renderHook(() => useReadThaiGameState());

    // Setup initial state with practice items
    act(() => {
      result.current.setCurrentLesson(0);
      result.current.setProgressionMode("firstPass");
      result.current.handleFirstPassChoice("card-1", "practice");
      result.current.handleFirstPassChoice("card-2", "practice");
    });

    const initialItem = result.current.activeItem;
    expect(initialItem).not.toBeNull();

    // Next should advance
    act(() => {
      result.current.nextItem();
    });
    expect(result.current.activeItem).not.toEqual(initialItem);

    const secondItem = result.current.activeItem;
    expect(secondItem).not.toEqual(initialItem);
  });

  it("should handle end of lesson correctly", () => {
    const { result } = renderHook(() => useReadThaiGameState());

    // Setup initial state
    act(() => {
      result.current.updateGameState((draft) => {
        draft.lessonData[mockLessonMetadata.id] = {
          metadata: mockLessonMetadata,
          items: mockLessonItems,
        };
      });
      result.current.setCurrentLesson(0);
    });

    // Mark all items as mastered
    act(() => {
      mockLessonItems.forEach((item) => {
        result.current.handleFirstPassChoice(item.id, "mastered");
      });
    });

    // Should have no active item when all are mastered
    expect(result.current.activeItem).toBeNull();
    expect(result.current.lessonSubset.masteredItems.length).toBe(
      mockLessonItems.length
    );
    expect(result.current.lessonSubset.unseenItems.length).toBe(0);
  });

  it("should maintain set exclusivity when moving items", () => {
    const { result } = renderHook(() => useReadThaiGameState());

    // Setup initial state
    act(() => {
      result.current.updateGameState((draft) => {
        draft.lessonData[mockLessonMetadata.id] = {
          metadata: mockLessonMetadata,
          items: mockLessonItems,
        };
      });
      result.current.setCurrentLesson(0);
    });

    // Move items through different states
    act(() => {
      // First to practice
      result.current.handleFirstPassChoice("card-1", "practice");
      // Another to mastered
      result.current.handleFirstPassChoice("card-2", "mastered");
      // Last one skipped
      result.current.handleFirstPassChoice("card-3", "skipped");
    });

    // Verify each item is only in one set
    const allSets = [
      ...result.current.lessonSubset.practiceItems,
      ...result.current.lessonSubset.masteredItems,
      ...result.current.lessonSubset.skippedItems,
      ...result.current.lessonSubset.unseenItems,
    ];

    const uniqueItems = new Set(allSets);
    expect(uniqueItems.size).toBe(mockLessonItems.length);
    expect(allSets.length).toBe(mockLessonItems.length);

    // Verify specific item locations
    expect(result.current.lessonSubset.practiceItems).toContain("card-1");
    expect(result.current.lessonSubset.masteredItems).toContain("card-2");
    expect(result.current.lessonSubset.skippedItems).toContain("card-3");

    // Verify each item is only in its assigned set
    expect(result.current.lessonSubset.practiceItems).not.toContain("card-2");
    expect(result.current.lessonSubset.practiceItems).not.toContain("card-3");
    expect(result.current.lessonSubset.masteredItems).not.toContain("card-1");
    expect(result.current.lessonSubset.masteredItems).not.toContain("card-3");
    expect(result.current.lessonSubset.skippedItems).not.toContain("card-1");
    expect(result.current.lessonSubset.skippedItems).not.toContain("card-2");
  });

  it("should maintain set exclusivity when changing progression modes", () => {
    const { result } = renderHook(() => useReadThaiGameState());

    // Setup initial state
    act(() => {
      result.current.setCurrentLesson(0);
      result.current.setProgressionMode("firstPass");
    });

    // Move items through different states
    act(() => {
      result.current.handleFirstPassChoice("card-1", "practice");
      result.current.handleFirstPassChoice("card-2", "mastered");
      result.current.handleFirstPassChoice("card-3", "skipped");
    });

    // Verify each item is only in one set
    const allSets = [
      ...result.current.lessonSubset.practiceItems,
      ...result.current.lessonSubset.masteredItems,
      ...result.current.lessonSubset.skippedItems,
      ...result.current.lessonSubset.unseenItems,
    ];

    const uniqueItems = new Set(allSets);
    expect(uniqueItems.size).toBe(3);
    expect(allSets.length).toBe(3);

    // Move items in spaced repetition mode
    act(() => {
      result.current.setProgressionMode("spacedRepetition");
    });

    // Verify items maintain their states
    expect(result.current.lessonSubset.practiceItems).toContain("card-1");
    expect(result.current.lessonSubset.masteredItems).toContain("card-2");
    expect(result.current.lessonSubset.skippedItems).toContain("card-3");
  });
});
