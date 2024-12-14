import React from 'react';
import { useReadThaiGameState } from '../hooks/useReadThaiGameState';

const LessonListModal = ({ onClose, lessons, setCurrentLesson }) => {

  const handleLessonClick = (index) => {
    setCurrentLesson(index);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-gray-800 p-6 rounded-md shadow-lg max-w-md w-full h-full">
        <h2 className="text-lg font-bold mb-4 text-white">Lessons</h2>
        <div className="h-[calc(100%-64px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          <div className="grid grid-cols-1 gap-4">
            {lessons.map((lesson, index) => (
              <div 
                key={index} 
                className="bg-gray-700 p-4 rounded-md shadow-md cursor-pointer hover:bg-gray-600" 
                onClick={() => handleLessonClick(index)}
              >
                <h3 className="text-white text-lg font-semibold">{lesson.lessonName}</h3>
                <p className="text-gray-300">Level: {lesson.lessonLevel}</p>
                <p className="text-gray-300">Items: {lesson.items.length}</p>
                <p className="text-gray-300">{lesson.lessonDescription}</p>
              </div>
            ))}
          </div>
        </div>
        <button onClick={onClose} className="mt-4 p-2 bg-blue-600 text-white rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default LessonListModal; 