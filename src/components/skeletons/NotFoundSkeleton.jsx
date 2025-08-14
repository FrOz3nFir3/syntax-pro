import React from "react";

const NotFoundSkeleton = () => {
  return (
    <div className="animate-pulse flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md mx-auto px-4">
        {/* Large number skeleton */}
        <div className="h-32 bg-gray-300 dark:bg-gray-600 rounded-lg mb-8 max-w-48 mx-auto"></div>

        {/* Title skeleton */}
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded-lg mb-4 max-w-64 mx-auto"></div>

        {/* Description skeleton */}
        <div className="space-y-2 mb-8">
          <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded max-w-80 mx-auto"></div>
          <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded max-w-60 mx-auto"></div>
        </div>

        {/* Button skeleton */}
        <div className="h-12 w-40 bg-gray-300 dark:bg-gray-600 rounded-lg mx-auto"></div>
      </div>
    </div>
  );
};

export default NotFoundSkeleton;
