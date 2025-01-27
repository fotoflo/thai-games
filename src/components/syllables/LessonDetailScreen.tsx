import React, { useState, useEffect } from "react";
import { X, BookOpen, Globe } from "lucide-react";
import { Lesson } from "@/types/lessons";
import ModalContainer from "../ui/ModalContainer";
import DetailCard from "./DetailCard";
import ItemDisplay from "./ItemDisplay";
import { useModal, modals } from "@/hooks/useModal";
import { useGameActions } from "@/hooks/game/useReadThaiGame";

interface LessonDetailsData {
  lesson: Lesson;
  index: number;
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
            {lesson?.categories?.map((cat) => cat.name).join(", ")}
          </span>
        </div>
        <h1 className="text-2xl font-semibold">{lesson?.name}</h1>
      </div>
      <button
        onClick={onClose}
        className="p-2 hover:bg-slate-800/50 rounded-lg"
      >
        <X className="w-5 h-5" />
      </button>
    </div>

    <p className="text-sm text-slate-300 leading-relaxed">
      {lesson?.description}
    </p>

    <div className="flex flex-wrap gap-2">
      <span className="px-3 py-1.5 bg-slate-800/50 rounded-full text-sm inline-flex items-center gap-2">
        <Globe className="w-3.5 h-3.5" />
        {lesson?.subject}
      </span>
      <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full text-sm">
        {lesson?.difficulty}
      </span>
    </div>
  </div>
);

const LessonDetails = () => {
  const [expandedItems, setExpandedItems] = useState(new Set());
  const modal = useModal<LessonDetailsData>();
  const { chooseLesson } = useGameActions();

  // Register the modal as soon as possible
  useEffect(() => {
    if (modal) {
      modals.lessonDetails = modal;
      console.log("Registered lessonDetails modal:", modal);
    }
  }, [modal]);

  if (!modal.isOpen || !modal.data) {
    console.log("Modal not open or no data:", {
      isOpen: modal.isOpen,
      data: modal.data,
    });
    return null;
  }

  const { lesson } = modal.data;
  console.log("Rendering lesson details for:", lesson?.name);

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
        const lessonWithTimestamps = {
          ...lesson,
          createdAt: lesson.createdAt || new Date(),
          updatedAt: lesson.updatedAt || new Date(),
        };
        chooseLesson(0, [lessonWithTimestamps]);
        modal.close();
      }}
      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
    >
      <BookOpen className="w-5 h-5" />
      Start Learning
    </button>
  );

  return (
    <ModalContainer
      onClose={modal.close}
      showHeader={true}
      bottomButtons={studyButton}
      gradientColor="from-emerald-600/20"
      headerContent={<LessonHeader lesson={lesson} onClose={modal.close} />}
    >
      {/* Vocabulary Overview Grid */}
      <div className="py-4">
        <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-2">
          Vocabulary Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {lesson?.items?.map((item, index) => (
            <div
              key={index}
              className="bg-slate-800/30 p-3 hover:bg-slate-700/30 transition-colors"
            >
              <ItemDisplay
                key={index}
                vocabItem={item}
                textSize="text-lg sm:text-xl"
                iconSize={16}
                sideTwoTextSize="text-sm sm:text-base"
                showBothSides={true}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Cards */}
      <div className="px-4 pb-4 space-y-4">
        <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide">
          Vocabulary Details
        </h2>
        {lesson?.items?.map((item, index) => (
          <DetailCard
            key={index}
            vocabItem={item}
            showExamples={expandedItems.has(index)}
            onToggleExamples={() => toggleExamples(index)}
          />
        ))}
      </div>
    </ModalContainer>
  );
};

export default LessonDetails;
