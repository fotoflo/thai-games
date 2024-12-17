import React from 'react';
import LessonItemsIcon from './Icons/LessonItemsIcon';
import ModalContainer from './ui/ModalContainer';

const LessonListModal = ({ onClose, lessons, setCurrentLesson, onViewDetails }) => {
  const handleLessonClick = (index) => {
    setCurrentLesson(index);
    onClose();
  };

  return (
    <ModalContainer title="Choose a Lesson" onClose={onClose}>
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
                onViewDetails(lesson, index);
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
    </ModalContainer>
  );
};

export default LessonListModal;