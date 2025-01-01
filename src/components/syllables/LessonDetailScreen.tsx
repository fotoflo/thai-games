import React, { useState } from "react";
import { X, BookOpen, Globe } from "lucide-react";
import { Lesson } from "@/types/lessons";
import ModalContainer from "../ui/ModalContainer";
import DetailCard from "./DetailCard";

interface LessonDetailsProps {
  lesson: Lesson;
  onClose: () => void;
  onStudyLesson: (index: number) => void;
  lessonIndex: number;
}

const LessonHeader = ({
  lesson,
  onClose,
}: {
  lesson: Lesson;
  onClose: () => void;
}) => (
  <div className="px-4 py-6 space-y-4">
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-medium text-emerald-500">
            {lesson.lessonType}
          </span>
        </div>
        <h1 className="text-2xl font-semibold">{lesson.name}</h1>
      </div>
      <button
        onClick={onClose}
        className="p-2 hover:bg-slate-800/50 rounded-lg"
      >
        <X className="w-5 h-5" />
      </button>
    </div>

    <p className="text-sm text-slate-300 leading-relaxed">
      {lesson.description}
    </p>

    <div className="flex flex-wrap gap-2">
      <span className="px-3 py-1.5 bg-slate-800/50 rounded-full text-sm inline-flex items-center gap-2">
        <Globe className="w-3.5 h-3.5" />
        {lesson.languagePair?.target?.name}
      </span>
      <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full text-sm">
        {lesson.level}
      </span>
    </div>
  </div>
);

const LessonDetails = ({
  lesson,
  onClose,
  onStudyLesson,
  lessonIndex,
}: LessonDetailsProps) => {
  const [expandedItems, setExpandedItems] = useState(new Set());

  const handleSpeak = (text: string) => {
    console.log("Speaking:", text);
  };

  const toggleExamples = (index: number) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const studyButton = (
    <button
      onClick={() => {
        onStudyLesson(lessonIndex);
        onClose();
      }}
      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
    >
      <BookOpen className="w-5 h-5" />
      Start Learning
    </button>
  );

  return (
    <ModalContainer
      onClose={onClose}
      showHeader={true}
      bottomButtons={studyButton}
      gradientColor="from-emerald-600/20"
      headerContent={<LessonHeader lesson={lesson} onClose={onClose} />}
    >
      {/* Vocabulary Overview Grid */}
      <div className="py-4">
        <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-2">
          Vocabulary Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {lesson.items.map((item, index) => (
            <div
              key={index}
              className="bg-slate-800/30 p-3 hover:bg-slate-700/30 transition-colors"
            >
              <div className="text-lg sm:text-xl text-slate-100">
                {item.text}
              </div>
              <div className="text-xs sm:text-sm text-slate-400">
                {item.translation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Cards */}
      <div className="px-4 pb-4 space-y-4">
        <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide">
          Vocabulary Details
        </h2>
        {lesson.items.map((item, index) => (
          <DetailCard
            key={index}
            vocabItem={item}
            showExamples={expandedItems.has(index)}
            onToggleExamples={() => toggleExamples(index)}
            onSpeak={handleSpeak}
          />
        ))}
      </div>
    </ModalContainer>
  );
};

export default LessonDetails;
