import { z } from "zod";

// Basic Types
export type InterleaveStrategy = "random" | "balanced" | "progressive";
export type RecallCategory = "UNSEEN" | "SKIPPED" | "MASTERED" | "PRACTICE";
export type ConfidenceLevel = 1 | 2 | 3 | 4 | 5;
export type CardSource = "PRACTICE" | "MASTERED" | "UNSEEN";
export type Difficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

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
  result: z.enum(["UNSEEN", "SKIPPED", "MASTERED", "PRACTICE"]),
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
  sourceCategory: z.enum(["PRACTICE", "MASTERED", "UNSEEN"]),
});

export const LessonItemSchema = z.object({
  id: z.string(),
  sides: z.tuple([CardSideSchema, CardSideSchema]),
  practiceHistory: z.array(PracticeEventSchema).optional().default([]),
  recallCategory: z
    .enum(["UNSEEN", "SKIPPED", "MASTERED", "PRACTICE"])
    .optional()
    .default("UNSEEN"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  tags: z.array(z.string()),
  categories: z.array(z.string()),
  intervalModifier: z.number(),
});

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const LessonSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  categories: z.array(CategorySchema),
  subject: z.string().nullable(),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  estimatedTime: z.number(),
  totalItems: z.number(),
  version: z.number(),
  items: z.array(LessonItemSchema),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Type Exports
export type Lesson = z.infer<typeof LessonSchema>;
export type LessonItem = z.infer<typeof LessonItemSchema>;
export type PracticeEvent = z.infer<typeof PracticeEventSchema>;
export type CardSide = z.infer<typeof CardSideSchema>;
export type Category = z.infer<typeof CategorySchema>;

// Game Types
export type SuperSetItem = {
  id: string;
  item: LessonItem;
  recallCategory: RecallCategory;
};

export type SuperSet = SuperSetItem[];
