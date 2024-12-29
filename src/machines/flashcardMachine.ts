import { createMachine } from "xstate";

type LessonItem = {
  id: string;
  sides: [any, any];
  recallCategory: "unseen" | "skipped" | "mastered" | "practice";
  practiceHistory: Array<any>;
};

type FlashcardContext = {
  practiceSet: string[];
  practiceSetMaxLength: number;
  currentItem: LessonItem | null;
  lessonSet: LessonItem[];
};

const flashcardMachine = createMachine({
  id: "flashcard",
  initial: "firstPass",
  context: {
    practiceSet: [],
    practiceSetMaxLength: 4,
    currentItem: null,
    lessonSet: [],
  } as FlashcardContext,
  states: {
    firstPass: {
      initial: "showCard",
      states: {
        showCard: {
          on: {
            SKIP: {
              target: "processNextCard",
              actions: "markCurrentAsSkipped",
            },
            PRACTICE: [
              {
                target: "processNextCard",
                actions: "addToPracticeSet",
                guard: "hasPracticeSetSpace",
              },
              {
                target: "transitionToPractice",
                guard: "isPracticeSetFull",
              },
            ],
            KNOW_IT: {
              target: "processNextCard",
              actions: "markCurrentAsMastered",
            },
          },
        },
        processNextCard: {
          always: [
            {
              target: "#flashcard.practiceMode",
              guard: "isPracticeSetFull",
            },
            {
              target: "showCard",
              actions: "loadNextCard",
              guard: "hasMoreCards",
            },
            {
              target: "#flashcard.practiceMode",
              guard: "isFirstPassComplete",
            },
          ],
        },
        transitionToPractice: {
          always: {
            target: "#flashcard.practiceMode",
          },
        },
      },
    },
    practiceMode: {
      initial: "showPracticeCard",
      states: {
        showPracticeCard: {
          on: {
            SKIP: {
              target: "processNextPracticeCard",
              actions: ["removeFromPracticeSet", "markCurrentAsSkipped"],
            },
            PRACTICE: {
              target: "processNextPracticeCard",
              actions: "updatePracticeHistory",
            },
            KNOW_IT: {
              target: "processNextPracticeCard",
              actions: [
                "removeFromPracticeSet",
                "markCurrentAsMastered",
                "addNewToPracticeSetIfAvailable",
              ],
            },
          },
        },
        processNextPracticeCard: {
          always: [
            {
              target: "showPracticeCard",
              actions: "loadNextPracticeCard",
              guard: "hasPracticeItems",
            },
            {
              target: "#flashcard.firstPass",
              guard: "hasUnfinishedFirstPass",
            },
            {
              target: "complete",
            },
          ],
        },
        complete: {
          type: "final",
        },
      },
    },
  },
});

// Guards and actions would be implemented separately
// Example guard:
const guards = {
  hasPracticeSetSpace: (context: FlashcardContext) =>
    context.practiceSet.length < context.practiceSetMaxLength,
  isPracticeSetFull: (context: FlashcardContext) =>
    context.practiceSet.length >= context.practiceSetMaxLength,
  // ... other guards
};

export default flashcardMachine;
