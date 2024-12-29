import { useCallback, useState } from "react";
import useLocalStorage from "../useLocalStorage";
import { LessonItem, Lesson, RecallCategory } from "../../types/lessons";

export interface WorkingSetItem {
  id: string;
  mastery: number;
  vocabularyItem: LessonItem;
  lastReviewed?: Date;
}

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
  const [activeVocabItem, setActiveVocabItem] = useState<WorkingSetItem | null>(
    null
  );
  const [lessonSubset, setLessonSubset] = useState<LessonSubset>({
    unseenItems: [],
    practiceItems: [],
    masteredItems: [],
    skippedItems: [],
  });

  const addToWorkingSet = useCallback(
    (items: WorkingSetItem[]) => {
      setWorkingSet((prev: WorkingSetItem[]) => {
        const newSet = [...prev, ...items].slice(0, 7);
        return newSet;
      });
      if (!activeVocabItem && items.length > 0) {
        setActiveVocabItem(items[0]);
      }
    },
    [activeVocabItem, setActiveVocabItem]
  );

  const removeFromWorkingSet = useCallback(
    (itemId: string) => {
      setWorkingSet((prev: WorkingSetItem[]) =>
        prev.filter((item) => item.id !== itemId)
      );
      if (activeVocabItem?.id === itemId) {
        setActiveVocabItem(workingSet[0] || null);
      }
    },
    [activeVocabItem, workingSet]
  );

  const clearWorkingSet = useCallback(() => {
    setWorkingSet([]);
    setActiveVocabItem(null);
  }, []);

  const nextItem = useCallback(() => {
    if (!activeVocabItem || workingSet.length === 0) return;
    const currentIndex = workingSet.findIndex(
      (item) => item.id === activeVocabItem.id
    );
    const nextIndex = (currentIndex + 1) % workingSet.length;
    setActiveVocabItem({
      ...workingSet[nextIndex],
      lastReviewed: new Date(),
    });
  }, [activeVocabItem, workingSet]);

  const addMoreItems = useCallback(
    (count: number = 1) => {
      if (currentLesson >= 0 && lessons[currentLesson]) {
        const lessonItems = lessons[currentLesson].items;
        if (lessonItems.length === 0) return;

        const newItems = lessonItems.slice(0, count).map((item) => ({
          id: item.id,
          mastery: 0,
          vocabularyItem: item,
          lastReviewed: new Date(),
        }));

        addToWorkingSet(newItems);
      }
    },
    [currentLesson, lessons, addToWorkingSet]
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
      setLessonSubset((prev: LessonSubset) => {
        const newSubset = { ...prev };

        // Remove from all categories first
        newSubset.unseenItems = newSubset.unseenItems.filter(
          (id: string) => id !== itemId
        );
        newSubset.practiceItems = newSubset.practiceItems.filter(
          (id: string) => id !== itemId
        );
        newSubset.masteredItems = newSubset.masteredItems.filter(
          (id: string) => id !== itemId
        );
        newSubset.skippedItems = newSubset.skippedItems.filter(
          (id: string) => id !== itemId
        );

        // Add to appropriate category
        switch (choice) {
          case "practice":
            newSubset.practiceItems.push(itemId);
            break;
          case "mastered":
            newSubset.masteredItems.push(itemId);
            break;
          case "unseen":
            newSubset.unseenItems.push(itemId);
            break;
          case "skipped":
            newSubset.skippedItems.push(itemId);
            break;
        }

        return newSubset;
      });

      // Handle working set updates
      if (choice === "practice") {
        const item = lessons[currentLesson]?.items.find(
          (i: LessonItem) => i.id === itemId
        );
        if (item && workingSet.length < 7) {
          addToWorkingSet([
            {
              id: itemId,
              mastery: 1,
              vocabularyItem: item,
              lastReviewed: new Date(),
            },
          ]);
        }
      } else {
        removeFromWorkingSet(itemId);
      }

      // Load next unseen item if available
      if (lessonSubset.unseenItems.length > 0) {
        const nextItemId = lessonSubset.unseenItems[0];
        const nextItem = lessons[currentLesson]?.items.find(
          (item: LessonItem) => item.id === nextItemId
        );
        if (nextItem) {
          addToWorkingSet([
            {
              id: nextItem.id,
              mastery: 0,
              vocabularyItem: nextItem,
              lastReviewed: new Date(),
            },
          ]);
        }
      }
    },
    [
      currentLesson,
      lessons,
      workingSet,
      lessonSubset,
      addToWorkingSet,
      removeFromWorkingSet,
    ]
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
    activeVocabItem,
    lessonSubset,
    isWorkingSetFull: workingSet.length >= 7,
    addToWorkingSet,
    removeFromWorkingSet,
    clearWorkingSet,
    nextItem,
    loadFirstPassItems,
    handleFirstPassChoice,
    addMoreItems,
    markForPractice,
    markAsMastered,
    markAsSkipped,
    refreshWorkingSet,
  };
};
