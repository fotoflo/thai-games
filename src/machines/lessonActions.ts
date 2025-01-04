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
  activeItem: SuperSetItem | null;
  activeItemIndex: number;
};

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

const updateRecallCategory = ({
  superSet,
  itemId,
  newCategory,
}: {
  superSet: SuperSetItem[];
  itemId: string;
  newCategory: RecallCategory;
}) => {
  return superSet.map((item) =>
    item.id === itemId ? { ...item, recallCategory: newCategory } : item
  );
};
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
    currentLessonId: event?.lessonIndex,
    lessons: event?.lessons,
    activeItem: superSet?.[activeItemIndex],
    activeItemIndex,
    currentLessonData: lessonData,
  };
};

export const handleMarkForPractice = assign(
  ({ context }: { context: LessonContext }) => {
    return {
      superSet: updateRecallCategory({
        superSet: context.superSet,
        itemId: context?.activeItem?.id || "0",
        newCategory: "practice",
      }),
      practiceSet: [...context.practiceSet, context.activeItem],
    };
  }
);

export const handleMarkAsMastered = assign(
  ({ context }: { context: LessonContext }) => {
    return {
      superSet: updateRecallCategory({
        superSet: context.superSet,
        itemId: context?.activeItem?.id || "0",
        newCategory: "mastered",
      }),
    };
  }
);

export const handleSkipItem = assign(
  ({ context }: { context: LessonContext }) => {
    return {
      superSet: updateRecallCategory({
        superSet: context.superSet,
        itemId: context?.activeItem?.id || "0",
        newCategory: "skipped",
      }),
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
