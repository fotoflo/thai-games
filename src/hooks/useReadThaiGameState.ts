import { useCallback } from "react";
import { useGameSettings } from "./game/useGameSettings";
import { useLessons } from "./game/useLessons";
import { useWorkingSet } from "./game/useWorkingSet";
import { useFlashcardMachine } from "./useFlashcardMachine";
import { RecallCategory, CardSource } from "../types/lessons";

export const useReadThaiGameState = () => {
  const gameSettings = useGameSettings();
  const lessonState = useLessons();
  const workingSet = useWorkingSet({
    currentLesson: lessonState.currentLesson,
    lessons: lessonState.lessons,
    progressionMode: lessonState.progressionMode,
  });

  const flashcardMachine = useFlashcardMachine();

  // Handle first pass choices
  const handleFirstPassChoice = useCallback(
    (itemId: string, choice: RecallCategory) => {
      // Update lesson state
      lessonState.handleFirstPassChoice(itemId, choice);

      // Update working set state based on choice
      if (choice === "practice") {
        workingSet.markForPractice(itemId);
      } else if (choice === "mastered") {
        workingSet.markAsMastered(itemId);
      } else if (choice === "skipped") {
        workingSet.markAsSkipped(itemId);
      }

      // If it's a practice item, add it to the working set
      if (choice === "practice") {
        const item = lessonState.lessons[lessonState.currentLesson]?.items.find(
          (i) => i.id === itemId
        );
        if (item && !workingSet.isWorkingSetFull) {
          workingSet.addToWorkingSet([
            {
              id: itemId,
              mastery: 1,
              vocabularyItem: item,
              lastReviewed: new Date(),
            },
          ]);
        }
      }

      // Update game state
      flashcardMachine.updateGameState((draft) => {
        if (!draft.currentLesson) return;
        const card = draft.currentLesson.items.find((i) => i.id === itemId);
        if (!card) return;

        const oldCategory = card.recallCategory;
        card.recallCategory = choice;

        // Update stats based on the transition
        if (choice === "practice") {
          draft.currentLesson.progress.practiceSetIds.push(itemId);
          draft.currentLesson.progress.stats.practice++;
          draft.currentLesson.progress.stats.unseen--;
        } else if (choice === "mastered") {
          // Remove from practice set if it was there
          draft.currentLesson.progress.practiceSetIds =
            draft.currentLesson.progress.practiceSetIds.filter(
              (id) => id !== itemId
            );
          draft.currentLesson.progress.stats.mastered++;

          // Update stats based on previous category
          if (oldCategory === "practice") {
            draft.currentLesson.progress.stats.practice--;
          } else if (oldCategory === "unseen") {
            draft.currentLesson.progress.stats.unseen--;
          }

          card.practiceHistory.push({
            timestamp: Date.now(),
            result: choice,
            timeSpent: 1000,
            recalledSide: 0,
            confidenceLevel: 5,
            isCorrect: true,
            attemptCount: 1,
            sourceCategory:
              oldCategory === "practice"
                ? "practice"
                : ("unseen" as CardSource),
          });
        } else if (choice === "skipped") {
          draft.currentLesson.progress.stats.skipped++;
          draft.currentLesson.progress.stats.unseen--;
        }
      });
    },
    [lessonState, workingSet, flashcardMachine]
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

    // Lesson management
    currentLesson: lessonState.currentLesson,
    setCurrentLesson: lessonState.setCurrentLesson,
    progressionMode: lessonState.progressionMode,
    setProgressionMode: handleProgressionModeChange,

    // Working set
    workingSet: workingSet.workingSet,
    activeVocabItem: workingSet.activeVocabItem,
    currentItem: workingSet.activeVocabItem, // Alias for activeVocabItem
    setActiveVocabItem: (item: typeof workingSet.activeVocabItem) => {
      if (item) {
        workingSet.addToWorkingSet([item]);
      }
    },
    addMoreItems: workingSet.addMoreItems,
    nextItem: workingSet.nextItem,
    handleFirstPassChoice,

    // Lesson data
    lessons: lessonState.lessons,
    totalLessons: lessonState.totalLessons,

    // Progress tracking
    lessonSubset: workingSet.lessonSubset,

    // Game state
    gameState: flashcardMachine.gameState,

    // Update game state
    updateGameState: flashcardMachine.updateGameState,
  };
};
