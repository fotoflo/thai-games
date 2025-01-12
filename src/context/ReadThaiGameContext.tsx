import React, { createContext, useContext, useEffect } from "react";
import { useGameSettings } from "../hooks/game/useGameSettings";
import { useLessons } from "../hooks/game/useLessons";
import { useMachine } from "@xstate/react";
import { cardSetMachine } from "@/machines/cardSetMachine";
import { SuperSetItem, Lesson } from "@/types/lessons";

import { StateFrom } from "xstate";

interface ReadThaiGameContextType {
  // Game settings
  invertTranslation: boolean;
  toggleInvertTranslation: () => void;

  // Game state
  cardSetMachineState: StateFrom<typeof cardSetMachine>;

  lessons: Lesson[];
  currentLesson: Lesson | null;
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
  const [cardSetMachineState, sendToCardSetMachine] =
    useMachine(cardSetMachine);

  // Self-initialize the lesson machine
  useEffect(() => {
    if (lessonState.lessons && lessonState.lessons.length > 0) {
      sendToCardSetMachine({
        type: "INITIALIZE",
        lessonIndex: 0,
        lessons: lessonState.lessons,
      });
    }
  }, [sendToCardSetMachine, lessonState.lessons]);

  const value = {
    // Game settings
    ...gameSettings,
    gameState: cardSetMachineState,
    cardSetMachineState,
    // Lesson management
    lessons: lessonState.lessons,
    lessonsLoading: lessonState.lessonsLoading,
    lessonsError: lessonState.lessonsError,
    currentLesson: lessonState.currentLesson,
    setCurrentLesson: lessonState.setCurrentLesson,

    progressionMode: cardSetMachineState.context.progressionMode,
    handleSwitchToPracticeMode: () =>
      sendToCardSetMachine({ type: "SWITCH_TO_PRACTICE" }),
    handleSwitchToFirstPassMode: () =>
      sendToCardSetMachine({ type: "SWITCH_TO_FIRST_PASS" }),

    superSet: cardSetMachineState.context.superSet,
    practiceSet: cardSetMachineState.context.practiceSet,
    practiceSetSize: cardSetMachineState.context.practiceSetSize,

    activeItem: cardSetMachineState.context.activeItem,
    superSetIndex: cardSetMachineState.context.superSetIndex,
    practiceSetIndex: cardSetMachineState.context.practiceSetIndex,

    nextItem: () => sendToCardSetMachine({ type: "NEXT_ITEM" }),
    handleMarkForPractice: () =>
      sendToCardSetMachine({ type: "MARK_FOR_PRACTICE" }),
    handleMarkAsMastered: () =>
      sendToCardSetMachine({ type: "MARK_AS_MASTERED" }),
    handleSkipItem: () => sendToCardSetMachine({ type: "SKIP_ITEM" }),
  };

  return (
    <ReadThaiGameContext.Provider value={value}>
      {children}
    </ReadThaiGameContext.Provider>
  );
};

export const useReadThaiGame = () => {
  const context = useContext(ReadThaiGameContext);

  if (
    context?.lessons &&
    context?.lessons.length > 0 &&
    context?.currentLesson === -1
  ) {
    context?.setCurrentLesson(0);
  }

  if (!context) {
    throw new Error(
      "useReadThaiGame must be used within a ReadThaiGameProvider"
    );
  }
  return context;
};
