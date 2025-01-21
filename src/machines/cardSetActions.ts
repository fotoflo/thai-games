import { assign } from "xstate";
import { LessonItem, RecallCategory, SuperSetItem } from "@/types/lessons";
import { LessonWithRelations } from "@/services/lessonService";

export interface CardSetContext {
  lessons: LessonWithRelations[];
  progressionMode: "initializing" | "firstPass" | "practice" | "test";
  superSet: SuperSetItem[];
  practiceSet: SuperSetItem[];
  practiceSetSize: number;
  practiceSetIndex: number;
  activeItem: SuperSetItem | null;
  currentLesson: number;
  superSetIndex: number;
  error: string | null;
  invertCard: boolean;
  FlashCardModalOpen: boolean;
}

export type ChooseLessonEvent = {
  lessonIndex: number;
  lessons: LessonWithRelations[];
};

export type CardSetEvent =
  | { type: "OPEN_FLASH_CARD_MODAL" }
  | { type: "CLOSE_FLASH_CARD_MODAL" }
  | { type: "INITIALIZE"; lessons: LessonWithRelations[] }
  | { type: "CHOOSE_LESSON"; chooseLessonEvent: ChooseLessonEvent }
  | { type: "MARK_FOR_PRACTICE" }
  | { type: "MARK_AS_MASTERED" }
  | { type: "SKIP_ITEM" }
  | { type: "NEXT_ITEM" }
  | { type: "SWITCH_TO_PRACTICE" }
  | { type: "SWITCH_TO_FIRST_PASS" }
  | { type: "SWITCH_TO_TEST" }
  | { type: "CHOOSE_LESSON"; chooseLessonEvent: ChooseLessonEvent };

export const INITIAL_PRACTICE_SET_SIZE = 5;

export type LessonEvent =
  | ChooseLessonEvent
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
  recallCategory: "unseen",
});

// Action Functions
export const initializeWithLoadedLessons = assign(({ event }) => {
  const superSet = event.lessons[0].items.map(createSuperSetItem);

  return {
    superSet,
    lessons: event.lessons,
    practiceSet: [] as SuperSetItem[],
    superSetIndex: 0,
    practiceSetIndex: 0,
    activeItem: superSet[0],
    progressionMode: "firstPass",
  };
});

const updateRecallCategory = ({
  superSet,
  itemId,
  newCategory,
}: {
  superSet: SuperSetItem[];
  itemId: string | undefined;
  newCategory: string;
}) => {
  if (!itemId) {
    return superSet;
  }

  return superSet.map((item) =>
    item.id === itemId ? { ...item, recallCategory: newCategory } : item
  );
};

const updateActiveItemRecallCategory = (
  context: CardSetContext,
  recallCategory: RecallCategory
) => {
  if (!context.activeItem) {
    return context.superSet;
  }

  return context.superSet.map((item) =>
    item.id === context.activeItem?.item.id ? { ...item, recallCategory } : item
  );
};

const addActiveItemToPracticeSet = (context: CardSetContext) => {
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

const getNextPracticeItem = (context: CardSetContext): SuperSetItem | null => {
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
  ({ context }: { context: CardSetContext }) => {
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

export const enterSwitchToPractice = assign(({}) => {
  return {
    progressionMode: "practice" as const,
  };
});

export const enterSwitchToFirstPass = assign(({}) => {
  return {
    progressionMode: "firstPass" as const,
  };
});

export const enterSwitchToTest = assign({
  progressionMode: "test" as const,
});

export const handleChooseLesson = assign(
  ({
    context,
    event,
  }: {
    context: CardSetContext;
    event: ChooseLessonEvent;
  }) => {
    console.log("log chooseLesson", event);
    const lessonData = event?.lessons?.[event?.lessonIndex];
    const superSet = lessonData?.items.map(createSuperSetItem);
    const lessons = event?.lessons;
    const currentLesson = lessons[event.lessonIndex];
    console.log("log chooseLesson currentLesson", currentLesson);

    const currentLessonId = currentLesson?.id;
    const activeItem = superSet?.[0];
    const superSetIndex = 0;

    return {
      ...context,
      lessonData,
      superSet,
      lessons,
      currentLesson,
      currentLessonId,
      activeItem,
      superSetIndex,
    };
  }
);

export const openFlashCardModal = assign({
  FlashCardModalOpen: () => true,
});

export const closeFlashCardModal = assign({
  FlashCardModalOpen: () => false,
});

export const handleMarkAsMastered = assign(
  ({ context }: { context: CardSetContext }) => {
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
  ({ context }: { context: CardSetContext }) => {
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

const practiceSetIsFull = (context: CardSetContext) => {
  return context.practiceSet.length < context.practiceSetSize;
};

export const practiceSetIsEmpty = ({
  context,
}: {
  context: CardSetContext;
}) => {
  if (!context || !context.practiceSet) return true;
  return context.practiceSet.length === 0;
};

export const hasPracticeSetPracticeItems = ({
  context,
}: {
  context: CardSetContext;
}) => {
  if (!context || !context.practiceSet) return false;
  return context.practiceSet.length > 0;
};

export const hasSuperSetPracticeItems = ({
  context,
}: {
  context: CardSetContext;
}) => {
  if (!context || !context.superSet) return false;
  const superSetPracticeItems = context.superSet.filter(
    (item) => item.recallCategory === "practice"
  );
  return superSetPracticeItems.length > 0;
};

export const allItemsMastered = ({ context }: { context: CardSetContext }) => {
  if (!context || !context.superSet || !context.superSet.length) return false;
  return context.superSet.every((item) => item.recallCategory === "mastered");
};

export const allItemsSeen = ({ context }: { context: CardSetContext }) => {
  if (!context || !context.superSet || !context.superSet.length) return false;
  return context.superSet.every((item) => item.recallCategory !== "unseen");
};
