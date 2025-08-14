// Responsive utilities for handling different screen sizes and touch interactions

import React from "react";
import { breakpoints } from "./constants";

/**
 * Hook to detect current screen size and responsive state
 */
export const useResponsiveBreakpoint = () => {
  const [currentBreakpoint, setCurrentBreakpoint] = React.useState("lg");
  const [screenSize, setScreenSize] = React.useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
  });

  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setScreenSize({ width, height });

      if (width < 475) {
        setCurrentBreakpoint("xs");
      } else if (width < 640) {
        setCurrentBreakpoint("sm");
      } else if (width < 768) {
        setCurrentBreakpoint("md");
      } else if (width < 1024) {
        setCurrentBreakpoint("lg");
      } else if (width < 1280) {
        setCurrentBreakpoint("xl");
      } else {
        setCurrentBreakpoint("2xl");
      }
    };

    // Initial check
    updateBreakpoint();

    // Add event listener with debouncing
    let timeoutId;
    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateBreakpoint, 100);
    };

    window.addEventListener("resize", debouncedUpdate);
    window.addEventListener("orientationchange", debouncedUpdate);

    return () => {
      window.removeEventListener("resize", debouncedUpdate);
      window.removeEventListener("orientationchange", debouncedUpdate);
      clearTimeout(timeoutId);
    };
  }, []);

  return {
    currentBreakpoint,
    screenSize,
    isXs: currentBreakpoint === "xs",
    isSm: currentBreakpoint === "sm",
    isMd: currentBreakpoint === "md",
    isLg: currentBreakpoint === "lg",
    isXl: currentBreakpoint === "xl",
    is2Xl: currentBreakpoint === "2xl",
    isMobile: ["xs", "sm"].includes(currentBreakpoint),
    isTablet: currentBreakpoint === "md",
    isDesktop: ["lg", "xl", "2xl"].includes(currentBreakpoint),
    isSmallScreen: ["xs", "sm", "md"].includes(currentBreakpoint),
    isLargeScreen: ["xl", "2xl"].includes(currentBreakpoint),
  };
};

/**
 * Hook to detect touch device capabilities
 */
export const useTouchDevice = () => {
  const [isTouchDevice, setIsTouchDevice] = React.useState(false);
  const [hasHover, setHasHover] = React.useState(true);

  React.useEffect(() => {
    // Check for touch support
    const hasTouchSupport =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0;

    // Check for hover support
    const hasHoverSupport = window.matchMedia("(hover: hover)").matches;

    setIsTouchDevice(hasTouchSupport);
    setHasHover(hasHoverSupport);
  }, []);

  return {
    isTouchDevice,
    hasHover,
    isHoverCapable: hasHover && !isTouchDevice,
  };
};

/**
 * Get responsive grid columns based on screen size
 */
export const getResponsiveColumns = (breakpoint, type = "projects") => {
  const configs = {
    projects: {
      xs: 1,
      sm: 1,
      md: 2,
      lg: 3,
      xl: 4,
      "2xl": 4,
    },
    cards: {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4,
      xl: 5,
      "2xl": 6,
    },
  };

  return configs[type]?.[breakpoint] || configs[type]?.lg || 3;
};

/**
 * Get responsive spacing based on screen size
 */
export const getResponsiveSpacing = (breakpoint) => {
  const spacingMap = {
    xs: {
      container: "px-4",
      section: "py-6",
      card: "p-4",
      gap: "gap-4",
    },
    sm: {
      container: "px-4",
      section: "py-8",
      card: "p-4",
      gap: "gap-4",
    },
    md: {
      container: "px-6",
      section: "py-8",
      card: "p-6",
      gap: "gap-6",
    },
    lg: {
      container: "px-8",
      section: "py-12",
      card: "p-6",
      gap: "gap-6",
    },
    xl: {
      container: "px-8",
      section: "py-12",
      card: "p-8",
      gap: "gap-8",
    },
    "2xl": {
      container: "px-8",
      section: "py-16",
      card: "p-8",
      gap: "gap-8",
    },
  };

  return spacingMap[breakpoint] || spacingMap.lg;
};

