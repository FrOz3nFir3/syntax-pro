import React, { useState, memo } from "react";
import Button from "../ui/Button";
import ProjectCard from "./ProjectCard";
import { ConfirmDialog } from "../ui";

const FolderSection = memo(
  ({
    folder,
    folderId,
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
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [draggedItem, setDraggedItem] = useState(null);
    const [dragOverItem, setDragOverItem] = useState(null);

    const playgrounds = folder.playgrounds || {};
    const playgroundEntries = Object.entries(playgrounds);
    const playgroundCount = playgroundEntries.length;

    const handleDeleteFolder = () => {
      setShowDeleteConfirm(false);
      onDeleteFolder(folderId);
    };

    const handleDragStart = (e, playgroundId) => {
      setDraggedItem(playgroundId);
      e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e, playgroundId) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setDragOverItem(playgroundId);
    };

    const handleDragLeave = () => {
      setDragOverItem(null);
    };

    const handleDrop = (e, targetPlaygroundId) => {
      e.preventDefault();

      if (draggedItem && draggedItem !== targetPlaygroundId) {
        onReorderProjects?.(folderId, draggedItem, targetPlaygroundId);
      }

      setDraggedItem(null);
      setDragOverItem(null);
    };

    const handleDragEnd = () => {
      setDraggedItem(null);
      setDragOverItem(null);
    };

    return (
      <>
        <div className={`folder-section ${className}`}>
          {/* Folder Header */}
          <div
            className={`
            flex items-center justify-between p-4 rounded-t-xl border-b bg-neutral-50 border-neutral-200 dark:bg-gray-900 dark:border-gray-800
            ${isCollapsed ? "rounded-b-xl border-b-0" : ""}
          `}
          >
            <div className="flex items-center gap-3">
              {/* Collapse/Expand Button */}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="
                p-2 rounded-lg transition-all duration-200
                hover:bg-neutral-200 text-neutral-600
                dark:hover:bg-neutral-700 dark:text-neutral-300
              "
                aria-label={isCollapsed ? "Expand folder" : "Collapse folder"}
              >
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isCollapsed ? "-rotate-90" : "rotate-0"
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

              {/* Folder Icon and Title */}
              <div className="flex items-center gap-3">
                <div
                  className="
                  p-2 rounded-lg bg-yellow-100 text-yellow-600 dark:bg-neutral-700 dark:text-yellow-400
                "
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z" />
                  </svg>
                </div>

                <div>
                  <h3
                    className="
                    text-lg font-semibold
                    text-neutral-900 dark:text-neutral-100
                  "
                  >
                    {folder.title}
                  </h3>
                  <p
                    className="
                    text-sm
                    text-neutral-500 dark:text-neutral-400
                  "
                  >
                    {playgroundCount}{" "}
                    {playgroundCount === 1 ? "playground" : "playgrounds"}
                  </p>
                </div>
              </div>
            </div>

            {/* Folder Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="small"
                onClick={() => onCreatePlayground(folderId)}
                className="hidden sm:inline-flex"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                New Playground
              </Button>

              {/* Mobile New Playground Button */}
              <Button
                variant="secondary"
                size="small"
                onClick={() => onCreatePlayground(folderId)}
                className="sm:hidden"
                title="New Playground"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </Button>

              {/* Folder Menu */}
              <div className="relative group">
                <button
                  className="
                  p-2 rounded-lg transition-colors duration-200
                  hover:bg-neutral-200 text-neutral-600
                  dark:hover:bg-neutral-700 dark:text-neutral-300
                "
                  title="Folder options"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div
                  className="
                  absolute right-0 top-full mt-1 w-40 py-1 rounded-lg shadow-lg border z-20
                  opacity-0 invisible group-hover:opacity-100 group-hover:visible
                  transition-all duration-200 origin-top-right
                  bg-white border-neutral-200
                  dark:bg-neutral-800 dark:border-neutral-700
                "
                >
                  <button
                    onClick={() => onEditFolder(folderId, folder.title)}
                    className="
                    w-full px-3 py-2 text-left text-sm transition-colors duration-200
                    text-neutral-700 hover:bg-neutral-50
                    dark:text-neutral-300 dark:hover:bg-neutral-700
                  "
                  >
                    <svg
                      className="w-4 h-4 inline mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Folder
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="
                    w-full px-3 py-2 text-left text-sm transition-colors duration-200
                    text-red-500 hover:bg-red-50
                    dark:hover:bg-red-900/20
                  "
                  >
                    <svg
                      className="w-4 h-4 inline mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete Folder
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Folder Content */}
          <div
            className={`
            transition-all duration-300 ease-in-out overflow-hidden
            ${isCollapsed ? "max-h-0 opacity-0" : "max-h-[2000px] opacity-100"}
          `}
          >
            <div
              className="
              p-4 sm:p-6
              bg-white dark:bg-neutral-800/50
              rounded-b-xl border-l border-r border-b
              border-neutral-200 dark:border-neutral-700
            "
            >
              {playgroundCount === 0 ? (
                /* Empty State */
                <div className="text-center py-12">
                  <div
                    className="
                    w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center
                    bg-neutral-100 text-neutral-500
                    dark:bg-neutral-700 dark:text-neutral-400
                  "
                  >
                    <svg
                      className="w-8 h-8"
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
                  </div>
                  <h4
                    className="
                    text-lg font-medium mb-2
                    text-neutral-700 dark:text-neutral-300
                  "
                  >
                    No playgrounds yet
                  </h4>
                  <p
                    className="
                    text-sm mb-4
                    text-neutral-500 dark:text-neutral-400
                  "
                  >
                    Create your first playground to start coding
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => onCreatePlayground(folderId)}
                  >
                    Create Playground
                  </Button>
                </div>
              ) : (
                /* Playgrounds Grid */
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {playgroundEntries.map(([playgroundId, playground]) => (
                    <div
                      key={playgroundId}
                      draggable
                      onDragStart={(e) => handleDragStart(e, playgroundId)}
                      onDragOver={(e) => handleDragOver(e, playgroundId)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, playgroundId)}
                      onDragEnd={handleDragEnd}
                      className={`
                      transition-all duration-200
                      ${
                        draggedItem === playgroundId
                          ? "opacity-50 scale-95"
                          : ""
                      }
                      ${
                        dragOverItem === playgroundId
                          ? "transform translate-y-1 shadow-lg"
                          : ""
                      }
                    `}
                    >
                      <ProjectCard
                        project={playground}
                        playgroundId={playgroundId}
                        folderId={folderId}
                        onEdit={() =>
                          onEditPlayground(
                            folderId,
                            playgroundId,
                            playground.title
                          )
                        }
                        onDelete={() =>
                          onDeletePlayground(folderId, playgroundId)
                        }
                        onDuplicate={() =>
                          onDuplicatePlayground(folderId, playgroundId)
                        }
                        onToggleFavorite={() =>
                          onToggleFavorite(folderId, playgroundId)
                        }
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteFolder}
          title="Delete Folder"
          message={`Are you sure you want to delete "${folder.title}"? This will also delete all playgrounds in this folder. This action cannot be undone.`}
          confirmText="Delete Folder"
          confirmVariant="danger"
        />
      </>
    );
  }
);

FolderSection.displayName = "FolderSection";

export default FolderSection;
