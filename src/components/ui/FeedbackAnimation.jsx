import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  SUCCESS_ANIMATION,
  ERROR_ANIMATION,
  FEEDBACK_ANIMATIONS,
  ENTRY_ANIMATIONS,
  EXIT_ANIMATIONS,
} from "../../utils/animations";

// Floating feedback animation component
const FloatingFeedback = ({
  type = "success",
  message,
  icon,
  position = { x: 0, y: 0 },
  duration = 2000,
  onComplete,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [animationPhase, setAnimationPhase] = useState("enter");

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationPhase("exit");
      setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 300);
    }, duration - 300);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!isVisible) return null;

  const typeStyles = {
    success: {
      bg: "bg-green-500",
      text: "text-white",
      icon: "✓",
      animation: SUCCESS_ANIMATION,
    },
    error: {
      bg: "bg-red-500",
      text: "text-white",
      icon: "✕",
      animation: ERROR_ANIMATION,
    },
    warning: {
      bg: "bg-yellow-500",
      text: "text-white",
      icon: "⚠",
      animation: FEEDBACK_ANIMATIONS.warning,
    },
    info: {
      bg: "bg-blue-500",
      text: "text-white",
      icon: "ℹ",
      animation: FEEDBACK_ANIMATIONS.info,
    },
  };

  const style = typeStyles[type];
  const animationClass =
    animationPhase === "enter"
      ? `${ENTRY_ANIMATIONS.BOUNCE_IN} ${style.animation}`
      : EXIT_ANIMATIONS.FADE_OUT;

  return createPortal(
    <div
      className={`
        fixed z-50 px-4 py-2 rounded-lg shadow-lg pointer-events-none
        ${style.bg} ${style.text} ${animationClass}
        flex items-center gap-2 font-medium text-sm
      `}
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -100%)",
      }}
    >
      <span className="text-lg">{icon || style.icon}</span>
      {message && <span>{message}</span>}
    </div>,
    document.body
  );
};

// Inline feedback component
const InlineFeedback = ({
  type = "success",
  message,
  icon,
  visible = true,
  className = "",
  onAnimationComplete,
}) => {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (visible) {
      setAnimationKey((prev) => prev + 1);
    }
  }, [visible, message]);

  if (!visible) return null;

  const typeStyles = {
    success: {
      bg: "bg-green-50 dark:bg-green-900/90",
      border: "border-green-200 dark:border-green-800",
      text: "text-green-800 dark:text-green-200",
      icon: "text-green-500",
      iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      animation: SUCCESS_ANIMATION,
    },
    error: {
      bg: "bg-red-50 dark:bg-red-900/20",
      border: "border-red-200 dark:border-red-800",
      text: "text-red-800 dark:text-red-200",
      icon: "text-red-500",
      iconPath:
        "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
      animation: ERROR_ANIMATION,
    },
    warning: {
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      border: "border-yellow-200 dark:border-yellow-800",
      text: "text-yellow-800 dark:text-yellow-200",
      icon: "text-yellow-500",
      iconPath:
        "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z",
      animation: FEEDBACK_ANIMATIONS.warning,
    },
    info: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-800 dark:text-blue-200",
      icon: "text-blue-500",
      iconPath: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      animation: FEEDBACK_ANIMATIONS.info,
    },
  };

  const style = typeStyles[type];

  return (
    <div
      key={animationKey}
      className={`
        flex items-center gap-3 p-3 rounded-lg border
        ${style.bg} ${style.border} ${style.animation}
        ${className}
      `}
      onAnimationEnd={onAnimationComplete}
    >
      <div className={`flex-shrink-0 ${style.icon}`}>
        {icon || (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={style.iconPath}
            />
          </svg>
        )}
      </div>
      <div className={`flex-1 ${style.text}`}>
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
};

// Button feedback component
const ButtonFeedback = ({
  children,
  onSuccess,
  onError,
  successMessage = "Success!",
  errorMessage = "Error occurred",
  feedbackDuration = 2000,
  ...buttonProps
}) => {
  const [feedbackState, setFeedbackState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e) => {
    if (isLoading) return;

    setIsLoading(true);
    setFeedbackState(null);

    try {
      if (onSuccess) {
        await onSuccess(e);
        setFeedbackState("success");
      }
    } catch (error) {
      setFeedbackState("error");
      onError?.(error);
    } finally {
      setIsLoading(false);

      setTimeout(() => {
        setFeedbackState(null);
      }, feedbackDuration);
    }
  };

  const getFeedbackIcon = () => {
    switch (feedbackState) {
      case "success":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case "error":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const getFeedbackClasses = () => {
    switch (feedbackState) {
      case "success":
        return `${SUCCESS_ANIMATION} bg-green-600 hover:bg-green-700`;
      case "error":
        return `${ERROR_ANIMATION} bg-red-600 hover:bg-red-700`;
      default:
        return "";
    }
  };

  return (
    <button
      {...buttonProps}
      onClick={handleClick}
      disabled={isLoading || buttonProps.disabled}
      className={`
        ${buttonProps.className || ""} 
        ${getFeedbackClasses()}
        transition-all duration-200 relative overflow-hidden
      `}
    >
      <span
        className={`flex items-center gap-2 ${
          feedbackState ? "opacity-0" : "opacity-100"
        } transition-opacity`}
      >
        {isLoading && (
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </span>

      {feedbackState && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex items-center gap-2">
            {getFeedbackIcon()}
            {feedbackState === "success" ? successMessage : errorMessage}
          </span>
        </span>
      )}
    </button>
  );
};

// Hook for managing feedback animations
export const useFeedbackAnimation = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  const showFeedback = (type, message, options = {}) => {
    const id = Date.now() + Math.random();
    const feedback = {
      id,
      type,
      message,
      ...options,
    };

    setFeedbacks((prev) => [...prev, feedback]);

    // Auto remove after duration
    setTimeout(() => {
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    }, options.duration || 3000);

    return id;
  };

  const removeFeedback = (id) => {
    setFeedbacks((prev) => prev.filter((f) => f.id !== id));
  };

  const clearAll = () => {
    setFeedbacks([]);
  };

  return {
    feedbacks,
    showFeedback,
    removeFeedback,
    clearAll,
  };
};

export { FloatingFeedback, InlineFeedback, ButtonFeedback };
export default InlineFeedback;
