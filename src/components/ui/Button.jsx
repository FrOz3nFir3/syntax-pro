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
      bg-mustard text-ink border border-mustard-500 shadow-press
      focus:ring-ink dark:focus:ring-paper
      ${
        hasHover
          ? "hover:bg-mustard-300 hover:shadow-lift hover:-translate-y-0.5"
          : "active:bg-mustard-300"
      }
    `,
    secondary: `
      bg-paper-50 text-ink border border-ink/15 shadow-soft
      dark:bg-ink-700 dark:text-paper dark:border-paper/15
      focus:ring-ink dark:focus:ring-paper
      ${
        hasHover
          ? "hover:bg-paper hover:border-ink/35 dark:hover:bg-ink-600 dark:hover:border-paper/35 hover:-translate-y-0.5"
          : "active:bg-paper-200 dark:active:bg-ink-600"
      }
    `,
    danger: `
      bg-signal text-paper border border-signal-500 shadow-soft
      focus:ring-signal
      ${
        hasHover
          ? "hover:bg-signal-500 hover:shadow-lift hover:-translate-y-0.5"
          : "active:bg-signal-500"
      }
    `,
    ghost: `
      text-ink/75 dark:text-paper/75 focus:ring-ink/30 dark:focus:ring-paper/30
      ${
        hasHover
          ? "hover:bg-ink/5 hover:text-ink dark:hover:bg-paper/5 dark:hover:text-paper"
          : "active:bg-ink/5 dark:active:bg-paper/5"
      }
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
