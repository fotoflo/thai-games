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
    window.localStorage.clear();
  });

  describe("Initial State", () => {
    it("should initialize with empty working set", () => {
      const { result } = setupFirstPassMock();
      expect(result.current.workingSet).toHaveLength(0);
    });

    it("should load first pass items from debug lesson", () => {
      const { result } = setupFirstPassMock();
      expect(result.current.lessonSubset.unseenItems).toHaveLength(7);
      expect(result.current.lessonSubset.unseenItems).toContain("item2");
      expect(result.current.lessonSubset.unseenItems).not.toContain("item1");
    });

    it("should set first item as active on load", () => {
      const { result } = setupFirstPassMock();
      expect(result.current.activeVocabItem).toEqual({
        id: "item1",
        mastery: 0,
        vocabularyItem: expect.objectContaining({
          id: "item1",
          text: "A1",
          translation: "A1",
        }),
      });
    });
  });

  describe("First Pass Choices", () => {
    it("should handle skip choice", () => {
      const { result } = setupFirstPassMock();

      act(() => {
        result.current.handleFirstPassChoice("skip");
      });

      expect(result.current.lessonSubset.skippedItems).toContain("item1");
      expect(result.current.activeVocabItem?.id).toBe("item2");
      expect(result.current.lessonSubset.unseenItems).not.toContain("item2");
    });

    it("should handle practice choice", () => {
      const { result } = setupFirstPassMock();

      act(() => {
        result.current.handleFirstPassChoice("practice");
      });

      expect(result.current.lessonSubset.practiceItems).toContain("item1");
      expect(result.current.activeVocabItem?.id).toBe("item2");
      expect(result.current.lessonSubset.unseenItems).not.toContain("item2");
    });

    it("should handle mastered choice", () => {
      const { result } = setupFirstPassMock();

      act(() => {
        result.current.handleFirstPassChoice("mastered");
      });

      expect(result.current.lessonSubset.masteredItems).toContain("item1");
      expect(result.current.activeVocabItem?.id).toBe("item2");
      expect(result.current.lessonSubset.unseenItems).not.toContain("item2");
    });

    it("should set activeVocabItem to null when all items are processed", () => {
      const { result } = setupFirstPassMock();

      // Process all items
      act(() => {
        for (let i = 0; i < 8; i++) {
          result.current.handleFirstPassChoice("mastered");
        }
      });

      expect(result.current.activeVocabItem).toBeNull();
      expect(result.current.lessonSubset.unseenItems).toHaveLength(0);
    });
  });

  describe("Lesson Changes", () => {
    it("should reset state when changing lessons", () => {
      const { rerender } = renderHook((props) => useWorkingSet(props), {
        initialProps: {
          currentLesson: 0,
          lessons: mockLessons,
          progressionMode: "firstPass",
        },
      });

      // Change lesson
      rerender({
        currentLesson: 1,
        lessons: mockLessons,
        progressionMode: "firstPass",
      });

      // Should reset to initial state
      expect(result.current.workingSet).toHaveLength(0);
      expect(result.current.lessonSubset).toEqual({
        unseenItems: [],
        practiceItems: [],
        masteredItems: [],
        skippedItems: [],
      });
    });
  });

  describe("Working Set Management", () => {
    it("should add items to working set", () => {
      const { result } = setupFirstPassMock();

      act(() => {
        result.current.addMoreItems(3);
      });

      expect(result.current.workingSet.length).toBeGreaterThan(0);
      expect(result.current.workingSet.length).toBeLessThanOrEqual(3);
    });

    it("should respect maximum working set size", () => {
      const { result } = setupFirstPassMock();

      act(() => {
        result.current.addMoreItems(10);
      });

      expect(result.current.workingSet.length).toBeLessThanOrEqual(7);
    });

    it("should clear working set", () => {
      const { result } = setupFirstPassMock();

      act(() => {
        result.current.addMoreItems(3);
        result.current.clearWorkingSet();
      });

      expect(result.current.workingSet).toHaveLength(0);
    });
  });

  describe("Local Storage Persistence", () => {
    it("should persist state to localStorage", () => {
      const { result } = setupFirstPassMock();

      act(() => {
        result.current.handleFirstPassChoice("practice");
      });

      // Create a new hook instance
      const { result: newResult } = setupFirstPassMock();

      // State should be preserved
      expect(newResult.current.lessonSubset.practiceItems).toContain("item1");
      expect(newResult.current.activeVocabItem?.id).toBe("item2");
    });
  });
});
