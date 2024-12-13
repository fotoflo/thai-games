import React from "react";
import { ChevronRight } from 'lucide-react';

const LessonSelector = ({ currentLesson, setCurrentLesson, totalLessons, lessons }) => {
  return (
    <div className="max-w-md mx-auto mb-4 bg-gray-800 p-2 rounded-lg overflow-x-auto">
      <div className="flex justify-start gap-2">
        {totalLessons > 0 ? (
          lessons.map((lesson, index) => (
            <button
              key={index}
              onClick={() => setCurrentLesson(index)}
              className={`px-4 py-2 rounded-md transition-colors ${
                currentLesson === index
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-300"
              }`}
            >
              {lesson.lessonName}
            </button>
          ))
        ) : (
          <div className="text-white">No lessons available</div>
        )}
        {totalLessons > 0 && (
          <div className="flex items-center">
            <ChevronRight size={24} className="text-gray-300" />
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonSelector;
