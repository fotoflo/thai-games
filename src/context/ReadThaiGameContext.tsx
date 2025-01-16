// import React, { createContext, useContext, useEffect } from "react";
// import { useGameSettings } from "../hooks/game/useGameSettings";
// import { useLessons } from "../hooks/game/useLessons";
// import { useMachine } from "@xstate/react";
// import { cardSetMachine } from "@/machines/cardSetMachine";
// import { SuperSetItem, Lesson } from "@/types/lessons";

// import { StateFrom } from "xstate";

// interface ReadThaiGameContextType {
//   // Game settings
//   invertTranslation: boolean;
//   toggleInvertTranslation: () => void;

//   // Game state
//   cardSetMachineState: StateFrom<typeof cardSetMachine>;

//   lessons: Lesson[];
//   currentLesson: Lesson | null;
//   setCurrentLesson: (index: number) => void;

//   // Progression state
//   progressionMode: string;
//   handleSwitchToPracticeMode: () => void;
//   handleSwitchToFirstPassMode: () => void;

//   // Item management
//   superSet: SuperSetItem[];
//   practiceSet: SuperSetItem[];
//   practiceSetSize: number;
//   activeItem: SuperSetItem | null;
//   superSetIndex: number;
//   practiceSetIndex: number;

//   // Actions
//   nextItem: () => void;
//   handleMarkForPractice: () => void;
//   handleMarkAsMastered: () => void;
//   handleSkipItem: () => void;

//   // Lessons state
//   lessonsLoading: boolean;
//   lessonsError: string | null;
//   invalidateLessons: () => void;
// }

// const ReadThaiGameContext = createContext<ReadThaiGameContextType | null>(null);

// export const ReadThaiGameProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const gameSettings = useGameSettings();
//   const {
//     currentLesson,
//     setCurrentLesson,
//     progressionMode,
//     setProgressionMode,
//     lessons,
//     lessonsLoading,
//     lessonsError,
//     invalidateLessons,
//   } = useLessons();
//   const [cardSetMachineState, sendToCardSetMachine] =
//     useMachine(cardSetMachine);

//   // Self-initialize the lesson machine
//   useEffect(() => {
//     if (lessons && lessons.length > 0) {
//       sendToCardSetMachine({
//         type: "INITIALIZE",
//         lessonIndex: 0,
//         lessons: lessons,
//       });
//     }
//   }, [sendToCardSetMachine, lessons]);

//   const value = {
//     // Game settings
//     ...gameSettings,
//     gameState: cardSetMachineState,
//     cardSetMachineState,
//     // Lesson management
//     lessons,
//     lessonsLoading,
//     lessonsError,
//     currentLesson,
//     setCurrentLesson,

//     sendToCardSetMachine,
//     progressionMode,
//     handleSwitchToPracticeMode: () =>
//       sendToCardSetMachine({ type: "SWITCH_TO_PRACTICE" }),
//     handleSwitchToFirstPassMode: () =>
//       sendToCardSetMachine({ type: "SWITCH_TO_FIRST_PASS" }),

//     superSet: cardSetMachineState.context.superSet,
//     practiceSet: cardSetMachineState.context.practiceSet,
//     practiceSetSize: cardSetMachineState.context.practiceSetSize,

//     activeItem: cardSetMachineState.context.activeItem,
//     superSetIndex: cardSetMachineState.context.superSetIndex,
//     practiceSetIndex: cardSetMachineState.context.practiceSetIndex,

//     nextItem: () => sendToCardSetMachine({ type: "NEXT_ITEM" }),
//     handleMarkForPractice: () =>
//       sendToCardSetMachine({ type: "MARK_FOR_PRACTICE" }),
//     handleMarkAsMastered: () =>
//       sendToCardSetMachine({ type: "MARK_AS_MASTERED" }),
//     handleSkipItem: () => sendToCardSetMachine({ type: "SKIP_ITEM" }),

//     invalidateLessons,
//   };

//   return (
//     <ReadThaiGameContext.Provider value={value}>
//       {children}
//     </ReadThaiGameContext.Provider>
//   );
// };

// export const useReadThaiGame = () => {
//   const context = useContext(ReadThaiGameContext);

//   if (!context) {
//     throw new Error(
//       "useReadThaiGame must be used within a ReadThaiGameProvider"
//     );
//   }

//   useEffect(() => {
//     if (
//       context.lessons &&
//       context.lessons.length > 0 &&
//       context.currentLesson === -1
//     ) {
//       context.setCurrentLesson(0);
//     }
//   }, [context.lessons, context.currentLesson]);

//   return context;
// };
