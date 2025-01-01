import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import ItemDisplay from "./ItemDisplay";
import { LessonItem } from "@/types/lessons";
import { useThaiSpeech } from "@/hooks/useThaiSpeech";

type Size = "sm" | "md" | "lg" | "xl";

interface SizeConfig {
  textSize: string;
  iconSize: number;
  exampleTextSize: string;
  exampleIconSize: number;
  translationTextSize: string;
  romanizationTextSize: string;
  containerPadding: string;
  contentSpacing: string;
  examplePadding: string;
}

const sizeConfigs: Record<Size, SizeConfig> = {
  sm: {
    textSize: "text-xl",
    iconSize: 16,
    exampleTextSize: "text-base",
    exampleIconSize: 12,
    translationTextSize: "text-base",
    romanizationTextSize: "text-xs",
    containerPadding: "p-2",
    contentSpacing: "space-y-2",
    examplePadding: "p-2",
  },
  md: {
    textSize: "text-2xl",
    iconSize: 18,
    exampleTextSize: "text-lg",
    exampleIconSize: 14,
    translationTextSize: "text-lg",
    romanizationTextSize: "text-sm",
    containerPadding: "p-3",
    contentSpacing: "space-y-2",
    examplePadding: "p-3",
  },
  lg: {
    textSize: "text-3xl",
    iconSize: 20,
    exampleTextSize: "text-lg",
    exampleIconSize: 16,
    translationTextSize: "text-lg",
    romanizationTextSize: "text-sm",
    containerPadding: "p-4",
    contentSpacing: "space-y-3",
    examplePadding: "p-4",
  },
  xl: {
    textSize: "text-4xl",
    iconSize: 24,
    exampleTextSize: "text-3xl",
    exampleIconSize: 18,
    translationTextSize: "text-3xl",
    romanizationTextSize: "text-xl",
    containerPadding: "p-6",
    contentSpacing: "space-y-4",
    examplePadding: "p-5",
  },
};

interface DetailCardProps {
  vocabItem: LessonItem;
  showExamples: boolean;
  onToggleExamples: () => void;
  size?: Size;
}

const DetailCard: React.FC<DetailCardProps> = ({
  vocabItem,
  showExamples,
  onToggleExamples,
  size = "lg", // Default size
}) => {
  const sizeConfig = sizeConfigs[size];

  const { handleSpeak } = useThaiSpeech(false, false);

  return (
    <div className="bg-slate-700/30 rounded-xl overflow-hidden">
      <div
        className={`${sizeConfig.containerPadding} ${sizeConfig.contentSpacing}`}
      >
        <div
          className="cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            handleSpeak(vocabItem.sides[0].markdown);
          }}
        >
          <ItemDisplay
            vocabItem={vocabItem}
            textSize={sizeConfig.textSize}
            iconSize={sizeConfig.iconSize}
            useFullMarkdown={true}
          />
        </div>
        <div className="space-y-1">
          <div
            className={`${sizeConfig.translationTextSize} text-slate-300 cursor-pointer`}
            onClick={(e) => {
              e.preventDefault();
              handleSpeak(vocabItem.sides[1].markdown);
            }}
          >
            translation: {vocabItem.sides[1].markdown}
          </div>
          <div
            className={`${sizeConfig.romanizationTextSize} text-slate-400 font-mono`}
          >
            romanization: {vocabItem.sides[0].metadata?.pronunciation}
          </div>
        </div>

        {vocabItem.tags.length > 0 && (
          <button
            onClick={onToggleExamples}
            className={`flex items-center gap-2 mt-2 ${sizeConfig.romanizationTextSize} text-slate-400 hover:text-slate-300 w-full justify-between p-2 rounded-lg hover:bg-slate-700/30`}
          >
            <span>Tags ({vocabItem.tags.length})</span>
            {showExamples ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        )}
      </div>

      {showExamples && vocabItem.tags.length > 0 && (
        <div className="border-t border-slate-700/50">
          <div className="divide-y divide-slate-700/50">
            {vocabItem.tags.map((tag, idx) => (
              <div
                key={idx}
                className={`${sizeConfig.examplePadding} hover:bg-slate-700/20`}
              >
                <div
                  className={`${sizeConfig.romanizationTextSize} text-slate-400`}
                >
                  {tag}
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
