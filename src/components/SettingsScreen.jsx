import SettingsMenuButton from './SettingsMenuButton';
import DebugPanelModal from './DebugPanelModal';
import ModalContainer from './ui/ModalContainer';
import { ArrowLeft } from 'lucide-react';

const SettingsHeader = ({ onClose }) => (
  <div className="px-4 py-6 space-y-4">
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-slate-300">
          Customize your experience, language, and preferences
        </p>
      </div>
      <button
        onClick={onClose}
        className="p-2 hover:bg-slate-800/50 rounded-lg"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
    </div>
  </div>
);

const SettingsScreen = ({ closeModal, showDebugPanel, setShowDebugPanel }) => {
  const openDebugPanel = () => {
    setShowDebugPanel(true);
  };

  const closeDebugPanel = () => {
    setShowDebugPanel(false);
  };

  return (
    <>
      <ModalContainer
        onClose={closeModal}
        showHeader={true}
        headerContent={<SettingsHeader onClose={closeModal} />}
        gradientColor="from-slate-600/20"
      >
        <div className="px-4 pb-4">
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
      </ModalContainer>

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