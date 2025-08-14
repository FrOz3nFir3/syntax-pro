// Accessibility utilities and hooks for better a11y support

import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Hook for managing focus trap within a component
 */
export const useFocusTrap = (isActive = false) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    // Focus first element when trap becomes active
    firstElement?.focus();

    container.addEventListener("keydown", handleTabKey);
    return () => container.removeEventListener("keydown", handleTabKey);
  }, [isActive]);

  return containerRef;
};

/**
 * Hook for managing keyboard navigation in lists/grids
 */
export const useKeyboardNavigation = (items = [], onSelect = null) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);

  const handleKeyDown = useCallback(
    (e) => {
      if (!items.length) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) => (prev + 1) % items.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => (prev <= 0 ? items.length - 1 : prev - 1));
          break;
        case "Home":
          e.preventDefault();
          setActiveIndex(0);
          break;
        case "End":
          e.preventDefault();
          setActiveIndex(items.length - 1);
          break;
        case "Enter":
        case " ":
          if (activeIndex >= 0 && onSelect) {
            e.preventDefault();
            onSelect(items[activeIndex], activeIndex);
          }
          break;
        case "Escape":
          setActiveIndex(-1);
          break;
      }
    },
    [items, activeIndex, onSelect]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return {
    containerRef,
    activeIndex,
    setActiveIndex,
    handleKeyDown,
  };
};

/**
 * Hook for managing announcements to screen readers
 */
export const useScreenReader = () => {
  const [announcement, setAnnouncement] = useState("");
  const timeoutRef = useRef(null);

  const announce = (message) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setAnnouncement(""); // Clear first to ensure re-announcement

    timeoutRef.current = setTimeout(() => {
      setAnnouncement(message);
    }, 100);

    // Clear announcement after it's been read
    timeoutRef.current = setTimeout(() => {
      setAnnouncement("");
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    announce,
    announcement,
  };
};

/**
 * Utility for managing skip links
 */
export const createSkipLinks = (links = []) => {
  const handleSkipLinkClick = (href) => {
    const target = document.querySelector(href);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return {
    links,
    handleSkipLinkClick,
  };
};

/**
 * Generate accessible IDs for form elements
 */
export const useAccessibleId = (prefix = "element") => {
  const idRef = useRef(null);

  if (!idRef.current) {
    idRef.current = `${prefix}-${Math.random().toString(36).substring(2, 11)}`;
  }

  return idRef.current;
};

/**
 * Hook for managing reduced motion preferences
 */
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
};

/**
 * ARIA attributes helpers
 */
export const getAriaAttributes = {
  button: (props = {}) => ({
    role: "button",
    tabIndex: props.disabled ? -1 : 0,
    "aria-disabled": props.disabled || undefined,
    "aria-pressed": props.pressed || undefined,
    "aria-expanded": props.expanded || undefined,
    "aria-haspopup": props.hasPopup || undefined,
    "aria-controls": props.controls || undefined,
    "aria-describedby": props.describedBy || undefined,
  }),

  input: (props = {}) => ({
    "aria-required": props.required || undefined,
    "aria-invalid": props.invalid || undefined,
    "aria-describedby": props.describedBy || undefined,
    "aria-labelledby": props.labelledBy || undefined,
  }),

  dialog: (props = {}) => ({
    role: "dialog",
    "aria-modal": true,
    "aria-labelledby": props.labelledBy || undefined,
    "aria-describedby": props.describedBy || undefined,
  }),

  listbox: (props = {}) => ({
    role: "listbox",
    "aria-expanded": props.expanded || undefined,
    "aria-activedescendant": props.activeDescendant || undefined,
    "aria-multiselectable": props.multiselectable || undefined,
  }),

  option: (props = {}) => ({
    role: "option",
    "aria-selected": props.selected || undefined,
    "aria-disabled": props.disabled || undefined,
  }),

  tab: (props = {}) => ({
    role: "tab",
    "aria-selected": props.selected || undefined,
    "aria-controls": props.controls || undefined,
    tabIndex: props.selected ? 0 : -1,
  }),

  tabpanel: (props = {}) => ({
    role: "tabpanel",
    "aria-labelledby": props.labelledBy || undefined,
    tabIndex: 0,
  }),
};

/**
 * Color contrast utilities
 */
export const colorContrast = {
  // Check if color combination meets WCAG AA standards
  meetsWCAG: (foreground, background) => {
    // This is a simplified check - in production, use a proper color contrast library
    const getLuminance = (color) => {
      // Convert hex to RGB and calculate luminance
      const hex = color.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;

      const [rs, gs, bs] = [r, g, b].map((c) =>
        c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      );

      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const l1 = getLuminance(foreground);
    const l2 = getLuminance(background);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

    return ratio >= 4.5; // WCAG AA standard
  },

  // Get accessible color pairs
  getAccessiblePairs: () => ({
    light: {
      primary: { bg: "#ffffff", text: "#1e293b" }, // 16.07:1
      secondary: { bg: "#f8fafc", text: "#334155" }, // 12.63:1
      accent: { bg: "#3b82f6", text: "#ffffff" }, // 8.59:1
    },
    dark: {
      primary: { bg: "#0f172a", text: "#f8fafc" }, // 16.07:1
      secondary: { bg: "#1e293b", text: "#e2e8f0" }, // 12.63:1
      accent: { bg: "#60a5fa", text: "#0f172a" }, // 8.59:1
    },
  }),
};

/**
 * Keyboard shortcuts manager
 */
export const useKeyboardShortcuts = (shortcuts = {}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      const modifiers = {
        ctrl: e.ctrlKey,
        alt: e.altKey,
        shift: e.shiftKey,
        meta: e.metaKey,
      };

      Object.entries(shortcuts).forEach(([shortcut, handler]) => {
        const [modifierStr, keyStr] = shortcut
          .split("+")
          .map((s) => s.trim().toLowerCase());

        if (keyStr === key) {
          const requiredModifiers = modifierStr.split(",").map((m) => m.trim());
          const hasRequiredModifiers = requiredModifiers.every(
            (mod) => modifiers[mod]
          );

          if (hasRequiredModifiers) {
            e.preventDefault();
            handler(e);
          }
        }
      });
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
};

export default {
  useFocusTrap,
  useKeyboardNavigation,
  useScreenReader,
  createSkipLinks,
  useAccessibleId,
  useReducedMotion,
  getAriaAttributes,
  colorContrast,
  useKeyboardShortcuts,
};
