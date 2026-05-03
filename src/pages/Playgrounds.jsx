import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useButtonToggle } from "../hooks/useButtonToggle.jsx";
import Modal from "../components/ui/Modal.jsx";
import { ProjectGrid } from "../components/features";
import AppLayout from "../components/layout/AppLayout";
import {
  deleteItems,
  selectCurrentPlayground,
  addFolder,
  addPlayground,
  editTitles,
  toggleFavorite,
  reorderPlaygrounds,
} from "../slices/playgroundSlice.jsx";

function Playgrounds() {
  const [modal, toggle] = useButtonToggle();
  const folders = useSelector(selectCurrentPlayground);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Enhanced folder management
  const handleCreateFolder = () => {
    toggle({
      clicked: true,
      type: "newFolder",
    });
  };

  const handleEditFolder = (folderId, currentTitle) => {
    toggle({
      clicked: true,
      type: "editFolder",
      title: currentTitle,
      folderId,
    });
  };

  const handleDeleteFolder = (folderId) => {
    dispatch(deleteItems({ type: "deleteFolder", folderId }));
  };

  // Enhanced playground management
  const handleCreatePlayground = (folderId = null) => {
    if (folderId) {
      toggle({
        clicked: true,
        type: "newPlayground",
        folderId,
      });
    } else {
      toggle({
        clicked: true,
        type: "newPlaygroundAndFolder",
      });
    }
  };

  const handleEditPlayground = (folderId, playgroundId, currentTitle) => {
    toggle({
      clicked: true,
      type: "editCard",
      title: currentTitle,
      playgroundId,
      folderId,
    });
  };

  const handleDeletePlayground = (folderId, playgroundId) => {
    dispatch(deleteItems({ type: "deleteCard", playgroundId, folderId }));
  };

  const handleDuplicatePlayground = (folderId, playgroundId) => {
    const playground = folders[folderId]?.playgrounds[playgroundId];
    if (playground) {
      const duplicatedPlayground = {
        ...playground,
        title: `${playground.title} (Copy)`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      // Add the duplicated playground to the same folder
      dispatch(
        addPlayground({
          folderId,
          title: duplicatedPlayground.title,
          language: duplicatedPlayground.language,
        })
      );
    }
  };

  const handleToggleFavorite = (folderId, playgroundId) => {
    dispatch(toggleFavorite({ folderId, playgroundId }));
  };

  const handleReorderProjects = (folderId, draggedId, targetId) => {
    dispatch(reorderPlaygrounds({ folderId, draggedId, targetId }));
  };

  return (
    <AppLayout className="bg-paper dark:bg-ink-800">
      {modal.clicked && <Modal modal={modal} toggle={toggle} />}

      {error && (
        <div className="mb-6 p-4 bg-signal-50 border border-signal-100 text-signal-500 rounded-xl shadow-soft dark:bg-signal/10 dark:border-signal/30 dark:text-signal-200">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-signal mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <p className="font-medium">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 underline hover:no-underline transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <ProjectGrid
          folders={folders}
          onCreateFolder={handleCreateFolder}
          onEditFolder={handleEditFolder}
          onDeleteFolder={handleDeleteFolder}
          onCreatePlayground={handleCreatePlayground}
          onEditPlayground={handleEditPlayground}
          onDeletePlayground={handleDeletePlayground}
          onDuplicatePlayground={handleDuplicatePlayground}
          onToggleFavorite={handleToggleFavorite}
          onReorderProjects={handleReorderProjects}
        />
      </div>
    </AppLayout>
  );
}

export default Playgrounds;
