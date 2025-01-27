import { Lesson, LessonSchema } from "@/types/lessons";
import { allLessons } from "@/lessons/lessonsForImport";

// Helper functions
export const getLessonById = ({
  lessons,
  id,
}: {
  lessons: Lesson[];
  id: string;
}): Lesson | undefined => lessons.find((lesson) => lesson.id === id);

export const getLessonsByLevel = ({
  lessons,
  level,
}: {
  lessons: Lesson[];
  level: Lesson["difficulty"];
}): Lesson[] => lessons.filter((lesson) => lesson.difficulty === level);

export const getLessonsByTag = ({
  lessons,
  tag,
}: {
  lessons: Lesson[];
  tag: string;
}): Lesson[] =>
  lessons.filter((lesson) => lesson.categories.some((cat) => cat.name === tag));

export const getLessonsByDifficulty = ({
  lessons,
  difficulty,
}: {
  lessons: Lesson[];
  difficulty: Lesson["difficulty"];
}): Lesson[] => lessons.filter((lesson) => lesson.difficulty === difficulty);

// Validations and Loaders

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
      validLessons.push(result.data as Lesson);
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
