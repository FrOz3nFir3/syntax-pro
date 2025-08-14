// Animation utilities and constants
import React from "react";

// Animation duration constants
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 200,
  SLOW: 300,
  SLOWER: 500,
};

// Easing functions
export const EASING = {
  EASE_OUT: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  EASE_IN: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
  EASE_IN_OUT: "cubic-bezier(0.645, 0.045, 0.355, 1)",
  BOUNCE: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
};

// Common transition classes
export const TRANSITIONS = {
  DEFAULT: "transition-all duration-200 ease-out",
  FAST: "transition-all duration-150 ease-out",
  SLOW: "transition-all duration-300 ease-out",
  COLORS: "transition-colors duration-200 ease-out",
  TRANSFORM: "transition-transform duration-200 ease-out",
  OPACITY: "transition-opacity duration-200 ease-out",
  SHADOW: "transition-shadow duration-200 ease-out",
};

// Hover effect classes
export const HOVER_EFFECTS = {
  SCALE: "hover:scale-105 active:scale-95",
  SCALE_SMALL: "hover:scale-102 active:scale-98",
  LIFT: "hover:-translate-y-1 hover:shadow-lg",
  GLOW: "hover:shadow-lg hover:shadow-blue-500/25",
  BRIGHTNESS: "hover:brightness-110",
  SATURATE: "hover:saturate-150",
};

// Loading animation classes
export const LOADING_ANIMATIONS = {
  SPIN: "animate-spin",
  PULSE: "animate-pulse",
  BOUNCE: "animate-bounce",
  PULSE_SLOW: "animate-pulse-slow",
  SHIMMER: "animate-shimmer",
};

// Entry/exit animation classes
export const ENTRY_ANIMATIONS = {
  FADE_IN: "animate-fade-in",
  SCALE_IN: "animate-scale-in",
  SLIDE_IN_RIGHT: "animate-slide-in-right",
  SLIDE_IN_LEFT: "animate-slide-in-left",
  SLIDE_IN_UP: "animate-slide-in-up",
  BOUNCE_IN: "animate-bounce-in",
};

export const EXIT_ANIMATIONS = {
  FADE_OUT: "animate-fade-out",
  SCALE_OUT: "animate-scale-out",
  SLIDE_OUT_RIGHT: "animate-slide-out-right",
  SLIDE_OUT_LEFT: "animate-slide-out-left",
  SLIDE_OUT_DOWN: "animate-slide-out-down",
};

// Feedback animation classes
export const FEEDBACK_ANIMATIONS = {
  SHAKE: "animate-shake",
  FLOAT: "animate-float",
  GLOW: "animate-glow",
};

// Animation utility functions
export const createTransition = (
  properties,
  duration = ANIMATION_DURATION.NORMAL,
  easing = EASING.EASE_OUT
) => {
  return `transition-${properties} duration-${duration} ${easing}`;
};

export const createHoverEffect = (baseClasses, hoverClasses) => {
  return `${baseClasses} ${TRANSITIONS.DEFAULT} ${hoverClasses}`;
};

// Animation state management
export const useAnimationState = (initialState = false) => {
  const [isAnimating, setIsAnimating] = React.useState(initialState);

  const startAnimation = () => setIsAnimating(true);
  const stopAnimation = () => setIsAnimating(false);

  return { isAnimating, startAnimation, stopAnimation };
};

// Stagger animation utility
export const createStaggerDelay = (index, baseDelay = 50) => {
  return `animation-delay: ${index * baseDelay}ms`;
};

// Page transition utilities
export const PAGE_TRANSITIONS = {
  FADE: {
    enter: "animate-fade-in",
    exit: "animate-fade-out",
  },
  SLIDE: {
    enter: "animate-slide-in-right",
    exit: "animate-slide-out-left",
  },
  SCALE: {
    enter: "animate-scale-in",
    exit: "animate-scale-out",
  },
};

// Success/Error animation utilities
export const SUCCESS_ANIMATION = "animate-bounce-in";
export const ERROR_ANIMATION = "animate-shake";

// Interactive element animations
export const INTERACTIVE_ANIMATIONS = {
  BUTTON_PRESS: "active:scale-95 transition-transform duration-100",
  CARD_HOVER:
    "hover:scale-102 hover:-translate-y-1 hover:shadow-xl transition-all duration-200",
  ICON_HOVER: "hover:scale-110 transition-transform duration-150",
  INPUT_FOCUS: "focus:scale-105 transition-transform duration-200",
};

// Micro-interaction utilities
export const MICRO_INTERACTIONS = {
  RIPPLE:
    "relative overflow-hidden before:absolute before:inset-0 before:bg-white before:opacity-0 before:scale-0 before:rounded-full before:transition-all before:duration-300 active:before:opacity-20 active:before:scale-100",
  HIGHLIGHT:
    "relative after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white after:to-transparent after:opacity-0 after:translate-x-[-100%] after:transition-all after:duration-500 hover:after:opacity-10 hover:after:translate-x-[100%]",
};

// Enhanced page transition with stagger support
export const createPageTransition = (
  type = "FADE",
  stagger = false,
  staggerDelay = 100
) => {
  const baseTransition = PAGE_TRANSITIONS[type];

  if (stagger) {
    return {
      ...baseTransition,
      stagger: true,
      staggerDelay,
    };
  }

  return baseTransition;
};

// Smooth scroll animation utility
export const smoothScrollTo = (element, duration = 500) => {
  const start = window.pageYOffset;
  const target = element.offsetTop;
  const distance = target - start;
  let startTime = null;

  const animation = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, start, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  };

  const ease = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  requestAnimationFrame(animation);
};

export default {
  ANIMATION_DURATION,
  EASING,
  TRANSITIONS,
  HOVER_EFFECTS,
  LOADING_ANIMATIONS,
  ENTRY_ANIMATIONS,
  EXIT_ANIMATIONS,
  FEEDBACK_ANIMATIONS,
  PAGE_TRANSITIONS,
  INTERACTIVE_ANIMATIONS,
  MICRO_INTERACTIONS,
  createTransition,
  createHoverEffect,
  createStaggerDelay,
  createPageTransition,
  smoothScrollTo,
};
