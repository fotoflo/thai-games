import { renderHook } from "@testing-library/react";
import { useWorkingSet } from "../../../hooks/game/useWorkingSet";
import debugLesson from "../../../lessons/debug-lesson.json";

// Mock lessons array with debug lesson
const mockLessons = [debugLesson];

describe("useWorkingSet", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear();
  });

  it("should initialize with empty state", () => {
    const { result } = renderHook(() =>
      useWorkingSet({
        currentLesson: 0,
        lessons: mockLessons,
        progressionMode: "firstPass",
      })
    );

    expect(result.current.workingSet).toEqual([]);
    expect(result.current.activeVocabItem).toBeNull();
    expect(result.current.lessonSubset).toEqual({
      unseenItems: [],
      currentItem: null,
      practiceItems: [],
      masteredItems: [],
      skippedItems: [],
    });
  });

  it("should load first pass items from debug lesson", () => {
    const { result } = renderHook(() =>
      useWorkingSet({
        currentLesson: 0,
        lessons: mockLessons,
        progressionMode: "firstPass",
      })
    );

    // Debug lesson has 8 items
    expect(result.current.lessonSubset.unseenItems).toHaveLength(8);
    expect(result.current.lessonSubset.unseenItems).toContain("item1");
    expect(result.current.lessonSubset.unseenItems).toContain("item8");
  });
});
