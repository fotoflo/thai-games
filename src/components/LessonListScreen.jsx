import React, { useState, useMemo } from 'react';
import { BookOpen, Languages, Search, X } from 'lucide-react';
import LessonItemsIcon from './Icons/LessonItemsIcon';
import ModalContainer from './ui/ModalContainer';
import LessonWizard from './lesson-wizard/LessonWizard';
import { useLessons } from '@/hooks/game/useLessons';
import { useGameActions } from '@/hooks/game/useReadThaiGame';
import { modals } from '@/hooks/useModal';

const LessonListScreen = ({ onClose }) => {
  const { lessons: apiLessons } = useLessons();
  const { chooseLesson } = useGameActions();
  const [showLanguageWizard, setShowLanguageWizard] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showAllTags, setShowAllTags] = useState(false);

  const INITIAL_TAG_LIMIT = 6;

  // Get all unique tags from lessons
  const allTags = useMemo(() => {
    const tagSet = new Set();
    apiLessons?.forEach(lesson => {
      lesson.categories?.forEach(category => {
        tagSet.add(category.name);
      });
    });
    return Array.from(tagSet).sort(); // Sort alphabetically
  }, [apiLessons]);

  // Get visible tags based on show more/less state
  const visibleTags = useMemo(() => {
    if (showAllTags) return allTags;
    // Always show selected tags, even if they're beyond the limit
    const selectedSet = new Set(selectedTags);
    const initialTags = allTags.slice(0, INITIAL_TAG_LIMIT);
    const additionalSelectedTags = allTags.filter(tag => 
      selectedSet.has(tag) && !initialTags.includes(tag)
    );
    return [...initialTags, ...additionalSelectedTags];
  }, [allTags, showAllTags, selectedTags]);

  // Filter and sort lessons
  const filteredAndSortedLessons = useMemo(() => {
    if (!apiLessons) return [];
    
    return apiLessons
      .filter(lesson => {
        // Search filter
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = searchQuery === '' ||
          lesson.name.toLowerCase().includes(searchLower) ||
          lesson.description.toLowerCase().includes(searchLower) ||
          lesson.subject.toLowerCase().includes(searchLower);

        // Tag filter
        const matchesTags = selectedTags.length === 0 ||
          selectedTags.every(tag => 
            lesson.categories?.some(category => 
              category.name.toLowerCase() === tag.toLowerCase()
            )
          );

        return matchesSearch && matchesTags;
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA; // Sort descending
      });
  }, [apiLessons, searchQuery, selectedTags]);

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleLessonClick = (index) => {
    // Find the actual index in the original array
    const originalIndex = apiLessons.findIndex(
      lesson => lesson.id === filteredAndSortedLessons[index].id
    );
    chooseLesson(originalIndex, apiLessons);
    onClose();
  };

  const handleViewDetails = (e, lesson, index) => {
    e.stopPropagation();
    console.log("Opening lesson details for:", lesson.name);
    const lessonWithTimestamps = {
      ...lesson,
      createdAt: lesson.createdAt || new Date(),
      updatedAt: lesson.updatedAt || new Date(),
    };
    modals.lessonDetails.open({ lesson: lessonWithTimestamps, index });
    onClose();
  };

  const handleLanguageWizardComplete = (state) => {
    console.log('Language wizard completed:', state);
    setShowLanguageWizard(false);
  };

  if (showLanguageWizard) {
    return (
      <ModalContainer 
        title="Language Preferences" 
        onClose={() => setShowLanguageWizard(false)}
        showHeader={false}
        className="w-full max-w-5xl"
      >
        <LessonWizard 
          onComplete={handleLanguageWizardComplete} 
          onClose={() => setShowLanguageWizard(false)}
        />
      </ModalContainer>
    );
  }

  return (
    <div className="px-4 pb-4 space-y-4">
      <button
        onClick={() => setShowLanguageWizard(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 
                 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl 
                 transition-colors duration-200"
      >
        <Languages className="w-5 h-5" />
        <span>Create New Lesson with AI</span>
      </button>

      {/* Search and Filter Controls */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search lessons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/30 border border-slate-700/50 
                     rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none 
                     focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {visibleTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 
                         transition-colors ${
                           selectedTags.includes(tag)
                             ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                             : 'bg-slate-800/30 text-slate-300 border border-slate-700/50 hover:bg-slate-700/50'
                         }`}
              >
                {tag}
                {selectedTags.includes(tag) && (
                  <X className="w-3 h-3" />
                )}
              </button>
            ))}
          </div>
          
          {allTags.length > INITIAL_TAG_LIMIT && (
            <button
              onClick={() => setShowAllTags(!showAllTags)}
              className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
            >
              {showAllTags ? 'Show Less' : `Show ${allTags.length - INITIAL_TAG_LIMIT} More Tags`}
            </button>
          )}
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 gap-3">
        {filteredAndSortedLessons.map((lesson, index) => (
          <div 
            key={lesson.id || index} 
            className="bg-slate-800/30 rounded-xl overflow-hidden border border-slate-700/50
                     hover:bg-slate-700/30 transition-colors cursor-pointer"
            onClick={() => handleLessonClick(index)}
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
                <div className="flex items-center gap-4 text-slate-400 text-sm">
                  <div className="flex items-center gap-2">
                    <LessonItemsIcon />
                    {lesson.items.length} items
                  </div>
                  <span>
                    {new Date(lesson.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <button 
                  onClick={(e) => handleViewDetails(e, lesson, index)}
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