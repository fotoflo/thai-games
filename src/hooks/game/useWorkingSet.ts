import { useCallback, useState } from "react";
import { LessonItem, Lesson, WorkingSetItem } from "../../types/lessons";

interface LessonSubset {
  unseenItems: string[];
  practiceItems: string[];
  masteredItems: string[];
  skippedItems: string[];
}

interface UseWorkingSetProps {
  currentLesson: number;
  lessons: Lesson[];
  progressionMode: "firstPass" | "spacedRepetition" | "test";
}

export const useWorkingSet = ({
  currentLesson,
  lessons,
  progressionMode,
}: UseWorkingSetProps) => {
  const [workingSet, setWorkingSet] = useState<WorkingSetItem[]>([]);
  const [activeItem, setActiveItem] = useState<WorkingSetItem | null>(null);
  const [lessonSubset, setLessonSubset] = useState<LessonSubset>({
    unseenItems: [],
    practiceItems: [],
    masteredItems: [],
    skippedItems: [],
  });

  const addToWorkingSet = useCallback(
    (items: WorkingSetItem[]) => {
      setWorkingSet((prev: WorkingSetItem[]) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const newItems = items.filter((item) => !existingIds.has(item.id));
        const newSet = [
          ...prev.map((item) => ({ ...item })),
          ...newItems,
        ].slice(0, 7);
        return newSet;
      });
      if (!activeItem && items.length > 0) {
        setActiveItem({ ...items[0] });
      }
    },
    [activeItem]
  );

  const removeFromWorkingSet = useCallback(
    (itemId: string) => {
      setWorkingSet((prev: WorkingSetItem[]) => {
        const newSet = prev.filter((item) => item.id !== itemId);
        return newSet;
      });
      if (activeItem?.id === itemId) {
        const remainingItems = workingSet.filter((item) => item.id !== itemId);
        setActiveItem(remainingItems[0] || null);
      }
    },
    [activeItem, workingSet]
  );

  const clearWorkingSet = useCallback(() => {
    setWorkingSet([]);
    setActiveItem(null);
  }, []);

  const nextItem = useCallback(() => {
    if (!activeItem || workingSet.length === 0) return;

    const currentIndex = workingSet.findIndex(
      (item) => item.id === activeItem.id
    );
    if (currentIndex === -1 || workingSet.length === 1) return;

    const nextIndex = (currentIndex + 1) % workingSet.length;
    setActiveItem({ ...workingSet[nextIndex] });
  }, [activeItem, workingSet]);

  return {
    workingSet,
    activeItem,
    lessonSubset,
    isWorkingSetFull: workingSet.length >= 7,
    addToWorkingSet,
    removeFromWorkingSet,
    clearWorkingSet,
    nextItem,
    setLessonSubset,
    setActiveItem,
  };
};
