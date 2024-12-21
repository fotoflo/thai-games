import { useCallback } from "react";
import { WorkingSetItem, Lesson } from "../types/lessons";
import { lessons } from "../lessons/LessonLoader";
import { useGameSettings } from "./game/useGameSettings";
import { useLessonState } from "./game/useLessonState";
import { useWorkingSet } from "./game/useWorkingSet";

export const useReadThaiGameState = () => {
  const gameSettings = useGameSettings();
  const lessonState = useLessonState(lessons);
  const workingSet = useWorkingSet({
    currentLesson: lessonState.currentLesson,
    lessons,
    progressionMode: lessonState.progressionMode,
  });

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

  return {
    // Game settings
    ...gameSettings,

    // Lesson state
    currentLesson: lessonState.currentLesson,
    setCurrentLesson: lessonState.setCurrentLesson,
    progressionMode: lessonState.progressionMode,
    setProgressionMode: handleProgressionModeChange,
    lessonStates: lessonState.lessonStates,

    // Working set
    workingSet: workingSet.workingSet,
    activeVocabItem: workingSet.activeVocabItem,
    currentItem: workingSet.currentItem,
    setActiveVocabItem: workingSet.setActiveVocabItem,
    addMoreItems: workingSet.addMoreItems,
    nextItem: workingSet.nextItem,

    // Combined operations
    handleFirstPassChoice,

    // Progress tracking
    lessonProgress: lessonState.getLessonProgress(lessonState.currentLesson),
    lessonSubset: workingSet.lessonSubset,

    // Lesson data
    lessons,
    totalLessons: lessons.length,
  };
};
