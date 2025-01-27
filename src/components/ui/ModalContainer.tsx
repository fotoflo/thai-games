import React, { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface ModalContainerProps {
  children: ReactNode;
  onClose: () => void;
  title?: string;
  className?: string;
  showClose?: boolean;
  bottomButtons?: ReactNode;
  showHeader?: boolean;
  gradientColor?: string;
  headerContent?: ReactNode;
}

const ModalContainer: React.FC<ModalContainerProps> = ({
  children,
  onClose,
  title,
  className = "",
  showClose = true,
  bottomButtons,
  showHeader = true,
  gradientColor = "from-emerald-600/20",
  headerContent,
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
      className="fixed inset-0 bg-black/70 z-50 flex justify-center p-8"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-slate-900 text-white flex flex-col rounded-lg overflow-hidden h-full w-full max-w-[800px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header Section */}
        <div className="relative">
          <div
            className={`absolute inset-0 bg-gradient-to-b ${gradientColor} to-transparent`}
          />
          {showHeader && (title || headerContent) && (
            <div className="relative z-10">
              {title && (
                <div className="px-4 py-6">
                  <div className="flex items-start justify-between">
                    <h2 className="text-2xl font-semibold">{title}</h2>
                    {showClose && (
                      <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-800/50 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
              {headerContent}
            </div>
          )}
        </div>

        {/* Scrollable Content Section with custom scrollbar */}
        <div
          className={`
            flex-1 overflow-y-auto relative 
            scrollbar-thin scrollbar-track-slate-800 
            scrollbar-thumb-slate-600 hover:scrollbar-thumb-slate-500
            ${className}
          `}
        >
          {children}
        </div>

        {/* Fixed Bottom Section */}
        {bottomButtons && (
          <div className="p-4 border-t border-slate-800">{bottomButtons}</div>
        )}
      </div>
    </div>
  );
};

export default ModalContainer;
