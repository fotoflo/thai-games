import React from 'react';
import { BookOpen } from 'lucide-react';
import LessonItemsIcon from './Icons/LessonItemsIcon';
import ModalContainer from './ui/ModalContainer';

const LessonListScreen = ({ onClose, lessons, setCurrentLesson, onViewDetails }) => {
  const handleLessonClick = (index) => {
    setCurrentLesson(index);
    onClose();
  };

  return (
    <ModalContainer 
      title="Choose a Lesson" 
      onClose={onClose}
      showHeader={true}
    >
      <div className="px-4 pb-4 space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {lessons.map((lesson, index) => (
            <div 
              key={lesson.id || index} 
              className="bg-slate-800/30 rounded-xl overflow-hidden border border-slate-700/50"
            >
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-medium text-emerald-500">
                        {lesson.lessonType}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-50">
                      {lesson.lessonName}
                    </h3>
                  </div>
                  <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full text-sm whitespace-nowrap">
                    {lesson.lessonLevel}
                  </span>
                </div>
                
                <p className="text-sm text-slate-300">{lesson.lessonDescription}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <LessonItemsIcon />
                    {lesson.items.length} items
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails(lesson, index);
                      onClose();
                    }}
                    className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-200 
                             rounded-lg text-sm transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModalContainer>
  );
};

export default LessonListScreen; 