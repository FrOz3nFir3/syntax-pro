import React from "react";
import AppLayout from "../layout/AppLayout";
import Skeleton from "./Skeleton";

const LandingSkeleton = () => {
  return (
    <AppLayout
      showBreadcrumbs={false}
      noPadding
      className="!bg-paper dark:!bg-ink-800"
    >
      <Skeleton.Group>
        {/* Hero */}
        <section className="relative overflow-hidden pt-28 pb-24 sm:pt-36 sm:pb-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <Skeleton.Block className="h-3 w-40" />
                <div className="space-y-3">
                  <Skeleton.Block className="h-12 w-3/4" />
                  <Skeleton.Block className="h-12 w-full" />
                  <Skeleton.Block className="h-12 w-5/6" />
                </div>
                <div className="space-y-2 max-w-xl">
                  <Skeleton.Block className="h-4 w-full" />
                  <Skeleton.Block className="h-4 w-2/3" />
                </div>
                <div className="flex gap-4 pt-4">
                  <Skeleton.Block className="h-12 w-44 rounded-xl" />
                  <Skeleton.Block className="h-12 w-32 rounded-xl" />
                </div>
              </div>

              {/* Editor mock */}
              <div className="lg:col-span-5">
                <div className="rounded-xl overflow-hidden bg-ink-700 dark:bg-ink-900 border border-ink/10 dark:border-paper/10 max-w-xl mx-auto">
                  <div className="px-4 py-3 border-b border-paper/10 flex items-center justify-between">
                    <Skeleton.Block className="h-3 w-16 !bg-paper/10" />
                    <Skeleton.Block className="h-3 w-20 !bg-paper/10" />
                  </div>
                  <div className="p-5 space-y-2.5 min-h-[210px]">
                    <Skeleton.Block className="h-3 w-3/4 !bg-paper/10" />
                    <Skeleton.Block className="h-3 w-1/2 !bg-paper/10" />
                    <Skeleton.Block className="h-3 w-5/6 !bg-paper/10" />
                    <Skeleton.Block className="h-3 w-2/3 !bg-paper/10" />
                  </div>
                  <div className="px-5 py-3 border-t border-paper/10">
                    <Skeleton.Block className="h-3 w-32 !bg-paper/10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Languages band */}
        <section className="bg-ink dark:bg-ink-900 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div className="space-y-3">
                <Skeleton.Block className="h-3 w-32 !bg-paper/15" />
                <Skeleton.Block className="h-9 w-72 !bg-paper/15" />
              </div>
              <Skeleton.Block className="h-12 w-72 !bg-paper/15 hidden md:block" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-paper/10 rounded-2xl overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-ink dark:bg-ink-900 p-6 flex flex-col items-center justify-center gap-3"
                >
                  <Skeleton.Block className="h-12 w-12 rounded-xl !bg-paper/15" />
                  <Skeleton.Block className="h-3 w-16 !bg-paper/15" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-bone dark:bg-ink-700 py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16 space-y-3">
              <Skeleton.Block className="h-3 w-32" />
              <Skeleton.Block className="h-10 w-full" />
              <Skeleton.Block className="h-10 w-3/4" />
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-paper dark:bg-ink-800 rounded-2xl border border-ink/10 dark:border-paper/10 p-7 space-y-4"
                >
                  <Skeleton.Block className="h-3 w-20" />
                  <Skeleton.Block className="h-7 w-3/4" />
                  <div className="space-y-2 pt-2">
                    <Skeleton.Block className="h-3 w-full" />
                    <Skeleton.Block className="h-3 w-full" />
                    <Skeleton.Block className="h-3 w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Skeleton.Group>
    </AppLayout>
  );
};

export default LandingSkeleton;
