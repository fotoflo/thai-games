import { Lesson } from "./lessons";

export type LessonStatesRecord = Record<number, LessonState>;

export interface LessonState {
  progressionMode: "firstPass" | "spacedRepetition" | "random";
  itemStates: Record<string, ItemState>;
  lastAddedIndex: number;
  problemList: string[];
  possibleProblemList: string[];
  workingList: string[];
}

export interface ItemState {
  mastery: number;
  lastStudied: number;
}

export const createInitialLessonState = (): LessonState => ({
  progressionMode: "firstPass",
  itemStates: {},
  lastAddedIndex: -1,
  problemList: [],
  possibleProblemList: [],
  workingList: [],
});
