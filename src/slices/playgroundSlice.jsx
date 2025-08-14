import { createSlice } from "@reduxjs/toolkit";
import { handleAsyncError, handleAsyncSuccess, setLoading } from "./uiSlice";
import storageManager from "../utils/storageManager";

const languageMap = {
  cpp: {
    id: 54,
    defaultCode:
      "#include <iostream>\n" +
      "using namespace std;\n\n" +
      "int main() {\n" +
      '\tcout << "Hello from C++!";\n' +
      "\treturn 0;\n" +
      "}",
  },
  java: {
    id: 62,
    defaultCode: `public class Main {
      public static void main(String[] args) {
        System.out.println("Hello from Java!");
      }
}`,
  },
  javascript: {
    id: 63,
    defaultCode: `console.log("Hello from Javascript!")`,
  },
  php: {
    id: 68,
    defaultCode: `<?php echo 'Hello from PHP!'; ?>`,
  },
  python: {
    id: 71,
    defaultCode: `print("Hello from Python")`,
  },
  rust: {
    id: 73,
    defaultCode: `fn main() {
      println!("Hello from Rust!");
}`,
  },
};

const initialState = {
  [crypto.randomUUID()]: {
    title: "DSA",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    playgrounds: {
      [crypto.randomUUID()]: {
        id: 54,
        title: "Hello World",
        language: "cpp",
        code: languageMap["cpp"].defaultCode,
        theme: "tokyoNight",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isFavorite: false,
        lastRun: null,
      },
      [crypto.randomUUID()]: {
        id: 63,
        title: "Hello World",
        language: "javascript",
        code: languageMap["javascript"].defaultCode,
        theme: "tokyoNight",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isFavorite: true,
        lastRun: Date.now(),
      },
      [crypto.randomUUID()]: {
        id: 71,
        title: "Hello World ",
        language: "python",
        code: languageMap["python"].defaultCode,
        theme: "tokyoNight",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isFavorite: false,
        lastRun: null,
      },
      [crypto.randomUUID()]: {
        id: 62,
        title: "Hello World",
        language: "java",
        code: languageMap["java"].defaultCode,
        theme: "tokyoNight",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isFavorite: false,
        lastRun: Date.now(),
      },
    },
  },
};

const localPlayground = localStorage.getItem("playground") || "{}";

if (localPlayground == "{}") {
  // website doesn't have any playgrounds or folders
  localStorage.setItem("playground", JSON.stringify(initialState));
}

// Enhanced localStorage operations with error handling using storageManager
const saveToLocalStorage = (state) => {
  return storageManager.safeSetItem("playground", state);
};

const loadFromLocalStorage = () => {
  return storageManager.safeGetItem("playground", null);
};

// Initialize state with better error handling
const initializeState = () => {
  const localData = loadFromLocalStorage();

  if (!localData || Object.keys(localData).length === 0) {
    // First time user or corrupted data - use initial state
    saveToLocalStorage(initialState);
    return initialState;
  }

  return localData;
};

