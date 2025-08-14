import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  TRANSITIONS,
  ENTRY_ANIMATIONS,
  EXIT_ANIMATIONS,
} from "../../utils/animations";

const Tooltip = ({
  children,
  content,
  position = "top",
  delay = 500,
  disabled = false,
  className = "",
  contentClassName = "",
  arrow = true,
  trigger = "hover", // hover, click, focus
  maxWidth = "200px",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);

  const showTooltip = () => {
    if (disabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      calculatePosition();
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;

    let top, left;

    switch (position) {
      case "top":
        top = triggerRect.top + scrollTop - tooltipRect.height - 8;
        left =
          triggerRect.left +
          scrollLeft +
          (triggerRect.width - tooltipRect.width) / 2;
        break;
      case "bottom":
        top = triggerRect.bottom + scrollTop + 8;
        left =
          triggerRect.left +
          scrollLeft +
          (triggerRect.width - tooltipRect.width) / 2;
        break;
      case "left":
        top =
          triggerRect.top +
          scrollTop +
          (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left + scrollLeft - tooltipRect.width - 8;
        break;
      case "right":
        top =
          triggerRect.top +
          scrollTop +
          (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + scrollLeft + 8;
        break;
      default:
        top = triggerRect.top + scrollTop - tooltipRect.height - 8;
        left =
          triggerRect.left +
          scrollLeft +
          (triggerRect.width - tooltipRect.width) / 2;
    }

    // Keep tooltip within viewport
    const padding = 8;
    if (left < padding) left = padding;
    if (left + tooltipRect.width > window.innerWidth - padding) {
      left = window.innerWidth - tooltipRect.width - padding;
    }
    if (top < padding) top = padding;

    setTooltipPosition({ top, left });
  };

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
      window.addEventListener("scroll", calculatePosition);
      window.addEventListener("resize", calculatePosition);

      return () => {
        window.removeEventListener("scroll", calculatePosition);
        window.removeEventListener("resize", calculatePosition);
      };
    }
  }, [isVisible]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getArrowClasses = () => {
    const baseArrow =
      "absolute w-2 h-2 bg-gray-900 dark:bg-gray-100 transform rotate-45";

    switch (position) {
      case "top":
        return `${baseArrow} -bottom-1 left-1/2 -translate-x-1/2`;
      case "bottom":
        return `${baseArrow} -top-1 left-1/2 -translate-x-1/2`;
      case "left":
        return `${baseArrow} -right-1 top-1/2 -translate-y-1/2`;
      case "right":
        return `${baseArrow} -left-1 top-1/2 -translate-y-1/2`;
      default:
        return `${baseArrow} -bottom-1 left-1/2 -translate-x-1/2`;
    }
  };

  const triggerProps = {
    ref: triggerRef,
    ...(trigger === "hover" && {
      onMouseEnter: showTooltip,
      onMouseLeave: hideTooltip,
    }),
    ...(trigger === "click" && {
      onClick: () => (isVisible ? hideTooltip() : showTooltip()),
    }),
    ...(trigger === "focus" && {
      onFocus: showTooltip,
      onBlur: hideTooltip,
    }),
  };

  const tooltipContent = isVisible && content && (
    <div
      ref={tooltipRef}
      className={`
        fixed z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900
        rounded-lg shadow-lg pointer-events-none
        ${isVisible ? ENTRY_ANIMATIONS.SCALE_IN : EXIT_ANIMATIONS.SCALE_OUT}
        ${contentClassName}
      `}
      style={{
        top: tooltipPosition.top,
        left: tooltipPosition.left,
        maxWidth,
      }}
    >
      {content}
      {arrow && <div className={getArrowClasses()} />}
    </div>
  );

  return (
    <>
      <div className={className} {...triggerProps}>
        {children}
      </div>
      {typeof document !== "undefined" &&
        createPortal(tooltipContent, document.body)}
    </>
  );
};

// Higher-order component for easy tooltip wrapping
export const withTooltip = (Component, tooltipProps) => {
  return function TooltipWrappedComponent(props) {
    return (
      <Tooltip {...tooltipProps}>
        <Component {...props} />
      </Tooltip>
    );
  };
};

// Hook for programmatic tooltip control
export const useTooltip = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [content, setContent] = useState("");
  const [position, setPosition] = useState("top");

  const showTooltip = (newContent, newPosition = "top") => {
    setContent(newContent);
    setPosition(newPosition);
    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  return {
    isVisible,
    content,
    position,
    showTooltip,
    hideTooltip,
  };
};

export default Tooltip;
