import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { pageUrl } = JSON.parse(req.body);

    // Extract page ID from URL
    const pageId = pageUrl.split("?")[0].split("-").pop();

    console.log("Attempting to fetch page:", pageId);

    // Fetch the page
    const response = await notion.pages.retrieve({
      page_id: pageId,
    });

    console.log("Notion API Response:", JSON.stringify(response, null, 2));

    return res.status(200).json({
      success: true,
      pageId,
      response,
    });
  } catch (error) {
    console.error("Sync Error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
