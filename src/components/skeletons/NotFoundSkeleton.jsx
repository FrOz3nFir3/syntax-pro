import React from "react";
import Skeleton from "./Skeleton";

const NotFoundSkeleton = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-paper dark:bg-ink-800 px-4">
    <Skeleton.Group className="max-w-lg w-full">
      <div className="text-center px-8 py-14 bg-paper-50 dark:bg-ink-700 border border-ink/10 dark:border-paper/10 rounded-2xl shadow-soft space-y-5">
        <Skeleton.Block className="h-3 w-32 mx-auto" />
        <Skeleton.Block className="h-14 w-3/4 mx-auto" />
        <div className="space-y-2 max-w-sm mx-auto pt-2">
          <Skeleton.Block className="h-4 w-full" />
          <Skeleton.Block className="h-4 w-2/3 mx-auto" />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Skeleton.Block className="h-11 w-32 rounded-xl" />
          <Skeleton.Block className="h-11 w-40 rounded-xl" />
        </div>
      </div>
    </Skeleton.Group>
  </div>
);

export default NotFoundSkeleton;
