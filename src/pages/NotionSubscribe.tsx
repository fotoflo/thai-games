"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

type NotionPage = {
  id: string;
  title: string;
  lastSynced: string;
};

export default function Home() {
  const [pageUrl, setPageUrl] = useState("");

  const { data: pages, isLoading } = useQuery<NotionPage[]>({
    queryKey: ["notion-pages"],
    queryFn: () => fetch("/api/pages").then((res) => res.json()),
  });

  const handleSync = async () => {
    try {
      await fetch("/api/notionSync", {
        method: "POST",
        body: JSON.stringify({ pageUrl }),
      });
    } catch (error) {
      console.error("Sync failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto p-12">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Share Your Notion Content
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            Easily sync and share your Notion pages with your audience. Just
            paste your page URL to get started.
          </p>
        </div>

        {/* Login Section */}
        <div className="flex justify-end mb-12">
          <button className="text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium">
            Login (coming soon)
          </button>
        </div>

        {/* Sync Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Add your Notion page
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              To get your page URL: 1. Open your Notion page 2. Click 'Share' in
              the top right 3. Click 'Copy link'
            </p>
            <p className="text-gray-600 text-sm">
              Supports: Public pages, databases, and shared pages
            </p>
          </div>

          <input
            type="text"
            value={pageUrl}
            onChange={(e) => setPageUrl(e.target.value)}
            placeholder="https://www.notion.so/your-page-name-123..."
            className="w-full p-4 border border-gray-200 rounded-lg mb-4 
               focus:outline-none focus:ring-2 focus:ring-blue-500 
               focus:border-transparent transition-all duration-200
               text-gray-800 placeholder-gray-400"
          />
          <button
            onClick={handleSync}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 rounded-lg font-medium transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Sync Page
          </button>
        </div>

        {/* Display Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Synced Pages
          </h2>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : pages?.length ? (
            <div className="bg-white rounded-xl shadow-lg divide-y divide-gray-100">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className="p-6 hover:bg-gray-50 transition-colors duration-200"
                >
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    {page.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Last synced: {new Date(page.lastSynced).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No pages synced yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
