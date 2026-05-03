import React from "react";
import AppLayout from "../layout/AppLayout";
import Skeleton from "./Skeleton";

const ProjectCardSkeleton = () => (
  <div className="relative flex flex-col rounded-2xl border bg-paper-50 border-ink/10 dark:bg-ink-700 dark:border-paper/10 shadow-soft">
    <div className="flex-grow p-5">
      <div className="flex items-start gap-3 mb-4">
        <Skeleton.Block className="w-11 h-11 rounded-xl flex-shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton.Block className="h-5 w-3/4" />
          <Skeleton.Block className="h-3 w-20" />
        </div>
      </div>
      <div className="rounded-xl p-4 bg-ink dark:bg-ink-900 border border-ink/15 dark:border-paper/10 space-y-2">
        <Skeleton.Block className="h-3 w-5/6 !bg-paper/15" />
        <Skeleton.Block className="h-3 w-full !bg-paper/15" />
        <Skeleton.Block className="h-3 w-1/2 !bg-paper/15" />
      </div>
    </div>
    <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-ink/10 dark:border-paper/10">
      <Skeleton.Block className="h-3 w-32" />
      <div className="flex items-center gap-1">
        <Skeleton.Block className="w-7 h-7 rounded-lg" />
        <Skeleton.Block className="w-7 h-7 rounded-lg" />
      </div>
    </div>
  </div>
);

const FolderSectionSkeleton = () => (
  <div>
    <div className="flex items-center justify-between p-4 rounded-t-2xl border bg-paper-50 border-ink/10 dark:bg-ink-700 dark:border-paper/10 border-b-0">
      <div className="flex items-center gap-3">
        <Skeleton.Block className="w-9 h-9 rounded-lg" />
        <div className="flex items-center gap-3">
          <Skeleton.Block className="w-9 h-9 rounded-lg" />
          <div className="space-y-2">
            <Skeleton.Block className="h-5 w-32" />
            <Skeleton.Block className="h-3 w-20" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Skeleton.Block className="w-32 h-9 rounded-lg" />
        <Skeleton.Block className="w-9 h-9 rounded-lg" />
      </div>
    </div>
    <div className="p-4 sm:p-6 rounded-b-2xl border border-t-0 border-ink/10 dark:border-paper/10 bg-paper dark:bg-ink-800">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

const PlaygroundsSkeleton = () => (
  <AppLayout className="bg-paper dark:bg-ink-800">
    <Skeleton.Group className="project-grid py-8">
      {/* Header */}
      <div className="mb-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="flex-1 space-y-3">
            <Skeleton.Block className="h-3 w-32" />
            <Skeleton.Block className="h-12 w-72" />
            <Skeleton.Block className="h-3 w-48" />
          </div>
          <div className="flex flex-col xs:flex-row gap-3">
            <Skeleton.Block className="w-32 h-11 rounded-xl" />
            <Skeleton.Block className="w-44 h-11 rounded-xl" />
          </div>
        </div>

        {/* Filter toggle */}
        <Skeleton.Block className="h-12 w-full max-w-xs mx-auto rounded-xl" />
      </div>

      {/* Folders */}
      <div className="space-y-8 px-4 sm:px-6 lg:px-8">
        {[...Array(2)].map((_, i) => (
          <FolderSectionSkeleton key={i} />
        ))}
      </div>
    </Skeleton.Group>
  </AppLayout>
);

export default PlaygroundsSkeleton;
