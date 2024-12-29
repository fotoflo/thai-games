import { renderHook, act } from "@testing-library/react";
import { useReadThaiGameState } from "./useReadThaiGameState";
import { LessonItem, LessonMetadata } from "../types/lessons";

describe("GameState - Happy Path", () => {
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
      ],
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
      ],
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
      ],
      practiceHistory: [],
      recallCategory: "unseen",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tags: ["greeting"],
      categories: ["basic"],
      intervalModifier: 1,
    },
  ];

  beforeEach(() => {
    localStorage.clear();
  });

  it("should initialize with default settings", () => {
    const { result } = renderHook(() => useReadThaiGameState());

    expect(result.current.gameState).toEqual({
      lessonData: {},
      currentLesson: null,
      completedLessons: [],
      settings: {
        defaultPracticeSetSize: 4,
        audioEnabled: true,
        interleaving: {
          enabled: false,
          strategy: "balanced",
          minCategorySpacing: 2,
        },
        srsSettings: {
          baseInterval: 24 * 60 * 60 * 1000, // 24 hours in ms
          intervalModifier: 1,
          failureSetback: 0.5,
        },
        offlineMode: {
          enabled: false,
          maxCacheSize: 100,
        },
      },
    });
  });

  it("should load a lesson correctly", () => {
    const { result } = renderHook(() => useReadThaiGameState());

    act(() => {
      result.current.updateGameState((draft) => {
        draft.lessonData[mockLessonMetadata.id] = {
          metadata: mockLessonMetadata,
          items: mockLessonItems,
        };
        draft.currentLesson = {
          id: mockLessonMetadata.id,
          items: mockLessonItems,
          progress: {
            startedAt: Date.now(),
            lastAccessedAt: Date.now(),
            practiceSetIds: [],
            practiceSetMaxLength: 4,
            streakDays: 0,
            bestStreak: 0,
            totalTimeSpent: 0,
            accuracyRate: 0,
            recentlyShownCategories: [],
            stats: {
              unseen: mockLessonItems.length,
              skipped: 0,
              mastered: 0,
              practice: 0,
            },
          },
        };
      });
    });

    expect(result.current.gameState?.currentLesson?.id).toBe(
      mockLessonMetadata.id
    );
    expect(result.current.gameState?.currentLesson?.items).toHaveLength(3);
    expect(result.current.gameState?.currentLesson?.progress.stats.unseen).toBe(
      3
    );
  });

  it("should handle first pass card decisions", () => {
    const { result } = renderHook(() => useReadThaiGameState());

    // Setup initial state with loaded lesson
    act(() => {
      result.current.updateGameState((draft) => {
        draft.lessonData[mockLessonMetadata.id] = {
          metadata: mockLessonMetadata,
          items: mockLessonItems,
        };
        draft.currentLesson = {
          id: mockLessonMetadata.id,
          items: mockLessonItems,
          progress: {
            startedAt: Date.now(),
            lastAccessedAt: Date.now(),
            practiceSetIds: [],
            practiceSetMaxLength: 4,
            streakDays: 0,
            bestStreak: 0,
            totalTimeSpent: 0,
            accuracyRate: 0,
            recentlyShownCategories: [],
            stats: {
              unseen: mockLessonItems.length,
              skipped: 0,
              mastered: 0,
              practice: 0,
            },
          },
        };
      });
    });

    // Mark first card for practice
    act(() => {
      result.current.handleFirstPassChoice("card-1", "practice");
    });

    // Mark second card as mastered
    act(() => {
      result.current.handleFirstPassChoice("card-2", "mastered");
    });

    // Skip third card
    act(() => {
      result.current.handleFirstPassChoice("card-3", "skipped");
    });

    // Verify final state
    expect(result.current.gameState?.currentLesson?.progress.stats).toEqual({
      unseen: 0,
      practice: 1,
      mastered: 1,
      skipped: 1,
    });
    expect(
      result.current.gameState?.currentLesson?.progress.practiceSetIds
    ).toHaveLength(1);
    expect(
      result.current.gameState?.currentLesson?.progress.practiceSetIds[0]
    ).toBe("card-1");
  });

  it("should handle practice mode transitions", () => {
    const { result } = renderHook(() => useReadThaiGameState());

    // Setup state with one card in practice
    act(() => {
      result.current.updateGameState((draft) => {
        draft.lessonData[mockLessonMetadata.id] = {
          metadata: mockLessonMetadata,
          items: mockLessonItems,
        };
        draft.currentLesson = {
          id: mockLessonMetadata.id,
          items: mockLessonItems,
          progress: {
            startedAt: Date.now(),
            lastAccessedAt: Date.now(),
            practiceSetIds: ["card-1"],
            practiceSetMaxLength: 4,
            streakDays: 0,
            bestStreak: 0,
            totalTimeSpent: 0,
            accuracyRate: 0,
            recentlyShownCategories: [],
            stats: {
              unseen: 0,
              skipped: 1,
              mastered: 1,
              practice: 1,
            },
          },
        };
      });
    });

    // Move practiced card to mastered
    act(() => {
      result.current.handleFirstPassChoice("card-1", "mastered");
    });

    // Verify practice set is empty and stats updated
    expect(
      result.current.gameState?.currentLesson?.progress.practiceSetIds
    ).toHaveLength(0);
    expect(result.current.gameState?.currentLesson?.progress.stats).toEqual({
      unseen: 0,
      practice: 0,
      mastered: 2,
      skipped: 1,
    });
  });
});
