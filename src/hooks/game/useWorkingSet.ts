import { createMachine, assign, interpret } from "xstate";
import { useCallback, useEffect } from "react";
import useLocalStorage from "../useLocalStorage";

// Original interfaces
export interface LessonItem {
  id: string;
  term: string;
  definition: string;
  examples?: string[];
}

export interface Lesson {
  id: string;
  title: string;
  items: LessonItem[];
}

export interface WorkingSetItem {
  id: string;
  mastery: number;
  vocabularyItem: LessonItem;
  lastReviewed?: Date;
}

interface LessonSubset {
  unseenItems: string[];
  practiceItems: string[];
  masteredItems: string[];
  skippedItems: string[];
}

interface UseWorkingSetProps {
  currentLesson: number;
  lessons: Lesson[];
  progressionMode: "firstPass" | "spacedRepetition" | "test";
}

// State machine context
interface VocabContext {
  currentLesson: number;
  workingSet: WorkingSetItem[];
  activeVocabItem: WorkingSetItem | null;
  lessonSubset: LessonSubset;
  error: Error | null;
}

// State machine events
type VocabEvent =
  | { type: "START_FIRST_PASS" }
  | { type: "ADD_TO_WORKING_SET"; items: WorkingSetItem[] }
  | { type: "REMOVE_FROM_WORKING_SET"; itemId: string }
  | { type: "CLEAR_WORKING_SET" }
  | { type: "NEXT_ITEM" }
  | {
      type: "HANDLE_CHOICE";
      choice: "skip" | "mastered" | "practice";
      item: WorkingSetItem;
    }
  | { type: "ERROR"; error: Error };

/**
 * State machine for managing vocabulary learning progression.
 *
 * Key Concepts:
 *
 * Working Set:
 * - Limited to 7 active vocabulary items
 * - Currently being studied/reviewed items
 *   - Contains full item data with mastery levels and review dates
 *   - Primary state driving user interactions
 *
 * Lesson Subset Groups:
 * - Practice Items: Items marked for additional review
 *   - When marked as "practice", items are both tracked in practiceItems
 *   - and re-added to working set
 * - Mastered Items: Successfully learned items
 * - Skipped Items: Items to revisit later
 * - Unseen Items: Not yet introduced vocabulary
 *
 * Flow:
 * 1. Machine starts in 'idle' state
 * 2. START_FIRST_PASS transitions to 'active'
 * 3. In 'active' state, can:
 *    - Add/remove items from working set
 *    - Clear entire working set
 *    - Move to next item
 *    - Handle user choices (skip/master/practice)
 * 4. Error state available for handling issues
 *
 * @param lessons - Array of vocabulary lessons containing items to learn
 * @returns XState machine for vocabulary learning progression
 */

const createVocabMachine = (lessons: Lesson[]) =>
  createMachine<VocabContext, VocabEvent>(
    {
      id: "vocabLearning",
      initial: "idle",
      context: {
        currentLesson: 0,
        workingSet: [],
        activeVocabItem: null,
        lessonSubset: {
          unseenItems: [],
          practiceItems: [],
          masteredItems: [],
          skippedItems: [],
        },
        error: null,
      },
      states: {
        idle: {
          on: {
            START_FIRST_PASS: "active",
          },
        },
        active: {
          on: {
            ADD_TO_WORKING_SET: {
              actions: ["addToWorkingSet"],
            },
            REMOVE_FROM_WORKING_SET: {
              actions: ["removeFromWorkingSet"],
            },
            CLEAR_WORKING_SET: {
              actions: ["clearWorkingSet"],
            },
            NEXT_ITEM: {
              actions: ["nextItem"],
            },
            HANDLE_CHOICE: {
              actions: ["handleChoice"],
            },
            ERROR: {
              target: "error",
              actions: ["setError"],
            },
          },
        },
        error: {
          on: {
            START_FIRST_PASS: "active",
          },
        },
      },
    },
    {
      actions: {
        addToWorkingSet: assign((context, event) => {
          if (event.type !== "ADD_TO_WORKING_SET") return context;
          const newSet = [...context.workingSet, ...event.items].slice(0, 7);
          return {
            ...context,
            workingSet: newSet,
            activeVocabItem: context.activeVocabItem || newSet[0] || null,
          };
        }),

        removeFromWorkingSet: assign((context, event) => {
          if (event.type !== "REMOVE_FROM_WORKING_SET") return context;
          const updatedSet = context.workingSet.filter(
            (item) => item.id !== event.itemId
          );
          return {
            ...context,
            workingSet: updatedSet,
            activeVocabItem:
              context.activeVocabItem?.id === event.itemId
                ? updatedSet[0] || null
                : context.activeVocabItem,
          };
        }),

        clearWorkingSet: assign({
          workingSet: [],
          activeVocabItem: null,
        }),

        nextItem: assign((context) => {
          if (!context.activeVocabItem || context.workingSet.length === 0)
            return context;
          const currentIndex = context.workingSet.findIndex(
            (item) => item.id === context.activeVocabItem?.id
          );
          const nextIndex = (currentIndex + 1) % context.workingSet.length;
          return {
            ...context,
            activeVocabItem: {
              ...context.workingSet[nextIndex],
              lastReviewed: new Date(),
            },
          };
        }),

        handleChoice: assign((context, event) => {
          if (event.type !== "HANDLE_CHOICE") return context;
          const { choice, item } = event;
          const newContext = { ...context };

          switch (choice) {
            case "practice":
              newContext.lessonSubset.practiceItems = [
                ...newContext.lessonSubset.practiceItems,
                item.id,
              ];
              newContext.workingSet = [...newContext.workingSet, item].slice(
                0,
                7
              );
              break;
            case "mastered":
              newContext.lessonSubset.masteredItems = [
                ...newContext.lessonSubset.masteredItems,
                item.id,
              ];
              break;
            case "skip":
              newContext.lessonSubset.skippedItems = [
                ...newContext.lessonSubset.skippedItems,
                item.id,
              ];
              break;
          }

          return newContext;
        }),

        setError: assign({
          error: (_, event) => (event.type === "ERROR" ? event.error : null),
        }),
      },
    }
  );

