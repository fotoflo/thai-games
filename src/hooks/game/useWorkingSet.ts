import { useCallback, useState } from "react";
import { LessonItem, Lesson, PracticeSetItem } from "../../types/lessons";

interface LessonSubset {
  unseenItems: string[];
  practiceItems: string[];
  masteredItems: string[];
  skippedItems: string[];
}

interface UsePracticeSetProps {
  currentLesson: number;
  lessons: Lesson[];
  progressionMode: "firstPass" | "spacedRepetition" | "test";
}

export const usePracticeSet = ({
  currentLesson,
  lessons,
  progressionMode,
}: UsePracticeSetProps) => {
  const [practiceSet, setPracticeSet] = useState<PracticeSetItem[]>([]);
  const [activeItem, setActiveItem] = useState<PracticeSetItem | null>(null);
  const [lessonSubset, setLessonSubset] = useState<LessonSubset>({
    unseenItems: [],
    practiceItems: [],
    masteredItems: [],
    skippedItems: [],
  });

  const addToPracticeSet = useCallback(
    (items: PracticeSetItem[]) => {
      setPracticeSet((prev: PracticeSetItem[]) => {
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

  const removeFromPracticeSet = useCallback(
    (itemId: string) => {
      setPracticeSet((prev: PracticeSetItem[]) => {
        const newSet = prev.filter((item) => item.id !== itemId);
        return newSet;
      });
      if (activeItem?.id === itemId) {
        const remainingItems = practiceSet.filter((item) => item.id !== itemId);
        setActiveItem(remainingItems[0] || null);
      }
    },
    [activeItem, practiceSet]
  );

  const clearPracticeSet = useCallback(() => {
    setPracticeSet([]);
    setActiveItem(null);
  }, []);

  const nextItem = useCallback(() => {
    if (!activeItem || practiceSet.length === 0) return;

    const currentIndex = practiceSet.findIndex(
      (item) => item.id === activeItem.id
    );
    if (currentIndex === -1 || practiceSet.length === 1) return;

    const nextIndex = (currentIndex + 1) % practiceSet.length;
    setActiveItem({ ...practiceSet[nextIndex] });
  }, [activeItem, practiceSet]);

  return {
    practiceSet,
    activeItem,
    lessonSubset,
    isPracticeSetFull: practiceSet.length >= 7,
    addToPracticeSet,
    removeFromPracticeSet,
    clearPracticeSet,
    nextItem,
    setLessonSubset,
    setActiveItem,
  };
};
