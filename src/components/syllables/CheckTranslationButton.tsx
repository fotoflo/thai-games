import React from "react";
import { Eye } from "lucide-react";

interface CheckTranslationButtonProps {
  onClick: () => void;
}

const CheckTranslationButton: React.FC<CheckTranslationButtonProps> = ({
  onClick,
}) => {
  return (
    <div className="flex items-center justify-center">
      <button
        onClick={onClick}
        className="p-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-colors"
        title="Check Translation"
      >
        <Eye size={24} />
      </button>
    </div>
  );
};

export default CheckTranslationButton;
