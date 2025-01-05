import { createMachine, assign } from "xstate";
import { LessonContext, LessonEvent } from "./lessonActions";
import {
  initialize,
  moveToNextSuperSetItem,
  moveToNextPracticeSetItem,
  handleMarkForPractice,
  handleMarkAsMastered,
  handleSkipItem,
  hasPracticeItems,
} from "./lessonActions";

const initialContext: LessonContext = {
  lessons: [],
  currentLessonId: -1,
  superSet: [],
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
          actions: [handleMarkForPractice, moveToNextSuperSetItem],
        },
        MARK_AS_MASTERED: {
          actions: [handleMarkAsMastered, moveToNextSuperSetItem],
        },
        SKIP_ITEM: {
          actions: [handleSkipItem, moveToNextSuperSetItem],
        },
        NEXT_ITEM: {
          actions: moveToNextSuperSetItem,
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
          actions: [handleMarkForPractice, moveToNextPracticeSetItem],
        },
        MARK_AS_MASTERED: {
          actions: [handleMarkAsMastered, moveToNextPracticeSetItem],
        },
        SKIP_ITEM: {
          actions: [handleSkipItem, moveToNextPracticeSetItem],
        },
        NEXT_ITEM: {
          actions: moveToNextPracticeSetItem,
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
