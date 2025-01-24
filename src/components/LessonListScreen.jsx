import React, { useState } from 'react';
import { BookOpen, Plus } from 'lucide-react';
import LessonItemsIcon from './Icons/LessonItemsIcon';
import ModalContainer from './ui/ModalContainer';
import GuidedLessonCreator from './GuidedLessonCreator';
import { useLessons } from '@/hooks/game/useLessons';
import { useGameActions } from '@/hooks/game/useReadThaiGame';
import { modals } from '@/hooks/useModal';

const LessonListScreen = ({ onClose }) => {
  const { lessons: apiLessons } = useLessons();
  const { chooseLesson } = useGameActions();
  const [showGuidedCreator, setShowGuidedCreator] = useState(false);

  const handleLessonClick = (index) => {
    chooseLesson(index, apiLessons);
    onClose(); // Close the modal
  };

  if (showGuidedCreator) {
    return (
      <ModalContainer 
        title="Create New Lesson With AI" 
        onClose={() => setShowGuidedCreator(false)}
        showHeader={false}
        className="w-full max-w-3xl"
      >
        <GuidedLessonCreator onClose={() => setShowGuidedCreator(false)} />
      </ModalContainer>
    );
  }

  return (
    <div className="px-4 pb-4 space-y-4">
      <button
        onClick={() => setShowGuidedCreator(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 
                 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl 
                 transition-colors font-medium"
      >
        <Plus className="w-5 h-5" />
        Create New Lesson With AI
      </button>

      <div className="grid grid-cols-1 gap-3">
        {apiLessons?.map((lesson, index) => (
          <div 
            key={lesson.id || index} 
            className="bg-slate-800/30 rounded-xl overflow-hidden border border-slate-700/50"
            onClick={() => handleLessonClick(index)} // Handle lesson click
          >
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-medium text-emerald-500">
                      {lesson.subject}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-50">
                    {lesson.name}
                  </h3>
                </div>
                <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full text-sm whitespace-nowrap">
                  {lesson.difficulty}
                </span>
              </div>
              
              <p className="text-sm text-slate-300">{lesson.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <LessonItemsIcon />
                  {lesson.items.length} items
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the click from bubbling up
                    modals.lessonDetails.open({ lesson, index });
                    onClose(); // Close the lesson list modal
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
  );
};

export default LessonListScreen; 