import React from "react";

const SettingsHamburger = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-700"
      title="Settings"
    >
      <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="6" r="2" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="12" cy="18" r="2" />
      </svg>
    </button>
  );
};

export default SettingsHamburger;
