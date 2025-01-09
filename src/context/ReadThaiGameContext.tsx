import React, { createContext, useContext, useEffect } from "react";
import { useGameSettings } from "../hooks/game/useGameSettings";
import { useLessons } from "../hooks/game/useLessons";
import { useMachine } from "@xstate/react";
import { lessonMachine } from "@/machines/lessonMachine";
import { SuperSetItem } from "@/types/lessons";

interface ReadThaiGameContextType {
  // Game settings
  invertTranslation: boolean;
  toggleInvertTranslation: () => void;

  // Game state
  gameState: any; // We'll type this properly later
  lessons: any[]; // We'll type this properly later
  currentLesson: any; // We'll type this properly later
  setCurrentLesson: (index: number) => void;

  // Progression state
  progressionMode: string;
  handleSwitchToPracticeMode: () => void;
  handleSwitchToFirstPassMode: () => void;

  // Item management
  superSet: SuperSetItem[];
  practiceSet: SuperSetItem[];
  practiceSetSize: number;
  activeItem: SuperSetItem | null;
  superSetIndex: number;
  practiceSetIndex: number;

  // Actions
  nextItem: () => void;
  handleMarkForPractice: () => void;
  handleMarkAsMastered: () => void;
  handleSkipItem: () => void;
}

const ReadThaiGameContext = createContext<ReadThaiGameContextType | null>(null);

export const ReadThaiGameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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

  const value = {
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

  return (
    <ReadThaiGameContext.Provider value={value}>
      {children}
    </ReadThaiGameContext.Provider>
  );
};

export const useReadThaiGame = () => {
  const context = useContext(ReadThaiGameContext);
  if (!context) {
    throw new Error(
      "useReadThaiGame must be used within a ReadThaiGameProvider"
    );
  }
  return context;
};
