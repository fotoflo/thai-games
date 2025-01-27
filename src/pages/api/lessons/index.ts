import { NextApiRequest, NextApiResponse } from "next";
import { lessonService } from "@/services/lessonService";
import { LessonWithRelations } from "@/services/lessonService";
import { LessonSchema } from "@/types/lessons";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    lesson?: LessonWithRelations;
    lessons?: LessonWithRelations[];
    error?: string;
  }>
) {
  console.log("req.method", req.method);

  switch (req.method) {
    case "GET":
      try {
        const lessons = await lessonService.getAllLessons();
        return res.status(200).json({ lessons });
      } catch (error) {
        console.error("Failed to load lessons:", error);
        return res.status(500).json({ error: "Failed to load lessons" });
      }

    case "POST":
      try {
        const lessonData = req.body;

        // Validate the lesson data
        const validationResult = LessonSchema.safeParse(lessonData);
        if (!validationResult.success) {
          console.error("Validation errors:", validationResult.error);

          // Group validation issues by path for better organization
          const issuesByPath: Record<string, string[]> = {};
          validationResult.error.issues.forEach((issue) => {
            const path = issue.path.join(".");
            if (!issuesByPath[path]) {
              issuesByPath[path] = [];
            }
            issuesByPath[path].push(issue.message);
          });

          // Format the error message
          const errorMessage = Object.entries(issuesByPath)
            .map(([path, messages]) => {
              return `${path}:\n  - ${messages.join("\n  - ")}`;
            })
            .join("\n\n");

          return res.status(400).json({
            error: `Validation failed with the following issues:\n\n${errorMessage}`,
          });
        }

        // Transform categories to match the expected format
        const transformedData = {
          ...validationResult.data,
          categories: validationResult.data.categories.map((cat) => cat.name),
        };

        const lesson = await lessonService.createLesson(transformedData);
        return res.status(201).json({ lesson });
      } catch (error) {
        console.error("Failed to create lesson:", error);
        return res.status(500).json({ error: "Failed to create lesson" });
      }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