const playgroundSlicer = createSlice({
  name: "playground",
  initialState: initializeState(),
  reducers: {
    addFolder(state, action) {
      try {
        const newFolder = action.payload;
        const now = Date.now();
        const folderId = crypto.randomUUID();

        state[folderId] = {
          ...newFolder,
          createdAt: now,
          updatedAt: now,
          playgrounds: newFolder.playgrounds || {},
          color: newFolder.color || "#3b82f6", // Default blue color
          description: newFolder.description || "",
        };

        if (!saveToLocalStorage(state)) {
          throw new Error("Failed to save folder to storage");
        }
      } catch (error) {
        console.error("Error adding folder:", error);
        // Note: In a real app, you'd dispatch an error action here
      }
    },

    addPlayground(state, action) {
      try {
        const { folderId, title, language, description = "" } = action.payload;
        const now = Date.now();
        const playgroundId = crypto.randomUUID();

        if (!state[folderId]) {
          throw new Error("Folder not found");
        }

        if (!languageMap[language]) {
          throw new Error("Unsupported language");
        }

        state[folderId].playgrounds[playgroundId] = {
          id: languageMap[language].id,
          title,
          language,
          code: languageMap[language].defaultCode,
          theme: "tokyoNight",
          createdAt: now,
          updatedAt: now,
          isFavorite: false,
          lastRun: null,
          description,
          tags: [],
          executionCount: 0,
          averageExecutionTime: 0,
        };

        state[folderId].updatedAt = now;

        if (!saveToLocalStorage(state)) {
          throw new Error("Failed to save playground to storage");
        }
      } catch (error) {
        console.error("Error adding playground:", error);
      }
    },

    addPlaygroundAndFolder(state, action) {
      try {
        const {
          folderTitle,
          cardTitle,
          language,
          folderColor = "#3b82f6",
        } = action.payload;
        const now = Date.now();
        const folderId = crypto.randomUUID();
        const playgroundId = crypto.randomUUID();

        if (!languageMap[language]) {
          throw new Error("Unsupported language");
        }

        state[folderId] = {
          title: folderTitle,
          createdAt: now,
          updatedAt: now,
          color: folderColor,
          description: "",
          playgrounds: {
            [playgroundId]: {
              id: languageMap[language].id,
              title: cardTitle,
              language,
              code: languageMap[language].defaultCode,
              theme: "tokyoNight",
              createdAt: now,
              updatedAt: now,
              isFavorite: false,
              lastRun: null,
              description: "",
              tags: [],
              executionCount: 0,
              averageExecutionTime: 0,
            },
          },
        };

        if (!saveToLocalStorage(state)) {
          throw new Error("Failed to save folder and playground to storage");
        }
      } catch (error) {
        console.error("Error adding playground and folder:", error);
      }
    },

    editTitles(state, action) {
      try {
        const { type, title, folderId, playgroundId } = action.payload;
        const now = Date.now();

        if (type === "editFolder") {
          if (!state[folderId]) {
            throw new Error("Folder not found");
          }
          state[folderId].title = title;
          state[folderId].updatedAt = now;
        } else if (type === "editCard") {
          if (!state[folderId] || !state[folderId].playgrounds[playgroundId]) {
            throw new Error("Playground not found");
          }
          state[folderId].playgrounds[playgroundId].title = title;
          state[folderId].playgrounds[playgroundId].updatedAt = now;
          state[folderId].updatedAt = now;
        }

        if (!saveToLocalStorage(state)) {
          throw new Error("Failed to save title changes to storage");
        }
      } catch (error) {
        console.error("Error editing titles:", error);
      }
    },
    updateTheme(state, action) {
      try {
        const { theme, folderId, playgroundId } = action.payload;

        if (!state[folderId] || !state[folderId].playgrounds[playgroundId]) {
          throw new Error("Playground not found");
        }

        state[folderId].playgrounds[playgroundId].theme = theme;
        state[folderId].playgrounds[playgroundId].updatedAt = Date.now();
        state[folderId].updatedAt = Date.now();

        if (!saveToLocalStorage(state)) {
          throw new Error("Failed to save theme changes to storage");
        }
      } catch (error) {
        console.error("Error updating theme:", error);
      }
    },

    updateCode(state, action) {
      try {
        const { code, folderId, playgroundId } = action.payload;

        if (!state[folderId] || !state[folderId].playgrounds[playgroundId]) {
          throw new Error("Playground not found");
        }

        state[folderId].playgrounds[playgroundId].code = code;
        state[folderId].playgrounds[playgroundId].updatedAt = Date.now();
        state[folderId].updatedAt = Date.now();

        if (!saveToLocalStorage(state)) {
          throw new Error("Failed to save code changes to storage");
        }
      } catch (error) {
        console.error("Error updating code:", error);
      }
    },

    deleteItems(state, action) {
      try {
        const { type, folderId, playgroundId } = action.payload;

        if (type === "deleteFolder") {
          if (!state[folderId]) {
            throw new Error("Folder not found");
          }
          delete state[folderId];
        } else if (type === "deleteCard") {
          if (!state[folderId] || !state[folderId].playgrounds[playgroundId]) {
            throw new Error("Playground not found");
          }
          delete state[folderId].playgrounds[playgroundId];
          state[folderId].updatedAt = Date.now();
        }

        if (!saveToLocalStorage(state)) {
          throw new Error("Failed to save deletion to storage");
        }
      } catch (error) {
        console.error("Error deleting items:", error);
      }
    },

    toggleFavorite(state, action) {
      try {
        const { folderId, playgroundId } = action.payload;
        const playground = state[folderId]?.playgrounds[playgroundId];

        if (!playground) {
          throw new Error("Playground not found");
        }

        playground.isFavorite = !playground.isFavorite;
        playground.updatedAt = Date.now();
        state[folderId].updatedAt = Date.now();

        if (!saveToLocalStorage(state)) {
          throw new Error("Failed to save favorite toggle to storage");
        }
      } catch (error) {
        console.error("Error toggling favorite:", error);
      }
    },

    updateLastRun(state, action) {
      try {
        const { folderId, playgroundId, executionTime } = action.payload;
        const playground = state[folderId]?.playgrounds[playgroundId];

        if (!playground) {
          throw new Error("Playground not found");
        }

        const now = Date.now();
        playground.lastRun = now;
        playground.updatedAt = now;
        playground.executionCount = (playground.executionCount || 0) + 1;

        // Update average execution time if provided
        if (executionTime && typeof executionTime === "number") {
          const currentAvg = playground.averageExecutionTime || 0;
          const count = playground.executionCount;
          playground.averageExecutionTime =
            (currentAvg * (count - 1) + executionTime) / count;
        }

        state[folderId].updatedAt = now;

        if (!saveToLocalStorage(state)) {
          throw new Error("Failed to save execution data to storage");
        }
      } catch (error) {
        console.error("Error updating last run:", error);
      }
    },

    // New actions for enhanced functionality
    updatePlaygroundMetadata(state, action) {
      try {
        const { folderId, playgroundId, metadata } = action.payload;
        const playground = state[folderId]?.playgrounds[playgroundId];

        if (!playground) {
          throw new Error("Playground not found");
        }

        // Update allowed metadata fields
        const allowedFields = ["description", "tags"];
        allowedFields.forEach((field) => {
          if (metadata.hasOwnProperty(field)) {
            playground[field] = metadata[field];
          }
        });

        playground.updatedAt = Date.now();
        state[folderId].updatedAt = Date.now();

        if (!saveToLocalStorage(state)) {
          throw new Error("Failed to save metadata to storage");
        }
      } catch (error) {
        console.error("Error updating playground metadata:", error);
      }
    },

    updateFolderMetadata(state, action) {
      try {
        const { folderId, metadata } = action.payload;
        const folder = state[folderId];

        if (!folder) {
          throw new Error("Folder not found");
        }

        // Update allowed metadata fields
        const allowedFields = ["description", "color"];
        allowedFields.forEach((field) => {
          if (metadata.hasOwnProperty(field)) {
            folder[field] = metadata[field];
          }
        });

        folder.updatedAt = Date.now();

        if (!saveToLocalStorage(state)) {
          throw new Error("Failed to save folder metadata to storage");
        }
      } catch (error) {
        console.error("Error updating folder metadata:", error);
      }
    },

    reorderPlaygrounds(state, action) {
      try {
        const { folderId, draggedId, targetId } = action.payload;
        const folder = state[folderId];

        if (!folder || !folder.playgrounds) {
          throw new Error("Folder or playgrounds not found");
        }

        if (draggedId === targetId) {
          return;
        }

        const playgrounds = folder.playgrounds;
        const playgroundEntries = Object.entries(playgrounds);

        const fromIndex = playgroundEntries.findIndex(
          ([id]) => id === draggedId
        );
        const toIndex = playgroundEntries.findIndex(([id]) => id === targetId);

        if (fromIndex === -1 || toIndex === -1) {
          console.error("Could not find items to reorder");
          return;
        }

        const [reorderedItem] = playgroundEntries.splice(fromIndex, 1);
        playgroundEntries.splice(toIndex, 0, reorderedItem);

        folder.playgrounds = Object.fromEntries(playgroundEntries);
        folder.updatedAt = Date.now();

        if (!saveToLocalStorage(state)) {
          throw new Error("Failed to save reordered playgrounds to storage");
        }
      } catch (error) {
        console.error("Error reordering playgrounds:", error);
      }
    },

    duplicatePlayground(state, action) {
      try {
        const { folderId, playgroundId, newTitle } = action.payload;
        const originalPlayground = state[folderId]?.playgrounds[playgroundId];

        if (!originalPlayground) {
          throw new Error("Original playground not found");
        }

        const now = Date.now();
        const newPlaygroundId = crypto.randomUUID();

        state[folderId].playgrounds[newPlaygroundId] = {
          ...originalPlayground,
          title: newTitle || `${originalPlayground.title} (Copy)`,
          createdAt: now,
          updatedAt: now,
          lastRun: null,
          executionCount: 0,
          averageExecutionTime: 0,
        };

        state[folderId].updatedAt = now;

        if (!saveToLocalStorage(state)) {
          throw new Error("Failed to save duplicated playground to storage");
        }
      } catch (error) {
        console.error("Error duplicating playground:", error);
      }
    },
  },
});
export const {
  addFolder,
  addPlayground,
  addPlaygroundAndFolder,
  editTitles,
  deleteItems,
  updateTheme,
  updateCode,
  toggleFavorite,
  updateLastRun,
  updatePlaygroundMetadata,
  updateFolderMetadata,
  reorderPlaygrounds,
  duplicatePlayground,
} = playgroundSlicer.actions;

