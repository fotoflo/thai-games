import { useCallback } from "react";
import useLocalStorage from "../useLocalStorage";
import { WorkingSetItem } from "../../types/lessons";
import { UseLessonState } from "../../types/lessonState";

interface UseWorkingSet {
  workingSet: WorkingSetItem[];
  activeVocabItem: WorkingSetItem | null;
  setActiveVocabItem: (item: WorkingSetItem | null) => void;
  setWorkingSet: (items: WorkingSetItem[]) => void;
  nextItem: () => void;
  addItems: (items: WorkingSetItem[]) => void;
  clearWorkingSet: () => void;
  handleMastered: (item: WorkingSetItem) => void;
  refreshWorkingSet: () => void;
}

export const useWorkingSet = (lessonState: UseLessonState): UseWorkingSet => {
  const [workingSet, setWorkingSet] = useLocalStorage<WorkingSetItem[]>(
    "workingSet",
    []
  );
  const [activeVocabItem, setActiveVocabItem] =
    useLocalStorage<WorkingSetItem | null>("activeVocabItem", null);

  const nextItem = useCallback(() => {
    if (!activeVocabItem || workingSet.length === 0) return;

    const currentIndex = workingSet.findIndex(
      (item) => item.id === activeVocabItem.id
    );
    const nextIndex = (currentIndex + 1) % workingSet.length;
    setActiveVocabItem(workingSet[nextIndex]);
  }, [activeVocabItem, workingSet, setActiveVocabItem]);

  const addItems = useCallback(
    (newItems: WorkingSetItem[]) => {
      setWorkingSet((prev) => [...prev, ...newItems]);
      if (!activeVocabItem && newItems.length > 0) {
        setActiveVocabItem(newItems[0]);
      }
    },
    [setWorkingSet, activeVocabItem, setActiveVocabItem]
  );

  const clearWorkingSet = useCallback(() => {
    setWorkingSet([]);
    setActiveVocabItem(null);
  }, [setWorkingSet, setActiveVocabItem]);

  const handleMastered = useCallback(
    (item: WorkingSetItem) => {
      // Update item mastery in lesson state
      lessonState.updateItemState(item.id, { mastery: 5 });

      // Remove from working set
      setWorkingSet((prev) => prev.filter((i) => i.id !== item.id));

      // Update active item
      nextItem();
    },
    [lessonState, setWorkingSet]
  );

  const refreshWorkingSet = useCallback(() => {
    // Get items from lesson's working list
    const workingItems = lessonState.workingList.map((itemId) => {
      const item = findItemById(itemId); // You'll need to implement this
      return {
        id: itemId,
        mastery:
          lessonState.lessonStates[lessonState.currentLesson].itemStates[itemId]
            ?.mastery || 1,
        vocabularyItem: item,
      };
    });

    setWorkingSet(workingItems);
    if (workingItems.length > 0 && !activeVocabItem) {
      setActiveVocabItem(workingItems[0]);
    }
  }, [lessonState, setWorkingSet, setActiveVocabItem]);

  return {
    workingSet,
    activeVocabItem,
    setActiveVocabItem,
    setWorkingSet,
    nextItem,
    addItems,
    clearWorkingSet,
    handleMastered,
    refreshWorkingSet,
  };
};
