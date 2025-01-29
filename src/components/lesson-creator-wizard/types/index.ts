import { LessonItem, Difficulty } from "@/types/lessons";

export interface Subject {
  id: string;
  name: string;
  icon: string;
}

export interface Level {
  id: Difficulty;
  name: string;
}

export interface Topic {
  id: string;
  name: string;
  icon: string;
}

export interface PreviewCard {
  thai: string;
  phonetic: string;
  english: string;
}

// Props interfaces
export interface LessonCreatorWizardProps {
  onClose: () => void;
}

export interface HeaderProps {
  isJsonMode: boolean;
  setIsJsonMode: (isJson: boolean) => void;
  canGoBack: boolean;
  onBack: () => void;
  onClose: () => void;
}

export interface SubjectSelectionProps {
  onSelect: (subject: Subject) => void;
  selectedSubject: Subject | null;
}

export interface LevelSelectionProps {
  onSelect: (level: Level) => void;
  selectedLevel: Level | null;
}

export interface TopicSelectionProps {
  onSelect: (topic: Topic) => void;
  selectedTopic: Topic | null;
}

export interface CardPreviewProps {
  subject: Subject;
  level: Level;
  topic: Topic;
  previewItems: LessonItem[];
  onRegenerate: () => void;
  onApproveCard: (index: number) => void;
  onRejectCard: (index: number) => void;
  onCustomize: () => void;
  onCreateLesson: () => void;
}
