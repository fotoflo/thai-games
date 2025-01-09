import { assign, setup } from "xstate";
import { LessonContext, LessonEvent } from "./lessonActions";
import {
  initialize,
  enterSwitchToPractice,
  enterSwitchToFirstPass,
  enterSwitchToTest,
  moveToNextSuperSetItem,
  moveToNextPracticeSetItem,
  handleMarkForPractice,
  handleMarkAsMastered,
  handleSkipItem,
  hasPracticeItems,
  practiceSetIsEmpty,
  allItemsMastered,
} from "./lessonActions";

const initialContext: LessonContext = {
  lessons: [],
  progressionMode: "initializing",
  superSet: [],
  practiceSet: [],
  practiceSetSize: 0,
  practiceSetIndex: 0,
  activeItem: null,
  currentLesson: 0,
  superSetIndex: 0,
};

export const lessonMachine = setup({
  types: {} as {
    context: LessonContext;
    events: LessonEvent;
  },
  guards: {
    hasPracticeItems,
    practiceSetIsEmpty,
    allItemsMastered,
  },
  actions: {
    moveToNextSuperSetItem,
    moveToNextPracticeSetItem,
    handleMarkForPractice,
    handleMarkAsMastered,
    handleSkipItem,
    initialize,
    enterSwitchToPractice,
    enterSwitchToFirstPass,
    enterSwitchToTest,
  },
}).createMachine({
  id: "lesson",
  context: initialContext,
  initial: "idle",
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
      entry: ["enterSwitchToFirstPass"],
      on: {
        MARK_FOR_PRACTICE: {
          actions: ["handleMarkForPractice", "moveToNextSuperSetItem"],
        },
        MARK_AS_MASTERED: {
          actions: ["handleMarkAsMastered", "moveToNextSuperSetItem"],
        },
        SKIP_ITEM: {
          actions: ["handleSkipItem", "moveToNextSuperSetItem"],
        },
        NEXT_ITEM: {
          actions: "moveToNextSuperSetItem",
        },
        SWITCH_TO_PRACTICE: {
          target: "practice",
          guard: "hasPracticeItems",
        },
      },
    },
    practice: {
      entry: ["enterSwitchToPractice"],
      on: {
        MARK_FOR_PRACTICE: {
          actions: ["handleMarkForPractice", "moveToNextPracticeSetItem"],
          guard: "hasPracticeItems",
        },
        MARK_AS_MASTERED: {
          actions: ["handleMarkAsMastered", "moveToNextPracticeSetItem"],
          guard: "hasPracticeItems",
        },
        SKIP_ITEM: {
          actions: ["handleSkipItem", "moveToNextPracticeSetItem"],
          guard: "hasPracticeItems",
        },
        NEXT_ITEM: {
          actions: "moveToNextPracticeSetItem",
          guard: "hasPracticeItems",
        },
        SWITCH_TO_FIRST_PASS: {
          target: "firstPass",
        },
      },
    },
  },
});
