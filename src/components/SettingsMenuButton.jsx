const SettingsMenuButton = ({ icon, label, description, comingSoon, onClick, href }) => (
  <button 
    className={`group w-full flex items-center gap-4 p-4 rounded-lg bg-gray-800 hover:bg-gray-700 text-left transition-colors relative ${comingSoon ? 'opacity-50 cursor-not-allowed' : ''}`}
    disabled={comingSoon}
    onClick={onClick || (() => {
      if (href) {
        window.open(href, '_blank', 'noopener,noreferrer');
      }
    })}
  >
    <div className="flex-shrink-0 text-2xl">
      {icon}
    </div>
    <div className="flex-grow">
      <div className="flex justify-between items-center">
        <span className="font-medium text-white">{label}</span>
        {comingSoon && (
          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full ml-2">
            Coming Soon
          </span>
        )}
      </div>
      <div className="text-sm text-gray-400">
        {description}
      </div>
    </div>
  </button>
);

export default SettingsMenuButton; 