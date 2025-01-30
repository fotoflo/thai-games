export type WizardView =
  | "welcome"
  | "languageSelect"
  | "targetSelect"
  | "pathSelect";

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
}
