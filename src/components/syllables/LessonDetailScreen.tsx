import React, { useState } from "react";
import {
  X,
  Volume2,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Tag,
  Globe,
} from "lucide-react";
import { Lesson } from "@/types/lessons";
import ModalContainer from "../ui/ModalContainer";
import ItemDisplay from "./ItemDisplay";

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
  <div className="relative">
    <div className="absolute inset-0 bg-gradient-to-b from-emerald-600/20 to-transparent -z-10" />
    <div className="px-4 py-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-500">
              {lesson.lessonType}
            </span>
          </div>
          <h1 className="text-2xl font-semibold">{lesson.lessonName}</h1>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-800/50 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <p className="text-sm text-slate-300 leading-relaxed">
        {lesson.lessonDescription}
      </p>

      <div className="flex flex-wrap gap-2">
        <span className="px-3 py-1.5 bg-slate-800/50 rounded-full text-sm inline-flex items-center gap-2">
          <Globe className="w-3.5 h-3.5" />
          {lesson.languagePair?.target?.name}
        </span>
        <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full text-sm">
          {lesson.lessonLevel}
        </span>
      </div>
    </div>
  </div>
);

const DetailCard = ({ item, showExamples, onToggleExamples, onSpeak }) => (
  <div className="bg-slate-800/30 rounded-xl overflow-hidden">
    <div className="p-4 space-y-3">
      <ItemDisplay
        current={item}
        textSize="text-3xl"
        iconSize={20}
        onSpeak={onSpeak}
      />
      <div className="space-y-1">
        <div className="text-lg text-slate-300">{item.translation}</div>
        <div className="text-sm text-slate-400 font-mono">
          {item.romanization}
        </div>
      </div>

      {item.examples?.length > 0 && (
        <button
          onClick={onToggleExamples}
          className="flex items-center gap-2 mt-2 text-sm text-slate-400 hover:text-slate-300 w-full justify-between p-2 rounded-lg hover:bg-slate-700/30"
        >
          <span>Examples ({item.examples.length})</span>
          {showExamples ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      )}
    </div>

    {showExamples && item.examples && (
      <div className="border-t border-slate-700/50">
        <div className="divide-y divide-slate-700/50">
          {item.examples.map((example, idx) => (
            <div key={idx} className="p-4 hover:bg-slate-700/20">
              <ItemDisplay
                current={{
                  text: example.text,
                  details: { translation: example.translation },
                }}
                textSize="text-lg"
                iconSize={16}
                onSpeak={onSpeak}
                className="mb-2"
              />
              <div className="text-sm text-slate-400">
                {example.translation}
              </div>
              <div className="text-xs text-slate-500 font-mono mt-1">
                {example.romanization}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
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
    // Implement speech functionality
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

  return (
    <div className="fixed inset-0 bg-slate-900 text-white flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <LessonHeader lesson={lesson} onClose={onClose} />

        {/* Detailed Cards */}
        <div className="px-4 pb-4 space-y-4">
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide">
            Vocabulary Details
          </h2>
          {lesson.items?.map((item, index) => (
            <DetailCard
              key={index}
              item={item}
              showExamples={expandedItems.has(index)}
              onToggleExamples={() => toggleExamples(index)}
              onSpeak={handleSpeak}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
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
      </div>
    </div>
  );
};

export default LessonDetails;
