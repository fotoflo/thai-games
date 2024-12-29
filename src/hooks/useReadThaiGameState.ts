import { useGameSettings } from "./game/useGameSettings";
import { useLessons } from "./game/useLessons";
import { useWorkingSet } from "./game/useWorkingSet";

export const useReadThaiGameState = () => {
  const gameSettings = useGameSettings();
  const lessonState = useLessons();
  const workingSet = useWorkingSet({
    currentLesson: lessonState.currentLesson,
    lessons: lessonState.lessons,
    progressionMode: lessonState.progressionMode,
  });

<<<<<<< Updated upstream
=======
  const useFlashcardMachine = useFlashcardMachine();

  // Handle first pass choices
  const handleFirstPassChoice = useCallback(
    (itemId: string, choice: "skip" | "mastered" | "practice") => {
      // Update lesson state
      lessonState.handleFirstPassChoice(itemId, choice);

      // Update working set state based on choice
      if (choice === "practice") {
        workingSet.markForPractice(itemId);
      } else if (choice === "mastered") {
        workingSet.markAsMastered(itemId);
      } else if (choice === "skip") {
        workingSet.markAsSkipped(itemId);
      }

      // If it's a practice item, add it to the working set
      if (choice === "practice") {
        const item = lessons[lessonState.currentLesson].items.find(
          (i) => i.id === itemId
        );
        if (item && !workingSet.isWorkingSetFull) {
          workingSet.addToWorkingSet([
            {
              id: itemId,
              mastery: 1,
              vocabularyItem: item,
            },
          ]);
        }
      }
    },
    [lessonState, workingSet, lessons]
  );

  // Handle progression mode changes
  const handleProgressionModeChange = useCallback(
    (mode: "firstPass" | "spacedRepetition" | "test") => {
      lessonState.setProgressionMode(mode);

      if (mode === "firstPass") {
        workingSet.loadFirstPassItems();
      } else if (mode === "spacedRepetition") {
        // Refresh working set from practice items
        workingSet.refreshWorkingSet();
      } else if (mode === "test") {
        // Clear working set in test mode
        workingSet.clearWorkingSet();
      }
    },
    [lessonState, workingSet]
  );

>>>>>>> Stashed changes
  return {
    // Game settings
    ...gameSettings,

    // Lesson management
    currentLesson: lessonState.currentLesson,
    setCurrentLesson: lessonState.setCurrentLesson,
    progressionMode: lessonState.progressionMode,
    setProgressionMode: lessonState.setProgressionMode,

    // Working set
    workingSet: workingSet.workingSet,
    activeVocabItem: workingSet.activeVocabItem,
    currentItem: workingSet.currentItem,
    setActiveVocabItem: workingSet.setActiveVocabItem,
    addMoreItems: workingSet.addMoreItems,
    nextItem: workingSet.nextItem,
    handleFirstPassChoice: workingSet.handleFirstPassChoice,

    // Lesson data
    lessons: lessonState.lessons,
    totalLessons: lessonState.totalLessons,

    // Progress tracking
    lessonSubset: workingSet.lessonSubset,
  };
};
