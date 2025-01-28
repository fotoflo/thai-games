import React from 'react';
import Image from 'next/image';

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
        <Image
          alt="English"
          src="http://purecatamphetamine.github.io/country-flag-icons/3x2/GB.svg"
          width={24}
          height={16}
          className="w-6 h-4"
        />
      ) : (
        <Image
          alt="Thailand"
          src="http://purecatamphetamine.github.io/country-flag-icons/3x2/TH.svg"
          width={24}
          height={16}
          className="w-6 h-4"
        />
      )}
    </button>
  );
};

export default ToggleInvertTranslationButton; 