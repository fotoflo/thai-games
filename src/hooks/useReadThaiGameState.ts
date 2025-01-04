import { useEffect } from "react";
import { useGameSettings } from "./game/useGameSettings";
import { useLessons } from "./game/useLessons";
import { useMachine } from "@xstate/react";
import { lessonMachine } from "../machines/lessonMachine";

export const useReadThaiGameState = () => {
  const gameSettings = useGameSettings();
  const lessonState = useLessons();
  const [state, send] = useMachine(lessonMachine);

  // Self-initialize the lesson machine
  useEffect(() => {
    if (lessonState.lessons && lessonState.lessons.length > 0) {
      send({
        type: "INITIALIZE",
        lessonIndex: 0,
        lessons: lessonState.lessons,
      });
    }
  }, [send, lessonState.lessons]);
  return {
    // Game settings
    ...gameSettings,
    gameState: state,

    // Lesson management
    lessons: lessonState.lessons,
    currentLesson: state,
    setCurrentLesson: lessonState.setCurrentLesson,
    progressionMode: lessonState.progressionMode,
    setProgressionMode: lessonState.setProgressionMode,

    // Working set
    practiceSet: state.context.practiceSet,
    lessonSubset: state.context.lessonSubset,
    activeItem: state.context.activeItem,
    activeItemIndex: state.context.activeItemIndex,

    nextItem: () => send({ type: "NEXT_ITEM" }),
    handleMarkForPractice: () => send({ type: "MARK_FOR_PRACTICE" }),
    handleMarkAsMastered: () => send({ type: "MARK_AS_MASTERED" }),
    handleSkipItem: () => send({ type: "SKIP_ITEM" }),
  };
};
