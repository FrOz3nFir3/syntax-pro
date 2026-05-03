import React from "react";
import AppLayout from "../layout/AppLayout";
import Skeleton from "./Skeleton";

const PanelHeader = ({ children }) => (
  <div className="flex items-center justify-between px-3 sm:px-5 py-2 bg-paper dark:bg-ink-800 border-b border-ink/10 dark:border-paper/10">
    {children}
  </div>
);

const EnhancedPlaygroundSkeleton = () => (
  <AppLayout
    className="bg-paper dark:bg-ink-800"
    noPadding
    showBreadcrumbs={false}
  >
    <Skeleton.Group className="flex flex-col h-[100dvh] sm:h-[calc(100vh-4rem)]">
      <div className="flex flex-col lg:flex-row h-full">
        {/* Editor side */}
        <div className="flex-1 lg:flex-[0_0_70%] flex flex-col bg-paper-50 dark:bg-ink-700 border-b lg:border-b-0 lg:border-r border-ink/10 dark:border-paper/10">
          {/* Section label */}
          <div className="px-3 sm:px-5 py-2 bg-paper-50 dark:bg-ink-700 border-b border-ink/10 dark:border-paper/10">
            <Skeleton.Block className="h-3 w-12" />
          </div>

          {/* Toolbar mock */}
          <PanelHeader>
            <div className="flex items-center gap-3">
              <Skeleton.Circle className="w-3 h-3" />
              <Skeleton.Block className="h-4 w-32" />
              <Skeleton.Block className="h-5 w-20" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton.Block className="w-8 h-8 rounded-lg" />
              <Skeleton.Block className="w-8 h-8 rounded-lg" />
              <Skeleton.Block className="w-8 h-8 rounded-lg" />
              <Skeleton.Block className="w-20 h-8 rounded-lg" />
              <Skeleton.Block className="w-12 h-8 rounded-lg" />
              <div className="w-px h-5 bg-ink/15 dark:bg-paper/15 mx-1" />
              <Skeleton.Block className="w-16 h-8 rounded-lg" />
              <Skeleton.Block className="w-20 h-9 rounded-lg !bg-mustard/40" />
            </div>
          </PanelHeader>

          {/* Editor body */}
          <div className="flex-1 overflow-hidden p-5 space-y-2.5 bg-paper dark:bg-ink-700">
            <Skeleton.Block className="h-3 w-1/3" />
            <Skeleton.Block className="h-3 w-2/3" />
            <Skeleton.Block className="h-3 w-1/2" />
            <Skeleton.Block className="h-3 w-3/4" />
            <Skeleton.Block className="h-3 w-1/4" />
            <Skeleton.Block className="h-3 w-2/5" />
          </div>
        </div>

        {/* I/O side */}
        <div className="flex-1 lg:flex-[0_0_30%] flex flex-col bg-paper-50 dark:bg-ink-700">
          <div className="px-3 sm:px-5 py-2 bg-paper-50 dark:bg-ink-700 border-b border-ink/10 dark:border-paper/10">
            <Skeleton.Block className="h-3 w-8" />
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Input */}
            <div className="flex-1 flex flex-col border-b border-ink/10 dark:border-paper/10">
              <PanelHeader>
                <Skeleton.Block className="h-3 w-12" />
                <div className="flex gap-1">
                  <Skeleton.Block className="w-7 h-7 rounded-md" />
                  <Skeleton.Block className="w-7 h-7 rounded-md" />
                  <Skeleton.Block className="w-7 h-7 rounded-md" />
                </div>
              </PanelHeader>
              <div className="flex-1 p-4 bg-paper dark:bg-ink-700">
                <Skeleton.Block className="h-3 w-2/3" />
              </div>
            </div>

            {/* Output */}
            <div className="flex-1 flex flex-col">
              <PanelHeader>
                <Skeleton.Block className="h-3 w-14" />
                <div className="flex gap-1">
                  <Skeleton.Block className="w-7 h-7 rounded-md" />
                  <Skeleton.Block className="w-7 h-7 rounded-md" />
                  <Skeleton.Block className="w-7 h-7 rounded-md" />
                </div>
              </PanelHeader>
              <div className="flex-1 p-4 bg-ink dark:bg-ink-900 space-y-2">
                <Skeleton.Block className="h-3 w-1/2 !bg-paper/15" />
                <Skeleton.Block className="h-3 w-2/3 !bg-paper/15" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Skeleton.Group>
  </AppLayout>
);

export default EnhancedPlaygroundSkeleton;
