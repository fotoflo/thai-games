import { useRouter } from 'next/router';
import SettingsScreen from './SettingsScreen';
import { useState, useEffect, useRef } from 'react';

const SettingsModalContainer = ({ onClose }) => {
  const router = useRouter();
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const modalRef = useRef(null);

  const closeModal = () => {
    onClose();
    router.push('/');
  };

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-100 flex items-center justify-center z-50">
      <div ref={modalRef} className="w-full max-w-[90%] max-h-[90%] bg-gray-900 rounded-lg overflow-hidden shadow-lg m-4">
        <SettingsScreen 
          closeModal={closeModal} 
          showDebugPanel={showDebugPanel} 
          setShowDebugPanel={setShowDebugPanel} 
        />
      </div>
    </div>
  );
};

export default SettingsModalContainer; 