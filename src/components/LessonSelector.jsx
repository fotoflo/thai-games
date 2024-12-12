import React from "react";

const LessonSelector = ({ currentLesson, setCurrentLesson, totalLessons, lessons }) => {
  console.log('LessonSelector Props:', { currentLesson, totalLessons });

  return (
    <div className="max-w-md mx-auto mb-4 bg-gray-800 p-2 rounded-lg">
      <div className="flex justify-center gap-2">
        {totalLessons > 0 ? (
          lessons.map((lesson, index) => (
            <button
              key={index}
              onClick={() => {
                console.log(`Selecting lesson ${index}`);
                setCurrentLesson(index);
              }}
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
      </div>
    </div>
  );
};

export default LessonSelector;
