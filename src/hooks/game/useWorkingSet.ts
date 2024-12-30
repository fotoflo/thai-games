import { useCallback, useState } from "react";
import useLocalStorage from "../useLocalStorage";
import {
  LessonItem,
  Lesson,
  RecallCategory,
  WorkingSetItem,
} from "../../types/lessons";

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
        // Filter out duplicates and create new references
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

    // If item not found or it's the only item, keep current
    if (currentIndex === -1 || workingSet.length === 1) return;

    // Calculate next index, cycling back to 0 if at end
    const nextIndex = (currentIndex + 1) % workingSet.length;

    // Create a new reference for all items to ensure React detects the change
    const newWorkingSet = workingSet.map((item, idx) => ({
      ...item,
      lastReviewed: idx === nextIndex ? new Date() : item.lastReviewed,
    }));

    // Update the working set
    setWorkingSet(newWorkingSet);

    // Then update the active item
    setActiveItem(newWorkingSet[nextIndex]);
  }, [activeItem, workingSet]);

  const addMoreItems = useCallback(
    (count: number = 1) => {
      if (currentLesson >= 0 && lessons[currentLesson]) {
        const lessonItems = lessons[currentLesson].items;
        if (lessonItems.length === 0) return;

        const newItems = lessonItems
          .filter((item) => !workingSet.some((w) => w.id === item.id))
          .slice(0, count)
          .map((item) => ({
            id: item.id,
            mastery: 0,
            vocabularyItem: item,
            lastReviewed: new Date(),
          }));

        if (newItems.length > 0) {
          addToWorkingSet(newItems);
        }
      }
    },
    [currentLesson, lessons, workingSet, addToWorkingSet]
  );

  const loadFirstPassItems = useCallback(() => {
    if (currentLesson >= 0 && lessons[currentLesson]) {
      const lessonItems = lessons[currentLesson].items;
      if (lessonItems.length === 0) return;

      clearWorkingSet();

      // Initialize with first item
      const firstItem = lessonItems[0];
      addToWorkingSet([
        {
          id: firstItem.id,
          mastery: 0,
          vocabularyItem: firstItem,
          lastReviewed: new Date(),
        },
      ]);

      // Update lesson subset
      setLessonSubset({
        unseenItems: lessonItems.slice(1).map((item) => item.id),
        practiceItems: [],
        masteredItems: [],
        skippedItems: [],
      });
    }
  }, [currentLesson, lessons, clearWorkingSet, addToWorkingSet]);

  const handleFirstPassChoice = useCallback(
    (itemId: string, choice: RecallCategory) => {
      // Get the current item's data before we remove it
      const currentItem = lessons[currentLesson]?.items.find(
        (item: LessonItem) => item.id === itemId
      );

      if (!currentItem) return;

      // Create practice item if needed
      const practiceItem =
        choice === "practice"
          ? {
              id: itemId,
              mastery: 1,
              vocabularyItem: currentItem,
              lastReviewed: new Date(),
            }
          : null;

      setLessonSubset((prev: LessonSubset) => {
        const newSubset = { ...prev };

        // Remove from all categories first
        (Object.keys(newSubset) as Array<keyof LessonSubset>).forEach((key) => {
          newSubset[key] = newSubset[key].filter((id: string) => id !== itemId);
        });

        // Add to appropriate category immediately
        switch (choice) {
          case "practice":
            newSubset.practiceItems.push(itemId);
            break;
          case "mastered":
            newSubset.masteredItems.push(itemId);
            break;
          case "skipped":
            newSubset.skippedItems.push(itemId);
            break;
          case "unseen":
            newSubset.unseenItems.push(itemId);
            break;
        }

        // Get next unseen item
        const nextUnseenId = newSubset.unseenItems[0];
        const nextItem = nextUnseenId
          ? lessons[currentLesson]?.items.find(
              (item) => item.id === nextUnseenId
            )
          : null;

        // Update working set and active item in one go
        queueMicrotask(() => {
          // Update working set first
          setWorkingSet((prev) => {
            const filteredSet = prev.filter(
              (i) => i.id !== itemId && i.mastery > 0
            );
            // Add practice item if this was marked for practice
            return practiceItem ? [...filteredSet, practiceItem] : filteredSet;
          });

          // If we have a next item, add it and make it active
          if (nextItem) {
            const newWorkingSetItem = {
              id: nextItem.id,
              mastery: 0,
              vocabularyItem: nextItem,
              lastReviewed: new Date(),
            };
            addToWorkingSet([newWorkingSetItem]);
            setActiveItem(newWorkingSetItem);
          } else if (practiceItem) {
            // If no next item but we have a practice item, make it active
            setActiveItem(practiceItem);
          } else {
            // Otherwise, move to next item in working set
            nextItem();
          }
        });

        return newSubset;
      });
    },
    [currentLesson, lessons, addToWorkingSet, setActiveItem, nextItem]
  );

  const markForPractice = useCallback(
    (itemId: string) => {
      handleFirstPassChoice(itemId, "practice");
    },
    [handleFirstPassChoice]
  );

  const markAsMastered = useCallback(
    (itemId: string) => {
      handleFirstPassChoice(itemId, "mastered");
    },
    [handleFirstPassChoice]
  );

  const markAsSkipped = useCallback(
    (itemId: string) => {
      handleFirstPassChoice(itemId, "skipped");
    },
    [handleFirstPassChoice]
  );

  const refreshWorkingSet = useCallback(() => {
    clearWorkingSet();
    const practiceItems = lessonSubset.practiceItems
      .map((id: string) =>
        lessons[currentLesson]?.items.find((item: LessonItem) => item.id === id)
      )
      .filter((item): item is LessonItem => item !== undefined)
      .slice(0, 7)
      .map((item) => ({
        id: item.id,
        mastery: 1,
        vocabularyItem: item,
        lastReviewed: new Date(),
      }));

    if (practiceItems.length > 0) {
      addToWorkingSet(practiceItems);
    }
  }, [
    currentLesson,
    lessons,
    lessonSubset.practiceItems,
    clearWorkingSet,
    addToWorkingSet,
  ]);

  return {
    workingSet,
    activeItem,
    lessonSubset,
    isWorkingSetFull: workingSet.length >= 7,
    addToWorkingSet,
    removeFromWorkingSet,
    clearWorkingSet,
    nextItem,
    addMoreItems,
    loadFirstPassItems,
    handleFirstPassChoice,
    markForPractice,
    markAsMastered,
    markAsSkipped,
    refreshWorkingSet,
    setLessonSubset,
    setActiveItem,
  };
};
