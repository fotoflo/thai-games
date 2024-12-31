import { useCallback, useEffect } from "react";
import { useGameSettings } from "./game/useGameSettings";
import { useLessons } from "./game/useLessons";
import { useWorkingSet } from "./game/useWorkingSet";
import { useFlashcardMachine } from "./useFlashcardMachine";
import { RecallCategory, LessonItem, Lesson } from "../types/lessons";

export const useReadThaiGameState = () => {
  const gameSettings = useGameSettings();
  const lessonState = useLessons();
  const workingSet = useWorkingSet({
    currentLesson: lessonState.currentLesson,
    lessons: lessonState.lessons,
    progressionMode: lessonState.progressionMode,
  });

  const flashcardMachine = useFlashcardMachine();

  const createWorkingSetItem = useCallback((item: LessonItem) => {
    return {
      id: item.id,
      mastery: 0,
      vocabularyItem: item,
      lastReviewed: new Date(),
    };
  }, []);

  const createLessonSubset = useCallback((lesson: Lesson) => {
    return {
      unseenItems: lesson.items.slice(1).map((item) => item.id),
      practiceItems: [],
      masteredItems: [],
      skippedItems: [],
    };
  }, []);

  const getCurrentLesson = useCallback(() => {
    return lessonState.lessons[lessonState.currentLesson];
  }, [lessonState]);

  const initializeWorkingSet = useCallback(
    ({
      items,
      shouldClearWorkingSet = true,
      shouldSetLessonSubset = false,
    }: {
      items: LessonItem[];
      shouldClearWorkingSet?: boolean;
      shouldSetLessonSubset?: boolean;
    }) => {
      const workingSetItems = items.map((item) => createWorkingSetItem(item));

      if (workingSetItems.length === 0) return;

      if (shouldClearWorkingSet) {
        workingSet.clearWorkingSet();
      }

      workingSet.addToWorkingSet(workingSetItems);
      workingSet.setActiveItem(workingSetItems[0]);

      if (shouldSetLessonSubset) {
        const currentLesson = getCurrentLesson();
        if (currentLesson) {
          workingSet.setLessonSubset(createLessonSubset(currentLesson));
        }
      }
    },
    [workingSet, createWorkingSetItem, getCurrentLesson, createLessonSubset]
  );

  const initializeFirstPassMode = useCallback(() => {
    const currentLesson = getCurrentLesson();
    if (currentLesson?.items.length > 0) {
      initializeWorkingSet({
        items: [currentLesson.items[0]],
        shouldClearWorkingSet: true,
        shouldSetLessonSubset: true,
      });
    }
  }, [getCurrentLesson, initializeWorkingSet]);

  const initializeSpacedRepetitionMode = useCallback(() => {
    const currentLesson = getCurrentLesson();
    if (currentLesson?.items.length > 0) {
      const practiceItems = currentLesson.items.filter((item) =>
        workingSet.lessonSubset.practiceItems.includes(item.id)
      );

      if (practiceItems.length > 0) {
        initializeWorkingSet({
          items: practiceItems,
          shouldClearWorkingSet: true,
        });
      }
    }
  }, [getCurrentLesson, workingSet.lessonSubset, initializeWorkingSet]);

  const initializeTestMode = useCallback(() => {
    workingSet.clearWorkingSet();
  }, [workingSet]);

  // Handle progression mode changes
  const handleProgressionModeChange = useCallback(
    (mode: "firstPass" | "spacedRepetition" | "test") => {
      if (!!workingSet.activeItem && mode === lessonState.progressionMode)
        return;

      lessonState.setProgressionMode(mode);

      switch (mode) {
        case "firstPass":
          initializeFirstPassMode();
          break;
        case "spacedRepetition":
          initializeSpacedRepetitionMode();
          break;
        case "test":
          initializeTestMode();
          break;
      }
    },
    [
      lessonState,
      workingSet,
      initializeFirstPassMode,
      initializeSpacedRepetitionMode,
      initializeTestMode,
    ]
  );

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
            workingSet.setActiveItem(item);
          }
        } catch (error) {
          console.error("Failed to parse saved game state:", error);
        }
      } else {
        // No saved state, initialize with first lesson
        lessonState.setCurrentLesson(0);
        handleProgressionModeChange("firstPass");
      }
    }
  }, [lessonState, flashcardMachine, workingSet]);

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
      const currentLesson = getCurrentLesson();
      if (!currentLesson) return;

      // Get the current item
      const currentItem = currentLesson.items.find(
        (item) => item.id === itemId
      );
      if (!currentItem) return;

      // Create practice item if needed
      const practiceItem =
        choice === "practice" ? createWorkingSetItem(currentItem) : null;

      // Batch our state updates
      workingSet.setLessonSubset((prev) => {
        const newSubset = { ...prev };

        // Remove from all categories
        Object.keys(newSubset).forEach((key) => {
          newSubset[key as keyof typeof newSubset] = newSubset[
            key as keyof typeof newSubset
          ].filter((id) => id !== itemId);
        });

        // Add to new category
        switch (choice) {
          case "practice":
            newSubset.practiceItems.push(itemId);
            break;
          case "mastered":
            newSubset.masteredItems.push(itemId);
            break;
          case "skipped":
            newSubset.skippedItems.push(itemId);
            break;
          case "unseen":
            newSubset.unseenItems.push(itemId);
            break;
        }

        // Get next unseen item from the new state
        const nextUnseenId = newSubset.unseenItems[0];
        const nextUnseenItem = nextUnseenId
          ? currentLesson.items.find((item) => item.id === nextUnseenId)
          : null;

        // Queue microtask to handle working set updates after state is committed
        queueMicrotask(() => {
          // Update working set based on choice
          if (choice === "practice" && practiceItem) {
            workingSet.addToWorkingSet([practiceItem]);
          } else {
            workingSet.removeFromWorkingSet(itemId);
          }

          // Set next active item
          if (nextUnseenItem) {
            const nextWorkingSetItem = createWorkingSetItem(nextUnseenItem);
            workingSet.addToWorkingSet([nextWorkingSetItem]);
            workingSet.setActiveItem(nextWorkingSetItem);
          } else if (practiceItem) {
            workingSet.setActiveItem(practiceItem);
          } else {
            workingSet.nextItem();
          }
        });

        return newSubset;
      });
    },
    [getCurrentLesson, workingSet, createWorkingSetItem]
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

  useEffect(() => {
    if (lessonState.currentLesson === -1) {
      lessonState.setCurrentLesson(0);
      handleProgressionModeChange("firstPass");
      workingSet.setActiveItem(
        createWorkingSetItem(lessonState.lessons[0].items[0])
      );
    }
  }, [
    lessonState,
    handleProgressionModeChange,
    workingSet,
    createWorkingSetItem,
  ]);

  // Separate handlers for each choice type
  const handleMarkForPractice = useCallback(() => {
    if (workingSet.activeItem) {
      handleFirstPassChoice(workingSet.activeItem.id, "practice");
    }
  }, [workingSet.activeItem, handleFirstPassChoice]);

  const handleMarkAsMastered = useCallback(() => {
    if (workingSet.activeItem) {
      handleFirstPassChoice(workingSet.activeItem.id, "mastered");
    }
  }, [workingSet.activeItem, handleFirstPassChoice]);

  const handleSkipItem = useCallback(() => {
    if (workingSet.activeItem) {
      handleFirstPassChoice(workingSet.activeItem.id, "skipped");
    }
  }, [workingSet.activeItem, handleFirstPassChoice]);

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
    setActiveItem: workingSet.setActiveItem,
    addMoreItems: workingSet.addMoreItems,
    nextItem: workingSet.nextItem,

    handleFirstPassChoice,
    handleMarkForPractice,
    handleMarkAsMastered,
    handleSkipItem,

    // Lesson data
    lessons: lessonState.lessons,

    // Progress tracking
    lessonSubset: workingSet.lessonSubset,

    // Game state
    gameState: flashcardMachine.gameState,

    // Update game state
    updateGameState: flashcardMachine.updateGameState,
  };
};
