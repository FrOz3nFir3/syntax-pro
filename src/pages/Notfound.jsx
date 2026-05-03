import React from "react";
import { Link } from "react-router-dom";
import Frame from "../components/ui/Frame";

function Notfound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-paper dark:bg-ink-800 px-4 relative overflow-hidden">
      <span
        aria-hidden
        className="absolute top-12 left-12 w-12 h-12 border-t-2 border-l-2 border-signal hidden sm:block"
      />
      <span
        aria-hidden
        className="absolute bottom-12 right-12 w-12 h-12 border-b-2 border-r-2 border-signal hidden sm:block"
      />

      <Frame
        tone="signal"
        size="lg"
        corners="all"
        className="max-w-lg w-full"
        innerClassName="text-center px-8 py-14 bg-paper-50 dark:bg-ink-700 border border-ink/10 dark:border-paper/10 rounded-2xl shadow-soft"
      >
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-signal mb-6">
          404 · file not found
        </p>
        <h1 className="heading-display text-6xl text-ink dark:text-paper mb-4">
          <span className="text-mustard">{"<"}</span>oops{" "}
          <span className="italic text-ink/55 dark:text-paper/55">/</span>
          <span className="text-mustard">{">"}</span>
        </h1>
        <p className="text-ink/65 dark:text-paper/65 mb-10 max-w-sm mx-auto">
          That route doesn't exist — but every other one still does. Try one of
          these.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" replace className="btn-secondary">
            Back to home
          </Link>
          <Link to="/playgrounds" replace className="btn-outline">
            View playgrounds
          </Link>
        </div>
      </Frame>
    </div>
  );
}

export default Notfound;
