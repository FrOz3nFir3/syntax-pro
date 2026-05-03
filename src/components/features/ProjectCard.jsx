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
          favorite: project.isFavorite ? "Removed from favorites" : "Added to favorites",
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

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setShowDropdown(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const isDarkTheme = ["githubDark", "dracula", "materialDark", "nord", "tokyoNight", "vscodeDark"].includes(project.theme);

    return (
      <div
        className={`
          group relative flex flex-col rounded-2xl border ${TRANSITIONS.DEFAULT}
          bg-paper-50 border-ink/10 shadow-soft
          dark:bg-ink-700 dark:border-paper/10
          hover:border-ink/30 dark:hover:border-paper/30
          hover:shadow-lift hover:-translate-y-0.5
          ${isDragging ? "opacity-50 scale-95 rotate-2 z-50 shadow-2xl" : ""}
          ${className}
        `}
      >
        {/* signal corner accent on hover */}
        <span
          aria-hidden
          className="absolute -top-1 -right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-signal opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
        <span
          aria-hidden
          className="absolute -bottom-1 -left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-signal opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        <Link
          to={`/playground/${folderId}/${playgroundId}`}
          className="flex-grow p-5 block"
        >
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center bg-paper border border-ink/10 dark:bg-ink-800 dark:border-paper/10">
              <img
                src={languageConfig.icon}
                alt={`${languageConfig.name} logo`}
                className="w-7 h-7 object-contain"
                onError={(e) => {
                  e.target.src = "/logo.png";
                }}
              />
            </div>
            <div className="flex-1 min-w-0 pr-7">
              <h3 className="font-display text-xl text-ink dark:text-paper leading-tight tracking-tight truncate mb-1.5">
                {project.title}
              </h3>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/55 dark:text-paper/55">
                {languageConfig.name}
              </span>
            </div>
          </div>

          {/* Code Preview */}
          <div className="rounded-xl p-4 font-mono text-xs leading-relaxed relative overflow-hidden bg-ink dark:bg-ink-900 border border-ink/15 dark:border-paper/10">
            <div className="space-y-1 text-paper/85">
              {project.code ? (
                project.code
                  .split("\n")
                  .slice(0, 3)
                  .map((line, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="text-paper/30 w-4 text-right">{index + 1}</span>
                      <span className="truncate flex-1">{line || " "}</span>
                    </div>
                  ))
              ) : (
                <div className="flex items-start gap-3 text-paper/40 italic">
                  <span className="w-4 text-right">1</span>
                  <span>// Start coding here...</span>
                </div>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-ink dark:from-ink-900 to-transparent pointer-events-none" />
          </div>
        </Link>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-ink/10 dark:border-paper/10">
          <div className="flex items-center gap-3 text-xs flex-1 min-w-0 font-mono">
            <span className="flex items-center gap-1.5 text-ink/55 dark:text-paper/55 uppercase tracking-[0.12em] text-[10px]">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatDate(project.updatedAt || project.createdAt)}
            </span>
            <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-ink/55 dark:text-paper/55">
              <span className={`w-1.5 h-1.5 rounded-full ${isDarkTheme ? "bg-ink dark:bg-paper" : "bg-mustard"}`} />
              {project.theme?.replace(/([A-Z])/g, " $1").trim() || "Default"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Tooltip content={project.isFavorite ? "Remove from favorites" : "Add to favorites"} position="top">
              <button
                onClick={(e) => handleActionClick(e, onToggleFavorite, "favorite")}
                className={`
                  p-1.5 rounded-lg transition-colors duration-200
                  ${project.isFavorite ? "text-mustard-500 hover:bg-mustard/15" : "text-ink/45 hover:text-ink hover:bg-ink/5 dark:text-paper/45 dark:hover:text-paper dark:hover:bg-paper/5"}
                `}
              >
                <svg className="w-4 h-4" fill={project.isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </button>
            </Tooltip>

            {draggable && (
              <Tooltip content="Drag to reorder" position="top">
                <div
                  {...dragProps}
                  className="p-1.5 rounded-lg cursor-grab active:cursor-grabbing transition-colors text-ink/45 hover:text-ink hover:bg-ink/5 dark:text-paper/45 dark:hover:text-paper dark:hover:bg-paper/5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
              </Tooltip>
            )}
          </div>
        </div>

        {/* More-actions menu */}
        <div className="absolute top-3 right-3 z-30" ref={dropdownRef}>
          <button
            onClick={handleDropdownToggle}
            title="More actions"
            className={`
              p-1.5 rounded-lg transition-all duration-200
              text-ink/55 hover:text-ink hover:bg-paper border border-transparent hover:border-ink/15
              dark:text-paper/55 dark:hover:text-paper dark:hover:bg-ink-800 dark:hover:border-paper/15
              ${showDropdown ? "bg-paper border-ink/15 text-ink dark:bg-ink-800 dark:border-paper/15 dark:text-paper" : ""}
            `}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>

          {showDropdown && (
            <div
              className="
                absolute top-full right-0 mt-2 w-44 py-2 rounded-xl shadow-lift z-[100]
                bg-paper-50 border border-ink/10
                dark:bg-ink-700 dark:border-paper/10
                animate-fade-in
              "
            >
              <DropdownItem onClick={(e) => handleActionClick(e, onEdit, "edit")} icon={<EditIcon />}>Edit</DropdownItem>
              <DropdownItem onClick={(e) => handleActionClick(e, onDuplicate, "duplicate")} icon={<CopyIcon />}>Duplicate</DropdownItem>
              <div className="my-1 h-px bg-ink/10 dark:bg-paper/10" />
              <DropdownItem onClick={(e) => handleActionClick(e, onDelete, "delete")} icon={<TrashIcon />} danger>Delete</DropdownItem>
            </div>
          )}
        </div>

        {feedback && (
          <div className="absolute bottom-3 left-3 right-3 z-10">
            <InlineFeedback type={feedback.type} message={feedback.message} visible className="text-xs py-2" />
          </div>
        )}
      </div>
    );
  }
);

const DropdownItem = ({ onClick, icon, children, danger }) => (
  <button
    onClick={onClick}
    className={`
      w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-3
      ${danger
        ? "text-signal-500 hover:bg-signal-50 dark:text-signal-200 dark:hover:bg-signal/10"
        : "text-ink/80 hover:bg-ink/5 dark:text-paper/80 dark:hover:bg-paper/5"}
    `}
  >
    {icon}
    {children}
  </button>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);
const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);
const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

ProjectCard.displayName = "ProjectCard";

export default ProjectCard;
