import React, { useState } from "react";
import {
  useTouchDevice,
  getTouchFriendlyClasses,
} from "../../utils/responsive";
import { getAriaAttributes, useAccessibleId } from "../../utils/accessibility";
import {
  TRANSITIONS,
  HOVER_EFFECTS,
  INTERACTIVE_ANIMATIONS,
  SUCCESS_ANIMATION,
  ERROR_ANIMATION,
} from "../../utils/animations";
import { createRippleEffect } from "../../utils/microInteractions";

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  className = "",
  touchFriendly = true,
  ripple = true,
  feedback = false,
  ariaLabel,
  ariaDescribedBy,
  ariaExpanded,
  ariaHasPopup,
  ariaControls,
  ariaPressed,
  ...props
}) => {
  const { isTouchDevice, hasHover } = useTouchDevice();
  const touchClasses = getTouchFriendlyClasses(isTouchDevice);
  const buttonId = useAccessibleId("button");
  const [feedbackState, setFeedbackState] = useState(null);

  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-lg 
    ${TRANSITIONS.DEFAULT} ${INTERACTIVE_ANIMATIONS.BUTTON_PRESS}
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    disabled:opacity-50 disabled:cursor-not-allowed select-none
    relative overflow-hidden
  `;

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-blue-800 to-blue-600 text-white focus:ring-blue-500
      ${
        hasHover
          ? "hover:from-blue-900 hover:to-blue-700 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5"
          : "active:from-blue-900 active:to-blue-700"
      }
      before:absolute before:inset-0 before:bg-white before:opacity-0 before:transition-opacity before:duration-200
      hover:before:opacity-10
    `,
    secondary: `
      bg-gray-100 text-gray-900 border border-gray-300 focus:ring-gray-500
      dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600
      ${
        hasHover
          ? "hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-md hover:-translate-y-0.5"
          : "active:bg-gray-200 dark:active:bg-gray-700"
      }
      before:absolute before:inset-0 before:bg-gray-900 before:opacity-0 before:transition-opacity before:duration-200
      hover:before:opacity-5 dark:before:bg-white dark:hover:before:opacity-10
    `,
    danger: `
      bg-red-600 text-white focus:ring-red-500
      ${
        hasHover
          ? "hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5"
          : "active:bg-red-700"
      }
      before:absolute before:inset-0 before:bg-white before:opacity-0 before:transition-opacity before:duration-200
      hover:before:opacity-10
    `,
    ghost: `
      text-gray-700 dark:text-gray-300 focus:ring-gray-500
      ${
        hasHover
          ? "hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-sm"
          : "active:bg-gray-100 dark:active:bg-gray-800"
      }
      before:absolute before:inset-0 before:bg-gray-900 before:opacity-0 before:transition-opacity before:duration-200
      hover:before:opacity-5 dark:before:bg-white dark:hover:before:opacity-5
    `,
  };

  const getSizeClasses = () => {
    if (touchFriendly && isTouchDevice) {
      return {
        small: "px-4 py-3 text-sm min-h-touch",
        medium: "px-6 py-3 text-base min-h-touch",
        large: "px-8 py-4 text-lg min-h-touch",
      };
    }

    return {
      small: "px-3 py-1.5 text-sm",
      medium: "px-4 py-2 text-base",
      large: "px-6 py-3 text-lg",
    };
  };

  const sizeClasses = getSizeClasses();
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  // Handle click with ripple effect and feedback
  const handleClick = async (e) => {
    if (disabled || loading) return;

    // Create ripple effect
    if (ripple && e.currentTarget) {
      createRippleEffect(e, e.currentTarget);
    }

    // Handle feedback
    if (feedback && onClick) {
      try {
        setFeedbackState("loading");
        await onClick(e);
        setFeedbackState("success");
        setTimeout(() => setFeedbackState(null), 1000);
      } catch (error) {
        setFeedbackState("error");
        setTimeout(() => setFeedbackState(null), 1000);
      }
    } else {
      onClick?.(e);
    }
  };

  // Get feedback classes
  const getFeedbackClasses = () => {
    switch (feedbackState) {
      case "success":
        return SUCCESS_ANIMATION;
      case "error":
        return ERROR_ANIMATION;
      default:
        return "";
    }
  };

  // Generate accessibility attributes
  const ariaAttributes = getAriaAttributes.button({
    disabled: disabled || loading || feedbackState === "loading",
    pressed: ariaPressed,
    expanded: ariaExpanded,
    hasPopup: ariaHasPopup,
    controls: ariaControls,
    describedBy: ariaDescribedBy,
  });

  return (
    <button
      id={buttonId}
      type={type}
      className={`${classes} ${getFeedbackClasses()}`}
      disabled={disabled || loading || feedbackState === "loading"}
      onClick={handleClick}
      aria-label={ariaLabel}
      {...ariaAttributes}
      {...props}
    >
      {(loading || feedbackState === "loading") && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}

      {feedbackState === "success" && (
        <svg
          className="-ml-1 mr-2 h-4 w-4"
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
      )}

      {feedbackState === "error" && (
        <svg
          className="-ml-1 mr-2 h-4 w-4"
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
      )}

      {children}
    </button>
  );
};

export default Button;
