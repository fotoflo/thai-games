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

  it("should load first pass items from debug lesson", () => {
    const { result } = renderHook(() =>
      useWorkingSet({
        currentLesson: 0,
        lessons: mockLessons,
        progressionMode: "firstPass",
      })
    );

    // Debug lesson has 8 items
    expect(result.current.lessonSubset.unseenItems).toHaveLength(7);
    expect(result.current.lessonSubset.unseenItems).toContain("item2");
    expect(result.current.lessonSubset.unseenItems).toContain("item8");
  });

  it("should set activeVocabItem on first load", () => {
    const { result } = renderHook(() =>
      useWorkingSet({
        currentLesson: 0,
        lessons: mockLessons,
        progressionMode: "firstPass",
      })
    );

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
});
