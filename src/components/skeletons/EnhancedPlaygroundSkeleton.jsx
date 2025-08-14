import React from "react";
import AppLayout from "../layout/AppLayout";

const SkeletonElement = ({ className }) => {
  return (
    <div
      className={`
      bg-neutral-200 dark:bg-neutral-700
      rounded-md ${className}
    `}
    />
  );
};

const EnhancedPlaygroundSkeleton = () => {
  return (
    <AppLayout
      className="animate-pulse bg-gray-50 dark:bg-neutral-900"
      noPadding
      showBreadcrumbs={false}
    >
      <div className="flex flex-col h-[100dvh] sm:h-[calc(100vh-4rem)]">
        <div className="flex-1 overflow-hidden">
          {/* Responsive Layout - Horizontal on desktop, Vertical on mobile */}
          <div className="flex flex-col lg:flex-row h-full">
            {/* Code Editor Panel */}
            <div className="flex-1 lg:flex-[0_0_70%] flex flex-col bg-white dark:bg-neutral-800 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-neutral-700">
              {/* Code Editor Header */}
              <div className="flex items-center justify-between px-2 sm:px-4 py-2 bg-gray-50 dark:bg-neutral-700 border-b border-gray-200 dark:border-neutral-600">
                <div className="flex items-center gap-2">
                  <SkeletonElement className="w-4 h-4" />
                  <SkeletonElement className="w-20 sm:w-32 h-4" />
                  <SkeletonElement className="w-12 h-6" />
                </div>
                <div className="flex items-center gap-1">
                  <SkeletonElement className="w-8 h-8" />
                  <SkeletonElement className="w-8 h-8" />
                  <SkeletonElement className="w-8 h-8" />
                  <SkeletonElement className="w-16 h-8" />
                  <SkeletonElement className="w-20 h-8" />
                </div>
              </div>

              {/* Code Editor Content */}
              <div className="flex-1 overflow-hidden lg:max-h-none max-h-[60vh]">
                <SkeletonElement className="w-full h-full" />
              </div>
            </div>

            {/* Input/Output Panel */}
            <div className="flex-1 lg:flex-[0_0_30%] flex flex-col bg-white dark:bg-neutral-800 lg:max-h-none max-h-[40vh]">
              {/* Input/Output Header */}
              <div className="flex items-center justify-between px-2 sm:px-4 py-2 bg-gray-50 dark:bg-neutral-700 border-b border-gray-200 dark:border-neutral-600">
                <SkeletonElement className="w-24 h-4" />
                <SkeletonElement className="w-8 h-8" />
              </div>

              {/* Input/Output Content */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Input Section */}
                <div className="flex-1 flex flex-col border-b border-gray-200 dark:border-gray-600 min-h-0">
                  <div className="flex items-center justify-between px-2 sm:px-4 py-2 bg-gray-50 dark:bg-neutral-700 border-b border-gray-200 dark:border-neutral-600">
                    <div className="flex items-center gap-2">
                      <SkeletonElement className="w-12 h-4" />
                      <SkeletonElement className="w-4 h-4" />
                    </div>
                    <div className="flex gap-1">
                      <SkeletonElement className="w-6 h-6" />
                      <SkeletonElement className="w-6 h-6" />
                      <SkeletonElement className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex-1 p-2">
                    <SkeletonElement className="w-full h-full" />
                  </div>
                </div>

                {/* Output Section */}
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="flex items-center justify-between px-2 sm:px-4 py-2 bg-gray-50 dark:bg-neutral-700 border-b border-gray-200 dark:border-neutral-600">
                    <SkeletonElement className="w-16 h-4" />
                    <div className="flex gap-1">
                      <SkeletonElement className="w-6 h-6" />
                      <SkeletonElement className="w-6 h-6" />
                      <SkeletonElement className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex-1 p-2">
                    <SkeletonElement className="w-full h-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default EnhancedPlaygroundSkeleton;
