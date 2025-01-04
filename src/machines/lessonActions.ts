import { useLessons } from "@/hooks/game/useLessons";
import { Lesson, LessonItem, RecallCategory } from "../types/lessons";
import { assign } from "xstate";

export type LessonSubset = {
  unseenItems: string[];
  practiceItems: string[];
  masteredItems: string[];
  skippedItems: string[];
};

export type WorkingSetItem = {
  id: string;
  lessonItem: LessonItem;
  lastReviewed: Date;
  recallCategory: RecallCategory;
};

export type LessonContext = {
  lessons: Lesson[];
  currentLesson: number;
  workingSet: WorkingSetItem[];
  lessonSubset: LessonSubset;
  activeItem: WorkingSetItem | null;
  currentIndex: number;
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

// Helper Functions
const moveItemToCategory = (
  context: LessonContext,
  itemId: string,
  targetCategory: keyof LessonSubset
): LessonSubset => {
  const newSubset = { ...context.lessonSubset };
  Object.keys(newSubset).forEach((key) => {
    newSubset[key as keyof LessonSubset] = newSubset[
      key as keyof LessonSubset
    ].filter((id) => id !== itemId);
  });
  newSubset[targetCategory].push(itemId);
  return newSubset;
};

const createWorkingSetItem = (item: LessonItem): WorkingSetItem => ({
  id: item.id,
  lessonItem: item,
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
  // if (!lesson?.items.length) {
  return {
    ...context,
    currentLessonId: event?.lessonIndex,
    lessons: event?.lessons,
    workingSet: [],
    lessonSubset: {
      unseenItems: [],
      practiceItems: [],
      masteredItems: [],
      skippedItems: [],
    },
    activeItem: null,
    currentIndex: 0,
    currentLessonData: lessonData,
  };
  // }

  const practiceItems = lesson.items.filter(
    (item) => item.recallCategory === "practice"
  );

  const practiceSet = practiceItems.map(createWorkingSetItem);

  return {
    currentLesson: event.lessonIndex,
    lessons: event.lessons,
    workingSet: practiceSet,
    lessonSubset: {
      unseenItems: [],
      practiceItems: practiceItems.map((item) => item.id),
      masteredItems: [],
      skippedItems: [],
    },
    activeItem: practiceSet[0] || null,
    currentIndex: 0,
  };
};

export const handleMarkForPractice = assign((context: LessonContext) => ({
  lessonSubset: context.activeItem
    ? moveItemToCategory(context, context.activeItem.id, "practiceItems")
    : context.lessonSubset,
}));

export const handleMarkAsMastered = assign((context: LessonContext) => ({
  lessonSubset: context.activeItem
    ? moveItemToCategory(context, context.activeItem.id, "masteredItems")
    : context.lessonSubset,
}));

export const handleSkipItem = assign((context: LessonContext) => ({
  lessonSubset: context.activeItem
    ? moveItemToCategory(context, context.activeItem.id, "skippedItems")
    : context.lessonSubset,
}));

export const moveToNextItem = assign((context: LessonContext) => {
  const nextUnseenId = context.lessonSubset.unseenItems[0];
  if (!nextUnseenId) return { activeItem: null };

  const lesson = context.lessons[context.currentLesson];
  const nextItem = lesson.items.find(
    (item: LessonItem) => item.id === nextUnseenId
  );
  if (!nextItem) return { activeItem: null };

  return {
    activeItem: createWorkingSetItem(nextItem),
  };
});

export const hasPracticeItems = (context: LessonContext): boolean => {
  return context.lessonSubset.practiceItems.length > 0;
};

export const cyclePracticeSet = assign<LessonContext>((context) => {
  const nextIndex = (context.currentIndex + 1) % context.workingSet.length;
  return {
    currentIndex: nextIndex,
    activeItem: context.workingSet[nextIndex],
  };
});
