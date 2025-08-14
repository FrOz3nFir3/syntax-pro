import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "dark", // 'light' | 'dark'
  sidebarCollapsed: false,
  editorLayout: "horizontal", // 'horizontal' | 'vertical'
  preferences: {
    fontSize: 14,
    tabSize: 2,
    wordWrap: true,
    autoSave: true,
    showLineNumbers: true,
    showMinimap: false,
  },
  notifications: [],
  loading: false,
  error: null,
  modals: {
    createFolder: false,
    createPlayground: false,
    editTitle: false,
    deleteConfirm: false,
  },
  search: {
    query: "",
    filters: {
      language: "all",
      favorites: false,
    },
  },
};

// Load UI preferences from localStorage
const loadUIPreferences = () => {
  try {
    const savedPreferences = localStorage.getItem("syntaxpro-ui-preferences");
    if (savedPreferences) {
      const parsed = JSON.parse(savedPreferences);
      return {
        ...initialState,
        ...parsed,
        // Ensure notifications and error are reset on load
        notifications: [],
        error: null,
        loading: false,
      };
    }
  } catch (error) {
    console.warn("Failed to load UI preferences from localStorage:", error);
  }
  return initialState;
};

// Save UI preferences to localStorage
const saveUIPreferences = (state) => {
  try {
    const preferencesToSave = {
      theme: state.theme,
      sidebarCollapsed: state.sidebarCollapsed,
      editorLayout: state.editorLayout,
      preferences: state.preferences,
      search: state.search,
    };
    localStorage.setItem(
      "syntaxpro-ui-preferences",
      JSON.stringify(preferencesToSave)
    );
  } catch (error) {
    console.warn("Failed to save UI preferences to localStorage:", error);
  }
};

const uiSlice = createSlice({
  name: "ui",
  initialState: loadUIPreferences(),
  reducers: {
    // Theme management
    setTheme: (state, action) => {
      state.theme = action.payload;
      saveUIPreferences(state);
    },

    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      saveUIPreferences(state);
    },

    // Layout management
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
      saveUIPreferences(state);
    },

    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      saveUIPreferences(state);
    },

    setEditorLayout: (state, action) => {
      state.editorLayout = action.payload;
      saveUIPreferences(state);
    },

    // Preferences management
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
      saveUIPreferences(state);
    },

    resetPreferences: (state) => {
      state.preferences = initialState.preferences;
      saveUIPreferences(state);
    },

    // Loading and error states
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearError: (state) => {
      state.error = null;
    },

    // Notification management
    addNotification: (state, action) => {
      const notification = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        ...action.payload,
      };
      state.notifications.push(notification);
    },

    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },

    clearNotifications: (state) => {
      state.notifications = [];
    },

    // Modal management
    setModalOpen: (state, action) => {
      const { modalName, isOpen } = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = isOpen;
      }
    },

    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((modalName) => {
        state.modals[modalName] = false;
      });
    },

    // Search and filter management
    setSearchQuery: (state, action) => {
      state.search.query = action.payload;
      saveUIPreferences(state);
    },

    setSearchFilters: (state, action) => {
      state.search.filters = { ...state.search.filters, ...action.payload };
      saveUIPreferences(state);
    },

    clearSearch: (state) => {
      state.search.query = "";
      state.search.filters = initialState.search.filters;
      saveUIPreferences(state);
    },

    // Bulk actions for error handling
    handleAsyncError: (state, action) => {
      state.loading = false;
      state.error = action.payload.message || "An unexpected error occurred";

      // Add error notification
      const errorNotification = {
        id: crypto.randomUUID(),
        type: "error",
        title: "Error",
        message: action.payload.message || "An unexpected error occurred",
        timestamp: Date.now(),
        autoClose: false,
      };
      state.notifications.push(errorNotification);
    },

    handleAsyncSuccess: (state, action) => {
      state.loading = false;
      state.error = null;

      // Add success notification if provided
      if (action.payload?.message) {
        const successNotification = {
          id: crypto.randomUUID(),
          type: "success",
          title: "Success",
          message: action.payload.message,
          timestamp: Date.now(),
          autoClose: true,
        };
        state.notifications.push(successNotification);
      }
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  setSidebarCollapsed,
  toggleSidebar,
  setEditorLayout,
  updatePreferences,
  resetPreferences,
  setLoading,
  setError,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setModalOpen,
  closeAllModals,
  setSearchQuery,
  setSearchFilters,
  clearSearch,
  handleAsyncError,
  handleAsyncSuccess,
} = uiSlice.actions;

// Selectors
export const selectTheme = (state) => state.ui.theme;
export const selectSidebarCollapsed = (state) => state.ui.sidebarCollapsed;
export const selectEditorLayout = (state) => state.ui.editorLayout;
export const selectPreferences = (state) => state.ui.preferences;
export const selectLoading = (state) => state.ui.loading;
export const selectError = (state) => state.ui.error;
export const selectNotifications = (state) => state.ui.notifications;
export const selectModals = (state) => state.ui.modals;
export const selectSearch = (state) => state.ui.search;

export default uiSlice;
