import React, { useState, useMemo, memo } from "react";
import { languages } from "../../utils/constants";
import {
  useResponsiveBreakpoint,
  useTouchDevice,
  getResponsiveSpacing,
  getResponsiveTypography,
} from "../../utils/responsive";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import FolderSection from "./FolderSection";
import { StaggeredContainer } from "../ui/PageTransition";

const ProjectGrid = memo(
  ({
    folders,
    onCreateFolder,
    onEditFolder,
    onDeleteFolder,
    onCreatePlayground,
    onEditPlayground,
    onDeletePlayground,
    onDuplicatePlayground,
    onToggleFavorite,
    onReorderProjects,
    className = "",
  }) => {
    const { currentBreakpoint, isMobile, isTablet, isSmallScreen } =
      useResponsiveBreakpoint();
    const { isTouchDevice } = useTouchDevice();
    const spacing = getResponsiveSpacing(currentBreakpoint);
    const typography = getResponsiveTypography(currentBreakpoint);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    const [showFavorites, setShowFavorites] = useState(false);
    const [showFilters, setShowFilters] = useState(!isSmallScreen);

    // Language options for filter
    const languageOptions = [
      { value: "all", label: "All Languages" },
      ...Object.entries(languages).map(([key, lang]) => ({
        value: key,
        label: lang.name,
      })),
    ];

    // Sort options
    const sortOptions = [
      { value: "name", label: "Name" },
      { value: "language", label: "Language" },
      { value: "created", label: "Date Created" },
      { value: "updated", label: "Last Modified" },
    ];

    // Filter and sort folders and playgrounds
    const filteredAndSortedFolders = useMemo(() => {
      const folderEntries = Object.entries(folders || {});

      return folderEntries
        .map(([folderId, folder]) => {
          // Filter playgrounds within each folder
          const playgroundEntries = Object.entries(folder.playgrounds || {});
          const filteredPlaygrounds = playgroundEntries.filter(
            ([_, playground]) => {
              // Search filter
              const matchesSearch =
                playground.title
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                playground.language
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                folder.title.toLowerCase().includes(searchQuery.toLowerCase());

              // Language filter
              const matchesLanguage =
                selectedLanguage === "all" ||
                playground.language === selectedLanguage;

              // Favorites filter
              const matchesFavorites = !showFavorites || playground.isFavorite;

              return matchesSearch && matchesLanguage && matchesFavorites;
            }
          );

          // Sort playgrounds
          const sortedPlaygrounds = filteredPlaygrounds.sort(([, a], [, b]) => {
            switch (sortBy) {
              case "name":
                return a.title.localeCompare(b.title);
              case "language":
                return a.language.localeCompare(b.language);
              case "created":
                return (b.createdAt || 0) - (a.createdAt || 0);
              case "updated":
                return (
                  (b.updatedAt || b.createdAt || 0) -
                  (a.updatedAt || a.createdAt || 0)
                );
              default:
                return 0;
            }
          });

          return [
            folderId,
            {
              ...folder,
              playgrounds: Object.fromEntries(sortedPlaygrounds),
            },
          ];
        })
        .filter(([_, folder]) => {
          // Show all folders, even empty ones, unless there's a search query
          if (!searchQuery && !selectedLanguage !== "all" && !showFavorites) {
            return true; // Show all folders when no filters are applied
          }

          // When filters are applied, show folders that have matching playgrounds or match search themselves
          const hasMatchingPlaygrounds =
            Object.keys(folder.playgrounds).length > 0;
          const folderMatchesSearch = folder.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

          return hasMatchingPlaygrounds || folderMatchesSearch;
        })
        .sort(([, a], [, b]) => a.title.localeCompare(b.title));
    }, [folders, searchQuery, selectedLanguage, sortBy, showFavorites]);

    const totalPlaygrounds = useMemo(() => {
      return Object.values(folders || {}).reduce(
        (total, folder) => total + Object.keys(folder.playgrounds || {}).length,
        0
      );
    }, [folders]);

    const filteredPlaygroundCount = useMemo(() => {
      return filteredAndSortedFolders.reduce(
        (total, [_, folder]) =>
          total + Object.keys(folder.playgrounds || {}).length,
        0
      );
    }, [filteredAndSortedFolders]);

    const hasNoFolders = Object.keys(folders || {}).length === 0;
    const hasNoResults = filteredAndSortedFolders.length === 0 && !hasNoFolders;

    return (
      <div className={`project-grid ${className}`}>
        {/* Header Section */}
        <div className={`mb-6 lg:mb-8 ${spacing.section}`}>
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <p className="eyebrow mb-3">Your workspace</p>
                <h1 className="heading-display text-4xl sm:text-5xl text-ink dark:text-paper mb-2">
                  My Playgrounds
                </h1>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink/55 dark:text-paper/55">
                  {totalPlaygrounds}{" "}
                  {totalPlaygrounds === 1 ? "playground" : "playgrounds"}
                  <span className="mx-2 text-ink/25 dark:text-paper/25">/</span>
                  {Object.keys(folders || {}).length}{" "}
                  {Object.keys(folders || {}).length === 1 ? "folder" : "folders"}
                </p>
              </div>

              <div className="flex flex-col xs:flex-row gap-3 xs:gap-2 sm:gap-3">
                <Button
                  variant="secondary"
                  onClick={onCreateFolder}
                  size={isSmallScreen ? "medium" : "medium"}
                  className="xs:order-1"
                >
                  <svg
                    className={`${isSmallScreen ? "w-5 h-5" : "w-4 h-4"} mr-2`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  {isSmallScreen ? "Folder" : "New Folder"}
                </Button>
                <Button
                  variant="primary"
                  onClick={() => onCreatePlayground()}
                  size={isSmallScreen ? "medium" : "medium"}
                  className="xs:order-2"
                >
                  <svg
                    className={`${isSmallScreen ? "w-5 h-5" : "w-4 h-4"} mr-2`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                  {isSmallScreen ? "Playground" : "New Playground"}
                </Button>
              </div>
            </div>

            {/* Filter Toggle — tightened to a pill, not a full-width row */}
            {!hasNoFolders && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="
                self-start inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border transition-colors font-mono text-[11px] uppercase tracking-[0.16em]
                bg-transparent border-ink/15 text-ink/65 hover:bg-ink/5 hover:text-ink hover:border-ink/30
                dark:border-paper/15 dark:text-paper/65 dark:hover:bg-paper/5 dark:hover:text-paper dark:hover:border-paper/30
              "
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
                  />
                </svg>
                {showFilters ? "Hide filters" : "Show filters"}
                <svg
                  className={`w-3 h-3 transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Search and Filter Controls */}
          {!hasNoFolders && showFilters && (
            <div
              className={`
              pt-5 transition-all duration-300
              ${isSmallScreen ? "animate-fade-in" : ""}
            `}
            >
              <div className="grid gap-4 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {/* Search */}
                <div className="sm:col-span-2 lg:col-span-2">
                  <Input
                    type="text"
                    placeholder={
                      isSmallScreen
                        ? "Search..."
                        : "Search playgrounds and folders..."
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                    touchFriendly={isTouchDevice}
                    icon={
                      <svg
                        className={`${isSmallScreen ? "w-5 h-5" : "w-4 h-4"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    }
                  />
                </div>

                {/* Language Filter */}
                <div className="sm:col-span-1">
                  <Select
                    value={selectedLanguage}
                    onChange={(value) => setSelectedLanguage(value)}
                    options={languageOptions}
                    placeholder={
                      isSmallScreen ? "Language" : "Filter by language"
                    }
                    touchFriendly={isTouchDevice}
                  />
                </div>

                {/* Sort */}
                <div className="sm:col-span-1">
                  <Select
                    value={sortBy}
                    onChange={(value) => setSortBy(value)}
                    options={sortOptions}
                    placeholder="Sort by"
                    touchFriendly={isTouchDevice}
                  />
                </div>
              </div>

              {/* Additional Filters */}
              <div className="flex flex-wrap items-center gap-4 mt-5 pt-4 border-t border-ink/10 dark:border-paper/10">
                <button
                  onClick={() => setShowFavorites(!showFavorites)}
                  className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
                  transition-colors duration-200
                  ${
                    showFavorites
                      ? "bg-mustard/20 text-mustard-700 border border-mustard-300 dark:bg-mustard/15 dark:text-mustard-200 dark:border-mustard/40"
                      : "text-ink/65 hover:text-ink hover:bg-ink/5 dark:text-paper/65 dark:hover:text-paper dark:hover:bg-paper/5"
                  }
                `}
                >
                  <svg
                    className="w-4 h-4"
                    fill={showFavorites ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                  Favorites Only
                </button>

                {/* Results Count */}
                {(searchQuery ||
                  selectedLanguage !== "all" ||
                  showFavorites) && (
                  <span className="font-mono text-xs uppercase tracking-[0.14em] text-ink/55 dark:text-paper/55">
                    Showing {filteredPlaygroundCount} / {totalPlaygrounds}
                  </span>
                )}

                {(searchQuery ||
                  selectedLanguage !== "all" ||
                  showFavorites) && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedLanguage("all");
                      setShowFavorites(false);
                    }}
                    className="text-sm font-medium transition-colors duration-200 text-signal hover:text-signal-500"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        {hasNoFolders ? (
          <div className="text-center py-20 relative">
            <span aria-hidden className="absolute top-0 left-1/2 -translate-x-24 w-10 h-10 border-t-2 border-l-2 border-signal/40" />
            <span aria-hidden className="absolute bottom-8 left-1/2 translate-x-14 w-10 h-10 border-b-2 border-r-2 border-signal/40" />
            <p className="eyebrow mb-4">A blank slate</p>
            <h2 className="heading-display text-4xl text-ink dark:text-paper mb-4">
              Welcome to Syntax<span className="text-signal">.</span>Pro
            </h2>
            <p className="text-ink/65 dark:text-paper/65 mb-10 max-w-md mx-auto">
              Make your first playground, or set up a folder to keep things
              organized. Either works — there's no wrong order.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" onClick={() => onCreatePlayground()}>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
                Create Your First Playground
              </Button>
              <Button variant="secondary" onClick={onCreateFolder}>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Create Folder
              </Button>
            </div>
          </div>
        ) : hasNoResults ? (
          <div className="text-center py-16">
            <p className="eyebrow mb-3">No matches</p>
            <h3 className="heading-display text-3xl text-ink dark:text-paper mb-3">
              Nothing here
            </h3>
            <p className="text-ink/65 dark:text-paper/65 mb-8 max-w-sm mx-auto">
              Loosen your search or filters and try again.
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                setSearchQuery("");
                setSelectedLanguage("all");
                setShowFavorites(false);
              }}
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          /* Folders List */
          <StaggeredContainer
            className="space-y-8"
            staggerDelay={100}
            animationType="FADE_IN"
          >
            {filteredAndSortedFolders.map(([folderId, folder]) => (
              <FolderSection
                key={folderId}
                folder={folder}
                folderId={folderId}
                onEditFolder={onEditFolder}
                onDeleteFolder={onDeleteFolder}
                onCreatePlayground={onCreatePlayground}
                onEditPlayground={onEditPlayground}
                onDeletePlayground={onDeletePlayground}
                onDuplicatePlayground={onDuplicatePlayground}
                onToggleFavorite={onToggleFavorite}
                onReorderProjects={onReorderProjects}
              />
            ))}
          </StaggeredContainer>
        )}
      </div>
    );
  }
);

ProjectGrid.displayName = "ProjectGrid";

export default ProjectGrid;
