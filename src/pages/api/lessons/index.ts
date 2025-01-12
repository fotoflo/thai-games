import { NextApiRequest, NextApiResponse } from "next";
import { lessonService } from "@/services/lessonService";
import { LessonWithRelations } from "@/services/lessonService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    lesson?: LessonWithRelations;
    lessons?: LessonWithRelations[];
    error?: string;
  }>
) {
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
        const lesson = await lessonService.createLesson(req.body);
        return res.status(201).json({ lesson });
      } catch (error) {
        console.error("Failed to create lesson:", error);
        return res.status(500).json({ error: "Failed to create lesson" });
      }

    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
