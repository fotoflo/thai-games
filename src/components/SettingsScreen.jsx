import SettingsMenuButton from './SettingsMenuButton';
import DebugPanelModal from './DebugPanelModal';

const SettingsScreen = ({ closeModal, showDebugPanel, setShowDebugPanel }) => {
  const openDebugPanel = () => {
    setShowDebugPanel(true);
  };

  const closeDebugPanel = () => {
    setShowDebugPanel(false);
  };

  return (
    <>
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4">
          <div className="h-16 flex items-center gap-4">
            <button onClick={closeModal} className="p-2 rounded-full hover:bg-gray-700 text-gray-300">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-white">Menu</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-5 pb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mb-4">Customize your experience, language, and preferences</p>
        
        <div className="max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          <div className="space-y-4">
            <SettingsMenuButton 
              icon="💡" 
              label="Feature suggestions" 
              description="Share your ideas for improving the app" 
              href="https://wa.me/6281717770552"
            />
            <SettingsMenuButton 
              icon="⚠️" 
              label="Report an issue" 
              description="Report bugs, view debug info, or get technical help" 
              onClick={openDebugPanel}
            />
            <SettingsMenuButton 
              icon="🏆" 
              label="Progress & Achievements" 
              description="Track your stats, streaks, and unlock achievements"
              comingSoon
            />

              <SettingsMenuButton 
                icon="⚙️" 
                label="Settings" 
                description="Customize your experience, language, and preferences"
                comingSoon
              />
              <SettingsMenuButton 
                icon="☕" 
                label="Buy me a coffee" 
                description="Support the development of this app"
                comingSoon
              />
              <SettingsMenuButton 
                icon="❤️" 
                label="Rate this app" 
                description="Share your feedback and help others find us"
                comingSoon
              />
              <SettingsMenuButton 
                icon="📤" 
                label="Share with friends" 
                description="Invite others to learn Thai"
                comingSoon
              />
              <SettingsMenuButton 
                icon="❓" 
                label="Help & FAQ" 
                description="Find answers to common questions"
                comingSoon
              />
          </div>
        </div>
      </div>

      {showDebugPanel && (
        <DebugPanelModal 
          onClose={closeDebugPanel}
          showDebug={true}
          setShowDebug={setShowDebugPanel}
          reportProblem={() => console.log('Report Problem')}
          reportPossibleProblem={() => console.log('Report Possible Problem')}
          copyDebugInfo={() => console.log('Copy Debug Info')}
          copied={false}
          workingList={[]}
          possibleProblemList={[]}
          problemList={[]}
        />
      )}
    </>
  );
};

export default SettingsScreen; 