// Enhanced selectors
export const selectCurrentPlayground = (state) => state.playground;

export const selectFolderById = (folderId) => (state) =>
  state.playground[folderId];

export const selectPlaygroundById = (folderId, playgroundId) => (state) =>
  state.playground[folderId]?.playgrounds[playgroundId];

export const selectFavoritePlaygrounds = (state) => {
  const favorites = [];
  Object.entries(state.playground).forEach(([folderId, folder]) => {
    Object.entries(folder.playgrounds || {}).forEach(
      ([playgroundId, playground]) => {
        if (playground.isFavorite) {
          favorites.push({
            ...playground,
            folderId,
            playgroundId,
            folderTitle: folder.title,
          });
        }
      }
    );
  });
  return favorites.sort((a, b) => b.updatedAt - a.updatedAt);
};

export const selectRecentPlaygrounds = (state, limit = 5) => {
  const recent = [];
  Object.entries(state.playground).forEach(([folderId, folder]) => {
    Object.entries(folder.playgrounds || {}).forEach(
      ([playgroundId, playground]) => {
        recent.push({
          ...playground,
          folderId,
          playgroundId,
          folderTitle: folder.title,
        });
      }
    );
  });
  return recent.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, limit);
};

export const selectPlaygroundsByLanguage = (language) => (state) => {
  const playgrounds = [];
  Object.entries(state.playground).forEach(([folderId, folder]) => {
    Object.entries(folder.playgrounds || {}).forEach(
      ([playgroundId, playground]) => {
        if (playground.language === language) {
          playgrounds.push({
            ...playground,
            folderId,
            playgroundId,
            folderTitle: folder.title,
          });
        }
      }
    );
  });
  return playgrounds.sort((a, b) => b.updatedAt - a.updatedAt);
};

export const selectPlaygroundStats = (state) => {
  let totalPlaygrounds = 0;
  let totalFolders = 0;
  let favoriteCount = 0;
  let languageStats = {};

  Object.entries(state.playground).forEach(([folderId, folder]) => {
    totalFolders++;
    Object.entries(folder.playgrounds || {}).forEach(
      ([playgroundId, playground]) => {
        totalPlaygrounds++;
        if (playground.isFavorite) favoriteCount++;

        languageStats[playground.language] =
          (languageStats[playground.language] || 0) + 1;
      }
    );
  });

  return {
    totalPlaygrounds,
    totalFolders,
    favoriteCount,
    languageStats,
  };
};

export default playgroundSlicer;