export const useWorkingSet = ({
  currentLesson,
  lessons,
  progressionMode,
}: UseWorkingSetProps) => {
  // Create and store machine instance
  const machine = useCallback(() => createVocabMachine(lessons), [lessons]);
  const [savedState, setSavedState] = useLocalStorage("vocabState", null);

  // Initialize service
  const service = interpret(machine()).start(
    savedState ? savedState : undefined
  );

  const state = service.getSnapshot();

  // Define base functions first
  const addToWorkingSet = useCallback(
    (items: WorkingSetItem[]) => {
      service.send({ type: "ADD_TO_WORKING_SET", items });
    },
    [service]
  );

  const removeFromWorkingSet = useCallback(
    (itemId: string) => {
      service.send({ type: "REMOVE_FROM_WORKING_SET", itemId });
    },
    [service]
  );

  const clearWorkingSet = useCallback(() => {
    service.send({ type: "CLEAR_WORKING_SET" });
  }, [service]);

  const nextItem = useCallback(() => {
    service.send({ type: "NEXT_ITEM" });
  }, [service]);

  const addMoreItems = useCallback(
    (count: number = 1) => {
      if (currentLesson >= 0 && lessons[currentLesson]) {
        const lessonItems = lessons[currentLesson].items;
        if (lessonItems.length === 0) return;

        const newItems = lessonItems.slice(0, count).map((item) => ({
          id: item.id,
          mastery: 0,
          vocabularyItem: item,
          lastReviewed: new Date(),
        }));

        service.send({ type: "ADD_TO_WORKING_SET", items: newItems });
      }
    },
    [currentLesson, lessons, service]
  );

  // Then define functions that depend on addToWorkingSet
  const loadFirstPassItems = useCallback(() => {
    if (currentLesson >= 0 && lessons[currentLesson]) {
      const lessonItems = lessons[currentLesson].items;
      if (lessonItems.length === 0) return;

      service.send({ type: "START_FIRST_PASS" });

      // Initialize with first item
      const firstItem = lessonItems[0];
      addToWorkingSet([
        {
          id: firstItem.id,
          mastery: 0,
          vocabularyItem: firstItem,
          lastReviewed: new Date(),
        },
      ]);

      // Update lesson subset
      state.context.lessonSubset = {
        unseenItems: lessonItems.slice(1).map((item) => item.id),
        practiceItems: [],
        masteredItems: [],
        skippedItems: [],
      };
    }
  }, [currentLesson, lessons, service, addToWorkingSet]);

  const handleFirstPassChoice = useCallback(
    (choice: "skip" | "mastered" | "practice") => {
      if (!state.context.activeVocabItem) return;

      service.send({
        type: "HANDLE_CHOICE",
        choice,
        item: state.context.activeVocabItem,
      });

      // After handling choice, load next unseen item if available
      if (state.context.lessonSubset.unseenItems.length > 0) {
        const nextItemId = state.context.lessonSubset.unseenItems[0];
        const nextItem = lessons[currentLesson].items.find(
          (item) => item.id === nextItemId
        );
        if (nextItem) {
          addToWorkingSet([
            {
              id: nextItem.id,
              mastery: 0,
              vocabularyItem: nextItem,
              lastReviewed: new Date(),
            },
          ]);
        }
      }
    },
    [
      service,
      state.context.activeVocabItem,
      currentLesson,
      lessons,
      addToWorkingSet,
    ]
  );

  // Subscribe to state changes
  useEffect(() => {
    const subscription = service.subscribe((state) => {
      setSavedState(state.context);
    });
    return () => subscription.unsubscribe();
  }, [service, setSavedState]);

  return {
    workingSet: state.context.workingSet,
    activeVocabItem: state.context.activeVocabItem,
    lessonSubset: state.context.lessonSubset,
    isWorkingSetFull: state.context.workingSet.length >= 7,
    addToWorkingSet,
    removeFromWorkingSet,
    clearWorkingSet,
    nextItem,
    loadFirstPassItems,
    handleFirstPassChoice,
    addMoreItems,
  };
};
