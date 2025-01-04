import { createMachine, assign } from "xstate";
import { LessonContext, LessonEvent } from "./lessonActions";
import {
  initialize,
  moveToNextItem,
  handleMarkForPractice,
  handleMarkAsMastered,
  handleSkipItem,
  hasPracticeItems,
} from "./lessonActions";

const initialContext: LessonContext = {
  lessons: [],
  currentLesson: -1,
  workingSet: [],
  lessonSubset: {
    unseenItems: [],
    practiceItems: [],
    masteredItems: [],
    skippedItems: [],
  },
  activeItem: null,
};

export const lessonMachine = createMachine({
  id: "lesson",
  context: initialContext,
  initial: "idle",
  types: {
    context: {} as LessonContext,
    events: {} as LessonEvent,
  },
  states: {
    idle: {
      on: {
        INITIALIZE: {
          target: "firstPass",
          actions: [assign((context, event) => initialize(context, event))],
        },
      },
    },
    firstPass: {
      on: {
        MARK_FOR_PRACTICE: {
          actions: [handleMarkForPractice, moveToNextItem],
        },
        MARK_AS_MASTERED: {
          actions: [handleMarkAsMastered, moveToNextItem],
        },
        SKIP_ITEM: {
          actions: [handleSkipItem, moveToNextItem],
        },
        NEXT_ITEM: {
          actions: moveToNextItem,
        },
        SWITCH_TO_SPACED: {
          target: "spacedRepetition",
          guard: hasPracticeItems,
        },
      },
    },
    spacedRepetition: {
      on: {
        MARK_FOR_PRACTICE: {
          actions: [handleMarkForPractice, moveToNextItem],
        },
        MARK_AS_MASTERED: {
          actions: [handleMarkAsMastered, moveToNextItem],
        },
        SKIP_ITEM: {
          actions: [handleSkipItem, moveToNextItem],
        },
        NEXT_ITEM: {
          actions: moveToNextItem,
        },
        SWITCH_TO_TEST: {
          target: "test",
        },
      },
    },
    test: {
      on: {
        COMPLETE_TEST: {
          target: "firstPass",
        },
      },
    },
  },
});
