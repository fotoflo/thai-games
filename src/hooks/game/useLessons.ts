import { useQuery, useQueryClient } from "@tanstack/react-query";
import { lessonApi } from "@/api/lessonApi";
import { LessonWithRelations } from "@/services/lessonService";

interface UseLessons {
  lessons: LessonWithRelations[]; // from the api
  lessonsLoading: boolean;
  lessonsError: Error | null;
  invalidateLessons: () => Promise<void>;
}

export const useLessons = (): UseLessons => {
  const queryClient = useQueryClient();

  // Load lessons using React Query
  const {
    data: lessons = [] as LessonWithRelations[],
    isLoading: lessonsLoading,
    error: lessonsError,
  } = useQuery({
    queryKey: ["lessons"],
    queryFn: lessonApi.loadLessons,
  });

  const invalidateLessons = async () => {
    await queryClient.invalidateQueries({ queryKey: ["lessons"] });
  };

  return {
    lessons,
    lessonsLoading,
    lessonsError,
    invalidateLessons,
  };
};
