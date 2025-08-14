// Design System Constants
// This file contains all design tokens including colors, typography, spacing, and other design constants

export const colors = {
  // Primary Colors
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },

  // Secondary Colors (Gold/Amber)
  secondary: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },

  // Neutral Colors
  neutral: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
  },

  // Semantic Colors
  success: {
    50: "#ecfdf5",
    100: "#d1fae5",
    200: "#a7f3d0",
    300: "#6ee7b7",
    400: "#34d399",
    500: "#10b981",
    600: "#059669",
    700: "#047857",
    800: "#065f46",
    900: "#064e3b",
  },

  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },

  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },

  // Background Colors
  background: {
    light: "#ffffff",
    dark: "#0f172a",
    surface: "#f8fafc",
    surfaceDark: "#1e293b",
  },
};

export const typography = {
  fontFamily: {
    primary: [
      "Inter",
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "sans-serif",
    ],
    code: [
      "JetBrains Mono",
      "Monaco",
      "Cascadia Code",
      "Segoe UI Mono",
      "Roboto Mono",
      "monospace",
    ],
  },

  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
    "6xl": "3.75rem", // 60px
  },

  fontWeight: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
  },

  lineHeight: {
    tight: "1.25",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2",
  },

  letterSpacing: {
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
  },
};

export const spacing = {
  // 8px grid system
  0: "0",
  1: "0.25rem", // 4px
  2: "0.5rem", // 8px
  3: "0.75rem", // 12px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  8: "2rem", // 32px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
  32: "8rem", // 128px
};

export const borderRadius = {
  none: "0",
  sm: "0.125rem", // 2px
  base: "0.25rem", // 4px
  md: "0.375rem", // 6px
  lg: "0.5rem", // 8px
  xl: "0.75rem", // 12px
  "2xl": "1rem", // 16px
  "3xl": "1.5rem", // 24px
  full: "9999px",
};

export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
};

export const breakpoints = {
  xs: "475px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

// Touch-friendly sizing constants
export const touchTargets = {
  minSize: "44px", // Minimum touch target size (WCAG AA)
  comfortable: "48px", // Comfortable touch target size
  large: "56px", // Large touch target size
};

// Responsive grid configurations
export const gridConfigs = {
  projects: {
    xs: 1, // 1 column on extra small screens
    sm: 1, // 1 column on small screens
    md: 2, // 2 columns on medium screens
    lg: 3, // 3 columns on large screens
    xl: 4, // 4 columns on extra large screens
    "2xl": 4, // 4 columns on 2xl screens
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

export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

export const transitions = {
  fast: "150ms ease-in-out",
  normal: "250ms ease-in-out",
  slow: "350ms ease-in-out",
};

// Language configuration
export const languages = {
  javascript: {
    id: 63,
    name: "JavaScript",
    icon: "/javascript.png",
    extension: ".js",
    defaultCode: 'console.log("Hello, World!");',
  },
  java: {
    id: 62,
    name: "Java",
    icon: "/java.png",
    extension: ".java",
    defaultCode:
      'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
  },
  python: {
    id: 71,
    name: "Python",
    icon: "/python.png",
    extension: ".py",
    defaultCode: 'print("Hello, World!")',
  },
  cpp: {
    id: 54,
    name: "C++",
    icon: "/cpp.png",
    extension: ".cpp",
    defaultCode:
      '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
  },
  rust: {
    id: 73,
    name: "Rust",
    icon: "/rust.png",
    extension: ".rs",
    defaultCode: 'fn main() {\n    println!("Hello, World!");\n}',
  },
  php: {
    id: 68,
    name: "PHP",
    icon: "/php.png",
    extension: ".php",
    defaultCode: '<?php\necho "Hello, World!";\n?>',
  },
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
  zIndex,
  transitions,
  languages,
};
