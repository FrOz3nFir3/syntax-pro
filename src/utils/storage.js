// Storage Utilities
// This file contains utilities for managing localStorage and data persistence

const STORAGE_PREFIX = "syntax-pro-";
const STORAGE_VERSION = "1.0";

/**
 * Storage utility class for managing localStorage with versioning and error handling
 */
class StorageManager {
  constructor(prefix = STORAGE_PREFIX) {
    this.prefix = prefix;
    this.version = STORAGE_VERSION;
  }

  /**
   * Generate storage key with prefix
   * @param {string} key - Base key
   * @returns {string} Prefixed key
   */
  getKey(key) {
    return `${this.prefix}${key}`;
  }

  /**
   * Set item in localStorage with error handling
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   * @param {boolean} withVersion - Include version info
   * @returns {boolean} Success status
   */
  setItem(key, value, withVersion = true) {
    try {
      const storageKey = this.getKey(key);
      const dataToStore = withVersion
        ? { version: this.version, data: value, timestamp: Date.now() }
        : value;

      localStorage.setItem(storageKey, JSON.stringify(dataToStore));
      return true;
    } catch (error) {
      console.error("Storage setItem error:", error);
      return false;
    }
  }

  /**
   * Get item from localStorage with error handling
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default value if not found
   * @param {boolean} withVersion - Expect version info
   * @returns {any} Retrieved value or default
   */
  getItem(key, defaultValue = null, withVersion = true) {
    try {
      const storageKey = this.getKey(key);
      const item = localStorage.getItem(storageKey);

      if (!item) return defaultValue;

      const parsedItem = JSON.parse(item);

      if (withVersion) {
        // Check version compatibility
        if (!parsedItem.version || parsedItem.version !== this.version) {
          console.warn(`Storage version mismatch for key: ${key}`);
          return defaultValue;
        }
        return parsedItem.data;
      }

      return parsedItem;
    } catch (error) {
      console.error("Storage getItem error:", error);
      return defaultValue;
    }
  }

  /**
   * Remove item from localStorage
   * @param {string} key - Storage key
   * @returns {boolean} Success status
   */
  removeItem(key) {
    try {
      const storageKey = this.getKey(key);
      localStorage.removeItem(storageKey);
      return true;
    } catch (error) {
      console.error("Storage removeItem error:", error);
      return false;
    }
  }

  /**
   * Clear all items with the current prefix
   * @returns {boolean} Success status
   */
  clear() {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach((key) => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error("Storage clear error:", error);
      return false;
    }
  }

  /**
   * Get all keys with the current prefix
   * @returns {Array<string>} Array of keys
   */
  getAllKeys() {
    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keys.push(key.replace(this.prefix, ""));
        }
      }
      return keys;
    } catch (error) {
      console.error("Storage getAllKeys error:", error);
      return [];
    }
  }

  /**
   * Check if localStorage is available
   * @returns {boolean} Availability status
   */
  isAvailable() {
    try {
      const testKey = "__storage_test__";
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get storage usage information
   * @returns {object} Storage usage stats
   */
  getStorageInfo() {
    try {
      let totalSize = 0;
      let itemCount = 0;

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          const value = localStorage.getItem(key);
          totalSize += key.length + (value ? value.length : 0);
          itemCount++;
        }
      }

      return {
        itemCount,
        totalSize,
        totalSizeFormatted: this.formatBytes(totalSize),
        available: this.isAvailable(),
      };
    } catch (error) {
      console.error("Storage getStorageInfo error:", error);
      return {
        itemCount: 0,
        totalSize: 0,
        totalSizeFormatted: "0 B",
        available: false,
      };
    }
  }

  /**
   * Format bytes to human readable format
   * @param {number} bytes - Bytes to format
   * @returns {string} Formatted string
   */
  formatBytes(bytes) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  /**
   * Export all data as JSON
   * @returns {string} JSON string of all data
   */
  exportData() {
    try {
      const data = {};
      const keys = this.getAllKeys();

      keys.forEach((key) => {
        data[key] = this.getItem(key, null, true);
      });

      return JSON.stringify(
        {
          version: this.version,
          exportDate: new Date().toISOString(),
          data,
        },
        null,
        2
      );
    } catch (error) {
      console.error("Storage exportData error:", error);
      return null;
    }
  }

  /**
   * Import data from JSON string
   * @param {string} jsonString - JSON string to import
   * @param {boolean} overwrite - Whether to overwrite existing data
   * @returns {boolean} Success status
   */
  importData(jsonString, overwrite = false) {
    try {
      const importData = JSON.parse(jsonString);

      if (!importData.data || !importData.version) {
        throw new Error("Invalid import data format");
      }

      // Version compatibility check
      if (importData.version !== this.version) {
        console.warn("Import data version mismatch");
      }

      Object.entries(importData.data).forEach(([key, value]) => {
        if (overwrite || !this.getItem(key)) {
          this.setItem(key, value, true);
        }
      });

      return true;
    } catch (error) {
      console.error("Storage importData error:", error);
      return false;
    }
  }
}

// Create default storage manager instance
const storage = new StorageManager();

// Specific storage utilities for the application
export const playgroundStorage = {
  /**
   * Save playground data
   * @param {object} playgroundData - Playground data to save
   * @returns {boolean} Success status
   */
  savePlaygrounds(playgroundData) {
    return storage.setItem("playgrounds", playgroundData);
  },

  /**
   * Load playground data
   * @returns {object} Playground data or empty object
   */
  loadPlaygrounds() {
    return storage.getItem("playgrounds", { folders: {} });
  },

  /**
   * Save user preferences
   * @param {object} preferences - User preferences
   * @returns {boolean} Success status
   */
  savePreferences(preferences) {
    return storage.setItem("preferences", preferences);
  },

  /**
   * Load user preferences
   * @returns {object} User preferences or defaults
   */
  loadPreferences() {
    return storage.getItem("preferences", {
      theme: "light",
      fontSize: 14,
      tabSize: 2,
      wordWrap: true,
      editorLayout: "horizontal",
    });
  },

  /**
   * Save editor state
   * @param {string} playgroundId - Playground ID
   * @param {object} editorState - Editor state
   * @returns {boolean} Success status
   */
  saveEditorState(playgroundId, editorState) {
    return storage.setItem(`editor-state-${playgroundId}`, editorState);
  },

  /**
   * Load editor state
   * @param {string} playgroundId - Playground ID
   * @returns {object} Editor state or defaults
   */
  loadEditorState(playgroundId) {
    return storage.getItem(`editor-state-${playgroundId}`, {
      cursorPosition: 0,
      scrollPosition: 0,
      selectedText: null,
    });
  },

  /**
   * Clear all playground data
   * @returns {boolean} Success status
   */
  clearAll() {
    return storage.clear();
  },
};

export { StorageManager, storage };
export default storage;
