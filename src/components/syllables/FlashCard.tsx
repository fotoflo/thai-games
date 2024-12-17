import React from "react";
import { Volume2 } from "lucide-react";
import ItemDisplay from "./ItemDisplay";

interface FlashCardProps {
  current: any; // Replace with the appropriate type
  isVisible: boolean;
  onSpeak: () => void;
  className?: string; // Add className prop
}

const FlashCard: React.FC<FlashCardProps> = ({
  current,
  isVisible,
  onSpeak,
  className = "", // Default to an empty string
}) => {
  const details = current?.details || current;

  return (
    <div
      className={`bg-gray-800 rounded-xl shadow-lg min-w-[300px] ${className}`}
    >
      {/* Main word */}
      <div className="flex justify-between items-center mb-4">
        <ItemDisplay
          current={current}
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
            <div className="text-2xl text-gray-200">{details.translation}</div>
            <div className="text-gray-400">{details.romanization}</div>
          </div>

          {/* Notes */}
          {details.notes && (
            <div className="text-gray-400 text-sm bg-gray-700 p-3 rounded">
              {details.notes}
            </div>
          )}

          {/* Example */}
          {details.examples && details.examples.length > 0 && (
            <div className="mt-4 space-y-4">
              {details.examples.map((example, index) => (
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
          {details.tags && (
            <div className="flex flex-wrap gap-2 mt-4">
              {details.tags.map((tag, index) => (
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
