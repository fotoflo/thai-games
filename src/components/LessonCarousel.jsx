import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import LessonListModal from './LessonListModal';

const LessonCarousel = ({ currentLesson, setCurrentLesson, totalLessons, lessons }) => {
  const carouselRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex items-center mb-6">
      <div className="flex overflow-hidden max-w-md mx-auto">
        <div 
          ref={carouselRef} 
          className="flex gap-2 overflow-x-auto scrollbar-hidden"
          style={{ margin: '0', padding: '0' }}
        >
          {totalLessons > 0 ? (
            <>
              <button
                key={currentLesson}
                onClick={() => setCurrentLesson(currentLesson)}
                className={`px-3 py-2 rounded-md transition-colors bg-blue-600 text-white`}
              >
                {lessons[currentLesson].lessonName}
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
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

      {isModalOpen && (
        <LessonListModal 
          lessons={lessons}
          setCurrentLesson={setCurrentLesson}
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default LessonCarousel; 