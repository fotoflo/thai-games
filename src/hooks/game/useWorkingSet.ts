import { useCallback, useState } from "react";
import { LessonItem, Lesson, SuperSetItem } from "../../types/lessons";

interface LessonSubset {
  unseenItems: string[];
  practiceItems: string[];
  masteredItems: string[];
  skippedItems: string[];
}

interface UseSuperSetProps {
  currentLesson: number;
  lessons: Lesson[];
  progressionMode: "firstPass" | "spacedRepetition" | "test";
}

export const useSuperSet = ({
  currentLesson,
  lessons,
  progressionMode,
}: UseSuperSetProps) => {
  const [superSet, setSuperSet] = useState<SuperSetItem[]>([]);
  const [activeItem, setActiveItem] = useState<SuperSetItem | null>(null);
  const [lessonSubset, setLessonSubset] = useState<LessonSubset>({
    unseenItems: [],
    practiceItems: [],
    masteredItems: [],
    skippedItems: [],
  });

  const addToSuperSet = useCallback(
    (items: SuperSetItem[]) => {
      setSuperSet((prev: SuperSetItem[]) => {
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

  const removeFromSuperSet = useCallback(
    (itemId: string) => {
      setSuperSet((prev: SuperSetItem[]) => {
        const newSet = prev.filter((item) => item.id !== itemId);
        return newSet;
      });
      if (activeItem?.id === itemId) {
        const remainingItems = superSet.filter((item) => item.id !== itemId);
        setActiveItem(remainingItems[0] || null);
      }
    },
    [activeItem, superSet]
  );

  const clearSuperSet = useCallback(() => {
    setSuperSet([]);
    setActiveItem(null);
  }, []);

  const nextItem = useCallback(() => {
    if (!activeItem || superSet.length === 0) return;

    const currentIndex = superSet.findIndex(
      (item) => item.id === activeItem.id
    );
    if (currentIndex === -1 || superSet.length === 1) return;

    const nextIndex = (currentIndex + 1) % superSet.length;
    setActiveItem({ ...superSet[nextIndex] });
  }, [activeItem, superSet]);

  return {
    superSet,
    activeItem,
    lessonSubset,
    isSuperSetFull: superSet.length >= 7,
    addToSuperSet,
    removeFromSuperSet,
    clearSuperSet,
    nextItem,
    setLessonSubset,
    setActiveItem,
  };
};
