import { useLessons } from "@/hooks/game/useLessons";
import { Lesson, LessonItem, RecallCategory } from "../types/lessons";
import { assign } from "xstate";

export type LessonSubset = {
  unseenItems: string[];
  practiceItems: string[];
  masteredItems: string[];
  skippedItems: string[];
};

export type PracticeSetItem = {
  id: string;
  item: LessonItem;
  lastReviewed: Date;
  recallCategory: RecallCategory;
};

export type LessonContext = {
  lessons: Lesson[];
  currentLesson: number;
  practiceSet: PracticeSetItem[];
  lessonSubset: LessonSubset;
  activeItem: PracticeSetItem | null;
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

const createPracticeSetItem = (item: LessonItem): PracticeSetItem => ({
  id: item.id,
  item,
  lastReviewed: new Date(),
  recallCategory: "unseen" as RecallCategory,
});

const updateRecallCategory = ({
  practiceSet,
  itemId,
  newCategory,
}: {
  practiceSet: PracticeSetItem[];
  itemId: string;
  newCategory: RecallCategory;
}) => {
  return practiceSet.map((item) =>
    item.id === itemId ? { ...item, recallCategory: newCategory } : item
  );
};

const getActiveItem = (practiceSet: PracticeSetItem[]) => {
  return practiceSet.find((item) => item.recallCategory === "active");
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

  const practiceSet = lessonData?.items.map(createPracticeSetItem);

  return {
    ...context,
    lessonData,
    practiceSet,
    currentLessonId: event?.lessonIndex,
    lessons: event?.lessons,
    activeItem: practiceSet?.[activeItemIndex],
    activeItemIndex,
    currentLessonData: lessonData,
  };
};

export const handleMarkForPractice = assign(
  ({ context }: { context: LessonContext }) => {
    return {
      practiceSet: updateRecallCategory({
        practiceSet: context.practiceSet,
        itemId: context?.activeItem?.id || "0",
        newCategory: "practice",
      }),
    };
  }
);

export const handleMarkAsMastered = assign(
  ({ context }: { context: LessonContext }) => {
    return {
      practiceSet: updateRecallCategory({
        practiceSet: context.practiceSet,
        itemId: context?.activeItem?.id || "0",
        newCategory: "mastered",
      }),
    };
  }
);

export const handleSkipItem = assign(
  ({ context }: { context: LessonContext }) => {
    return {
      practiceSet: updateRecallCategory({
        practiceSet: context.practiceSet,
        itemId: context?.activeItem?.id || "0",
        newCategory: "skipped",
      }),
    };
  }
);

export const moveToNextItem = assign(
  ({ context }: { context: LessonContext }) => {
    return {
      activeItemIndex: context.activeItemIndex + 1,
      activeItem: context.practiceSet[context.activeItemIndex + 1],
    };
  }
);

// export const hasPracticeItems = (context: LessonContext): boolean => {
//   return context.lessonSubset.practiceItems.length > 0;
// };

export const cyclePracticeSet = assign<LessonContext>(({ context }) => {
  const nextIndex = (context.activeItemIndex + 1) % context.practiceSet.length;
  return {
    activeItemIndex: nextIndex,
    activeItem: context.practiceSet[nextIndex],
  };
});
