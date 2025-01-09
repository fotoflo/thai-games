import React from "react";
import { PlusCircle } from "lucide-react";
import { thaiToIPA } from "../../utils/thaiToIPA";
import { useReadThaiGame } from "@/context/ReadThaiGameContext";

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

const PracticeSetCards: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const { practiceSet, activeItem } = useReadThaiGame();

  return (
    <div className={`flex flex-col relative ${className}`}>
      <div className="flex items-center justify-center gap-2 my-2">
        <div className="flex gap-2 flex-wrap justify-center">
          {practiceSet?.map((item) => {
            const text = item?.item?.sides?.[0]?.markdown;
            if (!text) return null;

            const phoneticText = thaiToIPA(text);
            return (
              <div
                key={item.id}
                className={`
                  text-center p-2 rounded cursor-pointer w-[60px] h-[80px]
                  ${item.id === activeItem?.id ? "bg-blue-700" : "bg-gray-800"}
                  hover:bg-blue-600 transition-colors
                  flex flex-col justify-center
                `}
                // onClick={() => onCardSelect(item)}
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
          {practiceSet?.length > 0 && (
            <button
              // onClick={addMoreItems}
              className="w-[60px] h-[80px] bg-gray-800 hover:bg-blue-600 transition-colors rounded flex items-center justify-center"
            >
              <PlusCircle className="text-gray-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeSetCards;
