export type WizardView =
  | "welcome"
  | "languageSelect"
  | "targetSelect"
  | "pathSelect"
  | "jsonUpload"
  | "lessonTopic";

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface ProficiencyLevels {
  [key: string]: string;
}

export type PathType = "existing" | "new" | null;
export type LessonType =
  | "conversational"
  | "nouns"
  | "scenarios"
  | "grammar"
  | "culture"
  | "business"
  | null;

export interface LessonCategory {
  id: string;
  name: string;
}

export interface LessonSide {
  markdown: string;
  metadata?: {
    pronunciation?: string;
    [key: string]: unknown;
  };
}

export interface LessonItem {
  id: string;
  sides: LessonSide[];
  tags: string[];
  categories: string[];
  intervalModifier: number;
}

export interface LessonData {
  name: string;
  description: string;
  subject: string;
  categories: LessonCategory[];
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  estimatedTime: number;
  totalItems: number;
  version: number;
  items: LessonItem[];
}

export interface WizardState {
  view: WizardView;
  showNext: boolean;
  knownLanguages: string[];
  proficiencyLevels: ProficiencyLevels;
  selectedForProficiency: string | null;
  customLanguage: string;
  showCustomInput: boolean;
  targetLanguage: string | null;
  pathType: PathType;
  lessonType: LessonType;
  lessonData: LessonData | null;
  selectedTopic: string | null;
}
