import React from "react";
import { Button } from "@/components/ui/button";
import { HeaderProps } from "./types";

const LessonCreatorHeader: React.FC<HeaderProps> = ({
  isJsonMode,
  setIsJsonMode,
  canGoBack,
  onBack,
  onClose,
}) => {
  return (
    <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur sticky top-0 z-10">
      <div className="px-6 py-3 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-100">
          Create New Lesson With AI
        </h1>
        <div className="flex items-center gap-3">
          {!isJsonMode && canGoBack && (
            <Button
              variant="ghost"
              className="text-gray-100 hover:bg-gray-800"
              onClick={onBack}
            >
              Back
            </Button>
          )}
          <span
            className={`text-sm ${
              isJsonMode ? "text-gray-400" : "text-gray-100"
            }`}
          >
            AI Wizard
          </span>
          <button
            onClick={() => setIsJsonMode(!isJsonMode)}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full
              transition-colors focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950
              ${isJsonMode ? "bg-blue-600" : "bg-gray-700"}
            `}
          >
            <span
              className={`
                ${isJsonMode ? "translate-x-6" : "translate-x-1"}
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
              `}
            />
          </button>
          <span
            className={`text-sm ${
              isJsonMode ? "text-gray-100" : "text-gray-400"
            }`}
          >
            JSON Upload
          </span>
        </div>
      </div>
    </div>
  );
};

export default LessonCreatorHeader;
