// Basic Types
export type InterleaveStrategy = "random" | "balanced" | "progressive";
export type RecallCategory = "unseen" | "skipped" | "mastered" | "practice";
export type ConfidenceLevel = 1 | 2 | 3 | 4 | 5;
export type CardSource = "practice" | "mastered" | "unseen";

// Card Structure
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

// Lesson Structure
export type Lesson = {
  id: string;
  name: string;
  description: string;
  categories: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: number; // minutes
  totalItems: number;
  version: number; // For data migrations
  items: LessonItem[];
};

// Working Set Item
export type WorkingSetItem = {
  id: string;
  mastery: number;
  lessonItem: LessonItem;
  lastReviewed: Date;
};

// AI-Generated Study Materials
export type StudyGuide = {
  id: string;
  lessonId: string;
  outline: Array<{
    fact: string;
    importance: number;
    relatedCards: string[]; // Card IDs
  }>;
  connections: Array<{
    cards: string[]; // Card IDs
    relationshipType: string;
    description: string;
  }>;
  mnemonics: Array<{
    cardIds: string[];
    technique: string;
    description: string;
  }>;
};

// Source Content
export type SourceMaterial = {
  id: string;
  type: "text" | "image" | "audio";
  content: string; // Could be text or URL
  processed: boolean;
  extractedCards: string[]; // Card IDs
  language?: string;
  chapter?: string;
  topic?: string;
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

// Progress Tracking
export type LessonProgress = {
  startedAt: number;
  lastAccessedAt: number;
  practiceSetIds: string[];
  practiceSetMaxLength: number;
  streakDays: number;
  bestStreak: number;
  totalTimeSpent: number;
  accuracyRate: number;
  recentlyShownCategories: Array<{
    category: string;
    timestamp: number;
  }>;
  stats: {
    unseen: number;
    skipped: number;
    mastered: number;
    practice: number;
  };
};

// Main Game State
export type GameState = {
  // All available lessons (lazy loaded)
  lessonData: {
    [id: string]: {
      metadata: LessonMetadata;
      items?: LessonItem[]; // Optional until loaded
      syncStatus?: "synced" | "pending" | "conflict";
      studyGuide?: StudyGuide;
      sourceMaterial?: SourceMaterial;
    };
  };

  // Current active lesson state
  currentLesson: {
    id: string; // References lessonData
    progress: LessonProgress;
    items: LessonItem[];
  } | null;

  completedLessons: string[]; // Lesson IDs

  interleavedSessions?: {
    activeLessonIds: string[];
    practiceSetIds: string[];
    lastAccessed: number;
  };

  // Global settings
  settings: {
    defaultPracticeSetSize: number;
    audioEnabled: boolean;
    interleaving: {
      enabled: boolean;
      strategy: InterleaveStrategy;
      minCategorySpacing: number; // Min cards between same category
    };
    srsSettings: {
      baseInterval: number; // Base time between reviews
      intervalModifier: number; // Global modifier for intervals
      failureSetback: number; // How much to reduce interval on failure
      masteredReviewFrequency?: number; // How often to show mastered cards
    };
    offlineMode: {
      enabled: boolean;
      maxCacheSize: number; // MB
    };
  };
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
  lastActive: number;
};
