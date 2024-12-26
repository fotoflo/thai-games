import { useGameSettings } from "./game/useGameSettings";
import { useLessons } from "./game/useLessons";
import { useWorkingSet } from "./game/useWorkingSet";

export const useReadThaiGameState = () => {
  const gameSettings = useGameSettings();
  const lessonState = useLessons();

  const workingSet = useWorkingSet();

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
    setActiveVocabItem: workingSet.setActiveVocabItem,
    addToWorkingSet: workingSet.addToWorkingSet,
    removeFromWorkingSet: workingSet.removeFromWorkingSet,
    clearWorkingSet: workingSet.clearWorkingSet,
    loadFirstPassItems: workingSet.loadFirstPassItems,

    // Lesson data
    lessons: lessonState.lessons,
    totalLessons: lessonState.totalLessons,

    // Progress tracking
    lessonSubset: workingSet.lessonSubset,
  };
};
