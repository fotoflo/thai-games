import { z } from "zod";
import { Lesson } from "../types/lessons";

// Import all lesson files
import atTheBar from "./at-the-bar.json";
import atTheRestraunt from "./at-the-restraunt.json";
import basicThai from "./basic-thai.json";
import combos1 from "./combos1.json";
import combos2 from "./combos2.json";
import envirenmentalSigns from "./envirenmental-signs.json";
import food1 from "./food1.json";
import food2veg from "./food2veg.json";
import greetings from "./greetings.json";
import languageLearning2 from "./language-learning-2.json";
import languageLearning from "./language-learning.json";
import lessonForKids1 from "./lesson-for-kids1.json";
import numbers from "./numbers.json";
import pronunciationAndSpelling from "./pronunciation-and-spelling.json";
import syllables1 from "./syllables1.json";
import syllables2 from "./syllables2.json";
import verbs from "./verbs.json";
import words1 from "./words1.json";

// Define Zod schemas
const LanguagePairSchema = z.object({
  target: z.object({
    code: z.string(),
  }),
  native: z.object({
    code: z.string(),
  }),
});

const LessonItemSchema = z.object({
  id: z.string(),
  text: z.string(),
  translation: z.string(),
  tags: z.array(z.string()),
  examples: z.array(
    z.object({
      text: z.string(),
      translation: z.string(),
      romanization: z.string(),
    })
  ),
  notes: z.string().optional(),
  pronunciation: z.string().optional(),
});

const LessonSchema = z.object({
  lessonName: z.string(),
  lessonDescription: z.string(),
  lessonLevel: z.enum(["beginner", "intermediate", "advanced"]),
  lessonType: z.string(),
  tags: z.array(z.string()).optional(),
  difficulty: z.number().int().min(1).max(5),
  languagePair: LanguagePairSchema,
  items: z.array(LessonItemSchema),
});

// Type inference from schema
type ZodLesson = z.infer<typeof LessonSchema>;

// Updated validation function with detailed error reporting
export const validateLesson = (lesson: unknown): lesson is Lesson => {
  try {
    const result = LessonSchema.safeParse(lesson);

    if (!result.success) {
      console.error(
        `Validation error in lesson: ${(lesson as any)?.lessonName}`
      );
      console.error("Validation errors:");
      result.error.issues.forEach((issue) => {
        console.error(`- Path: ${issue.path.join(".")}`);
        console.error(`  Error: ${issue.message}`);
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error(
      `Unexpected error validating lesson: ${(lesson as any)?.lessonName}`,
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
    try {
      const result = LessonSchema.safeParse(lesson);

      if (result.success) {
        validLessons.push(lesson as Lesson);
      } else {
        errors.push({
          lessonName: (lesson as any)?.lessonName || "Unknown Lesson",
          errors: result.error.issues.map(
            (issue) => `${issue.path.join(".")}: ${issue.message}`
          ),
        });
      }
    } catch (error) {
      errors.push({
        lessonName: (lesson as any)?.lessonName || "Unknown Lesson",
        errors: [(error as Error).message],
      });
    }
  });

  // Log validation summary
  if (errors.length > 0) {
    console.error("\nLesson Validation Errors:");
    errors.forEach(({ lessonName, errors }) => {
      console.error(`\n${lessonName}:`);
      errors.forEach((error) => console.error(`- ${error}`));
    });
    console.warn(
      `\nLoaded ${validLessons.length} out of ${allLessons.length} lessons.`
    );
  } else {
    console.log(`Successfully loaded all ${validLessons.length} lessons.`);
  }

  return validLessons;
};

// Array of all lesson data
const allLessons = [
  atTheBar,
  atTheRestraunt,
  basicThai,
  combos1,
  combos2,
  envirenmentalSigns,
  food1,
  food2veg,
  greetings,
  languageLearning2,
  languageLearning,
  lessonForKids1,
  numbers,
  pronunciationAndSpelling,
  syllables1,
  syllables2,
  verbs,
  words1,
];

// Export lessons array directly
export const lessons = loadLessons();

// Helper functions
export const getLessonById = (id: string): Lesson | undefined =>
  lessons.find((lesson) => lesson.lessonName === id);

export const getLessonsByLevel = (level: Lesson["lessonLevel"]): Lesson[] =>
  lessons.filter((lesson) => lesson.lessonLevel === level);

export const getLessonsByTag = (tag: string): Lesson[] =>
  lessons.filter((lesson) => lesson.tags.includes(tag));

export const getLessonsByDifficulty = (
  difficulty: Lesson["difficulty"]
): Lesson[] => lessons.filter((lesson) => lesson.difficulty === difficulty);
