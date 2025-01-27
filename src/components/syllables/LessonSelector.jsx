import React, { useRef } from 'react';
import { useGameLessons } from '@/hooks/game/useReadThaiGame';

const LessonSelector = ({ 
  onViewDetails,
  onOpenLessonList
}) => {
  const carouselRef = useRef(null);
  const { lessons, currentLesson } = useGameLessons();

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
                onClick={onOpenLessonList}
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
    </div>
  );
}

export default LessonSelector; 