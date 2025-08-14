import React, { useState, memo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { languages } from "../../utils/constants";
import { TRANSITIONS } from "../../utils/animations";
import { useDragAndDrop, DRAG_TYPES } from "../../utils/dragAndDrop";
import Tooltip from "../ui/Tooltip";
import { InlineFeedback } from "../ui/FeedbackAnimation";

const ProjectCard = memo(
  ({
    project,
    playgroundId,
    folderId,
    onEdit,
    onDelete,
    onDuplicate,
    onToggleFavorite,
    className = "",
    draggable = true,
  }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const dropdownRef = useRef(null);

    const { dragProps, isDragging } = useDragAndDrop({
      type: DRAG_TYPES.PROJECT,
      data: { project, playgroundId, folderId },
      canDrag: () => draggable,
    });

    const languageConfig = languages[project.language] || {
      name: project.language,
      icon: `/logo.png`,
    };

    const handleActionClick = async (e, action, actionType) => {
      e.preventDefault();
      e.stopPropagation();
      setShowDropdown(false);

      try {
        await action();
        const messages = {
          favorite: project.isFavorite
            ? "Removed from favorites"
            : "Added to favorites",
          duplicate: "Project duplicated",
          delete: "Project deleted",
          edit: "Opening editor...",
        };
        if (messages[actionType]) {
          setFeedback({ type: "success", message: messages[actionType] });
          setTimeout(() => setFeedback(null), 2000);
        }
      } catch (error) {
        setFeedback({ type: "error", message: "Action failed" });
        setTimeout(() => setFeedback(null), 2000);
      }
    };

    const formatDate = (timestamp) => {
      if (!timestamp) return "Recently";
      return new Date(timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    };

    const handleDropdownToggle = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setShowDropdown((prev) => !prev);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setShowDropdown(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    return (
      <div
        className={`
        relative flex flex-col rounded-2xl border ${TRANSITIONS.DEFAULT} group
        bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg
        dark:bg-slate-800 dark:border-slate-700 dark:hover:border-slate-600 dark:hover:shadow-2xl
        ${
          isDragging
            ? "opacity-50 scale-95 rotate-2 z-50 shadow-2xl"
            : "shadow-sm"
        }
        ${className}
      `}
      >
        {/* Main clickable area */}
        <Link
          to={`/playground/${folderId}/${playgroundId}`}
          className="flex-grow p-4 block"
        >
          {/* Card Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className={`
                flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
                bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200
                dark:from-slate-700 dark:to-slate-800 dark:border-slate-600
                shadow-sm group-hover:shadow-md transition-shadow duration-200
              `}
              >
                <img
                  src={languageConfig.icon}
                  alt={`${languageConfig.name} logo`}
                  className="w-7 h-7 object-contain"
                  onError={(e) => {
                    e.target.src = "/logo.png";
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className={`
                  text-lg font-bold truncate mb-1
                  text-slate-900 dark:text-slate-100
                `}
                >
                  {project.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span
                    className={`
                    text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded-md
                    bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400
                  `}
                  >
                    {languageConfig.name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Code Preview */}
          <div
            className={`
            rounded-xl p-4 font-mono text-xs leading-relaxed relative overflow-hidden
            bg-slate-50/80 border border-slate-200/50 group-hover:bg-slate-100/50
            dark:bg-slate-900/80 dark:border-slate-700/50 dark:group-hover:bg-slate-800/50
            transition-colors duration-200
          `}
          >
            <div
              className={`
              text-slate-600 dark:text-slate-300
              space-y-1.5
            `}
            >
              {project.code ? (
                project.code
                  .split("\n")
                  .slice(0, 3)
                  .map((line, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="text-xs text-slate-400 dark:text-slate-500 w-4 text-right font-medium">
                        {index + 1}
                      </span>
                      <span className="truncate flex-1 text-slate-700 dark:text-slate-300">
                        {line || " "}
                      </span>
                    </div>
                  ))
              ) : (
                <div className="flex items-start gap-3 text-slate-400 dark:text-slate-500 italic">
                  <span className="text-xs w-4 text-right font-medium">1</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    // Start coding here...
                  </span>
                </div>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-slate-50/80 via-slate-50/40 dark:from-slate-900/80 dark:via-slate-900/40 to-transparent pointer-events-none" />
          </div>
        </Link>

        {/* Card Footer with actions */}
        <div
          className={`
          flex items-center justify-between gap-3 p-4 border-t bg-slate-50/50 dark:bg-slate-800/50
          border-slate-200 dark:border-slate-700
        `}
        >
          <div className="flex items-center gap-4 text-xs flex-1 min-w-0">
            <span
              className={`
              flex items-center gap-2
              text-slate-500 dark:text-slate-400
            `}
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {formatDate(project.updatedAt || project.createdAt)}
            </span>

            {/* Theme indicator */}
            <div className="flex items-center gap-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  project.theme === "githubDark" ||
                  project.theme === "dracula" ||
                  project.theme === "materialDark" ||
                  project.theme === "nord" ||
                  project.theme === "tokyoNight" ||
                  project.theme === "vscodeDark"
                    ? "bg-slate-800 dark:bg-slate-200"
                    : "bg-slate-200 dark:bg-slate-800"
                }`}
              ></div>
              <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                {project.theme?.replace(/([A-Z])/g, " $1").trim() || "Default"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Tooltip
              content={
                project.isFavorite
                  ? "Remove from favorites"
                  : "Add to favorites"
              }
              position="top"
            >
              <button
                onClick={(e) =>
                  handleActionClick(e, onToggleFavorite, "favorite")
                }
                className={`
                p-1.5 rounded-lg transition-colors duration-200
                ${
                  project.isFavorite
                    ? "text-yellow-500 hover:bg-yellow-500/10"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700"
                }
              `}
              >
                <svg
                  className="w-4 h-4"
                  fill={project.isFavorite ? "currentColor" : "none"}
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
              </button>
            </Tooltip>

            {/* Drag Handle */}
            {draggable && (
              <Tooltip content="Drag to reorder" position="top">
                <div
                  {...dragProps}
                  className={`
                  p-1.5 rounded-lg cursor-grab active:cursor-grabbing transition-colors
                  text-slate-500 hover:text-slate-700 hover:bg-slate-100
                  dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700
                `}
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
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </div>
              </Tooltip>
            )}
          </div>
        </div>

        {/* More Actions Dropdown */}
        <div className="absolute top-3 right-3 z-30" ref={dropdownRef}>
          <button
            onClick={handleDropdownToggle}
            title="More actions"
            className={`
            p-1.5 rounded-lg transition-all duration-200 backdrop-blur-sm
            text-slate-600 hover:text-slate-800 hover:bg-white/80
            dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/80
            border border-transparent hover:border-slate-200 dark:hover:border-slate-700
            ${
              showDropdown
                ? "bg-white/90 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700"
                : ""
            }
          `}
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
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>

          {showDropdown && (
            <div
              className={`
              absolute top-full right-0 mt-2 w-40 py-2 rounded-xl shadow-2xl border backdrop-blur-sm z-[100]
              bg-white border-slate-200 shadow-slate-900/20
              dark:bg-slate-800 dark:border-slate-700 dark:shadow-black/40
              transform transition-all duration-200 origin-top-right
              ${
                showDropdown
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }
            `}
            >
              <button
                onClick={(e) => handleActionClick(e, onEdit, "edit")}
                className="w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-3 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700/50"
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </button>
              <button
                onClick={(e) => handleActionClick(e, onDuplicate, "duplicate")}
                className="w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-3 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700/50"
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
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Duplicate
              </button>
              <div className="my-1 h-px bg-slate-200 dark:bg-slate-700"></div>
              <button
                onClick={(e) => handleActionClick(e, onDelete, "delete")}
                className="w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-3 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Feedback Overlay */}
        {feedback && (
          <div className="absolute bottom-3 left-3 right-3 z-10">
            <InlineFeedback
              type={feedback.type}
              message={feedback.message}
              visible={true}
              className="text-xs py-2"
            />
          </div>
        )}
      </div>
    );
  }
);

ProjectCard.displayName = "ProjectCard";

export default ProjectCard;
