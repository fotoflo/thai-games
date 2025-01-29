import React, { useState, useEffect } from "react";
import { LessonItem } from "@/types/lessons";
import { Subject, Level, Topic } from "./lesson-creator-wizard/types";
import LessonCreatorHeader from "./lesson-creator-wizard/LessonCreatorHeader";
import SubjectSelection from "./lesson-creator-wizard/sections/SubjectSelection";
import LevelSelection from "./lesson-creator-wizard/sections/LevelSelection";
import TopicSelection from "./lesson-creator-wizard/sections/TopicSelection";
import CardPreview from "./lesson-creator-wizard/sections/CardPreview";
import LessonJsonUploader from "./lessons/LessonJsonUploader";

interface LessonCreatorWizardProps {
  onClose: () => void;
}

const LessonCreatorWizard: React.FC<LessonCreatorWizardProps> = ({
  onClose,
}) => {
  // Mode state
  const [isJsonMode, setIsJsonMode] = useState(false);

  // Selection states
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [previewItems, setPreviewItems] = useState<LessonItem[]>([]);

  // Generate preview items when topic is selected
  useEffect(() => {
    if (selectedSubject && selectedLevel && selectedTopic) {
      // TODO: Call AI service to generate initial cards
      setPreviewItems([]); // Temporary empty array until AI integration
    }
  }, [selectedSubject, selectedLevel, selectedTopic]);

  // Handle back navigation
  const handleBack = () => {
    if (selectedTopic) {
      setSelectedTopic(null);
    } else if (selectedLevel) {
      setSelectedLevel(null);
    } else if (selectedSubject) {
      setSelectedSubject(null);
    }
  };

  // Preview card actions
  const handleRegenerate = async () => {
    // TODO: Call AI service to regenerate cards
    console.log("Regenerating cards...");
  };

  const handleApproveCard = (index: number) => {
    // TODO: Mark card as approved
    console.log("Approving card:", index);
  };

  const handleRejectCard = (index: number) => {
    // TODO: Mark card as rejected and possibly regenerate
    console.log("Rejecting card:", index);
  };

  const handleCustomize = () => {
    // TODO: Open customization modal/interface
    console.log("Opening customization...");
  };

  const handleCreateLesson = async () => {
    // TODO: Create final lesson with approved cards
    console.log("Creating lesson...");
  };

  // Determine if we can go back based on current state
  const canGoBack = Boolean(selectedSubject || selectedLevel || selectedTopic);

  return (
    <div className="flex flex-col max-h-[90vh]">
      <LessonCreatorHeader
        isJsonMode={isJsonMode}
        setIsJsonMode={setIsJsonMode}
        canGoBack={canGoBack}
        onBack={handleBack}
        onClose={onClose}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-4">
          {isJsonMode ? (
            <LessonJsonUploader onUploadSuccess={onClose} />
          ) : (
            <>
              {!selectedSubject && (
                <SubjectSelection
                  onSelect={setSelectedSubject}
                  selectedSubject={selectedSubject}
                />
              )}

              {selectedSubject && !selectedLevel && (
                <LevelSelection
                  onSelect={setSelectedLevel}
                  selectedLevel={selectedLevel}
                />
              )}

              {selectedLevel && !selectedTopic && (
                <TopicSelection
                  onSelect={setSelectedTopic}
                  selectedTopic={selectedTopic}
                />
              )}

              {selectedSubject && selectedLevel && selectedTopic && (
                <CardPreview
                  subject={selectedSubject}
                  level={selectedLevel}
                  topic={selectedTopic}
                  previewItems={previewItems}
                  onRegenerate={handleRegenerate}
                  onApproveCard={handleApproveCard}
                  onRejectCard={handleRejectCard}
                  onCustomize={handleCustomize}
                  onCreateLesson={handleCreateLesson}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonCreatorWizard;
