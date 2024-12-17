import React from "react";

interface DifficultyLevelProps {
  difficulty: number;
}

const DifficultyLevel: React.FC<DifficultyLevelProps> = ({ difficulty }) => {
  const getDifficultyColor = (difficulty: number) => {
    const colors = {
      1: "bg-green-500",
      2: "bg-blue-500",
      3: "bg-yellow-500",
      4: "bg-orange-500",
      5: "bg-red-500",
    };
    return colors[difficulty as keyof typeof colors];
  };

  return (
    <div className="flex gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${
            i < difficulty ? getDifficultyColor(difficulty) : "bg-slate-700"
          }`}
        />
      ))}
    </div>
  );
};

export default DifficultyLevel;
