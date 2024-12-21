import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import ItemDisplay from "./ItemDisplay";
import { VocabularyItem } from "@/types/lessons";

const DetailCard = ({
  vocabItem,
  showExamples,
  onToggleExamples,
  onSpeak,
}: {
  vocabItem: VocabularyItem;
  showExamples: boolean;
  onToggleExamples: () => void;
  onSpeak: (text: string) => void;
}) => {
  return (
    <div className="bg-slate-700/30 rounded-xl overflow-hidden">
      <div className="p-4 space-y-3">
        <ItemDisplay current={vocabItem} textSize="text-3xl" iconSize={20} />
        <div className="space-y-1">
          <div className="text-lg text-slate-300">
            translation: {vocabItem?.translation}
          </div>
          <div className="text-sm text-slate-400 font-mono">
            romanization: {vocabItem?.romanization}
          </div>
        </div>

        {vocabItem?.examples?.length > 0 && (
          <button
            onClick={onToggleExamples}
            className="flex items-center gap-2 mt-2 text-sm text-slate-400 hover:text-slate-300 w-full justify-between p-2 rounded-lg hover:bg-slate-700/30"
          >
            <span>Examples ({vocabItem?.examples.length})</span>
            {showExamples ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        )}
      </div>

      {showExamples && vocabItem?.examples && (
        <div className="border-t border-slate-700/50">
          <div className="divide-y divide-slate-700/50">
            {vocabItem?.examples.map((example, idx) => (
              <div key={idx} className="p-4 hover:bg-slate-700/20">
                <ItemDisplay
                  current={example}
                  textSize="text-lg"
                  iconSize={16}
                  className="mb-2 items-start"
                />
                <div className="text-sm text-slate-400">
                  {example.translation}
                </div>
                <div className="text-xs text-slate-500 font-mono mt-1">
                  {example.romanization}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailCard;
