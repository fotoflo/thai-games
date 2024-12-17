import React from 'react';

const ModalCTAButton = ({ onClick, label }) => {
  return (
    <button
      onClick={onClick}
      className="w-full p-3 bg-green-600 text-white rounded-lg font-semibold
                 transition-colors duration-200 hover:bg-green-700
                 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
    >
      {label}
    </button>
  );
};

export default ModalCTAButton; 