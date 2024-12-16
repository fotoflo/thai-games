import { useRouter } from 'next/router';
import DebugPanelModal from './DebugPanelModal';
import { useState, useEffect, useRef } from 'react';

const SettingsModal = ({ onClose }) => {
  const router = useRouter();
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const modalRef = useRef(null);

  const closeModal = () => {
    onClose();
    router.push('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalRef]);

  const openDebugPanel = () => {
    setShowDebugPanel(true);
  };

  const closeDebugPanel = () => {
    setShowDebugPanel(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-100 flex items-center justify-center z-50">
      <div ref={modalRef} className="w-full max-w-4xl bg-gray-900 rounded-lg overflow-hidden shadow-lg m-20">
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
              {/* Available Features */}
              <MenuButton 
                icon="💡" 
                label="Feature suggestions" 
                description="Share your ideas for improving the app" 
                href="https://wa.me/6281717770552"
              />
              <MenuButton 
                icon="⚠️" 
                label="Report an issue" 
                description="Report bugs, view debug info, or get technical help" 
                onClick={openDebugPanel}
              />

              {/* Coming Soon Features */}
              <MenuButton 
                icon="🏆" 
                label="Progress & Achievements" 
                description="Track your stats, streaks, and unlock achievements"
                comingSoon
              />
              <MenuButton 
                icon="⚙️" 
                label="Settings" 
                description="Customize your experience, language, and preferences"
                comingSoon
              />
              <MenuButton 
                icon="☕" 
                label="Buy me a coffee" 
                description="Support the development of this app"
                comingSoon
              />
              <MenuButton 
                icon="❤️" 
                label="Rate this app" 
                description="Share your feedback and help others find us"
                comingSoon
              />
              <MenuButton 
                icon="📤" 
                label="Share with friends" 
                description="Invite others to learn Thai"
                comingSoon
              />
              <MenuButton 
                icon="❓" 
                label="Help & FAQ" 
                description="Find answers to common questions"
                comingSoon
              />
            </div>
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
    </div>
  );
};

const MenuButton = ({ icon, label, description, comingSoon, onClick, href }) => (
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

export default SettingsModal;