import { allLessons } from "../src/lessons/lessonsForImport.js";
import { lessonService } from "../src/services/lessonService.js";
import { Difficulty as DifficultyEnum } from "@prisma/client";
import type { Difficulty, RecallCategory } from "@prisma/client";

interface CardMetadata {
  pronunciation?: string;
  notes?: string;
}

interface LessonSide {
  markdown: string;
  metadata?: CardMetadata;
}

interface PracticeEvent {
  timestamp: number;
  result: "UNSEEN" | "SKIPPED" | "MASTERED" | "PRACTICE";
  timeSpent: number;
  recalledSide: 0 | 1;
  confidenceLevel: 1 | 2 | 3 | 4 | 5;
  isCorrect: boolean;
  attemptCount: number;
  sourceCategory: "PRACTICE" | "MASTERED" | "UNSEEN";
}

interface LessonItem {
  id: string;
  recallCategory: string;
  sides: LessonSide[];
  tags: string[];
  categories: string[];
  intervalModifier: number;
  practiceHistory: PracticeEvent[];
}

interface ImportLesson {
  name: string;
  description: string;
  subject: string;
  difficulty: string;
  estimatedTime: number;
  version: number;
  items: LessonItem[];
  categories: string[];
}

async function importLessons() {
  console.log("Starting lesson import...");

  try {
    for (const lesson of allLessons as ImportLesson[]) {
      console.log(`Importing lesson: ${lesson.name}`);

      await lessonService.createLesson({
        name: lesson.name,
        description: lesson.description,
        subject: lesson.subject,
        difficulty:
          (lesson.difficulty?.toUpperCase() as Difficulty) ||
          DifficultyEnum.BEGINNER,
        estimatedTime: lesson.estimatedTime,
        totalItems: lesson.items.length,
        version: lesson.version,
        items: lesson.items.map((item: LessonItem) => ({
          id: item.id,
          recallCategory: (item.recallCategory.toUpperCase() ||
            "UNSEEN") as RecallCategory,
          sides: item.sides.map((side: LessonSide) => {
            const metadata = (side.metadata || {}) as CardMetadata;
            return {
              markdown: side.markdown,
              pronunciation: metadata.pronunciation ?? null,
              notes: metadata.notes ?? null,
              language: null,
              level: null,
              audio: null,
              video: null,
              image: null,
            };
          }),
          tags: item.tags,
          categories: item.categories,
          intervalModifier: item.intervalModifier,
          practiceHistory: item.practiceHistory,
        })),
        categories: lesson.categories,
      });
    }

    console.log("Lesson import completed successfully!");
  } catch (error) {
    console.error("Error importing lessons:", error);
    process.exit(1);
  }
}

importLessons();
