import { useCallback, useEffect } from "react";
import { useGameSettings } from "./game/useGameSettings";
import { useLessons } from "./game/useLessons";
import { useWorkingSet } from "./game/useWorkingSet";
import { useFlashcardMachine } from "./useFlashcardMachine";
import { RecallCategory, CardSource } from "../types/lessons";

export const useReadThaiGameState = () => {
  const gameSettings = useGameSettings();
  const lessonState = useLessons();
  const workingSet = useWorkingSet({
    currentLesson: lessonState.currentLesson,
    lessons: lessonState.lessons,
    progressionMode: lessonState.progressionMode,
  });

  // Initialize with -1 if no lesson is selected
  useEffect(() => {
    if (lessonState.currentLesson !== -1 && lessonState.lessons.length === 0) {
      lessonState.setCurrentLesson(-1);
    }
  }, [lessonState]);

  const flashcardMachine = useFlashcardMachine();

  // Initialize with default lesson if none selected
  useEffect(() => {
    if (lessonState.currentLesson === -1 && lessonState.lessons.length > 0) {
      // Load saved state from localStorage
      const savedState = localStorage.getItem("flashcardGameState");
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          flashcardMachine.updateGameState((draft) => {
            Object.assign(draft, {
              lessonData: parsed.lessonData,
            });
          });
          // Restore lesson state
          if (parsed.currentLesson !== undefined) {
            lessonState.setCurrentLesson(parsed.currentLesson);
          }
          if (parsed.progressionMode) {
            lessonState.setProgressionMode(parsed.progressionMode);
          }
          if (parsed.lessonSubset) {
            workingSet.setLessonSubset(parsed.lessonSubset);
          }
          if (parsed.workingSet && Array.isArray(parsed.workingSet)) {
            const items = parsed.workingSet.map((item: any) => ({
              ...item,
              lastReviewed: new Date(item.lastReviewed),
            }));
            workingSet.addToWorkingSet(items);
          }
          if (parsed.activeItem) {
            const item = {
              ...parsed.activeItem,
              lastReviewed: new Date(parsed.activeItem.lastReviewed),
            };
            workingSet.setactiveItem(item);
          }
        } catch (error) {
          console.error("Failed to parse saved game state:", error);
        }
      } else {
        // No saved state, initialize with first lesson
        lessonState.setCurrentLesson(0);
        lessonState.setProgressionMode("firstPass");

        // Initialize first item
        const currentLesson = lessonState.lessons[0];
        if (currentLesson?.items.length > 0) {
          const firstItem = currentLesson.items[0];
          const workingSetItem = {
            id: firstItem.id,
            mastery: 0,
            vocabularyItem: firstItem,
            lastReviewed: new Date(),
          };
          workingSet.clearWorkingSet();
          workingSet.addToWorkingSet([workingSetItem]);
          workingSet.setLessonSubset({
            unseenItems: currentLesson.items.slice(1).map((item) => item.id),
            practiceItems: [],
            masteredItems: [],
            skippedItems: [],
          });
          workingSet.setactiveItem(workingSetItem);
        }
      }
    }
  }, [lessonState, flashcardMachine, workingSet]);

  // Handle progression mode changes
  const handleProgressionModeChange = useCallback(
    (mode: "firstPass" | "spacedRepetition" | "test") => {
      if (mode === lessonState.progressionMode) return;

      lessonState.setProgressionMode(mode);

      if (mode === "firstPass") {
        // Initialize with first item from current lesson
        const currentLesson = lessonState.lessons[lessonState.currentLesson];
        if (currentLesson?.items.length > 0) {
          const firstItem = currentLesson.items[0];
          const workingSetItem = {
            id: firstItem.id,
            mastery: 0,
            vocabularyItem: firstItem,
            lastReviewed: new Date(),
          };
          workingSet.clearWorkingSet();
          workingSet.addToWorkingSet([workingSetItem]);
          workingSet.setLessonSubset({
            unseenItems: currentLesson.items.slice(1).map((item) => item.id),
            practiceItems: [],
            masteredItems: [],
            skippedItems: [],
          });
          workingSet.setactiveItem(workingSetItem);
        }
      } else if (mode === "spacedRepetition") {
        // Get all practice items from the current lesson
        const currentLesson = lessonState.lessons[lessonState.currentLesson];
        if (currentLesson?.items.length > 0) {
          const practiceItems = currentLesson.items
            .filter((item) =>
              workingSet.lessonSubset.practiceItems.includes(item.id)
            )
            .map((item) => ({
              id: item.id,
              mastery: 1,
              vocabularyItem: item,
              lastReviewed: new Date(),
            }));

          if (practiceItems.length > 0) {
            workingSet.clearWorkingSet();
            workingSet.addToWorkingSet(practiceItems);
            workingSet.setactiveItem(practiceItems[0]);
          }
        }
      } else if (mode === "test") {
        // Clear working set in test mode
        workingSet.clearWorkingSet();
      }
    },
    [lessonState, workingSet]
  );

  // Initialize first pass mode when lesson is selected
  useEffect(() => {
    if (
      lessonState.currentLesson >= 0 &&
      lessonState.progressionMode === "firstPass"
    ) {
      handleProgressionModeChange("firstPass");
    }
  }, [
    lessonState.currentLesson,
    lessonState.progressionMode,
    handleProgressionModeChange,
  ]);

  // Handle first pass choices
  const handleFirstPassChoice = useCallback(
    (itemId: string, choice: RecallCategory) => {
      // Update lesson state
      lessonState.handleFirstPassChoice(itemId, choice);

      const currentLesson = lessonState.lessons[lessonState.currentLesson];
      const item = currentLesson?.items.find((i) => i.id === itemId);

      if (!item) return;

      // Update working set state based on choice
      if (choice === "practice") {
        const workingSetItem = {
          id: itemId,
          mastery: 1,
          vocabularyItem: item,
          lastReviewed: new Date(),
        };

        // Add to working set if not already present
        if (!workingSet.workingSet.some((i) => i.id === itemId)) {
          workingSet.addToWorkingSet([workingSetItem]);
          workingSet.setactiveItem(workingSetItem);
        }

        // Update lesson subset
        workingSet.setLessonSubset((prev) => {
          const newSubset = { ...prev };
          // Remove from all other categories
          newSubset.unseenItems = newSubset.unseenItems.filter(
            (id) => id !== itemId
          );
          newSubset.masteredItems = newSubset.masteredItems.filter(
            (id) => id !== itemId
          );
          newSubset.skippedItems = newSubset.skippedItems.filter(
            (id) => id !== itemId
          );
          // Add to practice items if not already there
          if (!newSubset.practiceItems.includes(itemId)) {
            newSubset.practiceItems.push(itemId);
          }
          return newSubset;
        });
      } else if (choice === "mastered") {
        // Remove from working set
        workingSet.removeFromWorkingSet(itemId);

        // Update lesson subset
        workingSet.setLessonSubset((prev) => {
          const newSubset = { ...prev };
          // Remove from all other categories
          newSubset.unseenItems = newSubset.unseenItems.filter(
            (id) => id !== itemId
          );
          newSubset.practiceItems = newSubset.practiceItems.filter(
            (id) => id !== itemId
          );
          newSubset.skippedItems = newSubset.skippedItems.filter(
            (id) => id !== itemId
          );
          // Add to mastered items if not already there
          if (!newSubset.masteredItems.includes(itemId)) {
            newSubset.masteredItems.push(itemId);
          }
          return newSubset;
        });
      } else if (choice === "skipped") {
        // Remove from working set
        workingSet.removeFromWorkingSet(itemId);

        // Update lesson subset
        workingSet.setLessonSubset((prev) => {
          const newSubset = { ...prev };
          // Remove from all other categories
          newSubset.unseenItems = newSubset.unseenItems.filter(
            (id) => id !== itemId
          );
          newSubset.practiceItems = newSubset.practiceItems.filter(
            (id) => id !== itemId
          );
          newSubset.masteredItems = newSubset.masteredItems.filter(
            (id) => id !== itemId
          );
          // Add to skipped items if not already there
          if (!newSubset.skippedItems.includes(itemId)) {
            newSubset.skippedItems.push(itemId);
          }
          return newSubset;
        });
      }

      // Load next unseen item if available
      const nextUnseenItem = currentLesson?.items.find((i) =>
        workingSet.lessonSubset.unseenItems.includes(i.id)
      );

      if (nextUnseenItem) {
        const nextWorkingSetItem = {
          id: nextUnseenItem.id,
          mastery: 0,
          vocabularyItem: nextUnseenItem,
          lastReviewed: new Date(),
        };
        workingSet.addToWorkingSet([nextWorkingSetItem]);
        workingSet.setactiveItem(nextWorkingSetItem);
      } else {
        // If no unseen items, move to the next item in the working set
        workingSet.nextItem();
      }
    },
    [lessonState, workingSet]
  );

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const state = {
      lessonData: flashcardMachine.gameState.lessonData,
      currentLesson: lessonState.currentLesson,
      progressionMode: lessonState.progressionMode,
      lessonSubset: workingSet.lessonSubset,
      workingSet: workingSet.workingSet.map((item) => ({
        ...item,
        lastReviewed: item.lastReviewed.toISOString(),
      })),
      activeItem: workingSet.activeItem
        ? {
            ...workingSet.activeItem,
            lastReviewed: workingSet.activeItem.lastReviewed.toISOString(),
          }
        : null,
    };
    localStorage.setItem("flashcardGameState", JSON.stringify(state));
  }, [
    flashcardMachine.gameState,
    lessonState.currentLesson,
    lessonState.progressionMode,
    workingSet.lessonSubset,
    workingSet.workingSet,
    workingSet.activeItem,
  ]);

  return {
    // Game settings
    ...gameSettings,

    // Lesson management
    currentLesson: lessonState.currentLesson,
    setCurrentLesson: lessonState.setCurrentLesson,
    progressionMode: lessonState.progressionMode,
    setProgressionMode: handleProgressionModeChange,

    // Working set
    workingSet: workingSet.workingSet,
    activeItem: workingSet.activeItem,
    currentItem: workingSet.activeItem, // Alias for activeItem
    setactiveItem: (item: typeof workingSet.activeItem) => {
      if (item) {
        workingSet.addToWorkingSet([item]);
      }
    },
    addMoreItems: workingSet.addMoreItems,
    nextItem: workingSet.nextItem,
    handleFirstPassChoice,

    // Lesson data
    lessons: lessonState.lessons,
    totalLessons: lessonState.totalLessons,

    // Progress tracking
    lessonSubset: workingSet.lessonSubset,

    // Game state
    gameState: flashcardMachine.gameState,

    // Update game state
    updateGameState: flashcardMachine.updateGameState,
  };
};
