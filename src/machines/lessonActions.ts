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
  superSet: SuperSetItem[];
  practiceSet: SuperSetItem[];
  practiceSetSize: number;
  activeItem: SuperSetItem | null;
  activeItemIndex: number;
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
    currentLessonData: lessonData,
    progressionMode: "firstPass",
  };
};

export const enterSwitchToPractice = assign(
  ({ context }: { context: LessonContext }) => {
    console.log("enterSwitchToPractice");
    return {
      progressionMode: "practice",
    };
  }
);

export const switchToFirstPass = assign((context: LessonContext) => ({
  // progressionMode: "firstPass",
}));

export const switchToTest = assign((context: LessonContext) => ({
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

export const handleMarkForPractice = assign(
  ({ context, event }: { context: LessonContext; event: LessonEvent }) => {
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

export const moveToNextSuperSetItem = assign(
  ({ context }: { context: LessonContext }) => {
    console.log("nextSuperSetItem");
    const activeItemIndex =
      (context.activeItemIndex + 1) % context.superSet.length;
    return {
      activeItemIndex,
      activeItem: context.superSet[activeItemIndex],
    };
  }
);

export const moveToNextPracticeSetItem = assign(
  ({ context }: { context: LessonContext }) => {
    console.log("nextPracticeItem"); // not firing
    const activeItemIndex =
      (context.activeItemIndex + 1) % context.practiceSet.length;
    return {
      activeItemIndex,
      activeItem: context.practiceSet[activeItemIndex],
    };
  }
);

export const hasPracticeItems = ({ context }: { context: LessonContext }) => {
  console.log("hasPracticeItems", context?.practiceSet?.length > 0);
  return context?.practiceSet?.length > 0;
};
