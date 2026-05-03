import React from "react";

/**
 * Bracket-system skeleton primitive.
 *
 *   <Skeleton.Block className="h-6 w-32" />
 *   <Skeleton.Circle size="10" />
 *
 * All variants share the same paper-200/ink-700 base + pulse animation,
 * so every loading state in the app feels cohesive.
 */

const base = "bg-ink/10 dark:bg-paper/10 animate-pulse";

const Block = ({ className = "", rounded = "rounded-lg" }) => (
  <div className={`${base} ${rounded} ${className}`} />
);

const Circle = ({ className = "" }) => (
  <div className={`${base} rounded-full ${className}`} />
);

/**
 * Group — wraps a loading region. Marks it non-interactive and applies
 * a subtle parent-level pulse for cohesion.
 */
const Group = ({ children, className = "" }) => (
  <div
    className={`pointer-events-none select-none ${className}`}
    aria-busy="true"
    aria-live="polite"
  >
    {children}
  </div>
);

const Skeleton = { Block, Circle, Group };

export default Skeleton;
export { Block, Circle, Group };
