import { SuperSet, RecallCategory } from "@/types/lessons";
import React from "react";

const LessonSubsetVisualizer = ({
  superSet,
  className = "",
  superSetIndex = 0,
}: {
  superSet: SuperSet;
  className?: string;
  superSetIndex: number;
}) => {
  if (!superSet?.length) {
    return <div className={className}>No items in practice set</div>;
  }

  // Calculate counts for the legend
  const counts = superSet.reduce((acc, item) => {
    acc[item.recallCategory] = (acc[item.recallCategory] || 0) + 1;
    return acc;
  }, {} as Record<RecallCategory, number>);

  return (
    <div className={className}>
      {/* Status Legend */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-slate-300">
            Mastered ({counts.mastered || 0})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <span className="text-slate-300">
            Practice ({counts.practice || 0})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-500" />
          <span className="text-slate-300">
            Skipped ({counts.skipped || 0})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-slate-700" />
          <span className="text-slate-300">Unseen ({counts.unseen || 0})</span>
        </div>
      </div>

      {/* Progress Bars with active item indicator */}
      <div className="flex gap-px">
        {superSet.map((item, index) => (
          <div key={item.id} className="relative h-1 flex-1">
            <div
              className={`h-full w-full first:rounded-l-full last:rounded-r-full ${getStatusColor(
                item.recallCategory
              )}`}
            />
            {/* Active item indicator */}
            {index === superSetIndex && (
              <div className="absolute -bottom-1.5 left-0 right-0 h-3/4 bg-slate-500 rounded-full opacity-75" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonSubsetVisualizer;

const getStatusColor = (status: RecallCategory): string => {
  switch (status) {
    case "skipped":
      return "bg-rose-500";
    case "practice":
      return "bg-purple-500";
    case "mastered":
      return "bg-emerald-500";
    case "unseen":
    default:
      return "bg-slate-700";
  }
};
