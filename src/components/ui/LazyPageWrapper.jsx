import React, { Suspense, lazy } from "react";
import {
  LandingSkeleton,
  PlaygroundsSkeleton,
  EnhancedPlaygroundSkeleton,
  NotFoundSkeleton,
} from "../skeletons";

/**
 * LazyPageWrapper - A wrapper component for lazy loading pages with appropriate skeletons
 * @param {Function} importFn - The dynamic import function for the page component
 * @param {string} skeletonType - The type of skeleton to show while loading
 * @returns {React.Component} - The lazy-loaded component with Suspense wrapper
 */
const createLazyPage = (importFn, skeletonType = "default") => {
  const LazyComponent = lazy(importFn);

  const getSkeletonComponent = () => {
    switch (skeletonType) {
      case "landing":
        return <LandingSkeleton />;
      case "playgrounds":
        return <PlaygroundsSkeleton />;
      case "playground":
        return <EnhancedPlaygroundSkeleton />;
      case "notfound":
        return <NotFoundSkeleton />;
      default:
        return (
          <div className="animate-pulse p-8">
            <div className="space-y-4">
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            </div>
          </div>
        );
    }
  };

  return (props) => (
    <Suspense fallback={getSkeletonComponent()}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

export default createLazyPage;
