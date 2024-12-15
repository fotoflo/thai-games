import React from 'react';

const LessonListModal = ({ onClose, lessons, setCurrentLesson }) => {
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
                key={index} 
                className="bg-gray-700 p-5 rounded-lg shadow-md cursor-pointer 
                         transition-all duration-200 
                         hover:shadow-xl"
                onClick={() => handleLessonClick(index)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white text-xl font-semibold">{lesson.lessonName}</h3>
                  {lesson.lessonLevel && (
                    <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full">
                      {lesson.lessonLevel}
                    </span>
                  )}
                </div>
                
                <p className="text-gray-300 mb-3">{lesson.lessonDescription}</p>
                
                <div className="flex items-center text-gray-400 text-sm">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
                  </svg>
                  {lesson.items.length} items
                </div>
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