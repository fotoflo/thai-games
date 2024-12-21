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

// Validation function to ensure lesson data matches our schema
const validateLesson = (lesson: any): lesson is Lesson => {
  try {
    // Basic structure validation
    if (!lesson.lessonName || typeof lesson.lessonName !== "string")
      return false;
    if (
      !lesson.lessonDescription ||
      typeof lesson.lessonDescription !== "string"
    )
      return false;
    if (
      !lesson.lessonLevel ||
      !["beginner", "intermediate", "advanced"].includes(lesson.lessonLevel)
    )
      return false;
    if (!lesson.lessonType || typeof lesson.lessonType !== "string")
      return false;
    if (!Array.isArray(lesson.tags)) return false;
    if (
      typeof lesson.difficulty !== "number" ||
      ![1, 2, 3, 4, 5].includes(lesson.difficulty)
    )
      return false;

    // Language pair validation
    if (
      !lesson.languagePair?.target?.code ||
      !lesson.languagePair?.native?.code
    )
      return false;

    // Items validation
    if (!Array.isArray(lesson.items)) return false;

    // Validate each item has required fields
    return lesson.items.every(
      (item: any) =>
        item.id &&
        item.text &&
        item.translation &&
        Array.isArray(item.tags) &&
        Array.isArray(item.examples)
    );
  } catch (error) {
    console.error(`Validation error in lesson: ${lesson?.lessonName}`, error);
    return false;
  }
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

// Validate and load lessons
const loadLessons = (): Lesson[] => {
  const validLessons = allLessons.filter((lesson): lesson is Lesson => {
    const isValid = validateLesson(lesson);
    if (!isValid) {
      console.error(`Invalid lesson data found: ${lesson?.lessonName}`);
    }
    return isValid;
  });

  if (validLessons.length !== allLessons.length) {
    console.warn(
      `Some lessons failed validation. Loaded ${validLessons.length} out of ${allLessons.length} lessons.`
    );
  }

  return validLessons;
};

// Export the validated lessons
export const lessons = loadLessons();

// Helper functions for lesson management
export const getLessonById = (id: string): Lesson | undefined =>
  lessons.find((lesson) => lesson.lessonName === id);

export const getLessonsByLevel = (level: Lesson["lessonLevel"]): Lesson[] =>
  lessons.filter((lesson) => lesson.lessonLevel === level);

export const getLessonsByTag = (tag: string): Lesson[] =>
  lessons.filter((lesson) => lesson.tags.includes(tag));

export const getLessonsByDifficulty = (
  difficulty: Lesson["difficulty"]
): Lesson[] => lessons.filter((lesson) => lesson.difficulty === difficulty);

// Export default for direct import
export default lessons;
