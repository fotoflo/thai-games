import { useCallback, useEffect, useRef } from "react";
import useLocalStorage from "../useLocalStorage";
import { WorkingSetItem, LessonItem } from "../../types/lessons";

interface UseWorkingSetProps {
  currentLesson: number;
  lessons: Lesson[];
  progressionMode: "firstPass" | "spacedRepetition" | "test";
}

interface LessonSubset {
  unseenItems: string[]; // IDs of items not yet shown to user
  currentItem: string | null; // ID of item currently being shown
  practiceItems: string[]; // IDs of items marked for practice
  masteredItems: string[]; // IDs of items marked as "know it"
  skippedItems: string[]; // IDs of items that were skipped
}

interface UseWorkingSet {
  // Current active practice set (4-7 items)
  workingSet: WorkingSetItem[];
  activeVocabItem: WorkingSetItem | null;
  setActiveVocabItem: (item: WorkingSetItem | null) => void;

  // Working set operations
  addToWorkingSet: (items: WorkingSetItem[]) => void;
  removeFromWorkingSet: (itemId: string) => void;
  clearWorkingSet: () => void;
  nextItem: () => void;

  // Lesson subset tracking
  lessonSubset: LessonSubset;

  // Lesson subset operations
  markForPractice: (itemId: string) => void;
  markAsMastered: (itemId: string) => void;
  markAsSkipped: (itemId: string) => void;

  // Working set management
  refreshWorkingSet: () => void; // Fills working set from practice items
  isWorkingSetFull: boolean;

  addMoreItems: (targetCount?: number) => void;

  // Add a method specifically for loading first pass items
  loadFirstPassItems: () => void;

  currentItem: LessonItem | null;
}

