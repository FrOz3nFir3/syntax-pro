// Micro-interaction utilities for enhanced user experience

// Ripple effect utility
export const createRippleEffect = (event, element) => {
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  const ripple = document.createElement("div");
  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
    z-index: 1000;
  `;

  element.style.position = "relative";
  element.style.overflow = "hidden";
  element.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
};

// CSS for ripple animation (to be added to global styles)
export const rippleCSS = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;

// Hover lift effect classes
export const HOVER_LIFT_CLASSES = {
  subtle: "hover:-translate-y-0.5 hover:shadow-md transition-all duration-200",
  medium: "hover:-translate-y-1 hover:shadow-lg transition-all duration-200",
  strong: "hover:-translate-y-2 hover:shadow-xl transition-all duration-200",
};

// Scale effects
export const SCALE_EFFECTS = {
  subtle:
    "hover:scale-[1.02] active:scale-[0.98] transition-transform duration-150",
  medium: "hover:scale-105 active:scale-95 transition-transform duration-150",
  strong: "hover:scale-110 active:scale-90 transition-transform duration-150",
};

// Glow effects
export const GLOW_EFFECTS = {
  blue: "hover:shadow-lg hover:shadow-blue-500/25 transition-shadow duration-200",
  green:
    "hover:shadow-lg hover:shadow-green-500/25 transition-shadow duration-200",
  red: "hover:shadow-lg hover:shadow-red-500/25 transition-shadow duration-200",
  yellow:
    "hover:shadow-lg hover:shadow-yellow-500/25 transition-shadow duration-200",
  purple:
    "hover:shadow-lg hover:shadow-purple-500/25 transition-shadow duration-200",
};

// Rotation effects
export const ROTATION_EFFECTS = {
  subtle: "hover:rotate-1 transition-transform duration-200",
  medium: "hover:rotate-3 transition-transform duration-200",
  strong: "hover:rotate-6 transition-transform duration-200",
  flip: "hover:rotate-180 transition-transform duration-300",
};

// Bounce effects
export const BOUNCE_EFFECTS = {
  subtle: "hover:animate-bounce",
  click: "active:animate-bounce",
};

// Pulse effects
export const PULSE_EFFECTS = {
  subtle: "hover:animate-pulse",
  slow: "hover:animate-pulse-slow",
};

// Combined interaction classes
export const INTERACTION_COMBINATIONS = {
  cardHover: `${HOVER_LIFT_CLASSES.medium} ${SCALE_EFFECTS.subtle} ${GLOW_EFFECTS.blue}`,
  buttonPress: `${SCALE_EFFECTS.medium} hover:shadow-lg transition-all duration-150`,
  iconHover: `${SCALE_EFFECTS.medium} ${ROTATION_EFFECTS.subtle}`,
  imageHover: `${SCALE_EFFECTS.subtle} ${HOVER_LIFT_CLASSES.subtle}`,
  linkHover:
    "hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200",
};

// Focus ring utilities
export const FOCUS_RINGS = {
  default:
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
  danger:
    "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
  success:
    "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
  warning:
    "focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2",
};

// Loading state utilities
export const LOADING_STATES = {
  button: "opacity-75 cursor-not-allowed animate-pulse",
  overlay:
    "absolute inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center",
  skeleton: "animate-pulse bg-gray-200 dark:bg-gray-700 rounded",
};

// Success/Error feedback animations
export const FEEDBACK_ANIMATIONS = {
  success: "animate-bounce-in text-green-600 dark:text-green-400",
  error: "animate-shake text-red-600 dark:text-red-400",
  warning: "animate-pulse text-yellow-600 dark:text-yellow-400",
  info: "animate-fade-in text-blue-600 dark:text-blue-400",
};

// Utility function to combine classes
export const combineClasses = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

// Utility function to apply micro-interaction to element
export const applyMicroInteraction = (element, type = "default") => {
  if (!element) return;

  const interactions = {
    default: INTERACTION_COMBINATIONS.buttonPress,
    card: INTERACTION_COMBINATIONS.cardHover,
    icon: INTERACTION_COMBINATIONS.iconHover,
    image: INTERACTION_COMBINATIONS.imageHover,
    link: INTERACTION_COMBINATIONS.linkHover,
  };

  const classes = interactions[type] || interactions.default;
  element.className = combineClasses(element.className, classes);
};

// React hook for micro-interactions
export const useMicroInteraction = (type = "default") => {
  const interactions = {
    default: INTERACTION_COMBINATIONS.buttonPress,
    card: INTERACTION_COMBINATIONS.cardHover,
    icon: INTERACTION_COMBINATIONS.iconHover,
    image: INTERACTION_COMBINATIONS.imageHover,
    link: INTERACTION_COMBINATIONS.linkHover,
  };

  return interactions[type] || interactions.default;
};

export default {
  createRippleEffect,
  HOVER_LIFT_CLASSES,
  SCALE_EFFECTS,
  GLOW_EFFECTS,
  ROTATION_EFFECTS,
  BOUNCE_EFFECTS,
  PULSE_EFFECTS,
  INTERACTION_COMBINATIONS,
  FOCUS_RINGS,
  LOADING_STATES,
  FEEDBACK_ANIMATIONS,
  combineClasses,
  applyMicroInteraction,
  useMicroInteraction,
};
