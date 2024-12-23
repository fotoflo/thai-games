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
