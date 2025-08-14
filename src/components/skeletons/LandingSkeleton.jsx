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

const LandingSkeleton = () => {
  return (
    <AppLayout
      className={`animate-pulse !bg-neutral-50 dark:!bg-neutral-900`}
      showBreadcrumbs={false}
    >
      {/* Hero Section Skeleton */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <SkeletonElement className="w-24 h-24 mx-auto mb-6 rounded-full" />
            <SkeletonElement className="w-3/4 h-16 mx-auto mb-6" />
            <SkeletonElement className="w-full h-8 mx-auto mb-8" />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <SkeletonElement className="w-48 h-14 rounded-xl" />
            <SkeletonElement className="w-36 h-14 rounded-xl" />
          </div>
        </div>
      </section>

      {/* Features Section Skeleton - Full Width */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <section
          id="features"
          className={`py-20 bg-gray-100 dark:bg-neutral-800`}
        >
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <SkeletonElement className="w-1/2 h-12 mx-auto mb-4" />
              <SkeletonElement className="w-3/4 h-8 mx-auto" />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`card p-8 text-center rounded-2xl bg-white dark:bg-neutral-700/50 `}
                >
                  <SkeletonElement className="w-16 h-16 rounded-xl mx-auto mb-6" />
                  <SkeletonElement className="w-3/4 h-8 mx-auto mb-4" />
                  <SkeletonElement className="w-full h-5 mb-2" />
                  <SkeletonElement className="w-full h-5 mb-2" />
                  <SkeletonElement className="w-1/2 h-5 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Getting Started Section Skeleton */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <SkeletonElement className="w-1/2 h-12 mx-auto mb-8" />
          <SkeletonElement className="w-3/4 h-8 mx-auto mb-12" />

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-center">
                <SkeletonElement className="w-12 h-12 rounded-full mx-auto mb-4" />
                <SkeletonElement className="w-1/2 h-6 mx-auto mb-2" />
                <SkeletonElement className="w-3/4 h-5 mx-auto" />
              </div>
            ))}
          </div>

          <SkeletonElement className="w-56 h-16 rounded-xl mx-auto" />
        </div>
      </section>
    </AppLayout>
  );
};

export default LandingSkeleton;
