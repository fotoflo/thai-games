import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import ItemDisplay from "./ItemDisplay";
import { VocabularyItem } from "@/types/lessons";

interface DetailCardProps {
  vocabItem: VocabularyItem;
  showExamples: boolean;
  onToggleExamples: () => void;
  onSpeak: (text: string) => void;
}

const DetailCard: React.FC<DetailCardProps> = ({
  vocabItem,
  showExamples,
  onToggleExamples,
  onSpeak,
}) => (
  <div className="bg-slate-800/30 rounded-xl overflow-hidden">
    <div className="p-4 space-y-3">
      <ItemDisplay
        current={vocabItem}
        textSize="text-3xl"
        iconSize={20}
        onSpeak={onSpeak}
      />
      <div className="space-y-1">
        <div className="text-lg text-slate-300">
          translation: {vocabItem?.details?.translation}
        </div>
        <div className="text-sm text-slate-400 font-mono">
          romanization: {vocabItem?.details?.romanization}
        </div>

        {/* <div className="text-sm text-slate-400 font-mono">
          json: <pre>{JSON.stringify(vocabItem, null, 2)}</pre>
        </div> */}
      </div>

      {vocabItem?.examples?.length > 0 && (
        <button
          onClick={onToggleExamples}
          className="flex items-center gap-2 mt-2 text-sm text-slate-400 hover:text-slate-300 w-full justify-between p-2 rounded-lg hover:bg-slate-700/30"
        >
          <span>Examples ({vocabItem?.examples.length})</span>
          {showExamples ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      )}
    </div>

    {showExamples && vocabItem?.details?.examples && (
      <div className="border-t border-slate-700/50">
        <div className="divide-y divide-slate-700/50">
          {vocabItem?.details?.examples.map((example, idx) => (
            <div key={idx} className="p-4 hover:bg-slate-700/20">
              <ItemDisplay
                current={{
                  text: example.text,
                  details: { translation: example.translation },
                }}
                textSize="text-lg"
                iconSize={16}
                onSpeak={onSpeak}
                className="mb-2"
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

export default DetailCard;
