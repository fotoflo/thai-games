import React from 'react';
import LessonItemsIcon from './Icons/LessonItemsIcon';

const LessonListModal = ({ onClose, lessons, setCurrentLesson, onViewDetails }) => {
  const handleLessonClick = (index) => {
    setCurrentLesson(index);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-2xl max-w-md w-full h-[90vh] relative">
        <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-600 pb-3">
          Choose a Lesson
        </h2>
        
        <div className="h-[calc(100%-138px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          <div className="grid grid-cols-1 gap-4">
            {lessons.map((lesson, index) => (
              <div 
                key={lesson.id || index} 
                className="bg-gray-700 p-5 rounded-lg shadow-md"
              >
                <div 
                  className="flex justify-between items-start mb-2 cursor-pointer" 
                  onClick={() => handleLessonClick(index)}
                >
                  <h3 className="text-white text-xl font-semibold">{lesson.lessonName}</h3>
                  {lesson.lessonLevel && (
                    <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full">
                      {lesson.lessonLevel}
                    </span>
                  )}
                </div>
                
                <p className="text-gray-300 mb-3">{lesson.lessonDescription}</p>
                
                <div className="flex items-center text-gray-400 text-sm">
                  <LessonItemsIcon />
                  {lesson.items.length} items
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(lesson);
                    onClose();
                  }}
                  className="mt-4 w-full p-2 bg-green-600 text-white rounded-lg font-semibold
                           transition-colors duration-200 hover:bg-green-700
                           focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                >
                  Lesson Details
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-4">
          <button 
            onClick={onClose} 
            className="w-full p-3 bg-blue-600 text-white rounded-lg font-semibold
                     transition-colors duration-200 hover:bg-blue-700
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonListModal;