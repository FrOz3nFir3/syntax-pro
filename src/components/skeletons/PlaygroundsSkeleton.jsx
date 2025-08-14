import React from "react";
import AppLayout from "../layout/AppLayout";

const SkeletonElement = ({ className }) => {
  return (
    <div
      className={`
      bg-neutral-200 dark:bg-neutral-700 
      rounded-lg ${className}
    `}
    />
  );
};

const ProjectCardSkeleton = () => {
  return (
    <div
      className="relative flex flex-col rounded-xl border bg-white border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700"
    >
      <div className="flex-grow p-4 block">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <SkeletonElement className="w-10 h-10 rounded-xl flex-shrink-0" />
            <div className="flex-1 min-w-0 space-y-1.5">
              <SkeletonElement className="h-5 w-3/4" />
              <SkeletonElement className="h-3 w-1/4" />
            </div>
          </div>
        </div>
        <div
          className="rounded-xl p-3 font-mono text-xs relative overflow-hidden bg-gray-100 border-gray-200 dark:bg-neutral-900/80 dark:border-neutral-700/50 border"
        >
          <div className="space-y-2">
            <SkeletonElement className="h-3 w-5/6" />
            <SkeletonElement className="h-3 w-full" />
            <SkeletonElement className="h-3 w-1/2" />
          </div>
        </div>
      </div>
      <div
        className="flex flex-wrap items-center justify-between gap-2 p-3 border-t border-neutral-200 dark:border-neutral-700"
      >
        <SkeletonElement className="h-4 w-24" />
        <div className="flex items-center gap-1">
          <SkeletonElement className="w-8 h-8 rounded-lg" />
          <SkeletonElement className="w-8 h-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

const FolderSectionSkeleton = () => {
  return (
    <div className="folder-section">
      {/* Folder Header */}
      <div
        className="flex items-center justify-between p-4 rounded-t-xl border-b bg-gray-100 border-gray-200 dark:bg-neutral-800 dark:border-neutral-700"
      >
        <div className="flex items-center gap-3">
          <SkeletonElement className="w-9 h-9" />
          <div className="flex items-center gap-3">
            <SkeletonElement className="w-10 h-10" />
            <div className="space-y-1.5">
              <SkeletonElement className="h-5 w-32" />
              <SkeletonElement className="h-4 w-24" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SkeletonElement className="w-9 h-9" />
          <SkeletonElement className="w-9 h-9" />
        </div>
      </div>

      {/* Folder Content */}
      <div
        className="p-4 sm:p-6 rounded-b-xl border-l border-r border-b bg-white border-gray-200 dark:bg-neutral-800/50 dark:border-neutral-700"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

const PlaygroundsSkeleton = () => {
  return (
    <AppLayout>
      <div className="animate-pulse project-grid py-8">
        {/* Header Section */}
        <div className="mb-6 lg:mb-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1 space-y-2">
                <SkeletonElement className="w-1/2 h-9" />
                <SkeletonElement className="w-1/3 h-5" />
              </div>
              <div className="flex flex-col xs:flex-row gap-3">
                <SkeletonElement className="w-32 h-11" />
                <SkeletonElement className="w-40 h-11" />
              </div>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div
            className="p-4 rounded-xl border bg-white border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700"
          >
            <div className="grid gap-4 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <div className="sm:col-span-2 lg:col-span-2">
                <SkeletonElement className="h-11 w-full" />
              </div>
              <div className="sm:col-span-1">
                <SkeletonElement className="h-11 w-full" />
              </div>
              <div className="sm:col-span-1">
                <SkeletonElement className="h-11 w-full" />
              </div>
            </div>
            <div
              className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700"
            >
              <SkeletonElement className="w-32 h-8" />
              <SkeletonElement className="w-48 h-5" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8 px-4 sm:px-6 lg:px-8">
          {[...Array(2)].map((_, i) => (
            <FolderSectionSkeleton key={i} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default PlaygroundsSkeleton;