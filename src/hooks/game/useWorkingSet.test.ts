import { renderHook, act } from "@testing-library/react";
import { useWorkingSet } from "./useWorkingSet";
import { Lesson } from "../../types/lessons";

describe("useWorkingSet", () => {
  const mockLesson: Lesson = {
    id: "test-lesson",
    name: "Test Lesson",
    description: "Test Description",
    categories: ["test"],
    difficulty: "beginner",
    estimatedTime: 10,
    totalItems: 3,
    version: 1,
    items: [
      {
        id: "item-1",
        sides: [
          { markdown: "Test 1" },
          { markdown: "ทดสอบ 1", metadata: { pronunciation: "tod-sob 1" } },
        ],
        practiceHistory: [],
        recallCategory: "unseen",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        tags: ["test"],
        categories: ["test"],
        intervalModifier: 1,
      },
      {
        id: "item-2",
        sides: [
          { markdown: "Test 2" },
          { markdown: "ทดสอบ 2", metadata: { pronunciation: "tod-sob 2" } },
        ],
        practiceHistory: [],
        recallCategory: "unseen",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        tags: ["test"],
        categories: ["test"],
        intervalModifier: 1,
      },
      {
        id: "item-3",
        sides: [
          { markdown: "Test 3" },
          { markdown: "ทดสอบ 3", metadata: { pronunciation: "tod-sob 3" } },
        ],
        practiceHistory: [],
        recallCategory: "unseen",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        tags: ["test"],
        categories: ["test"],
        intervalModifier: 1,
      },
    ],
  };

  it("should initialize with empty working set", () => {
    const { result } = renderHook(() =>
      useWorkingSet({
        currentLesson: 0,
        lessons: [mockLesson],
        progressionMode: "firstPass",
      })
    );

    expect(result.current.workingSet).toHaveLength(0);
    expect(result.current.activeVocabItem).toBeNull();
    expect(result.current.lessonSubset).toEqual({
      unseenItems: [],
      practiceItems: [],
      masteredItems: [],
      skippedItems: [],
    });
  });

  it("should load first pass items correctly", () => {
    const { result } = renderHook(() =>
      useWorkingSet({
        currentLesson: 0,
        lessons: [mockLesson],
        progressionMode: "firstPass",
      })
    );

    act(() => {
      result.current.loadFirstPassItems();
    });

    // Should have first item in working set
    expect(result.current.workingSet).toHaveLength(1);
    expect(result.current.workingSet[0].id).toBe("item-1");

    // Should have remaining items in unseen
    expect(result.current.lessonSubset.unseenItems).toHaveLength(2);
    expect(result.current.lessonSubset.unseenItems).toContain("item-2");
    expect(result.current.lessonSubset.unseenItems).toContain("item-3");
  });

  it("should handle first pass choices correctly", () => {
    const { result } = renderHook(() =>
      useWorkingSet({
        currentLesson: 0,
        lessons: [mockLesson],
        progressionMode: "firstPass",
      })
    );

    // Load initial items
    act(() => {
      result.current.loadFirstPassItems();
    });

    // Mark first item for practice
    act(() => {
      result.current.handleFirstPassChoice("item-1", "practice");
    });

    expect(result.current.lessonSubset.practiceItems).toContain("item-1");
    expect(
      result.current.workingSet.some((item) => item.id === "item-1")
    ).toBeTruthy();

    // Mark second item as mastered
    act(() => {
      result.current.handleFirstPassChoice("item-2", "mastered");
    });

    expect(result.current.lessonSubset.masteredItems).toContain("item-2");
    expect(
      result.current.workingSet.some((item) => item.id === "item-2")
    ).toBeFalsy();

    // Skip third item
    act(() => {
      result.current.handleFirstPassChoice("item-3", "skipped");
    });

    expect(result.current.lessonSubset.skippedItems).toContain("item-3");
    expect(
      result.current.workingSet.some((item) => item.id === "item-3")
    ).toBeFalsy();
  });

  it("should respect working set size limit", () => {
    const { result } = renderHook(() =>
      useWorkingSet({
        currentLesson: 0,
        lessons: [mockLesson],
        progressionMode: "firstPass",
      })
    );

    // Add multiple items to working set
    act(() => {
      result.current.addMoreItems(10); // Try to add more than max (7)
    });

    expect(result.current.workingSet.length).toBeLessThanOrEqual(7);
  });

  it("should handle practice mode transitions", () => {
    const { result } = renderHook(() =>
      useWorkingSet({
        currentLesson: 0,
        lessons: [mockLesson],
        progressionMode: "spacedRepetition",
      })
    );

    // Add items to practice set
    act(() => {
      result.current.handleFirstPassChoice("item-1", "practice");
      result.current.handleFirstPassChoice("item-2", "practice");
    });

    expect(result.current.workingSet.length).toBe(2);

    // Move item from practice to mastered
    act(() => {
      result.current.handleFirstPassChoice("item-1", "mastered");
    });

    expect(result.current.workingSet.length).toBe(1);
    expect(result.current.lessonSubset.masteredItems).toContain("item-1");
    expect(result.current.lessonSubset.practiceItems).not.toContain("item-1");
  });

  it("should handle next item selection", () => {
    const { result } = renderHook(() =>
      useWorkingSet({
        currentLesson: 0,
        lessons: [mockLesson],
        progressionMode: "spacedRepetition",
      })
    );

    // Add multiple items
    act(() => {
      result.current.addMoreItems(3);
    });

    const firstItem = result.current.activeVocabItem;

    // Move to next item
    act(() => {
      result.current.nextItem();
    });

    expect(result.current.activeVocabItem).not.toBe(firstItem);
    expect(result.current.activeVocabItem?.lastReviewed).toBeDefined();
  });

  it("should advance to next card after first pass choices", () => {
    const { result } = renderHook(() =>
      useWorkingSet({
        currentLesson: 0,
        lessons: [mockLesson],
        progressionMode: "firstPass",
      })
    );

    // Load initial items
    act(() => {
      result.current.loadFirstPassItems();
    });

    const initialItem = result.current.activeVocabItem;

    // Practice choice should advance
    act(() => {
      result.current.handleFirstPassChoice("item-1", "practice");
    });
    expect(result.current.activeVocabItem).not.toBe(initialItem);

    const secondItem = result.current.activeVocabItem;

    // Mastered choice should advance
    act(() => {
      result.current.handleFirstPassChoice("item-2", "mastered");
    });
    expect(result.current.activeVocabItem).not.toBe(secondItem);

    const thirdItem = result.current.activeVocabItem;

    // Skip choice should advance
    act(() => {
      result.current.handleFirstPassChoice("item-3", "skipped");
    });
    expect(result.current.activeVocabItem).not.toBe(thirdItem);
  });

  it("should advance to next card after practice mode actions", () => {
    const { result } = renderHook(() =>
      useWorkingSet({
        currentLesson: 0,
        lessons: [mockLesson],
        progressionMode: "spacedRepetition",
      })
    );

    // Add items to practice set
    act(() => {
      result.current.addMoreItems(3);
    });

    const initialItem = result.current.activeVocabItem;

    // Next should advance
    act(() => {
      result.current.nextItem();
    });
    expect(result.current.activeVocabItem).not.toBe(initialItem);

    const secondItem = result.current.activeVocabItem;

    // Mastered should advance
    act(() => {
      result.current.handleFirstPassChoice(secondItem!.id, "mastered");
    });
    expect(result.current.activeVocabItem).not.toBe(secondItem);
  });

  it("should cycle back to first card when reaching end of working set", () => {
    const { result } = renderHook(() =>
      useWorkingSet({
        currentLesson: 0,
        lessons: [mockLesson],
        progressionMode: "spacedRepetition",
      })
    );

    // Add items to practice set
    act(() => {
      result.current.addMoreItems(3);
    });

    const firstItem = result.current.activeVocabItem;

    // Advance through all items
    act(() => {
      result.current.nextItem(); // to second
      result.current.nextItem(); // to third
      result.current.nextItem(); // should cycle back to first
    });

    expect(result.current.activeVocabItem?.id).toBe(firstItem?.id);
  });

  it("should ensure items exist in only one set at a time", () => {
    const { result } = renderHook(() =>
      useWorkingSet({
        currentLesson: 0,
        lessons: [mockLesson],
        progressionMode: "firstPass",
      })
    );

    // Load initial items
    act(() => {
      result.current.loadFirstPassItems();
    });

    // Mark item for practice
    act(() => {
      result.current.handleFirstPassChoice("item-1", "practice");
    });

    // Item should only be in practice set
    expect(result.current.lessonSubset.practiceItems).toContain("item-1");
    expect(result.current.lessonSubset.masteredItems).not.toContain("item-1");
    expect(result.current.lessonSubset.skippedItems).not.toContain("item-1");
    expect(result.current.lessonSubset.unseenItems).not.toContain("item-1");

    // Move item to mastered
    act(() => {
      result.current.handleFirstPassChoice("item-1", "mastered");
    });

    // Item should only be in mastered set
    expect(result.current.lessonSubset.masteredItems).toContain("item-1");
    expect(result.current.lessonSubset.practiceItems).not.toContain("item-1");
    expect(result.current.lessonSubset.skippedItems).not.toContain("item-1");
    expect(result.current.lessonSubset.unseenItems).not.toContain("item-1");

    // Skip an item
    act(() => {
      result.current.handleFirstPassChoice("item-2", "skipped");
    });

    // Item should only be in skipped set
    expect(result.current.lessonSubset.skippedItems).toContain("item-2");
    expect(result.current.lessonSubset.masteredItems).not.toContain("item-2");
    expect(result.current.lessonSubset.practiceItems).not.toContain("item-2");
    expect(result.current.lessonSubset.unseenItems).not.toContain("item-2");
  });

  it("should handle moving items between sets correctly", () => {
    const { result } = renderHook(() =>
      useWorkingSet({
        currentLesson: 0,
        lessons: [mockLesson],
        progressionMode: "firstPass",
      })
    );

    // Load initial items
    act(() => {
      result.current.loadFirstPassItems();
    });

    // Move item through different states
    act(() => {
      // First to practice
      result.current.handleFirstPassChoice("item-1", "practice");
      // Then to mastered
      result.current.handleFirstPassChoice("item-1", "mastered");
      // Then to practice again
      result.current.handleFirstPassChoice("item-1", "practice");
    });

    // Should end up only in practice set
    expect(result.current.lessonSubset.practiceItems).toContain("item-1");
    expect(result.current.lessonSubset.masteredItems).not.toContain("item-1");
    expect(result.current.lessonSubset.skippedItems).not.toContain("item-1");
    expect(result.current.lessonSubset.unseenItems).not.toContain("item-1");

    // Verify total count of items across all sets equals total lesson items
    const totalItemsInSets = [
      ...result.current.lessonSubset.practiceItems,
      ...result.current.lessonSubset.masteredItems,
      ...result.current.lessonSubset.skippedItems,
      ...result.current.lessonSubset.unseenItems,
    ];

    const uniqueItems = new Set(totalItemsInSets);
    expect(uniqueItems.size).toBe(mockLesson.items.length);
  });
});
