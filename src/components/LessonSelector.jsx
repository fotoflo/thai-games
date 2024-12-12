import React from "react";

const LessonSelector = ({ currentLesson, setCurrentLesson, totalLessons }) => {
  console.log('LessonSelector Props:', { currentLesson, totalLessons });

  return (
    <div className="max-w-md mx-auto mb-4 bg-gray-800 p-2 rounded-lg">
      <div className="flex justify-center gap-2">
        {totalLessons > 0 ? (
          Array.from({ length: totalLessons }, (_, i) => i + 1).map((lessonNum) => (
            <button
              key={lessonNum}
              onClick={() => {
                console.log(`Selecting lesson ${lessonNum}`);
                setCurrentLesson(lessonNum);
              }}
              className={`px-4 py-2 rounded-md transition-colors ${
                currentLesson === lessonNum
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-300"
              }`}
            >
              Lesson {lessonNum}
            </button>
          ))
        ) : (
          <div className="text-white">No lessons available</div>
        )}
      </div>
    </div>
  );
};

export default LessonSelector;
