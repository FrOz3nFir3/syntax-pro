import React from "react";

const Sidebar = ({
  children,
  className = "",
  width = "w-64",
  collapsible = false,
  collapsed = false,
  onToggle = null,
}) => {
  return (
    <aside
      className={`
        ${collapsed ? "w-16" : width}
        transition-all duration-300 ease-in-out
        bg-white border-neutral-200
        dark:bg-slate-900 dark:border-neutral-700
        border-r flex-shrink-0 h-full
        ${className}
      `}
      aria-label="Sidebar navigation"
    >
      {collapsible && onToggle && (
        <div className="p-4 border-b border-inherit">
          <button
            onClick={onToggle}
            className={`
              w-full flex items-center justify-center p-2 rounded-lg
              transition-colors duration-200 hover:bg-neutral-100 text-neutral-600 dark:hover:bg-neutral-700 dark:text-neutral-300
            `}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${
                collapsed ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">{children}</div>
    </aside>
  );
};

export default Sidebar;
