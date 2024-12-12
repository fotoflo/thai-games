import React from 'react';
import { Eye } from 'lucide-react';

const CheckAnswerButton = ({ onClick }) => {
  return (
    <div className="flex justify-center mt-12 mb-8">
      <button
        onClick={onClick}
        className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-2 text-lg"
      >
        <Eye size={24} />
        Check Answer
      </button>
    </div>
  );
};

export default CheckAnswerButton; 