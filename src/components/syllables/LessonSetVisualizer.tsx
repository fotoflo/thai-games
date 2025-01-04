import { LessonSubset } from "@/machines/lessonActions";
import React from "react";

type ItemStatus = "skip" | "practice" | "unseen" | "mastered";

interface PoolVisualizerProps {
  lesson: LessonSubset;
  className?: string;
}

const LessonSetVisualizer = ({
  lesson,
  className = "",
}: PoolVisualizerProps) => {
  if (!lesson.length) {
    return null;
  }
  // Calculate counts for the legend
  const counts = lesson.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<ItemStatus, number>);

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
          <span className="text-slate-300">Skipped ({counts.skip || 0})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-slate-700" />
          <span className="text-slate-300">Unseen ({counts.unseen || 0})</span>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="flex gap-px">
        {lesson.map((item, index) => (
          <div
            key={item.id}
            className={`h-1 flex-1 first:rounded-l-full last:rounded-r-full ${getStatusColor(
              item.status
            )}`}
          />
        ))}
      </div>
    </div>
  );
};

export default LessonSetVisualizer;

const getStatusColor = (status: ItemStatus): string => {
  switch (status) {
    case "skip":
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
