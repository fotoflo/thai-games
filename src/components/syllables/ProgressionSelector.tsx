import React from "react";

const ProgressionSelector: React.FC = () => {
  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => send({ type: "toggle", toggle: "ON" })}
        className={`flex-1 py-2 px-4 rounded ${
          state.value === "ON"
            ? "bg-blue-600 text-white"
            : "bg-gray-700 text-gray-300"
        }`}
      >
        First Pass
      </button>
      <button
        onClick={() => send({ type: "toggle", toggle: "OFF" })}
        className={`flex-1 py-2 px-4 rounded ${
          state.value === "OFF"
            ? "bg-blue-600 text-white"
            : "bg-gray-700 text-gray-300"
        }`}
      >
        Practice
      </button>
    </div>
  );
};

export default ProgressionSelector;
