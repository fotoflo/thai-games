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
      className="fixed inset-0 bg-black/70 z-50"
      onClick={handleBackdropClick}
    >
      <div
        className="fixed inset-0 bg-slate-900 text-white flex flex-col md:m-8 md:rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {showHeader && title && (
          <div className="relative">
            <div
              className={`absolute inset-0 bg-gradient-to-b ${gradientColor} to-transparent -z-10`}
            />
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
          </div>
        )}

        <div className={`flex-1 overflow-y-auto ${className}`}>{children}</div>

        {bottomButtons && (
          <div className="p-4 border-t border-slate-800">{bottomButtons}</div>
        )}
      </div>
    </div>
  );
};

export default ModalContainer;
