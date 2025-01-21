import React from 'react';

const ToggleInvertTranslationButton = ({ toggleInvertTranslation, invertCard }) => {
  
  const handleToggle = () => {
    toggleInvertTranslation(!invertCard);
  };

  return (
    <button
      className="flex
      items-center
      p-2
      rounded-full
      bg-gray-800
      text-white
      hover:bg-gray-700
      transition-colors"
      onClick={handleToggle}
      title={invertCard ? 'Show Original' : 'Show Translation'}
    >
      {invertCard ? (
        <img
          alt="English"
          src="http://purecatamphetamine.github.io/country-flag-icons/3x2/GB.svg"
          className="w-6 h-4" // Adjust size as needed
        />
      ) : (
        <img
          alt="Thailand"
          src="http://purecatamphetamine.github.io/country-flag-icons/3x2/TH.svg"
          className="w-6 h-4" // Adjust size as needed
        />
      )}
    </button>
  );
};

export default ToggleInvertTranslationButton; 