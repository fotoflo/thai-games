import { assign, fromPromise, setup } from "xstate";
import {
  CardSetContext,
  CardSetEvent,
  hasPracticeSetPracticeItems,
  hasSuperSetPracticeItems,
  practiceSetIsEmpty,
  allItemsMastered,
  allItemsSeen,
  moveToNextSuperSetItem,
  moveToNextPracticeSetItem,
  handleMarkForPractice,
  handleMarkAsMastered,
  handleSkipItem,
  handleChooseLesson,
  enterSwitchToPractice,
  enterSwitchToFirstPass,
  enterSwitchToTest,
  initializeWithLoadedLessons,
  openFlashCardModal,
  closeFlashCardModal,
} from "./cardSetActions";
import { createActorContext } from "@xstate/react";
import { lessonApi } from "@/api/lessonApi";

const initialContext: CardSetContext = {
  lessons: [],
  progressionMode: "firstPass",
  superSet: [],
  practiceSet: [],
  practiceSetSize: 0,
  practiceSetIndex: 0,
  activeItem: null,
  currentLesson: 0,
  superSetIndex: 0,
  error: null,
  invertCard: false,
  FlashCardModalOpen: false,
};

export const cardSetMachine = setup({
  types: {} as {
    context: CardSetContext;
    events: CardSetEvent;
  },
  guards: {
    hasPracticeSetPracticeItems,
    hasSuperSetPracticeItems,
    practiceSetIsEmpty,
    allItemsMastered,
    allItemsSeen,
  },
  actions: {
    moveToNextSuperSetItem,
    moveToNextPracticeSetItem,
    handleMarkForPractice,
    handleMarkAsMastered,
    handleSkipItem,
    handleChooseLesson,
    enterSwitchToPractice,
    enterSwitchToFirstPass,
    enterSwitchToTest,
    initializeWithLoadedLessons,
    openFlashCardModal,
    closeFlashCardModal,
  },
  actors: {
    fetchLessons: fromPromise(lessonApi.loadLessons),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QBs6wPYDsB0BLCqAxAJIByxAKsQIIAyxAWgKIDaADALqKgAO6suAC64s3EAA9EAZgCcADmwB2ACxsAbMrnKAjGwCsc-XoA0IAJ6I527GxlSV8gEx7N2xdoC+H06lgYcAGa4AE6wggAKAIZ+hACy1ABKANIA+gBiAPIJKeEJ1ADCVPmsnGJ8AsKiSBKIinIy2Mqqas7KimpScgamFghtCm56UrLaMmrqsl4+aFjYQaER0bBxianUAMop8esUTAlMACLsXNXlQiKYYpIIdQ1N6q3tnd3m0np6SjI6bI4ybGzKKR6RxTEC+fxzEJhKIxdZJYjhFKUJixY5lfjnKqga63RrNR4dLpyHqIRzDRraRxyNQ0gGGDQg7xgmaBKGLGKkJgADQoSN2qNKpwxlUu1Rx9TxDxcTyJJIQ2ns2DkVg6P1syj0E1B4Nm82hS0I6wA6pR8gAJFIUDI5PKFYjFNFCioXK7SeRKZqab4GIxytSjGyauxUgxqdqKbUs7A8YKRADGwjjYBWyXSWRtBSKJROvGFLrFiGUjjlmscSpkFcBGi+yn9kb8sxj8cTyfiqY2Ww2u32R0FuedWJqfSkNhkjkc2jaagrqpMrwQnTY2D02jkijYiiBnTcUnrEKbCdwScN8MRyIFOZAZxFroQXWwq8p-unij0ajfajlzgG9jaugMq5dBGTI6jgB4toQnI8nyKKOv2mKitilhlo4AJqFo06yDI2huHK2gtNg4wtFItYtHIUiOHUe6NrGh7HsapoWla6TEAkOw5Bs6xwVeeaDtcsgKCo6hev+hjvH604PhRozTvom7KF4TKYOgEBwGIoHogOiFDgAtJ+856dROD4KgmkIbejiSTha4dMMPzrsS866MoD6UpqCrkZoGhqEZkILDC8BOuZBY3DSSgtMoMiKJZFYzn6+jLm+eivpF+FjsB0wNmBtEtmZN4hWuSokZ09QqvhLh+lIS5UjhiiVpqKhyIpHhAA */
  id: "lesson",
  context: initialContext,
  initial: "loading",
  states: {
    loading: {
      on: {
        INITIALIZE: {
          actions: ["initializeWithLoadedLessons"],
          target: "firstPass",
        },
      },
    },
    firstPass: {
      entry: ["enterSwitchToFirstPass"],
      always: [
        {
          target: "practice",
          guard: "allItemsSeen",
        },
      ],
      on: {
        OPEN_FLASH_CARD_MODAL: {
          actions: ["openFlashCardModal"],
        },
        CLOSE_FLASH_CARD_MODAL: {
          actions: ["closeFlashCardModal"],
        },
        CHOOSE_LESSON: {
          actions: ["handleChooseLesson"],
        },
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
          guard: "hasSuperSetPracticeItems",
        },
      },
    },
    practice: {
      entry: ["enterSwitchToPractice"],
      always: [
        {
          target: "firstPass",
          guard: "practiceSetIsEmpty",
        },
      ],
      on: {
        OPEN_FLASH_CARD_MODAL: {
          actions: ["openFlashCardModal"],
        },
        CLOSE_FLASH_CARD_MODAL: {
          actions: ["closeFlashCardModal"],
        },
        CHOOSE_LESSON: {
          actions: ["handleChooseLesson"],
        },
        MARK_FOR_PRACTICE: {
          actions: ["handleMarkForPractice", "moveToNextPracticeSetItem"],
          guard: "hasSuperSetPracticeItems",
        },
        MARK_AS_MASTERED: {
          actions: ["handleMarkAsMastered", "moveToNextPracticeSetItem"],
          guard: "hasSuperSetPracticeItems",
        },
        SKIP_ITEM: {
          actions: ["handleSkipItem", "moveToNextPracticeSetItem"],
          guard: "hasSuperSetPracticeItems",
        },
        NEXT_ITEM: {
          actions: "moveToNextPracticeSetItem",
          guard: "hasSuperSetPracticeItems",
        },
        SWITCH_TO_FIRST_PASS: {
          target: "firstPass",
        },
      },
    },
  },
});

export const ReadThaiGameContext = createActorContext(cardSetMachine);
