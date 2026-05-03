import React from "react";
import { Link, useLocation } from "react-router-dom";
import { HomeIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useResponsiveBreakpoint } from "../../utils/responsive";

const Breadcrumbs = ({ className = "" }) => {
  const location = useLocation();
  const { isSmallScreen } = useResponsiveBreakpoint();

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

  if (breadcrumbs.length <= 1 || location.pathname.startsWith("/playground/")) {
    return null;
  }

  return (
    <div
      className={`
        fixed top-16 left-0 right-0 z-40
        bg-paper/85 dark:bg-ink-800/85
        border-b border-ink/10 dark:border-paper/10
        backdrop-blur-md transition-colors duration-300
        ${className}
      `}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          className="flex items-center gap-2 py-3 text-sm font-mono"
          aria-label="Breadcrumb"
        >
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.path}>
                {index > 0 && (
                  <span
                    aria-hidden
                    className="text-ink/30 dark:text-paper/30 select-none"
                  >
                    /
                  </span>
                )}

                {isLast ? (
                  <div className="flex items-center gap-1.5">
                    {crumb.isHome && (
                      <HomeIcon className="w-3.5 h-3.5 flex-shrink-0 text-signal" />
                    )}
                    <span className="text-ink dark:text-paper text-xs uppercase tracking-[0.18em]">
                      {crumb.isHome && isSmallScreen ? "" : crumb.label}
                    </span>
                  </div>
                ) : (
                  <Link
                    to={crumb.path}
                    className="flex items-center gap-1.5 group transition-colors"
                  >
                    {crumb.isHome && (
                      <HomeIcon className="w-3.5 h-3.5 flex-shrink-0 text-ink/55 dark:text-paper/55 group-hover:text-ink dark:group-hover:text-paper transition-colors" />
                    )}
                    <span className="text-xs uppercase tracking-[0.18em] text-ink/55 dark:text-paper/55 group-hover:text-ink dark:group-hover:text-paper transition-colors">
                      {crumb.isHome && isSmallScreen ? "" : crumb.label}
                    </span>
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumbs;
