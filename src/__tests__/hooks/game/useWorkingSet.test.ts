import { renderHook, act } from "@testing-library/react";
import { useWorkingSet } from "../../../hooks/game/useWorkingSet";
import debugLesson from "../../../lessons/debug-lesson.json";

// Mock lessons array with debug lesson
const mockLessons = [debugLesson];

// Helper function to set up the first pass mock
const setupFirstPassMock = () => {
  return renderHook(() =>
    useWorkingSet({
      currentLesson: 0,
      lessons: mockLessons,
      progressionMode: "firstPass",
    })
  );
};

describe("useWorkingSet", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear();
  });

  it("should load first pass items from debug lesson", () => {
    const { result } = setupFirstPassMock();

    // Debug lesson has 8 items
    expect(result.current.lessonSubset.unseenItems).toHaveLength(7);
    expect(result.current.lessonSubset.unseenItems).toContain("item2");
    expect(result.current.lessonSubset.unseenItems).toContain("item8");
  });

  it("should set activeVocabItem to item1 on first load", () => {
    const { result } = setupFirstPassMock();

    // After loading first pass items, the activeVocabItem should be set to the first item
    expect(result.current.activeVocabItem).toEqual({
      id: "item1",
      mastery: 0,
      vocabularyItem: {
        id: "item1",
        text: "A1",
        translation: "A1",
        romanization: "A1",
        difficulty: 1,
        tags: ["test", "simple"],
        examples: [
          {
            text: "A1",
            translation: "A1",
            romanization: "A1",
          },
        ],
      },
    });
  });

  it("should handle skip functionality", () => {
    const { result } = setupFirstPassMock();

    // Simulate skipping the active vocab item
    act(() => {
      result.current.handleFirstPassChoice("skip");
    });

    // Check that the skipped item is in the skippedItems array
    expect(result.current.lessonSubset.skippedItems).toContain("item1");
    expect(result.current.activeVocabItem.id).toContain("item2");
  });
  it("should handle practice functionality", () => {
    const { result } = setupFirstPassMock();

    // Simulate skipping the active vocab item
    act(() => {
      result.current.handleFirstPassChoice("practice");
    });

    // Check that the skipped item is in the skippedItems array
    expect(result.current.lessonSubset.practiceItems).toContain("item1");
    expect(result.current.activeVocabItem.id).toContain("item2");
  });
  it("should handle mastered functionality", () => {
    const { result } = setupFirstPassMock();

    // Simulate skipping the active vocab item
    act(() => {
      result.current.handleFirstPassChoice("mastered");
    });

    // Check that the skipped item is in the skippedItems array
    expect(result.current.lessonSubset.masteredItems).toContain("item1");
    expect(result.current.activeVocabItem.id).toContain("item2");
  });
});
