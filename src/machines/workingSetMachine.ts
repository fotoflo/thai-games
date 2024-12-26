import { createMachine, assign } from "xstate";
import { WorkingSetItem, LessonItem } from "../types/lessons";

interface WorkingSetContext {
  workingSet: WorkingSetItem[];
  activeVocabItem: WorkingSetItem | null;
  lessonSubset: {
    unseenItems: string[];
    practiceItems: string[];
    masteredItems: string[];
    skippedItems: string[];
  };
}

type WorkingSetEvent =
  | { type: "ADD_ITEMS"; items: WorkingSetItem[] }
  | { type: "REMOVE_ITEM"; itemId: string }
  | { type: "CLEAR" }
  | { type: "SET_ACTIVE"; item: WorkingSetItem | null }
  | { type: "LOAD_FIRST_PASS_ITEMS"; items: LessonItem[] };

const workingSetMachine = createMachine<WorkingSetContext, WorkingSetEvent>({
  id: "workingSet",
  initial: "idle",
  context: {
    workingSet: [],
    activeVocabItem: null,
    lessonSubset: {
      unseenItems: [],
      practiceItems: [],
      masteredItems: [],
      skippedItems: [],
    },
  },
  states: {
    idle: {
      on: {
        ADD_ITEMS: {
          actions: assign({
            workingSet: (context, event) => {
              const currentSet = Array.isArray(context.workingSet)
                ? context?.workingSet
                : [];
              const newItems = Array.isArray(event?.items) ? event.items : [];

              const newSet = [...currentSet, ...newItems];
              return newSet.slice(0, 7); // Keep working set size manageable
            },
          }),
        },
        REMOVE_ITEM: {
          actions: assign({
            workingSet: (context, event) =>
              context.workingSet.filter((item) => item.id !== event.itemId),
          }),
        },
        CLEAR: assign({
          workingSet: () => [],
          activeVocabItem: () => null,
        }),
        SET_ACTIVE: assign({
          activeVocabItem: (context, event) => event.item,
        }),
        LOAD_FIRST_PASS_ITEMS: {
          actions: assign({
            workingSet: (context, event) => {
              const [firstItem, ...restItems] = event.items;
              return [
                { id: firstItem.id, mastery: 0, vocabularyItem: firstItem },
                ...restItems.map((item) => ({
                  id: item.id,
                  mastery: 0,
                  vocabularyItem: item,
                })),
              ];
            },
          }),
        },
      },
    },
  },
});

export default workingSetMachine;
