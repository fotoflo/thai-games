import { Difficulty } from "@/types/lessons";

export const popularSubjects = [
  { id: "thai", name: "Thai", icon: "🇹🇭" },
  { id: "japanese", name: "Japanese", icon: "🇯🇵" },
  { id: "math", name: "Mathematics", icon: "🔢" },
  { id: "science", name: "Science", icon: "🔬" },
  { id: "history", name: "History", icon: "📚" },
] as const;

export const popularTopics = [
  { id: "food", name: "Food & Dining", icon: "🍜" },
  { id: "travel", name: "Travel Basics", icon: "✈️" },
  { id: "greetings", name: "Greetings", icon: "👋" },
] as const;

export const levels = [
  { id: "BEGINNER" as Difficulty, name: "Beginner" },
  { id: "INTERMEDIATE" as Difficulty, name: "Intermediate" },
  { id: "ADVANCED" as Difficulty, name: "Advanced" },
] as const;
