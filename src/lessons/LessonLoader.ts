import { z } from "zod";
import { Lesson } from "../types/lessons";

// Import only the active lessons
import basicThai from "./basic-thai.json";
import words1 from "./words1.json";

// Comment out unused lessons
// import atTheBar from "./at-the-bar.json";
// import atTheRestraunt from "./at-the-restraunt.json";
// import combos1 from "./combos1.json";
// import combos2 from "./combos2.json";
import envirenmentalSigns from "./envirenmental-signs.json";
// import food1 from "./food1.json";
// import food2veg from "./food2veg.json";
// import greetings from "./greetings.json";
// import languageLearning2 from "./language-learning-2.json";
// import languageLearning from "./language-learning.json";
// import lessonForKids1 from "./lesson-for-kids1.json";
// import pronunciationAndSpelling from "./pronunciation-and-spelling.json";
// import syllables1 from "./syllables1.json";
// import syllables2 from "./syllables2.json";
import verbs from "./verbs.json";

// Array of all lesson data
const allLessons = [words1, basicThai, verbs, envirenmentalSigns];

// Define Zod schemas
const CardSideSchema = z.object({
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

const PracticeEventSchema = z.object({
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

const LessonItemSchema = z.object({
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

const LessonSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  categories: z.array(z.string()),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  estimatedTime: z.number(),
  totalItems: z.number(),
  version: z.number(),
  items: z.array(LessonItemSchema),
  subject: z.string().optional(),
});

// Updated validation function with detailed error reporting
export const validateLesson = (lesson: unknown): lesson is Lesson => {
  try {
    const result = LessonSchema.safeParse(lesson);

    if (!result.success) {
      console.log(
        `Validation error in lesson: ${(lesson as { name?: string })?.name}`
      );
      console.log("Validation errors:");
      result.error.issues.forEach((issue) => {
        console.log(`- Path: ${issue.path.join(".")}`);
        console.log(`  Error: ${issue.message}`);
      });
      return false;
    }

    return true;
  } catch (error) {
    console.log(
      `Unexpected error validating lesson: ${
        (lesson as { name?: string })?.name
      }`,
      error
    );
    return false;
  }
};

// Load and validate lessons with better error reporting
export const loadLessons = (): Lesson[] => {
  const validLessons: Lesson[] = [];
  const errors: { lessonName: string; errors: string[] }[] = [];

  allLessons.forEach((lesson) => {
    const result = LessonSchema.safeParse(lesson);

    if (result.success) {
      validLessons.push(result.data);
    } else {
      errors.push({
        lessonName: (lesson as { name?: string })?.name || "Unknown Lesson",
        errors: result.error.issues.map(
          (issue) => `${issue.path.join(".")}: ${issue.message}`
        ),
      });
    }
  });

  // Log validation summary
  if (errors.length > 0) {
    console.log("\nLesson Validation Errors:");
    errors.forEach(({ lessonName, errors }) => {
      console.log(`\n${lessonName}:`);
      errors.forEach((error) => console.error(`- ${error}`));
    });
    console.warn(
      `\nLoaded ${validLessons.length} out of ${allLessons.length} lessons.`
    );
  }

  return validLessons;
};

// Export lessons array directly
export const lessons = loadLessons();

// Helper functions
export const getLessonById = (id: string): Lesson | undefined =>
  lessons.find((lesson) => lesson.id === id);

export const getLessonsByLevel = (level: Lesson["difficulty"]): Lesson[] =>
  lessons.filter((lesson) => lesson.difficulty === level);

export const getLessonsByTag = (tag: string): Lesson[] =>
  lessons.filter((lesson) => lesson.categories.includes(tag));

export const getLessonsByDifficulty = (
  difficulty: Lesson["difficulty"]
): Lesson[] => lessons.filter((lesson) => lesson.difficulty === difficulty);
