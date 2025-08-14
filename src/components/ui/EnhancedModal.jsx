import React, { useEffect, useRef, memo } from "react";

const EnhancedModal = memo(
  ({
    isOpen = false,
    onClose,
    title,
    children,
    size = "medium",
    showCloseButton = true,
    closeOnOverlayClick = true,
    closeOnEscape = true,
    className = "",
    overlayClassName = "",
    contentClassName = "",
  }) => {
    const modalRef = useRef(null);

    const sizeClasses = {
      small: "max-w-md",
      medium: "max-w-lg",
      large: "max-w-2xl",
      xlarge: "max-w-4xl",
      full: "max-w-full mx-4",
    };

    useEffect(() => {
      const handleEscape = (e) => {
        if (closeOnEscape && e.key === "Escape" && isOpen) {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";
      }

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
      };
    }, [isOpen, closeOnEscape, onClose]);

    const handleOverlayClick = (e) => {
      if (closeOnOverlayClick && e.target === e.currentTarget) {
        onClose();
      }
    };

    if (!isOpen) return null;

    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${overlayClassName}`}
        onClick={handleOverlayClick}
      >
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300" />

        {/* Modal */}
        <div
          ref={modalRef}
          className={`relative bg-white rounded-lg shadow-xl transform transition-all duration-300 w-full ${sizeClasses[size]} ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              {title && (
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors duration-200"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className={`p-6 ${contentClassName}`}>{children}</div>
        </div>
      </div>
    );
  }
);

EnhancedModal.displayName = "EnhancedModal";

export default EnhancedModal;
