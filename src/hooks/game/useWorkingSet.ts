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

  // Working set management
  refreshWorkingSet: () => void; // Fills working set from practice items
  isWorkingSetFull: boolean;

  addMoreItems: (targetCount?: number) => void;

  // Add a method specifically for loading first pass items
  loadFirstPassItems: () => void;

  // Add this function inside the useWorkingSet hook
  handleFirstPassChoice: (choice: "skip" | "mastered" | "practice") => void;
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
      practiceItems: [],
      masteredItems: [],
      skippedItems: [],
    }
  );

  // Add this ref to track loading state
  const hasLoadedRef = useRef<{
    lesson: number;
    mode: "firstPass" | "spacedRepetition" | "test";
  }>({
    lesson: -1,
    mode: "firstPass",
  });

  // Define showNextItem first since other functions depend on it
  const showNextItem = useCallback(() => {
    if (lessonSubset.unseenItems.length === 0) return;

    const nextItemId = lessonSubset.unseenItems[0];
    if (!nextItemId) return;

    // Find the next item in the lesson
    const nextItem = lessons[currentLesson].items.find(
      (item) => item.id === nextItemId
    );
    if (nextItem) {
      setActiveVocabItem({
        id: nextItem.id,
        mastery: 0,
        vocabularyItem: nextItem,
      });
    }
  }, [lessonSubset.unseenItems, lessons, currentLesson, setActiveVocabItem]);

  // Now define the functions that use showNextItem
  const markForPractice = useCallback(
    (itemId: string) => {
      setLessonSubset((prev) => ({
        ...prev,
        practiceItems: [...prev.practiceItems, itemId],
      }));
    },
    [setLessonSubset]
  );

  const markAsMastered = useCallback(
    (itemId: string) => {
      setLessonSubset((prev) => ({
        ...prev,
        masteredItems: [...prev.masteredItems, itemId],
      }));
    },
    [setLessonSubset]
  );

  const markAsSkipped = useCallback(
    (itemId: string) => {
      setLessonSubset((prev) => ({
        ...prev,
        skippedItems: [...prev.skippedItems, itemId],
      }));
    },
    [setLessonSubset]
  );

  const addToWorkingSet = useCallback(
    (items: WorkingSetItem[]) => {
      setWorkingSet((prev) => {
        const newSet = [...prev, ...items];
        // Keep working set size manageable (4-7 items)
        return newSet.slice(0, 7);
      });

      // Always set the active item if we don't have one and we're adding items
      if (!activeVocabItem && items.length > 0) {
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

  // Add an initialization effect
  useEffect(() => {
    if (
      progressionMode === "firstPass" &&
      currentLesson >= 0 &&
      lessons[currentLesson]
    ) {
      loadFirstPassItems();
    }
  }, []); // Run only once on mount

  // Update loadFirstPassItems to be more robust
  const loadFirstPassItems = useCallback(() => {
    if (currentLesson < 0 || !lessons[currentLesson]) return;

    const lessonItems = lessons[currentLesson].items;
    if (lessonItems.length === 0) return;

    // Always set the first item as active immediately
    const [firstItem, ...restItems] = lessonItems;

    // Set both states together to prevent flashing
    setActiveVocabItem({
      id: firstItem.id,
      mastery: 0,
      vocabularyItem: firstItem,
    });

    setLessonSubset({
      unseenItems: restItems.map((item) => item.id),
      practiceItems: [],
      masteredItems: [],
      skippedItems: [],
    });

    // Update the loaded ref
    hasLoadedRef.current = {
      lesson: currentLesson,
      mode: progressionMode,
    };
  }, [
    currentLesson,
    lessons,
    progressionMode,
    setActiveVocabItem,
    setLessonSubset,
  ]);

  // Update handleFirstPassChoice to be more reliable
  const handleFirstPassChoice = useCallback(
    (choice: "skip" | "mastered" | "practice") => {
      if (!activeVocabItem) {
        console.warn("No active vocabulary item found");
        return;
      }

      const currentId = activeVocabItem.id;
      const [nextItemId, ...remainingUnseen] = lessonSubset.unseenItems;

      // Find the next item before updating state
      const nextItem = nextItemId
        ? lessons[currentLesson].items.find((item) => item.id === nextItemId)
        : null;

      // Update both states together
      setLessonSubset((prev) => {
        const newState = { ...prev };
        switch (choice) {
          case "skip":
            newState.skippedItems = [...prev.skippedItems, currentId];
            break;
          case "mastered":
            newState.masteredItems = [...prev.masteredItems, currentId];
            break;
          case "practice":
            newState.practiceItems = [...prev.practiceItems, currentId];
            break;
        }
        newState.unseenItems = remainingUnseen;
        return newState;
      });

      // Set next item if available
      if (nextItem) {
        setActiveVocabItem({
          id: nextItem.id,
          mastery: 0,
          vocabularyItem: nextItem,
        });
      } else {
        setActiveVocabItem(null); // Clear active item if we're done
      }
    },
    [
      activeVocabItem,
      lessonSubset.unseenItems,
      lessons,
      currentLesson,
      setLessonSubset,
      setActiveVocabItem,
    ]
  );

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
    markForPractice,
    markAsMastered,
    markAsSkipped,

    // Working set management
    refreshWorkingSet,
    isWorkingSetFull: workingSet.length >= 7,

    addMoreItems,

    // Add a method specifically for loading first pass items
    loadFirstPassItems,

    // Add this function inside the useWorkingSet hook
    handleFirstPassChoice,
  };
};
