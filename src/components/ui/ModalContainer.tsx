import React, { ReactNode, useEffect } from "react";

interface ModalContainerProps {
  children: ReactNode;
  onClose: () => void;
  title: string;
  className?: string;
  showClose?: boolean;
  bottomButtons?: ReactNode;
}

const ModalContainer: React.FC<ModalContainerProps> = ({
  children,
  onClose,
  title,
  className = "",
  showClose = true,
  bottomButtons,
}) => {
  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-gray-800 p-4 xs:p-5 rounded-lg shadow-2xl max-w-md w-full h-[90vh] relative ${className}`}
      >
        <h2 className="text-2xl font-bold mb-4 xs:mb-6 text-white border-b border-gray-600 pb-3 flex justify-between items-center">
          {title}
          {showClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors text-base"
            >
              Close
            </button>
          )}
        </h2>

        <div className="h-[calc(100%-138px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {children}
        </div>

        {bottomButtons && (
          <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-4">
            {bottomButtons}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalContainer;
