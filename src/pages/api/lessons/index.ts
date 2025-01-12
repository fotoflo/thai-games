import { NextApiRequest, NextApiResponse } from "next";
import { loadLessons } from "@/lessons/LessonLoader";
import { Lesson } from "@/types/lessons";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ lessons: Lesson[] } | { error: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const lessons = loadLessons();
    return res.status(200).json({ lessons });
  } catch (error) {
    console.error("Failed to load lessons:", error);
    return res.status(500).json({ error: "Failed to load lessons" });
  }
}
