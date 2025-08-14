/**
 * Performance optimization utilities for React components
 */

import { memo, lazy, Suspense } from "react";

/**
 * Higher-order component for memoizing expensive components
 */
export const withMemo = (Component, areEqual) => {
  const MemoizedComponent = memo(Component, areEqual);
  MemoizedComponent.displayName = `Memo(${
    Component.displayName || Component.name
  })`;
  return MemoizedComponent;
};

/**
 * Creates a lazy-loaded component with a fallback
 */
export const createLazyComponent = (importFn, fallback = null) => {
  const LazyComponent = lazy(importFn);

  return (props) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

/**
 * Default loading skeleton for components
 */
export const DefaultSkeleton = ({ className = "", lines = 3 }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-gray-300 dark:bg-gray-600 rounded ${
            i === lines - 1 ? "w-3/4" : "w-full"
          }`}
        />
      ))}
    </div>
  </div>
);

/**
 * Code splitting utilities
 * @deprecated Use LazyPageWrapper for page-level lazy loading with custom skeletons
 */
export const CodeSplitting = {
  // Lazy load feature components
  createFeature: (importFn) =>
    createLazyComponent(importFn, <DefaultSkeleton lines={3} />),

  // Lazy load heavy libraries
  createLibrary: (importFn) =>
    createLazyComponent(importFn, <DefaultSkeleton lines={4} />),
};
