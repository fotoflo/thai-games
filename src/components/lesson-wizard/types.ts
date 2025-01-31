export interface LessonData {
  name: string;
  description: string;
  subject: string;
  categories: Array<{
    id: string;
    name: string;
  }>;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  estimatedTime: number;
  totalItems: number;
  version: number;
  items: Array<{
    id: string;
    sides: Array<{
      markdown: string;
      metadata?: {
        pronunciation?: string;
      };
    }>;
    tags: string[];
    categories: string[];
    intervalModifier: number;
  }>;
}

export interface WizardState {
  knownLanguages: string[];
  proficiencyLevels: Record<string, string>;
  selectedForProficiency: string | null;
  customLanguage: string;
  showCustomInput: boolean;
  targetLanguage: string | null;
  lessonType: LessonType | null;
  selectedTopic: string | null;
  customTopicTitle: string | null;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | null;
  lessonData: LessonData | null;
}

export type LessonType =
  | "conversational"
  | "nouns"
  | "scenarios"
  | "grammar"
  | "culture"
  | "business";
