import React from "react";
import ReactMarkdown from "react-markdown";
import { Volume2 } from "lucide-react";
import { useThaiSpeech } from "../../hooks/useThaiSpeech";
import { LessonItem } from "../../types/lessons";
import rehypeRaw from "rehype-raw";

const ItemDisplay = ({
  vocabItem,
  textSize = "text-6xl",
  iconSize = 24,
  className = "",
  textColor = "text-white",
  sideTwoTextColor = "text-slate-400",
  iconColor = "text-gray-400",
  speakOnMount = false,
  speakOnUnmount = false,
  invertTranslation = false,
  useFullMarkdown = false,
  showBothSides = false,
  sideTwoTextSize = "text-sm sm:text-base",
}: {
  vocabItem: LessonItem | null;
  textSize?: string;
  iconSize?: number;
  className?: string;
  textColor?: string;
  iconColor?: string;
  speakOnMount?: boolean;
  speakOnUnmount?: boolean;
  invertTranslation?: boolean;
  useFullMarkdown?: boolean;
  showBothSides?: boolean;
  sideTwoTextSize?: string;
  sideTwoTextColor?: string;
}) => {
  const { speaking, hasThai, error, handleSpeak } = useThaiSpeech(
    speakOnMount,
    speakOnUnmount,
    vocabItem?.sides?.[0]?.markdown
  );

  const displayText = invertTranslation
    ? vocabItem?.sides?.[1]?.markdown || vocabItem?.sides?.[0]?.markdown
    : vocabItem?.sides?.[0]?.markdown || "";

  const processedDisplayText = useFullMarkdown
    ? displayText
    : displayText?.split("\n")[0].replace(/<[^>]*>/g, "");

  if (!vocabItem) {
    return null;
  }

  return (
    <div
      className={`flex flex-col ${className}`}
      onClick={() => handleSpeak(processedDisplayText)}
    >
      <div className="flex flex-col">
        <div className="flex items-center justify-left">
          {useFullMarkdown ? (
            <ReactMarkdown
              className={`${textSize} ${textColor}`}
              rehypePlugins={[rehypeRaw]}
              components={{
                span: ({ ...props }) => (
                  <span style={{ color: props.style?.color }} {...props} />
                ),
              }}
            >
              {processedDisplayText}
            </ReactMarkdown>
          ) : (
            <div className={`${textSize} ${textColor}`}>
              {processedDisplayText}
            </div>
          )}
          <button
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            title="Speak"
            disabled={!hasThai || speaking}
          >
            <Volume2
              size={iconSize}
              className={`${iconColor} hover:text-white ${
                speaking ? "opacity-50" : ""
              }`}
            />
          </button>
        </div>
        {showBothSides && (
          <div className={`${sideTwoTextSize} ${sideTwoTextColor}`}>
            {vocabItem?.sides?.[1]?.markdown}
          </div>
        )}
      </div>

      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
};

export default ItemDisplay;
