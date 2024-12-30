import React from 'react';
import Link from 'next/link';

const SettingsScreen = ({ closeModal, showDebugPanel, setShowDebugPanel }) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <button
          onClick={closeModal}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-white">Show Debug Panel</span>
          <button
            onClick={() => setShowDebugPanel(!showDebugPanel)}
            className={`px-4 py-2 rounded-lg ${
              showDebugPanel
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {showDebugPanel ? 'Hide' : 'Show'}
          </button>
        </div>

        <Link href="/debug" className="block">
          <button 
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600"
            onClick={closeModal}
          >
            Open Debug View
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SettingsScreen; 