import React, { useRef, useState } from 'react';
import LessonListScreen from '../LessonListScreen';
import { useReadThaiGame } from '@/context/ReadThaiGameContext';

const LessonSelector = ({ 
  onViewDetails 
}) => {
  const carouselRef = useRef(null);
  const [showLessonList, setShowLessonList] = useState(false);

  const game = useReadThaiGame();
  const { lessons, currentLesson, setCurrentLesson } = game;


  console.log("lessonSelector currentLesson", currentLesson.name);
  console.log("lessonSelector lessons", lessons);

  return (
    <div className="flex items-center mb-6">
      <div className="flex overflow-hidden max-w-md mx-auto">
        <div 
          ref={carouselRef} 
          className="flex gap-2 overflow-x-auto scrollbar-hidden"
          style={{ margin: '0', padding: '0' }}
        >
          {lessons.length > 0 ? (
            <>
              {currentLesson >= 0 && lessons[currentLesson] && (
                <button
                  key={currentLesson}
                  onClick={() => {
                    onViewDetails(lessons[currentLesson], currentLesson);
                  }}
                  className={`px-3 py-2 rounded-md transition-colors bg-blue-600 text-white`}
                >
                  {lessons[currentLesson].name}
                </button>
              )}
              <button
                onClick={() => setShowLessonList(true)}
                className={`px-3 py-2 rounded-md transition-colors bg-gray-700 hover:bg-gray-600 text-gray-300`}
              >
                More Lessons
              </button>
            </>
          ) : (
            <div className="text-white">No lessons available</div>
          )}
        </div>
      </div>

      {showLessonList && (
        <LessonListScreen
          onClose={() => setShowLessonList(false)}
          lessons={lessons}
          setCurrentLesson={setCurrentLesson}
          onViewDetails={onViewDetails}
        />
      )}
    </div>
  );
};

export default LessonSelector; 