export type WizardView = "welcome" | "languageSelect" | "targetSelect";

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface ProficiencyLevels {
  [key: string]: string;
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
}
