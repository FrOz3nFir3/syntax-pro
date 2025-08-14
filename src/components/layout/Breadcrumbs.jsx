import React from "react";
import { Link, useLocation } from "react-router-dom";
import { HomeIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useResponsiveBreakpoint } from "../../utils/responsive";

const Breadcrumbs = ({ className = "" }) => {
  const location = useLocation();
  const { isSmallScreen } = useResponsiveBreakpoint();

  // Generate breadcrumbs based on current route
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const breadcrumbs = [{ label: "Home", path: "/", isHome: true }];

    if (pathSegments.length > 0) {
      if (pathSegments[0] === "playgrounds") {
        breadcrumbs.push({
          label: "Playgrounds",
          path: "/playgrounds",
          isHome: false,
        });
      } else if (pathSegments[0] === "playground" && pathSegments.length >= 3) {
        breadcrumbs.push({
          label: "Playgrounds",
          path: "/playgrounds",
          isHome: false,
        });
        breadcrumbs.push({
          label: "Playground",
          path: `/playground/${pathSegments[1]}/${pathSegments[2]}`,
          isHome: false,
        });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on home page, playground pages, or if only one item
  if (breadcrumbs.length <= 1 || location.pathname.startsWith("/playground/")) {
    return null;
  }

  return (
    <div
      className={`
        fixed top-16 left-0 right-0 z-40
        bg-neutral-50/95 border-neutral-200
        dark:bg-slate-900 dark:border-neutral-700
        border-b backdrop-blur-sm transition-colors duration-300
        ${className}
      `}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          className={`flex items-center space-x-2 py-3 ${
            isSmallScreen ? "text-sm" : "text-sm"
          }`}
          aria-label="Breadcrumb"
        >
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.path}>
              {index > 0 && (
                <ChevronRightIcon className="w-4 h-4 flex-shrink-0 text-neutral-400 dark:text-neutral-500" />
              )}

              {index === breadcrumbs.length - 1 ? (
                // Current page - not clickable
                <div className="flex items-center space-x-2">
                  {crumb.isHome && (
                    <HomeIcon className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  )}
                  <span
                    className="
                      font-semibold px-2 py-1 rounded-md
                      text-blue-700 bg-blue-100
                      dark:text-blue-400 dark:bg-blue-900/30
                    "
                  >
                    {crumb.isHome && isSmallScreen ? "" : crumb.label}
                  </span>
                </div>
              ) : (
                // Clickable breadcrumb
                <Link
                  to={crumb.path}
                  className="flex items-center space-x-2 group"
                >
                  {crumb.isHome && (
                    <HomeIcon className="w-4 h-4 flex-shrink-0 transition-colors text-neutral-500 group-hover:text-neutral-700 dark:text-neutral-400 dark:group-hover:text-neutral-200" />
                  )}
                  <span
                    className="
                      font-medium hover:underline transition-colors px-2 py-1 rounded-md
                      hover:bg-neutral-100 dark:hover:bg-neutral-700
                      text-neutral-600 group-hover:text-neutral-800
                      dark:text-neutral-400 dark:group-hover:text-neutral-200
                    "
                  >
                    {crumb.isHome && isSmallScreen ? "" : crumb.label}
                  </span>
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumbs;
