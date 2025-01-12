import { PrismaClient, Lesson, Category, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export type LessonWithRelations = Omit<Lesson, "items"> & {
  items: LessonItem[];
  categories: Category[];
};

export interface LessonItem {
  id: string;
  recallCategory: "UNSEEN" | "SKIPPED" | "MASTERED" | "PRACTICE";
  sides: Array<{
    markdown: string;
    pronunciation?: string | null;
    notes?: string | null;
    language?: string | null;
    level?: string | null;
    audio?: string | null;
    video?: string | null;
    image?: string | null;
  }>;
  tags: string[];
  categories: string[];
  intervalModifier: number;
  practiceHistory: Array<{
    timestamp: number;
    result: "UNSEEN" | "SKIPPED" | "MASTERED" | "PRACTICE";
    timeSpent: number;
    recalledSide: 0 | 1;
    confidenceLevel: 1 | 2 | 3 | 4 | 5;
    isCorrect: boolean;
    attemptCount: number;
    sourceCategory: "PRACTICE" | "MASTERED" | "UNSEEN";
  }>;
}

export const lessonService = {
  // Get all lessons with their relations
  getAllLessons: async (): Promise<LessonWithRelations[]> => {
    const lessons = await prisma.lesson.findMany({
      include: {
        categories: true,
      },
    });
    return lessons.map((lesson) => ({
      ...lesson,
      items: lesson.items as unknown as LessonItem[],
    }));
  },

  // Get a single lesson by ID
  getLessonById: async (id: string): Promise<LessonWithRelations | null> => {
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        categories: true,
      },
    });
    if (!lesson) return null;
    return {
      ...lesson,
      items: lesson.items as unknown as LessonItem[],
    };
  },

  // Create a new lesson
  createLesson: async (
    lessonData: Omit<Lesson, "id" | "createdAt" | "updatedAt" | "items"> & {
      items: LessonItem[];
      categories: string[];
    }
  ): Promise<LessonWithRelations> => {
    const { items, categories, ...lessonDetails } = lessonData;

    const lesson = await prisma.lesson.create({
      data: {
        ...lessonDetails,
        items: items as unknown as Prisma.InputJsonValue,
        categories: {
          connectOrCreate: categories.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
      },
      include: {
        categories: true,
      },
    });

    return {
      ...lesson,
      items: lesson.items as unknown as LessonItem[],
    };
  },

  // Update a lesson
  updateLesson: async (
    id: string,
    lessonData: Partial<Omit<Lesson, "id" | "items">> & {
      items?: LessonItem[];
    }
  ): Promise<LessonWithRelations> => {
    const { items, ...rest } = lessonData;
    const lesson = await prisma.lesson.update({
      where: { id },
      data: {
        ...rest,
        ...(items && { items: items as unknown as Prisma.InputJsonValue }),
      },
      include: {
        categories: true,
      },
    });

    return {
      ...lesson,
      items: lesson.items as unknown as LessonItem[],
    };
  },

  // Delete a lesson
  deleteLesson: async (id: string): Promise<Lesson> => {
    return prisma.lesson.delete({
      where: { id },
    });
  },
};
