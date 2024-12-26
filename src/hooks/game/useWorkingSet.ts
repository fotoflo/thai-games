import { useMachine } from "@xstate/react";
import workingSetMachine from "../../machines/workingSetMachine";
import { WorkingSetItem, LessonItem } from "../../types/lessons";

export const useWorkingSet = () => {
  const [state, send] = useMachine(workingSetMachine);

  const addToWorkingSet = (items: WorkingSetItem[] | number) => {
    if (typeof items === "number") {
      // If a number is passed, create an array of that many empty items
      send({ type: "ADD_ITEMS", items: [] });
    } else {
      // If items array is passed, send those items
      send({ type: "ADD_ITEMS", items });
    }
  };

  const removeFromWorkingSet = (itemId: string) => {
    send({ type: "REMOVE_ITEM", itemId });
  };

  const clearWorkingSet = () => {
    send({ type: "CLEAR" });
  };

  const setActiveVocabItem = (item: WorkingSetItem | null) => {
    send({ type: "SET_ACTIVE", item });
  };

  const loadFirstPassItems = (items: LessonItem[]) => {
    send({ type: "LOAD_FIRST_PASS_ITEMS", items });
  };

  return {
    workingSet: state.context.workingSet,
    activeVocabItem: state.context.activeVocabItem,
    lessonSubset: state.context.lessonSubset,
    addToWorkingSet,
    removeFromWorkingSet,
    clearWorkingSet,
    setActiveVocabItem,
    loadFirstPassItems,
  };
};
