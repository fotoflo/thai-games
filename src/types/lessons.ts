// Basic Types
export type InterleaveStrategy = "random" | "balanced" | "progressive";
export type RecallCategory = "unseen" | "skipped" | "mastered" | "practice";
export type ConfidenceLevel = 1 | 2 | 3 | 4 | 5;
export type CardSource = "practice" | "mastered" | "unseen";

// Card Structure

// Lesson Structure
export type Lesson = {
  id: string;
  name: string;
  description: string;
  categories: string[];
  subject: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: number; // minutes
  totalItems: number;
  version: number; // For data migrations
  items: LessonItem[];
};

// Core Lesson Items
export type LessonItem = {
  id: string;
  sides: [CardSide, CardSide];
  practiceHistory: PracticeEvent[];
  recallCategory: RecallCategory;
  createdAt: number;
  updatedAt: number;
  tags: string[];
  categories: string[]; // e.g. ['greetings', 'numbers', 'food']
  intervalModifier: number; // For SRS algorithm
};

// Working Set Item
export type PracticeSetItem = {
  id: string;
  recallCategory: RecallCategory;
  lessonItem: LessonItem;
  lastReviewed: Date;
};

export type CardSide = {
  markdown: string; // Can include text, images, audio via markdown syntax
  metadata?: {
    pronunciation?: string;
    notes?: string;
  };
};

// Practice Events and History
export type PracticeEvent = {
  timestamp: number;
  result: RecallCategory;
  timeSpent: number; // milliseconds
  recalledSide: 0 | 1; // Index of the side being recalled
  confidenceLevel: ConfidenceLevel;
  isCorrect: boolean; // Self-reported accuracy
  attemptCount: number; // Times seen in this session
  sourceCategory: CardSource;
};

// Lesson Metadata
export type LessonMetadata = {
  id: string;
  name: string;
  description: string;
  categories: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: number; // minutes
  totalItems: number;
  version: number; // For data migrations
};

// Main Game State
export type GameState = {
  // All available lessons (lazy loaded)
  lessonData: Lesson[];
  currentLesson: Lesson;

  practiceSet: PracticeSetItem[];
  practiceSetSize: number;

  lessonSubset: {
    unseenItems: PracticeSetItem[];
    practiceItems: PracticeSetItem[];
    masteredItems: PracticeSetItem[];
    skippedItems: PracticeSetItem[];
  };

  currentLessonId: string;
};

// Game Settings
export type GameSettings = {
  invertTranslation: boolean;
  showRomanization: boolean;
  showExamples: boolean;
  audio: {
    enabled: boolean;
    volume: number;
    autoPlay: boolean;
  };
  profile: PlayerProfile;
};

export type PlayerProfile = {
  id: string;
  name: string;
  createdAt: number;
  lastLogin: number;
};
