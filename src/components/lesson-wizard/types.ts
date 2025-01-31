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
  lessonData: any | null;
}

export type LessonType =
  | "conversational"
  | "nouns"
  | "scenarios"
  | "grammar"
  | "culture"
  | "business";
