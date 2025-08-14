import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addFolder as addFolderSync,
  addPlayground as addPlaygroundSync,
  addPlaygroundAndFolder as addPlaygroundAndFolderSync,
  deleteItems as deleteItemsSync,
  duplicatePlayground as duplicatePlaygroundSync,
  updateLastRun,
} from "./playgroundSlice";
import {
  setLoading,
  handleAsyncError,
  handleAsyncSuccess,
  addNotification,
} from "./uiSlice";

// Async thunk for adding a folder with proper error handling
export const addFolderAsync = createAsyncThunk(
  "playground/addFolderAsync",
  async (folderData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));

      // Validate folder data
      if (!folderData.title || folderData.title.trim() === "") {
        throw new Error("Folder title is required");
      }

      // Dispatch the synchronous action
      dispatch(addFolderSync(folderData));

      dispatch(
        handleAsyncSuccess({
          message: `Folder "${folderData.title}" created successfully`,
        })
      );

      return folderData;
    } catch (error) {
      dispatch(handleAsyncError({ message: error.message }));
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for adding a playground with proper error handling
export const addPlaygroundAsync = createAsyncThunk(
  "playground/addPlaygroundAsync",
  async (playgroundData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));

      // Validate playground data
      if (!playgroundData.title || playgroundData.title.trim() === "") {
        throw new Error("Playground title is required");
      }

      if (!playgroundData.language) {
        throw new Error("Programming language is required");
      }

      if (!playgroundData.folderId) {
        throw new Error("Folder ID is required");
      }

      // Dispatch the synchronous action
      dispatch(addPlaygroundSync(playgroundData));

      dispatch(
        handleAsyncSuccess({
          message: `Playground "${playgroundData.title}" created successfully`,
        })
      );

      return playgroundData;
    } catch (error) {
      dispatch(handleAsyncError({ message: error.message }));
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for adding both folder and playground
export const addPlaygroundAndFolderAsync = createAsyncThunk(
  "playground/addPlaygroundAndFolderAsync",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));

      // Validate data
      if (!data.folderTitle || data.folderTitle.trim() === "") {
        throw new Error("Folder title is required");
      }

      if (!data.cardTitle || data.cardTitle.trim() === "") {
        throw new Error("Playground title is required");
      }

      if (!data.language) {
        throw new Error("Programming language is required");
      }

      // Dispatch the synchronous action
      dispatch(addPlaygroundAndFolderSync(data));

      dispatch(
        handleAsyncSuccess({
          message: `Folder "${data.folderTitle}" and playground "${data.cardTitle}" created successfully`,
        })
      );

      return data;
    } catch (error) {
      dispatch(handleAsyncError({ message: error.message }));
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for deleting items with confirmation
export const deleteItemAsync = createAsyncThunk(
  "playground/deleteItemAsync",
  async (deleteData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));

      const { type, folderId, playgroundId, itemName } = deleteData;

      // Validate delete data
      if (!type || !folderId) {
        throw new Error("Invalid delete parameters");
      }

      if (type === "deleteCard" && !playgroundId) {
        throw new Error("Playground ID is required for deleting playground");
      }

      // Dispatch the synchronous action
      dispatch(deleteItemsSync({ type, folderId, playgroundId }));

      const itemType = type === "deleteFolder" ? "Folder" : "Playground";
      const name =
        itemName || (type === "deleteFolder" ? "folder" : "playground");

      dispatch(
        handleAsyncSuccess({
          message: `${itemType} "${name}" deleted successfully`,
        })
      );

      return deleteData;
    } catch (error) {
      dispatch(handleAsyncError({ message: error.message }));
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for duplicating playground
export const duplicatePlaygroundAsync = createAsyncThunk(
  "playground/duplicatePlaygroundAsync",
  async (duplicateData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));

      const { folderId, playgroundId, newTitle } = duplicateData;

      // Validate duplicate data
      if (!folderId || !playgroundId) {
        throw new Error("Folder ID and Playground ID are required");
      }

      // Dispatch the synchronous action
      dispatch(duplicatePlaygroundSync(duplicateData));

      dispatch(
        handleAsyncSuccess({
          message: `Playground duplicated as "${
            newTitle || "Copy"
          }" successfully`,
        })
      );

      return duplicateData;
    } catch (error) {
      dispatch(handleAsyncError({ message: error.message }));
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for code execution simulation
export const executeCodeAsync = createAsyncThunk(
  "playground/executeCodeAsync",
  async (executionData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));

      const { folderId, playgroundId, code, language } = executionData;

      // Validate execution data
      if (!folderId || !playgroundId || !code || !language) {
        throw new Error("Missing required execution parameters");
      }

      // Simulate code execution (in real app, this would call an API)
      const startTime = Date.now();

      // Add a small delay to simulate execution
      await new Promise((resolve) => setTimeout(resolve, 500));

      const executionTime = Date.now() - startTime;

      // Update last run with execution time
      dispatch(updateLastRun({ folderId, playgroundId, executionTime }));

      dispatch(
        handleAsyncSuccess({
          message: "Code executed successfully",
        })
      );

      return { executionTime, timestamp: Date.now() };
    } catch (error) {
      dispatch(handleAsyncError({ message: error.message }));
      return rejectWithValue(error.message);
    }
  }
);

// Utility function to show notification
export const showNotification = (notification) => (dispatch) => {
  dispatch(
    addNotification({
      type: notification.type || "info",
      title: notification.title || "Notification",
      message: notification.message,
      autoClose: notification.autoClose !== false,
    })
  );
};

// Utility function to handle localStorage errors
export const handleStorageError = (error) => (dispatch) => {
  console.error("Storage error:", error);

  dispatch(
    addNotification({
      type: "error",
      title: "Storage Error",
      message: "Failed to save data. Your changes may not be preserved.",
      autoClose: false,
    })
  );
};
