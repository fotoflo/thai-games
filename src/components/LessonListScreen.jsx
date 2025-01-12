import React from 'react';
import { BookOpen, Plus } from 'lucide-react';
import LessonItemsIcon from './Icons/LessonItemsIcon';
import ModalContainer from './ui/ModalContainer';
import { useReadThaiGame } from '@/context/ReadThaiGameContext';
import { lessonApi } from '@/api/lessonApi';
import { useQueryClient } from '@tanstack/react-query';

const LessonListScreen = ({ onClose, onViewDetails }) => {
  const { lessons, setCurrentLesson } = useReadThaiGame();
  const queryClient = useQueryClient();

  const handleLessonClick = (index) => {
    console.log("log handleLessonClick", index);
    setCurrentLesson(index); // Set the current lesson
    onClose(); // Close the modal
  };

  const handleCreateLesson = async () => {
    try {
      // Create a mock lesson
      const mockLesson = {
        name: "New Test Lesson",
        description: "This is a test lesson created from the UI",
        subject: "Thai for English Speakers",
        difficulty: "BEGINNER",
        estimatedTime: 30,
        totalItems: 2,
        version: 1,
        items: [
          {
            id: "test1",
            recallCategory: "UNSEEN",
            sides: [
              {
                markdown: "สวัสดี",
                pronunciation: "sa-wat-dee",
                notes: "Common greeting",
                language: "th",
              },
              {
                markdown: "hello",
                language: "en",
              }
            ],
            tags: ["greeting"],
            categories: ["basics"],
            intervalModifier: 1,
            practiceHistory: []
          }
        ],
        categories: ["basics"]
      };

      // Create the lesson
      const newLesson = await lessonApi.createLesson(mockLesson);
      console.log("Created lesson:", newLesson);

      // Invalidate the lessons query to trigger a refetch
      await queryClient.invalidateQueries({ queryKey: ["lessons"] });

      // Close the modal
      onClose();
    } catch (error) {
      console.error("Failed to create lesson:", error);
      // TODO: Show error message to user
    }
  };

  return (
    <ModalContainer 
      title="Choose a Lesson" 
      onClose={onClose}
      showHeader={true}
    >
      <div className="px-4 pb-4 space-y-4">
        <button
          onClick={handleCreateLesson}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 
                   bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl 
                   transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Create New Lesson
        </button>

        <div className="grid grid-cols-1 gap-3">
          {lessons.map((lesson, index) => (
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
                      onViewDetails(lesson, index); // Call onViewDetails to show lesson details
                      onClose(); // Close the modal
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