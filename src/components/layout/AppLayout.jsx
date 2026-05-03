import React from "react";

import {
  useResponsiveBreakpoint,
  useTouchDevice,
  getResponsiveSpacing,
  getContainerClasses,
} from "../../utils/responsive";
import Header from "./Header";
import Breadcrumbs from "./Breadcrumbs";

const AppLayout = ({
  children,
  showHeader = true,
  showBreadcrumbs = true,
  headerProps = {},
  className = "",
  containerClassName = "",
  containerSize = "default",
  noPadding = false,
}) => {
  const { currentBreakpoint } = useResponsiveBreakpoint();
  const { isTouchDevice } = useTouchDevice();
  const spacing = getResponsiveSpacing(currentBreakpoint);

  return (
    <div
      className={`app-layout bg-paper dark:bg-ink-800 min-h-screen transition-colors duration-300 overflow-x-hidden ${className}`}
      data-breakpoint={currentBreakpoint}
      data-touch={isTouchDevice}
    >
      {showHeader && <Header {...headerProps} />}

      {showBreadcrumbs && <Breadcrumbs />}

      <main
        id="main-content"
        className={`main-content  ${
          showHeader ? (showBreadcrumbs ? "pt-28" : "pt-16") : ""
        } ${containerClassName}`}
        role="main"
        tabIndex="-1"
      >
        <div
          className={noPadding ? "w-full" : getContainerClasses(containerSize)}
        >
          {children}
        </div>
      </main>
    </div>
  );
};

// Responsive container component for different content widths
export const AppContainer = ({
  children,
  size = "default",
  className = "",
  noPadding = false,
}) => {
  const sizeClasses = {
    sm: "max-w-2xl",
    default: "max-w-7xl",
    lg: "max-w-screen-2xl",
    full: "max-w-none",
  };

  return (
    <div
      className={`
        container mx-auto 
        ${sizeClasses[size]} 
        ${noPadding ? "" : "px-4 sm:px-6 lg:px-8"}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// Layout wrapper for pages that need sidebar
export const AppLayoutWithSidebar = ({
  children,
  sidebar,
  sidebarWidth = "w-64",
  collapsible = false,
  defaultCollapsed = false,
  ...props
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] =
    React.useState(defaultCollapsed);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <AppLayout {...props} containerClassName="p-0">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`
            ${sidebarCollapsed ? "w-16" : sidebarWidth}
            transition-all duration-300 ease-in-out
            bg-white border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700
            border-r flex-shrink-0
          `}
          aria-label="Sidebar navigation"
        >
          {collapsible && (
            <button
              onClick={toggleSidebar}
              className={`
                w-full p-4 text-left hover:bg-opacity-10 hover:bg-neutral-500
                transition-colors duration-200
                text-neutral-600 dark:text-neutral-300
              `}
              aria-label={
                sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
              }
            >
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${
                  sidebarCollapsed ? "rotate-180" : ""
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
          )}
          {sidebar}
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

// Legacy hook - use useResponsiveBreakpoint from utils/responsive instead
export const useResponsive = () => {
  const responsive = useResponsiveBreakpoint();

  return {
    screenSize: responsive.currentBreakpoint,
    isMobile: responsive.isMobile,
    isTablet: responsive.isTablet,
    isDesktop: responsive.isDesktop,
    breakpoints: {
      xs: responsive.isXs,
      sm: responsive.isSm,
      md: responsive.isMd,
      lg: responsive.isLg,
      xl: responsive.isXl,
      "2xl": responsive.is2Xl,
    },
  };
};

export default AppLayout;
