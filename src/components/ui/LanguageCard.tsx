import React from "react";
import { motion } from "framer-motion";
import DOMPurify from "isomorphic-dompurify";

interface CardSide {
  markdown: string;
  metadata?: {
    pronunciation?: string;
  };
}

interface LanguageCardProps {
  frontSide: CardSide;
  backSide: CardSide;
  maxBackLines?: number;
  showPronunciation?: boolean;
  className?: string;
}

const parseMarkdown = (text: string) => {
  // Handle <br /> tags
  let parsed = text.replace(/<br\s*\/?>/g, "\n");

  // Handle markdown bold (*text*)
  parsed = parsed.replace(/\*(.*?)\*/g, "<strong>$1</strong>");

  // Configure DOMPurify to allow span and strong tags
  const config = {
    ALLOWED_TAGS: ["span", "strong"],
    ALLOWED_ATTR: ["style"],
    ALLOWED_STYLE: ["color"],
  };

  return DOMPurify.sanitize(parsed, config);
};

const truncateLines = (text: string, maxLines: number): string => {
  const lines = text.split("\n").filter((line) => line.trim());
  if (lines.length <= maxLines) return text;
  return lines.slice(0, maxLines).join("\n") + "\n...";
};

export const LanguageCard: React.FC<LanguageCardProps> = ({
  frontSide,
  backSide,
  maxBackLines = 2,
  showPronunciation = true,
  className = "",
}) => {
  return (
    <motion.div
      className={`p-4 rounded-xl bg-gray-900 border border-gray-800 hover:bg-gray-800/50 transition-colors ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-2">
        {/* Front side - always show full content */}
        <div
          className="text-lg sm:text-xl text-white font-medium"
          dangerouslySetInnerHTML={{
            __html: parseMarkdown(frontSide.markdown),
          }}
        />

        {/* Back side - truncated */}
        <div
          className="text-base sm:text-lg text-gray-400"
          dangerouslySetInnerHTML={{
            __html: parseMarkdown(
              truncateLines(backSide.markdown, maxBackLines)
            ),
          }}
        />

        {/* Pronunciation - optional */}
        {showPronunciation && frontSide.metadata?.pronunciation && (
          <p className="text-sm text-gray-500 font-mono">
            <strong className="italic">
              {frontSide.metadata.pronunciation}
            </strong>
          </p>
        )}
      </div>
    </motion.div>
  );
};
