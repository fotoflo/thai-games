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

// Game state types (not part of schema but needed for the app)
export interface LessonItem {
  text: string;
}

export interface WorkingSetItem {
  text: string;
  mastery: number;
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

// Simplified working set item that references the original vocabulary item
export interface WorkingSetItem {
  id: string; // References VocabularyItem.id
  mastery: number;
  vocabularyItem: VocabularyItem; // Store the full vocabulary item
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

// Player profile
export interface PlayerProfile {
  id: string;
  name: string;
  age?: number;
  gender?: "male" | "female" | "other" | "prefer-not-to-say";
  nativeLanguage?: string;
  learningGoals?: string[];
  createdAt: number;
  lastActive: number;
}

// Configuration types
export interface GameSettings {
  invertTranslation: boolean;
  showRomanization: boolean;
  showExamples: boolean;
  audio: {
    enabled: boolean;
    volume: number;
    autoPlay: boolean;
  };
  profile: PlayerProfile;
}

// Speech function parameters
export interface SpeakFunctionParams {
  item: WorkingSetItem;
  setSpeaking: () => void;
  setError: () => void;
  onEnd: () => void;
}
