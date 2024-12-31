import { renderHook, act } from "@testing-library/react";
import { useReadThaiGameState } from "./useReadThaiGameState";
import {
  LessonMetadata,
  LessonItem,
  CardSide,
  WorkingSetItem,
} from "../types/lessons";
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
    expect(result.current.currentLesson).toBe(0);
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

  it("should advance cards after first pass choices", async () => {
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

  it("should advance cards in practice mode", async () => {
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

  describe("Item Actions", () => {
    let result: { current: ReturnType<typeof useReadThaiGameState> };

    beforeEach(() => {
      // Setup for each test
      const hook = renderHook(() => useReadThaiGameState());
      result = hook.result;

      // Initialize the lesson and mode
      act(() => {
        // First set up the lesson data
        result.current.updateGameState((draft) => {
          draft.lessonData[mockLessonMetadata.id] = {
            metadata: mockLessonMetadata,
            items: mockLessonItems,
          };
        });

        // Then set the lesson and mode
        result.current.setCurrentLesson(0);
        result.current.setProgressionMode("firstPass");
      });

      // Wait for state to update
      act(() => {
        // Empty act to flush effects
      });
    });

    it("should handle marking item for practice", () => {
      // Get initial active item
      const initialActiveItem = result.current.activeItem;
      expect(initialActiveItem).not.toBeNull();
      if (!initialActiveItem) return;

      // Mark for practice
      act(() => {
        result.current.handleMarkForPractice();
      });

      // Verify item was added to practice items
      expect(result.current.lessonSubset.practiceItems).toContain(
        initialActiveItem.id
      );

      // Verify item is in working set
      const itemInWorkingSet = result.current.workingSet.find(
        (item: WorkingSetItem) => item.id === initialActiveItem.id
      );
      expect(itemInWorkingSet).toBeTruthy();
      expect(itemInWorkingSet?.mastery).toBe(1);

      // Verify item was removed from unseen items
      expect(result.current.lessonSubset.unseenItems).not.toContain(
        initialActiveItem.id
      );
    });

    it("should handle marking item as mastered", () => {
      // Get initial active item
      const initialActiveItem = result.current.activeItem;
      expect(initialActiveItem).not.toBeNull();
      if (!initialActiveItem) return;

      // Mark as mastered
      act(() => {
        result.current.handleMarkAsMastered();
      });

      // Verify item was added to mastered items
      expect(result.current.lessonSubset.masteredItems).toContain(
        initialActiveItem.id
      );

      // Verify item was removed from working set
      const itemInWorkingSet = result.current.workingSet.find(
        (item: WorkingSetItem) => item.id === initialActiveItem.id
      );
      expect(itemInWorkingSet).toBeFalsy();

      // Verify item was removed from unseen items
      expect(result.current.lessonSubset.unseenItems).not.toContain(
        initialActiveItem.id
      );

      // Verify item is not in practice items
      expect(result.current.lessonSubset.practiceItems).not.toContain(
        initialActiveItem.id
      );
    });

    it("should handle skipping item", () => {
      // Get initial active item
      const initialActiveItem = result.current.activeItem;
      expect(initialActiveItem).not.toBeNull();
      if (!initialActiveItem) return;

      // Skip item
      act(() => {
        result.current.handleSkipItem();
      });

      // Verify item was added to skipped items
      expect(result.current.lessonSubset.skippedItems).toContain(
        initialActiveItem.id
      );

      // Verify item was removed from working set
      const itemInWorkingSet = result.current.workingSet.find(
        (item: WorkingSetItem) => item.id === initialActiveItem.id
      );
      expect(itemInWorkingSet).toBeFalsy();

      // Verify item was removed from unseen items
      expect(result.current.lessonSubset.unseenItems).not.toContain(
        initialActiveItem.id
      );

      // Verify item is not in practice or mastered items
      expect(result.current.lessonSubset.practiceItems).not.toContain(
        initialActiveItem.id
      );
      expect(result.current.lessonSubset.masteredItems).not.toContain(
        initialActiveItem.id
      );
    });

    it("should move to next item after any action", () => {
      // Get initial active item
      const initialActiveItem = result.current.activeItem;
      expect(initialActiveItem).not.toBeNull();
      if (!initialActiveItem) return;

      // Test after marking for practice
      act(() => {
        result.current.handleMarkForPractice();
      });
      expect(result.current.activeItem?.id).not.toBe(initialActiveItem.id);

      // Test after marking as mastered
      const secondItem = result.current.activeItem;
      if (!secondItem) return;
      act(() => {
        result.current.handleMarkAsMastered();
      });
      expect(result.current.activeItem?.id).not.toBe(secondItem.id);

      // Test after skipping
      const thirdItem = result.current.activeItem;
      if (!thirdItem) return;
      act(() => {
        result.current.handleSkipItem();
      });
      expect(result.current.activeItem?.id).not.toBe(thirdItem.id);
    });

    it("should maintain set exclusivity", () => {
      // Get initial active item
      const initialActiveItem = result.current.activeItem;
      expect(initialActiveItem).not.toBeNull();
      if (!initialActiveItem) return;

      // Test practice
      act(() => {
        result.current.handleMarkForPractice();
      });
      expect(result.current.lessonSubset.practiceItems).toContain(
        initialActiveItem.id
      );
      expect(result.current.lessonSubset.masteredItems).not.toContain(
        initialActiveItem.id
      );
      expect(result.current.lessonSubset.skippedItems).not.toContain(
        initialActiveItem.id
      );
      expect(result.current.lessonSubset.unseenItems).not.toContain(
        initialActiveItem.id
      );

      // Test mastered with second item
      const secondItem = result.current.activeItem;
      if (!secondItem) return;
      act(() => {
        result.current.handleMarkAsMastered();
      });
      expect(result.current.lessonSubset.masteredItems).toContain(
        secondItem.id
      );
      expect(result.current.lessonSubset.practiceItems).not.toContain(
        secondItem.id
      );
      expect(result.current.lessonSubset.skippedItems).not.toContain(
        secondItem.id
      );
      expect(result.current.lessonSubset.unseenItems).not.toContain(
        secondItem.id
      );

      // Test skipped with third item
      const thirdItem = result.current.activeItem;
      if (!thirdItem) return;
      act(() => {
        result.current.handleSkipItem();
      });
      expect(result.current.lessonSubset.skippedItems).toContain(thirdItem.id);
      expect(result.current.lessonSubset.practiceItems).not.toContain(
        thirdItem.id
      );
      expect(result.current.lessonSubset.masteredItems).not.toContain(
        thirdItem.id
      );
      expect(result.current.lessonSubset.unseenItems).not.toContain(
        thirdItem.id
      );
    });
  });
});
