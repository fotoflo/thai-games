import { z } from "zod";

// Basic Types
export type InterleaveStrategy = "random" | "balanced" | "progressive";
export type RecallCategory = "unseen" | "skipped" | "mastered" | "practice";
export type ConfidenceLevel = 1 | 2 | 3 | 4 | 5;
export type CardSource = "practice" | "mastered" | "unseen";

// Card Structure

export const CardSideSchema = z.object({
  markdown: z.string(),
  metadata: z
    .object({
      pronunciation: z.string().optional(),
      notes: z.string().optional(),
      language: z.string().optional(),
      level: z.string().optional(),
      audio: z.string().optional(),
      video: z.string().optional(),
      image: z.string().optional(),
    })
    .optional(),
});

export const PracticeEventSchema = z.object({
  timestamp: z.number(),
  result: z.enum(["unseen", "skipped", "mastered", "practice"]),
  timeSpent: z.number(),
  recalledSide: z.union([z.literal(0), z.literal(1)]),
  confidenceLevel: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  isCorrect: z.boolean(),
  attemptCount: z.number(),
  sourceCategory: z.enum(["practice", "mastered", "unseen"]),
});

export const LessonItemSchema = z.object({
  id: z.string(),
  sides: z.tuple([CardSideSchema, CardSideSchema]),
  practiceHistory: z.array(PracticeEventSchema),
  recallCategory: z.enum(["unseen", "skipped", "mastered", "practice"]),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
  tags: z.array(z.string()),
  categories: z.array(z.string()),
  intervalModifier: z.number(),
});

export const LessonSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  categories: z.array(z.string()),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  estimatedTime: z.number(),
  totalItems: z.number(),
  version: z.number(),
  items: z.array(LessonItemSchema),
  subject: z.string().optional(),
});

// Lesson Structure
export type Lesson = {
  id: string;
  name: string;
  description: string;
  categories: string[];
  subject?: string;
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

export type LessonSubset = {
  unseenItems: SuperSetItem[];
  practiceItems: SuperSetItem[];
  masteredItems: SuperSetItem[];
  skippedItems: SuperSetItem[];
};

// SuperSet Item
export type SuperSetItem = {
  id: string;
  recallCategory: RecallCategory;
  item: LessonItem;
  lastReviewed: Date;
};

export type SuperSet = SuperSetItem[];

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
  currentLessonId: string;

  superSet: SuperSet;
  practiceSet: SuperSet;
  practiceSetSize: number;

  lessonSubset: LessonSubset;
};

// Game Settings
export type GameSettings = {
  invertCard: boolean;
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
