import React, { useState, useEffect } from "react";
import {
  ENTRY_ANIMATIONS,
  EXIT_ANIMATIONS,
  TRANSITIONS,
  SUCCESS_ANIMATION,
  ERROR_ANIMATION,
} from "../../utils/animations";

// Individual Toast component
const Toast = ({
  id,
  type = "info",
  title,
  message,
  duration = 5000,
  onClose,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose(id);
    }, 300);
  };

  if (!isVisible) return null;

  const typeStyles = {
    success: {
      bg: "bg-green-50 border-green-200",
      icon: "text-green-400",
      title: "text-green-800",
      message: "text-green-700",
      iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    error: {
      bg: "bg-red-50 border-red-200",
      icon: "text-red-400",
      title: "text-red-800",
      message: "text-red-700",
      iconPath:
        "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    warning: {
      bg: "bg-yellow-50 border-yellow-200",
      icon: "text-yellow-400",
      title: "text-yellow-800",
      message: "text-yellow-700",
      iconPath:
        "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z",
    },
    info: {
      bg: "bg-blue-50 border-blue-200",
      icon: "text-blue-400",
      title: "text-blue-800",
      message: "text-blue-700",
      iconPath: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
  };

  const style = typeStyles[type];
  const animationClass = isExiting
    ? EXIT_ANIMATIONS.SLIDE_OUT_RIGHT
    : type === "success"
    ? SUCCESS_ANIMATION
    : type === "error"
    ? `${ENTRY_ANIMATIONS.SLIDE_IN_RIGHT} ${ERROR_ANIMATION}`
    : ENTRY_ANIMATIONS.SLIDE_IN_RIGHT;

  return (
    <div
      className={`max-w-sm w-full ${style.bg} border rounded-lg shadow-lg p-4 ${animationClass} ${TRANSITIONS.DEFAULT} hover:shadow-xl hover:scale-105 ${className}`}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className={`h-6 w-6 ${style.icon}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={style.iconPath}
            />
          </svg>
        </div>
        <div className="ml-3 w-0 flex-1">
          {title && (
            <p className={`text-sm font-medium ${style.title}`}>{title}</p>
          )}
          {message && (
            <p className={`text-sm ${style.message} ${title ? "mt-1" : ""}`}>
              {message}
            </p>
          )}
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            className={`inline-flex ${style.icon} hover:opacity-75 focus:outline-none`}
            onClick={handleClose}
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Toast Container component
const ToastContainer = ({ toasts = [], onRemove, position = "top-right" }) => {
  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 transform -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
  };

  return (
    <div className={`fixed z-50 ${positionClasses[position]} space-y-2`}>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onRemove} />
      ))}
    </div>
  );
};

export { Toast, ToastContainer };
export default Toast;