export const useWorkingSet = ({
  currentLesson,
  lessons,
  progressionMode,
}: UseWorkingSetProps) => {
  // Working Set State
  const [workingSet, setWorkingSet] = useLocalStorage<WorkingSetItem[]>(
    "workingSet",
    []
  );
  const [activeVocabItem, setActiveVocabItem] =
    useLocalStorage<WorkingSetItem | null>("activeVocabItem", null);

  // Lesson Subset State
  const [lessonSubset, setLessonSubset] = useLocalStorage<LessonSubset>(
    "lessonSubset",
    {
      unseenItems: [],
      currentItem: null,
      practiceItems: [],
      masteredItems: [],
      skippedItems: [],
    }
  );

  // Define showNextItem first since other functions depend on it
  const showNextItem = useCallback(() => {
    setLessonSubset((prev) => {
      if (prev.unseenItems.length === 0) return prev;

      const [nextItem, ...remainingUnseen] = prev.unseenItems;
      return {
        ...prev,
        unseenItems: remainingUnseen,
        currentItem: nextItem,
      };
    });
  }, [setLessonSubset]);

  // Now define the functions that use showNextItem
  const markForPractice = useCallback(
    (itemId: string) => {
      setLessonSubset((prev) => ({
        ...prev,
        practiceItems: [...prev.practiceItems, itemId],
        currentItem: null,
      }));
      showNextItem();
    },
    [setLessonSubset, showNextItem]
  );

  const markAsMastered = useCallback(
    (itemId: string) => {
      setLessonSubset((prev) => ({
        ...prev,
        masteredItems: [...prev.masteredItems, itemId],
        currentItem: null,
      }));
      showNextItem();
    },
    [setLessonSubset, showNextItem]
  );

  const markAsSkipped = useCallback(
    (itemId: string) => {
      setLessonSubset((prev) => ({
        ...prev,
        skippedItems: [...prev.skippedItems, itemId],
        currentItem: null,
      }));
      showNextItem();
    },
    [setLessonSubset, showNextItem]
  );

  const addToWorkingSet = useCallback(
    (items: WorkingSetItem[]) => {
      console.log("Adding to working set:", items);
      setWorkingSet((prev) => {
        const newSet = [...prev, ...items];
        // Keep working set size manageable (4-7 items)
        return newSet.slice(0, 7);
      });

      // Always set the active item if we don't have one and we're adding items
      if (!activeVocabItem && items.length > 0) {
        console.log("Setting active item in addToWorkingSet:", items[0]);
        setActiveVocabItem(items[0]);
      }
    },
    [setWorkingSet, activeVocabItem, setActiveVocabItem]
  );

  const removeFromWorkingSet = useCallback(
    (itemId: string) => {
      setWorkingSet((prev) => prev.filter((item) => item.id !== itemId));

      // If we removed the active item, select the next one
      if (activeVocabItem?.id === itemId) {
        const remainingItems = workingSet.filter((item) => item.id !== itemId);
        setActiveVocabItem(
          remainingItems.length > 0 ? remainingItems[0] : null
        );
      }
    },
    [workingSet, activeVocabItem, setWorkingSet, setActiveVocabItem]
  );

  const clearWorkingSet = useCallback(() => {
    setWorkingSet([]);
    setActiveVocabItem(null);
  }, [setWorkingSet, setActiveVocabItem]);

  const nextItem = useCallback(() => {
    if (!activeVocabItem || workingSet.length === 0) return;

    const currentIndex = workingSet.findIndex(
      (item) => item.id === activeVocabItem.id
    );
    const nextIndex = (currentIndex + 1) % workingSet.length;
    setActiveVocabItem(workingSet[nextIndex]);
  }, [workingSet, activeVocabItem, setActiveVocabItem]);

  const refreshWorkingSet = useCallback(() => {
    if (workingSet.length < 4 && lessonSubset.practiceItems.length > 0) {
      const itemsNeeded = Math.min(
        4 - workingSet.length,
        lessonSubset.practiceItems.length
      );

      // Get items from practice list that aren't already in working set
      const availableItems = lessonSubset.practiceItems
        .filter((id) => !workingSet.some((item) => item.id === id))
        .slice(0, itemsNeeded);

      if (availableItems.length > 0) {
        // Note: You'll need to implement getItemById to fetch the full item data
        const newItems = availableItems.map((id) => ({
          id,
          mastery: 1,
          vocabularyItem: getItemById(id), // You need to implement this
        }));
        addToWorkingSet(newItems);
      }
    }
  }, [workingSet, lessonSubset, addToWorkingSet]);

  const addMoreItems = useCallback(
    (targetCount: number = 5) => {
      if (workingSet.length >= targetCount) {
        return; // Already have enough items
      }

      const itemsNeeded = targetCount - workingSet.length;

      // First try to add items from practice list
      if (lessonSubset.practiceItems.length > 0) {
        const availableItems = lessonSubset.practiceItems
          .filter((id) => !workingSet.some((item) => item.id === id))
          .slice(0, itemsNeeded);

        if (availableItems.length > 0) {
          const newItems = availableItems.map((id) => ({
            id,
            mastery: 1,
            vocabularyItem: getItemById(id),
          }));
          addToWorkingSet(newItems);
          return;
        }
      }

      // If we get here, we need to add new items from the current lesson
      // We'll need to pass the current lesson and its items as props to useWorkingSet
      if (currentLesson && lessons[currentLesson]) {
        const lessonItems = lessons[currentLesson].items;
        const unusedItems = lessonItems.filter(
          (item) =>
            !workingSet.some((wsItem) => wsItem.id === item.id) &&
            !lessonSubset.masteredItems.includes(item.id) &&
            !lessonSubset.skippedItems.includes(item.id)
        );

        const itemsToAdd = unusedItems.slice(0, itemsNeeded).map((item) => ({
          id: item.id,
          mastery: 0,
          vocabularyItem: item,
        }));

        if (itemsToAdd.length > 0) {
          addToWorkingSet(itemsToAdd);
        }
      }
    },
    [workingSet, lessonSubset, currentLesson, lessons, addToWorkingSet]
  );

  // Add a method specifically for loading first pass items
  const loadFirstPassItems = useCallback(() => {
    if (!currentLesson || !lessons[currentLesson]) return;

    const lessonItems = lessons[currentLesson].items;

    setLessonSubset((prev) => ({
      ...prev,
      unseenItems: lessonItems.map((item) => item.id),
      currentItem: null,
      practiceItems: [],
      masteredItems: [],
      skippedItems: [],
    }));

    // Show first item
    showNextItem();
  }, [currentLesson, lessons, setLessonSubset]);

  // Load items when lesson changes
  useEffect(() => {
    console.log("Lesson changed to:", currentLesson);
    if (currentLesson >= 0 && lessons[currentLesson]) {
      const lessonItems = lessons[currentLesson].items;
      console.log("Loading items for lesson:", lessonItems);

      // Reset lesson subset with all items as unseen
      setLessonSubset({
        unseenItems: lessonItems.map((item) => item.id),
        currentItem: null,
        practiceItems: [],
        masteredItems: [],
        skippedItems: [],
      });

      // Show first item
      setTimeout(() => {
        showNextItem();
      }, 0);
    }
  }, [currentLesson, lessons]);

  // Add a ref to track if we've loaded items for this lesson
  const hasLoadedRef = useRef<{
    lesson: number;
    mode: string;
  }>({ lesson: -1, mode: "" });

  useEffect(() => {
    // Only load first pass items if:
    // 1. We're in firstPass mode
    // 2. We haven't already loaded items for this lesson/mode combination
    // 3. We have a valid lesson
    if (
      progressionMode === "firstPass" &&
      (hasLoadedRef.current.lesson !== currentLesson ||
        hasLoadedRef.current.mode !== progressionMode) &&
      currentLesson >= 0 &&
      lessons[currentLesson]
    ) {
      hasLoadedRef.current = {
        lesson: currentLesson,
        mode: progressionMode,
      };
      loadFirstPassItems();
    }
  }, [currentLesson, progressionMode]); // Remove loadFirstPassItems from dependencies

  // ... other methods

  return {
    // Working set state
    workingSet,
    activeVocabItem,
    setActiveVocabItem,

    // Working set operations
    addToWorkingSet,
    removeFromWorkingSet,
    clearWorkingSet,
    nextItem,

    // Lesson subset state and operations
    lessonSubset,
    currentItem: lessonSubset.currentItem
      ? lessons[currentLesson]?.items.find(
          (item) => item.id === lessonSubset.currentItem
        )
      : null,
    markForPractice,
    markAsMastered,
    markAsSkipped,

    // Working set management
    refreshWorkingSet,
    isWorkingSetFull: workingSet.length >= 7,

    addMoreItems,

    // Add a method specifically for loading first pass items
    loadFirstPassItems,
  };
};
