import { Lesson, LessonItem, RecallCategory } from "../types/lessons";
import { AnyActor, assign } from "xstate";

export type SuperSetItem = {
  id: string;
  item: LessonItem;
  lastReviewed: Date;
  recallCategory: RecallCategory;
};

export type ProgressionMode =
  | "firstPass"
  | "practice"
  | "test"
  | "initializing";

export type LessonContext = {
  lessons: Lesson[];
  currentLesson: number;
  superSet: SuperSetItem[];
  practiceSet: SuperSetItem[];
  practiceSetSize: number;
  activeItem: SuperSetItem | null;
  activeItemIndex: number;
  practiceSetIndex: number;
  progressionMode: ProgressionMode;
};

const INITIAL_PRACTICE_SET_SIZE = 5;

export type InitializeEvent = {
  type: "INITIALIZE";
  lessonIndex: number;
  lessons: Lesson[];
};

export type LessonEvent =
  | InitializeEvent
  | { type: "MARK_FOR_PRACTICE" }
  | { type: "MARK_AS_MASTERED" }
  | { type: "SKIP_ITEM" }
  | { type: "NEXT_ITEM" }
  | { type: "SWITCH_TO_PRACTICE" }
  | { type: "SWITCH_TO_TEST" }
  | { type: "SWITCH_TO_FIRST_PASS" }
  | { type: "COMPLETE_TEST" };

const createSuperSetItem = (item: LessonItem): SuperSetItem => ({
  id: item.id,
  item,
  lastReviewed: new Date(),
  recallCategory: "unseen" as RecallCategory,
});

// Action Functions
export const initialize = ({
  context,
  event,
}: {
  context: LessonContext;
  event: InitializeEvent;
}) => {
  const lessonData = event?.lessons?.[event?.lessonIndex];
  const activeItemIndex = 0;

  const superSet = lessonData?.items.map(createSuperSetItem);
  const practiceSet = [] as SuperSetItem[];

  return {
    ...context,
    lessonData,
    superSet,
    practiceSet,
    practiceSetSize: INITIAL_PRACTICE_SET_SIZE,
    currentLessonId: event?.lessonIndex,
    lessons: event?.lessons,
    activeItem: superSet?.[activeItemIndex],
    activeItemIndex,
    practiceSetIndex: 0,
    currentLessonData: lessonData,
    progressionMode: "firstPass",
  };
};

export const enterSwitchToPractice = assign(
  ({ context }: { context: LessonContext }) => {
    return {
      progressionMode: "practice",
    };
  }
);

export const enterSwitchToFirstPass = assign((context: LessonContext) => ({
  progressionMode: "firstPass",
  // activeItem: context?.superSet?.[context?.activeItemIndex || 0],
}));

export const enterSwitchToTest = assign((context: LessonContext) => ({
  progressionMode: "test",
}));

const updateRecallCategory = ({
  superSet,
  itemId,
  newCategory,
}: {
  superSet: SuperSetItem[];
  itemId: string | undefined;
  newCategory: RecallCategory;
}) => {
  if (!itemId) {
    return superSet;
  }

  return superSet.map((item) =>
    item.id === itemId ? { ...item, recallCategory: newCategory } : item
  );
};

const updateActiveItemRecallCategory = (
  context: LessonContext,
  recallCategory: RecallCategory
) => {
  if (!context.activeItem) {
    return context.superSet;
  }

  return context.superSet.map((item) =>
    item.id === context.activeItem?.item.id ? { ...item, recallCategory } : item
  );
};

const addActiveItemToPracticeSet = (context: LessonContext) => {
  if (!context.activeItem) {
    return context.practiceSet;
  }

  return [...context.practiceSet, context.activeItem];
};

const practiceSetIsFull = (context: LessonContext) => {
  return context.practiceSet.length < context.practiceSetSize;
};

export const handleMarkForPractice = assign(
  ({ context, event }: { context: LessonContext; event: LessonEvent }) => {
    let updatedPracticeSet = context.practiceSet;

    if (practiceSetIsFull(context)) {
      updatedPracticeSet = addActiveItemToPracticeSet(context);
    }

    return {
      superSet: updateActiveItemRecallCategory(context, "practice"),
      practiceSet: updatedPracticeSet,
    };
  }
);

const removeFromPracticeSet = (
  practiceSet: SuperSetItem[],
  itemId: string | undefined
) => {
  if (!itemId) {
    return practiceSet;
  }
  return practiceSet.filter((item) => item.id !== itemId);
};

export const handleMarkAsMastered = assign(
  ({ context }: { context: LessonContext }) => {
    const updatedPracticeSet = removeFromPracticeSet(
      context.practiceSet,
      context.activeItem?.id
    );

    return {
      superSet: updateRecallCategory({
        superSet: context.superSet,
        itemId: context?.activeItem?.id,
        newCategory: "mastered",
      }),
      practiceSet: updatedPracticeSet,
    };
  }
);

export const handleSkipItem = assign(
  ({ context }: { context: LessonContext }) => {
    const updatedPracticeSet = removeFromPracticeSet(
      context.practiceSet,
      context.activeItem?.id
    );

    return {
      superSet: updateRecallCategory({
        superSet: context.superSet,
        itemId: context?.activeItem?.id,
        newCategory: "skipped",
      }),
      practiceSet: updatedPracticeSet,
    };
  }
);

export const moveToNextSuperSetItem = assign(
  ({ context, self }: { context: LessonContext; self: AnyActor }) => {
    // debugger;
    // const context = fullContext.context;
    // const self = fullContext.self;

    const activeItemIndex =
      (context.activeItemIndex + 1) % context.superSet.length;

    // Check if we have gone through all items
    const allItemsProcessed = activeItemIndex === 0; // If we wrap around, we have processed all items

    // Send event if all items are processed
    if (allItemsProcessed) {
      self.send({ type: "ALL_ITEMS_PROCESSED" });
    }

    return {
      activeItemIndex,
      activeItem: context.superSet[activeItemIndex],
    };
  }
);

export const moveToNextPracticeSetItem = assign(({ context }) => {
  const nextIndex = (context.practiceSetIndex + 1) % context.practiceSet.length;

  return {
    practiceSetIndex: nextIndex,
    activeItem: context.practiceSet[nextIndex],
  };
});

export const hasPracticeItems = ({ context }: { context: LessonContext }) => {
  console.log("hasPracticeItems", context?.practiceSet?.length > 0);
  return context?.practiceSet?.length > 0;
};
