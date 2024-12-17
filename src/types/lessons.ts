export interface Lesson {
  lessonName: string;
  lessonDescription: string;
  lessonLevel: "beginner" | "intermediate" | "advanced";
  lessonType: string;
  tags: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  languagePair: LanguagePair;
  items: VocabularyItem[];
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export interface TargetLanguage extends Language {
  script: string;
}

export interface LanguagePair {
  target: TargetLanguage;
  native: Language;
}

// Example and vocabulary types
export interface Example {
  text: string;
  translation: string;
  romanization: string;
}

export interface VocabularyItem {
  id: string;
  text: string;
  translation: string;
  romanization: string;
  difficulty?: number;
  tags: string[];
  examples: Example[];
}

// Lesson content types
export interface LessonItem {
  text: string;
  details?: {
    translation?: string;
    romanization?: string;
    [key: string]: any;
  };
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
