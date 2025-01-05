import { Lesson, LessonItem, RecallCategory } from "../types/lessons";
import { assign } from "xstate";

export type SuperSetItem = {
  id: string;
  item: LessonItem;
  lastReviewed: Date;
  recallCategory: RecallCategory;
};

export type LessonContext = {
  lessons: Lesson[];
  currentLesson: number;
  superSet: SuperSetItem[];
  practiceSet: SuperSetItem[];
  practiceSetSize: number;
  activeItem: SuperSetItem | null;
  activeItemIndex: number;
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
  | { type: "SWITCH_TO_SPACED" }
  | { type: "SWITCH_TO_TEST" }
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
    currentLessonData: lessonData,
  };
};

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

export const handleMarkForPractice = assign(
  ({ context }: { context: LessonContext }) => {
    let updatedPracticeSet = context.practiceSet;

    if (context.practiceSet.length < context.practiceSetSize) {
      updatedPracticeSet = [...context.practiceSet, context.activeItem].filter(
        (item): item is SuperSetItem => item !== null
      );
    }

    return {
      superSet: updateRecallCategory({
        superSet: context.superSet,
        itemId: context?.activeItem?.id,
        newCategory: "practice",
      }),
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

export const moveToNextItem = assign(
  ({ context }: { context: LessonContext }) => {
    const activeItemIndex =
      (context.activeItemIndex + 1) % context.superSet.length;
    return {
      activeItemIndex,
      activeItem: context.superSet[activeItemIndex],
    };
  }
);
