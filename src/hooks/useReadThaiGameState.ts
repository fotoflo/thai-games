import { useEffect } from "react";
import { useGameSettings } from "./game/useGameSettings";
import { useLessons } from "./game/useLessons";
import { useMachine } from "@xstate/react";
import { lessonMachine } from "@/machines/lessonMachine";

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

    progressionMode: state.context.progressionMode,
    handleSwitchToPracticeMode: () => send({ type: "SWITCH_TO_PRACTICE" }),
    handleSwitchToFirstPassMode: () => send({ type: "SWITCH_TO_FIRST_PASS" }),

    superSet: state.context.superSet,
    practiceSet: state.context.practiceSet,
    practiceSetSize: state.context.practiceSetSize,

    activeItem: state.context.activeItem,
    superSetIndex: state.context.superSetIndex,
    practiceSetIndex: state.context.practiceSetIndex,

    nextItem: () => send({ type: "NEXT_ITEM" }),
    handleMarkForPractice: () => send({ type: "MARK_FOR_PRACTICE" }),
    handleMarkAsMastered: () => send({ type: "MARK_AS_MASTERED" }),
    handleSkipItem: () => send({ type: "SKIP_ITEM" }),
  };
};
