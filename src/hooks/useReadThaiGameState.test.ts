import { renderHook } from "@testing-library/react";
import { useReadThaiGameState } from "./useReadThaiGameState";
import {
  LessonMetadata,
  LessonItem,
  CardSide,
  GameState,
  LessonProgress,
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

  const mockLessonProgress: LessonProgress = {
    startedAt: Date.now(),
    lastAccessedAt: Date.now(),
    practiceSetIds: [],
    practiceSetMaxLength: 7,
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
  };

  const mockInitialGameState: GameState = {
    lessonData: {
      [mockLessonMetadata.id]: {
        metadata: mockLessonMetadata,
        items: mockLessonItems,
      },
    },
    currentLesson: {
      id: mockLessonMetadata.id,
      progress: mockLessonProgress,
      items: mockLessonItems,
    },
    completedLessons: [],
    settings: {
      defaultPracticeSetSize: 5,
      audioEnabled: true,
      interleaving: {
        enabled: false,
        strategy: "balanced",
        minCategorySpacing: 2,
      },
      srsSettings: {
        baseInterval: 24 * 60 * 60 * 1000, // 24 hours
        intervalModifier: 1,
        failureSetback: 0.5,
      },
      offlineMode: {
        enabled: false,
        maxCacheSize: 100,
      },
    },
  };

  beforeEach(() => {
    localStorage.clear();
    // Mock loadLessons to return our test data
    (LessonLoader.loadLessons as jest.Mock).mockReturnValue([mockLesson]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Initialization", () => {
    it("should initialize with default settings when no saved state exists", () => {
      const { result } = renderHook(() => useReadThaiGameState());

      expect(result.current.progressionMode).toBe("firstPass");
      expect(result.current.currentLesson).toBe(0);
      expect(result.current.workingSet).toHaveLength(1);
      expect(result.current.lessonSubset).toEqual({
        unseenItems: mockLessonItems.slice(1).map((item) => item.id),
        practiceItems: [],
        masteredItems: [],
        skippedItems: [],
      });
      expect(result.current.activeItem).toBeTruthy();
      if (result.current.activeItem) {
        expect(result.current.activeItem.id).toBe(mockLessonItems[0].id);
      }
    });

    it("should restore state from localStorage if it exists", () => {
      // Set up initial state in localStorage
      localStorage.setItem(
        "flashcardGameState",
        JSON.stringify(mockInitialGameState)
      );

      const { result } = renderHook(() => useReadThaiGameState());

      expect(result.current.currentLesson).toBe(0);
      expect(result.current.progressionMode).toBe("firstPass");
      expect(result.current.lessons).toHaveLength(1);
      expect(result.current.lessons[0]).toEqual(mockLesson);
    });

    it("should initialize working set with first item in first pass mode", () => {
      const { result } = renderHook(() => useReadThaiGameState());

      expect(result.current.workingSet).toHaveLength(1);
      expect(result.current.activeItem).toBeTruthy();
      if (result.current.activeItem) {
        expect(result.current.activeItem.id).toBe(mockLessonItems[0].id);
        expect(result.current.activeItem.lessonItem).toEqual(
          mockLessonItems[0]
        );
      }
    });

    it("should load lessons correctly", () => {
      const { result } = renderHook(() => useReadThaiGameState());

      expect(result.current.lessons).toHaveLength(1);
      expect(result.current.lessons[0]).toEqual(mockLesson);
      expect(LessonLoader.loadLessons).toHaveBeenCalled();
    });
  });
});
