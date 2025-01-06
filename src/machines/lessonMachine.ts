import { createMachine, assign, setup } from "xstate";
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
  actions: {
    initialize,
    enterSwitchToPractice,
    enterSwitchToFirstPass,
    enterSwitchToTest,
    moveToNextSuperSetItem,
    moveToNextPracticeSetItem,
    handleMarkForPractice,
    handleMarkAsMastered,
    handleSkipItem,
  },
  guards: {
    practiceSetIsEmpty,
    hasPracticeItems,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QBs6wPYDsB0BLCqAxAJIByxAKsQIIAyxAWgKIDaADALqKgAO6suAC64s3EAA9EAZgCMAdmwA2ACxsVy5YoBMADjZstAGhABPRMq1SlAVgCcU23MW35W5wF93x1LAw4AZrgATrCCAAoAhr6EALLUAEoA0gD6AGIA8vHJYfHUAMJUeaycYnwCwqJIEoh2ytg6MtaKimy2Olq21jJSxmYIFjLYUjpy1spOclJyrWzKnt5oWNiBIeFRsLEJKdQAyslxOxRM8UwAIuxcVWVCIphikgi19Y3Nre2d3b2IHbbY+to6VTjTRsKTzEA+PzLYKhSLRHaJYhhZKUJgxC6lfg3SqgB5PBpNFptDpdHqmRDyRRKLTWAyzLQyBkybTgyFLFaw9aEUhMAAaFBRR3RJSuWIqdyqeNsdQJr2JHzJfQaf3so1G9k6BjkrMWARha3hAHVKHkABLJCjpbK5ArEIoY0XlW73RCAnTYLSjUEqLTKPSKGRfR4jJQyNpSFqzcO2HW+dn6uEbHbGihmi1Wo6HB28MXOyXSZrYFyE7q+qRTRSKmph7BhtQtLo6NoNWNQnhBCIAY2EnbAmySaUy1vyhWKlxzTpx1QQMmZv2sbm0chkbHk5esQaaVnsjOstLkuikblbS3bXZ7fbiA92+12RxO5xFE+xEtxFLn2AXzU9K7XUg35L9MogxjLYYEyBoijWDoDhgl4EK6tgZ7drgvaEAiSKCmi2YgNc4oujOH5fkuv6TP+QayL8zIjJ67Sgv+WgnjgyEXtyfICqiwrjrhuZTg8s7OJ+i4-quZEAX0WiWEoUyaMoYFSGwkw6DoTFIR2KFocmJrmpaFpMFmT48ZOr7Th8QzWJR8gDGByhBjBMpNB0yhbm0tiKKpLGoX2WmpjpVqpMQ8SHNkuw7DheF5m+CC2AYfxyA0ch+v62iblMn7DNYiUOJWbgqfBbI4IIcCCIQeTpDEYS0EwRx6QZ3ERXx0jyEoqjqJouj6EYgFNL8P62JJjJOM5jH5YhRWhOhKZprpAVBQKYSheFvEmQ8sgKCoagaO1egGEGzR1JYGgGI0K6zDIqnjSVPnTVaOQjnaY6YsZBFrS1m2QR1u2AcudSyISUx2M0s6ePBmDoBAcBiAVT0vgRAC0ihBnD1hFvJw20lMqp5QscY4PgqAw-h+Yzm09QWRBiVNkyXV9JBSjxRBigwftHijbj0KrImhORdOmVaLWANuC4fpSMBm5+tgTjKbOPydHI2ps226kXtzjWEU0n5epl5ZC4jgHOIMsg0jIOjODFDRzIrSyXarK3mDTiDxb9voGG4fodMyIPuEAA */
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
        },
        SWITCH_TO_TEST: {
          target: "test",
        },
        ALL_ITEMS_PROCESSED: {
          target: "practice",
        },
      },
    },
    practice: {
      entry: ["enterSwitchToPractice"],
      on: {
        MARK_FOR_PRACTICE: {
          actions: ["handleMarkForPractice", "moveToNextPracticeSetItem"],
        },
        MARK_AS_MASTERED: {
          actions: ["handleMarkAsMastered", "moveToNextPracticeSetItem"],
        },
        SKIP_ITEM: {
          actions: ["handleSkipItem", "moveToNextPracticeSetItem"],
        },
        NEXT_ITEM: {
          actions: "moveToNextPracticeSetItem",
          guard: "practiceSetIsEmpty",
        },
        SWITCH_TO_TEST: {
          target: "test",
        },
        SWITCH_TO_FIRST_PASS: {
          target: "firstPass",
        },
      },
    },
    test: {
      entry: ["enterSwitchToTest"],
      on: {
        COMPLETE_TEST: {
          target: "firstPass",
        },
        SWITCH_TO_FIRST_PASS: {
          target: "firstPass",
        },
        SWITCH_TO_PRACTICE: {
          target: "practice",
        },
      },
    },
  },
});
