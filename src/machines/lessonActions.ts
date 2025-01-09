import { Lesson, LessonItem, RecallCategory } from "../types/lessons";
import { assign } from "xstate";

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
  activeItem: SuperSetItem | null;

  superSet: SuperSetItem[];
  superSetIndex: number;

  practiceSet: SuperSetItem[];
  practiceSetSize: number;
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
  | { type: "SWITCH_TO_FIRST_PASS" };

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
  const superSetIndex = 0;

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
    activeItem: superSet?.[superSetIndex],
    superSetIndex,
    practiceSetIndex: 0,
    currentLessonData: lessonData,
    progressionMode: "firstPass",
  };
};

///METHODS

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

  // check if the item is already in the practice set
  const isInPracticeSet = context.practiceSet.some(
    (item) => item.id === context.activeItem?.id
  );

  if (isInPracticeSet) {
    return context.practiceSet;
  }

  return [...context.practiceSet, context.activeItem];
};

const removeFromPracticeSet = (
  practiceSet: SuperSetItem[],
  itemId: string | undefined
) => {
  if (!itemId) {
    return practiceSet;
  }
  return practiceSet.filter((item) => item.id !== itemId);
};

const getNextPracticeItem = (context: LessonContext): SuperSetItem | null => {
  if (!context.superSet) return null;

  // Find items marked for practice that aren't in the practice set
  const practiceItems = context.superSet.filter(
    (item) =>
      item.recallCategory === "practice" &&
      !context.practiceSet.some((practiceItem) => practiceItem.id === item.id)
  );

  return practiceItems[0] || null;
};

/// ASSIGNED FUNCTIONS

export const handleMarkForPractice = assign(
  ({ context }: { context: LessonContext }) => {
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

export const enterSwitchToPractice = assign({
  progressionMode: "practice" as const,
});

export const enterSwitchToFirstPass = assign({
  progressionMode: "firstPass" as const,
});

export const enterSwitchToTest = assign({
  progressionMode: "test" as const,
});

export const handleMarkAsMastered = assign(
  ({ context }: { context: LessonContext }) => {
    // Remove the current item from practice set
    const updatedPracticeSet = removeFromPracticeSet(
      context.practiceSet,
      context.activeItem?.id
    );

    // Try to get the next practice item to add
    const nextPracticeItem = getNextPracticeItem(context);
    const finalPracticeSet = nextPracticeItem
      ? [...updatedPracticeSet, nextPracticeItem]
      : updatedPracticeSet;

    return {
      superSet: updateRecallCategory({
        superSet: context.superSet,
        itemId: context?.activeItem?.id,
        newCategory: "mastered",
      }),
      practiceSet: finalPracticeSet,
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

export const moveToNextSuperSetItem = assign(({ context }) => {
  const superSetIndex = (context.superSetIndex + 1) % context.superSet.length;

  return {
    superSetIndex,
    activeItem: context.superSet[superSetIndex],
  };
});

export const moveToNextPracticeSetItem = assign(({ context }) => {
  if (!context.practiceSet.length) {
    return {
      practiceSetIndex: 0,
      superSetIndex: 0,
      activeItem: context.superSet[0],
    };
  }

  const nextPracticeSetIndex =
    (context.practiceSetIndex + 1) % context.practiceSet.length;

  const superSetIndex = context.superSet.findIndex(
    (item: SuperSetItem) =>
      item.id === context.practiceSet[nextPracticeSetIndex]?.id
  );

  return {
    practiceSetIndex: nextPracticeSetIndex,
    superSetIndex,
    activeItem: context.superSet[superSetIndex],
  };
});

/// GUARDS

const practiceSetIsFull = (context: LessonContext) => {
  return context.practiceSet.length < context.practiceSetSize;
};

export const practiceSetIsEmpty = ({ context }: { context: LessonContext }) => {
  if (!context || !context.practiceSet) return true;
  return context.practiceSet.length === 0;
};

export const hasPracticeSetPracticeItems = ({
  context,
}: {
  context: LessonContext;
}) => {
  debugger;
  if (!context || !context.practiceSet) return false;
  return context.practiceSet.length > 0;
};

export const hasSuperSetPracticeItems = ({
  context,
}: {
  context: LessonContext;
}) => {
  if (!context || !context.superSet) return false;
  const superSetPracticeItems = context.superSet.filter(
    (item) => item.recallCategory === "practice"
  );
  return superSetPracticeItems.length > 0;
};

export const allItemsMastered = ({ context }: { context: LessonContext }) => {
  if (!context || !context.superSet) return false;
  return context.superSet.every((item) => item.recallCategory === "mastered");
};

export const allItemsSeen = ({ context }: { context: LessonContext }) => {
  if (!context || !context.superSet) return false;
  return context.superSet.every((item) => item.recallCategory !== "unseen");
};
