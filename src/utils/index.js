// Storage and data management utilities
export { default as storageManager } from "./storageManager";
export { default as dataMigration } from "./dataMigration";
export { default as backupRestore } from "./backupRestore";
export { default as storageInit } from "./storageInit";

// Performance optimization utilities
export * from "./performance.jsx";

// Re-export commonly used functions
export const safeGetItem = storageManager.safeGetItem.bind(storageManager);
export const safeSetItem = storageManager.safeSetItem.bind(storageManager);
export const createBackup = storageManager.createBackup.bind(storageManager);
export const getBackups = storageManager.getBackups.bind(storageManager);
export const restoreFromBackup =
  storageManager.restoreFromBackup.bind(storageManager);
export const getStorageInfo =
  storageManager.getStorageInfo.bind(storageManager);

// Backup & Restore
export const downloadBackup = backupRestore.downloadBackup.bind(backupRestore);
export const uploadBackup = backupRestore.uploadBackup.bind(backupRestore);

// Migration
export const runMigrations = dataMigration.runMigrations.bind(dataMigration);
export const validateDataIntegrity =
  dataMigration.validateDataIntegrity.bind(dataMigration);

// Initialization
export const initializeStorage = storageInit.initialize.bind(storageInit);
export const getStorageStatus = storageInit.getStatus.bind(storageInit);

// Utility functions for common operations
export const createInitialData = () => {
  return dataMigration.createInitialPlaygroundState();
};

export const createInitialUIPrefs = () => {
  return dataMigration.createInitialUIPreferences();
};

// Storage event helpers
export const setupStorageListeners = (callbacks = {}) => {
  const {
    onStorageChange,
    onQuotaExceeded,
    onAutoBackup,
    onFallbackMode,
    onNotification,
  } = callbacks;

  if (onStorageChange) {
    window.addEventListener("storage-changed", onStorageChange);
  }

  if (onQuotaExceeded) {
    window.addEventListener("storage-quota-exceeded", onQuotaExceeded);
  }

  if (onAutoBackup) {
    window.addEventListener("auto-backup-created", onAutoBackup);
  }

  if (onFallbackMode) {
    window.addEventListener("fallback-mode-enabled", onFallbackMode);
  }

  if (onNotification) {
    window.addEventListener("show-notification", onNotification);
  }

  // Return cleanup function
  return () => {
    if (onStorageChange) {
      window.removeEventListener("storage-changed", onStorageChange);
    }
    if (onQuotaExceeded) {
      window.removeEventListener("storage-quota-exceeded", onQuotaExceeded);
    }
    if (onAutoBackup) {
      window.removeEventListener("auto-backup-created", onAutoBackup);
    }
    if (onFallbackMode) {
      window.removeEventListener("fallback-mode-enabled", onFallbackMode);
    }
    if (onNotification) {
      window.removeEventListener("show-notification", onNotification);
    }
  };
};
