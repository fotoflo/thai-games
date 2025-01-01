import React from "react";
import { Eye } from "lucide-react";
import { LessonItem } from "@/types/lessons";

const CheckTranslationButton = ({
  onClick,
  lessonItem,
}: {
  onClick: () => void;
  lessonItem: LessonItem | null;
}) => {
  // Only render if current has details with a translation
  if (!lessonItem) return null;

  return (
    <div className="flex justify-center mt-12 mb-8">
      <button
        onClick={onClick}
        className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center justify-center text-lg w-1/2"
      >
        <Eye size={24} />
      </button>
    </div>
  );
};

export default CheckTranslationButton;
