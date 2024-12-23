import React from "react";
import { PlusCircle } from "lucide-react";
import { thaiToIPA } from "../../utils/thaiToIPA";
import { WorkingSetItem } from "../../types/lessons";

interface WorkingSetCardsProps {
  workingSet: WorkingSetItem[];
  selectedItem: WorkingSetItem | null;
  onCardSelect: (item: WorkingSetItem) => void;
  addMoreItems: () => void;
  progressionMode: string;
  currentLesson: number;
  lessonSubset: {
    practiceItems: string[];
  };
}

const getTextSizeClass = (text: string): string => {
  if (text.length <= 3) return "text-lg";
  if (text.length <= 5) return "text-base";
  if (text.length <= 7) return "text-sm";
  return "text-xs";
};

const getPhoneticSizeClass = (text: string): string => {
  if (text.length <= 5) return "text-xs";
  if (text.length <= 8) return "text-[10px]";
  return "text-[8px]";
};

const WorkingSetCards: React.FC<WorkingSetCardsProps> = ({
  workingSet,
  selectedItem,
  onCardSelect,
  addMoreItems,
  progressionMode,
  currentLesson,
  lessonSubset,
}) => {
  return (
    <div className="flex flex-col relative">
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="flex gap-2 flex-wrap justify-center">
          {workingSet.map((item) => {
            const text = item.vocabularyItem.text;
            if (!text) return null;

            const phoneticText = thaiToIPA(text);
            return (
              <div
                key={item.id}
                className={`
                  text-center p-2 rounded cursor-pointer w-[60px] h-[80px]
                  ${
                    item.id === selectedItem?.id ? "bg-blue-700" : "bg-gray-800"
                  }
                  hover:bg-blue-600 transition-colors
                  flex flex-col justify-center
                `}
                onClick={() => onCardSelect(item)}
                role="button"
                tabIndex={0}
              >
                <div
                  className={`text-white ${getTextSizeClass(
                    text
                  )} leading-tight`}
                >
                  {text}
                </div>
                <div
                  className={`text-gray-400 ${getPhoneticSizeClass(
                    phoneticText
                  )} leading-tight`}
                >
                  [
                  {phoneticText.length > 10
                    ? `${phoneticText.substring(0, 10)}...`
                    : phoneticText}
                  ]
                </div>
              </div>
            );
          })}
          {workingSet.length < 5 && (
            <div className="ml-auto">
              <button
                onClick={addMoreItems}
                className="flex flex-col items-center justify-center p-2 rounded bg-green-600 hover:bg-green-500 transition-colors cursor-pointer w-[60px] h-[80px]"
                title="Add One More Item"
              >
                <PlusCircle size={24} className="text-white" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="absolute bottom-0 right-0 text-xs text-gray-400">
        PracticeSet: {lessonSubset.practiceItems.length}, WorkingSet:{" "}
        {workingSet.length}
      </div>
    </div>
  );
};

export default WorkingSetCards;