/**
 * Get responsive typography classes
 */
export const getResponsiveTypography = (breakpoint) => {
  const typographyMap = {
    xs: {
      h1: "text-2xl",
      h2: "text-xl",
      h3: "text-lg",
      body: "text-sm",
      caption: "text-xs",
    },
    sm: {
      h1: "text-3xl",
      h2: "text-xl",
      h3: "text-lg",
      body: "text-base",
      caption: "text-sm",
    },
    md: {
      h1: "text-3xl",
      h2: "text-2xl",
      h3: "text-xl",
      body: "text-base",
      caption: "text-sm",
    },
    lg: {
      h1: "text-4xl",
      h2: "text-2xl",
      h3: "text-xl",
      body: "text-base",
      caption: "text-sm",
    },
    xl: {
      h1: "text-4xl",
      h2: "text-3xl",
      h3: "text-xl",
      body: "text-lg",
      caption: "text-base",
    },
    "2xl": {
      h1: "text-5xl",
      h2: "text-3xl",
      h3: "text-2xl",
      body: "text-lg",
      caption: "text-base",
    },
  };

  return typographyMap[breakpoint] || typographyMap.lg;
};

/**
 * Generate responsive class names for grid layouts
 */
export const getResponsiveGridClasses = (type = "projects") => {
  const configs = {
    projects:
      "grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    cards:
      "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
    features: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    stats: "grid-cols-2 md:grid-cols-4",
  };

  return configs[type] || configs.projects;
};

/**
 * Get touch-friendly button classes
 */
export const getTouchFriendlyClasses = (isTouchDevice = false) => {
  if (isTouchDevice) {
    return {
      button: "min-h-touch min-w-touch py-3 px-4 text-base",
      iconButton: "min-h-touch min-w-touch p-3",
      input: "min-h-touch py-3 px-4 text-base",
      select: "min-h-touch py-3 px-4 text-base",
    };
  }

  return {
    button: "py-2 px-4 text-sm",
    iconButton: "p-2",
    input: "py-2 px-3 text-sm",
    select: "py-2 px-3 text-sm",
  };
};

/**
 * Media query utilities for JavaScript
 */
export const mediaQueries = {
  xs: `(max-width: ${breakpoints.xs})`,
  sm: `(min-width: ${breakpoints.sm})`,
  md: `(min-width: ${breakpoints.md})`,
  lg: `(min-width: ${breakpoints.lg})`,
  xl: `(min-width: ${breakpoints.xl})`,
  "2xl": `(min-width: ${breakpoints["2xl"]})`,
  mobile: `(max-width: ${breakpoints.md})`,
  tablet: `(min-width: ${breakpoints.md}) and (max-width: ${breakpoints.lg})`,
  desktop: `(min-width: ${breakpoints.lg})`,
  touch: "(hover: none) and (pointer: coarse)",
  hover: "(hover: hover) and (pointer: fine)",
};

/**
 * Check if current screen matches media query
 */
export const matchesMediaQuery = (query) => {
  if (typeof window === "undefined") return false;
  return window.matchMedia(mediaQueries[query] || query).matches;
};

/**
 * Responsive container classes
 */
export const getContainerClasses = (size = "default") => {
  const sizeMap = {
    sm: "max-w-2xl",
    default: "max-w-7xl",
    lg: "max-w-screen-2xl",
    full: "max-w-none",
  };

  return `container mx-auto px-4 sm:px-6 lg:px-8 ${
    sizeMap[size] || sizeMap.default
  }`;
};

export default {
  useResponsiveBreakpoint,
  useTouchDevice,
  getResponsiveColumns,
  getResponsiveSpacing,
  getResponsiveTypography,
  getResponsiveGridClasses,
  getTouchFriendlyClasses,
  mediaQueries,
  matchesMediaQuery,
  getContainerClasses,
};
