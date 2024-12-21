import React from "react";
import { Volume2 } from "lucide-react";
import ItemDisplay from "./ItemDisplay";
import { Example, VocabularyItem } from "@/types/lessons";

interface FlashCardProps {
  vocabItem: VocabularyItem;
  isVisible: boolean;
  onSpeak: () => void;
}

const FlashCard: React.FC<FlashCardProps> = ({
  vocabItem,
  isVisible,
  onSpeak,
}) => {
  return (
    <div className={`bg-gray-800 rounded-xl shadow-lg min-w-[300px]`}>
      {/* Main word */}
      <div className="flex justify-between items-center mb-4">
        <ItemDisplay
          current={vocabItem}
          textSize="text-6xl"
          iconSize={52}
          speakOnMount={true}
          speakOnUnmount={true}
        />
        <button onClick={onSpeak} className="text-gray-400 hover:text-gray-200">
          <Volume2 size={24} />
        </button>
      </div>

      {isVisible && (
        <div className="mt-6 pt-6 border-t border-gray-600 space-y-4">
          {/* Translation and Romanization */}
          <div>
            <div className="text-2xl text-gray-200">
              {vocabItem.translation}
            </div>
            {vocabItem.romanization && (
              <div className="text-gray-400">{vocabItem.romanization}</div>
            )}
          </div>

          {/* Notes */}
          {vocabItem.notes && (
            <div className="text-gray-400 text-sm bg-gray-700 p-3 rounded">
              {vocabItem.notes}
            </div>
          )}

          {/* Examples */}
          {vocabItem.examples?.length > 0 && (
            <div className="mt-4 space-y-4">
              {vocabItem.examples.map((example: Example, index: number) => (
                <div key={index} className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-2">
                    <ItemDisplay
                      current={example}
                      textSize="text-2xl"
                      iconSize={22}
                    />
                  </div>
                  <div className="text-gray-300 mt-1">
                    {example.translation}
                  </div>
                  <div className="text-sm text-gray-400">
                    {example.romanization}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tags */}
          {vocabItem.tags && (
            <div className="flex flex-wrap gap-2 mt-4">
              {vocabItem.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlashCard;
