// src/types/lessons.ts
export interface LessonItem {
  text: string;
  details?: {
    translation?: string;
    romanization?: string;
    [key: string]: any;
  };
}

export interface Lesson {
  lessonName: string;
  items: LessonItem[] | string[];
}

export interface WorkingSetItem {
  text: string;
  mastery: number;
  details: LessonItem["details"] | null;
}

export interface ItemState {
  mastery: number;
  lastStudied: number;
}

export interface LessonState {
  progressionMode: "progression" | "random" | "discovery";
  itemStates: Record<string, ItemState>;
  lastAddedIndex: number;
  problemList: string[];
  possibleProblemList: string[];
  workingList: string[];
}

export interface GameProgress {
  currentIndex: number;
  totalItems: number;
}

export interface LessonProgress {
  total: number;
  mastered: number;
  inProgress: number;
}
