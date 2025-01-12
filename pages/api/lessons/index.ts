import { NextApiRequest, NextApiResponse } from "next";
import { lessonService } from "@/services/lessonService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const lessons = await lessonService.getAllLessons();
    return res.status(200).json({ lessons });
  } catch (error) {
    console.error("Failed to load lessons:", error);
    return res.status(500).json({ error: "Failed to load lessons" });
  }
}
