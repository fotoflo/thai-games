import { ReadThaiGameContext } from "@/machines/cardSetMachine";
import { LessonWithRelations } from "@/services/lessonService";

// Dedicated hook for all actions
export const useGameActions = () => {
  const { send: sendReadThaiGameContext } = ReadThaiGameContext.useActorRef();

  return {
    sendReadThaiGameContext,
    // Navigation
    nextItem: () => sendReadThaiGameContext({ type: "NEXT_ITEM" }),

    // Item status
    markForPractice: () =>
      sendReadThaiGameContext({ type: "MARK_FOR_PRACTICE" }),
    markAsMastered: () => sendReadThaiGameContext({ type: "MARK_AS_MASTERED" }),
    skipItem: () => sendReadThaiGameContext({ type: "SKIP_ITEM" }),

    // Mode switching
    switchToPractice: () =>
      sendReadThaiGameContext({ type: "SWITCH_TO_PRACTICE" }),
    switchToFirstPass: () =>
      sendReadThaiGameContext({ type: "SWITCH_TO_FIRST_PASS" }),
    switchToTest: () => sendReadThaiGameContext({ type: "SWITCH_TO_TEST" }),

    // Lesson management
    chooseLesson: (lessonIndex: number, lessons: LessonWithRelations[]) =>
      sendReadThaiGameContext({
        type: "CHOOSE_LESSON",
        chooseLessonEvent: { lessonIndex, lessons },
      }),

    // Initialization
    initializeLessons: (lessons: LessonWithRelations[]) =>
      sendReadThaiGameContext({ type: "INITIALIZE", lessons }),
  };
};

// State-only hooks
export const useSuperSet = () => {
  const { send: sendReadThaiGameContext } = ReadThaiGameContext.useActorRef();
  const state = ReadThaiGameContext.useSelector(({ context }) => ({
    superSet: context.superSet,
    superSetIndex: context.superSetIndex,
  }));

  return {
    ...state,
    sendReadThaiGameContext,
  };
};

export const usePracticeSet = () => {
  const { send: sendReadThaiGameContext } = ReadThaiGameContext.useActorRef();
  const state = ReadThaiGameContext.useSelector(({ context }) => ({
    practiceSet: context.practiceSet,
    practiceSetIndex: context.practiceSetIndex,
  }));

  return {
    ...state,
    sendReadThaiGameContext,
  };
};

export const useActiveItem = () => {
  const { send: sendReadThaiGameContext } = ReadThaiGameContext.useActorRef();
  const activeItem = ReadThaiGameContext.useSelector(
    ({ context }) => context.activeItem
  );

  return {
    activeItem,
    sendReadThaiGameContext,
  };
};

export const useGameMode = () => {
  const { send: sendReadThaiGameContext } = ReadThaiGameContext.useActorRef();
  const state = ReadThaiGameContext.useSelector(({ context }) => ({
    progressionMode: context.progressionMode,
  }));

  return {
    ...state,
    sendReadThaiGameContext,
  };
};

export const useGameLessons = () => {
  const { send: sendReadThaiGameContext } = ReadThaiGameContext.useActorRef();
  const state = ReadThaiGameContext.useSelector(({ context }) => ({
    lessons: context.lessons,
    currentLesson: context.currentLesson,
  }));

  return {
    ...state,
    sendReadThaiGameContext,
  };
};

export const useCardDisplay = () => {
  const { send: sendReadThaiGameContext } = ReadThaiGameContext.useActorRef();
  const state = ReadThaiGameContext.useSelector(({ context }) => ({
    invertCard: context.invertCard,
  }));

  return {
    ...state,
    sendReadThaiGameContext,
  };
};

// Legacy hook for backward compatibility
// Consider migrating away from this in favor of the more specific hooks above
export const useReadThaiGame = () => {
  const { send: sendReadThaiGameContext } = ReadThaiGameContext.useActorRef();
  const state = ReadThaiGameContext.useSelector(({ context }) => ({
    superSet: context.superSet,
    practiceSet: context.practiceSet,
    activeItem: context.activeItem,
    superSetIndex: context.superSetIndex,
    practiceSetIndex: context.practiceSetIndex,
    progressionMode: context.progressionMode,
    currentLesson: context.currentLesson,
    invertCard: context.invertCard,
  }));

  return {
    ...state,
    sendReadThaiGameContext,
  };
};

// Re-export the context for provider usage
export { ReadThaiGameContext };
