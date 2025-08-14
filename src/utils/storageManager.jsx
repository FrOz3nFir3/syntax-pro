// Storage Manager with versioning and migration support
class StorageManager {
  constructor() {
    this.STORAGE_VERSION = "1.0.0";
    this.PLAYGROUND_KEY = "playground";
    this.UI_PREFERENCES_KEY = "syntaxpro-ui-preferences";
    this.VERSION_KEY = "syntaxpro-version";
    this.BACKUP_KEY = "syntaxpro-backup";
    this.MIGRATION_LOG_KEY = "syntaxpro-migration-log";
  }

  // Get current storage version
  getCurrentVersion() {
    try {
      return localStorage.getItem(this.VERSION_KEY) || "0.0.0";
    } catch (error) {
      console.error("Failed to get storage version:", error);
      return "0.0.0";
    }
  }

  // Set storage version
  setVersion(version) {
    try {
      localStorage.setItem(this.VERSION_KEY, version);
      return true;
    } catch (error) {
      console.error("Failed to set storage version:", error);
      return false;
    }
  }

  // Check if migration is needed
  needsMigration() {
    const currentVersion = this.getCurrentVersion();
    return this.compareVersions(currentVersion, this.STORAGE_VERSION) < 0;
  }

  // Compare version strings (returns -1, 0, or 1)
  compareVersions(version1, version2) {
    const v1Parts = version1.split(".").map(Number);
    const v2Parts = version2.split(".").map(Number);

    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const v1Part = v1Parts[i] || 0;
      const v2Part = v2Parts[i] || 0;

      if (v1Part < v2Part) return -1;
      if (v1Part > v2Part) return 1;
    }

    return 0;
  }

  // Safe localStorage operations
  safeGetItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Failed to get item ${key} from localStorage:`, error);
      return defaultValue;
    }
  }

  safeSetItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Failed to set item ${key} in localStorage:`, error);

      // Handle quota exceeded error
      if (error.name === "QuotaExceededError") {
        this.handleQuotaExceeded();
      }

      return false;
    }
  }

  safeRemoveItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Failed to remove item ${key} from localStorage:`, error);
      return false;
    }
  }

  // Handle storage quota exceeded
  handleQuotaExceeded() {
    console.warn("localStorage quota exceeded. Attempting cleanup...");

    // Try to free up space by removing old backups
    this.cleanupOldBackups();

    // Clear migration logs if they exist
    this.safeRemoveItem(this.MIGRATION_LOG_KEY);

    // Notify user about storage issues
    if (window.dispatchEvent) {
      window.dispatchEvent(
        new CustomEvent("storage-quota-exceeded", {
          detail: {
            message:
              "Storage space is running low. Some data may not be saved.",
          },
        })
      );
    }
  }

  // Create backup of current data
  createBackup(label = null) {
    try {
      const timestamp = Date.now();
      const backupData = {
        version: this.getCurrentVersion(),
        timestamp,
        label: label || `Backup ${new Date(timestamp).toLocaleString()}`,
        data: {
          playground: this.safeGetItem(this.PLAYGROUND_KEY),
          uiPreferences: this.safeGetItem(this.UI_PREFERENCES_KEY),
        },
      };

      const existingBackups = this.safeGetItem(this.BACKUP_KEY, []);
      existingBackups.push(backupData);

      // Keep only the last 5 backups to save space
      const recentBackups = existingBackups
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 5);

      if (this.safeSetItem(this.BACKUP_KEY, recentBackups)) {
        console.log("Backup created successfully:", backupData.label);
        return backupData;
      } else {
        throw new Error("Failed to save backup");
      }
    } catch (error) {
      console.error("Failed to create backup:", error);
      return null;
    }
  }

  // Get all available backups
  getBackups() {
    return this.safeGetItem(this.BACKUP_KEY, []).sort(
      (a, b) => b.timestamp - a.timestamp
    );
  }

  // Restore from backup
  restoreFromBackup(backupId) {
    try {
      const backups = this.getBackups();
      const backup = backups.find((b) => b.timestamp === backupId);

      if (!backup) {
        throw new Error("Backup not found");
      }

      // Create a backup of current state before restoring
      this.createBackup("Pre-restore backup");

      // Restore data
      if (backup.data.playground) {
        this.safeSetItem(this.PLAYGROUND_KEY, backup.data.playground);
      }

      if (backup.data.uiPreferences) {
        this.safeSetItem(this.UI_PREFERENCES_KEY, backup.data.uiPreferences);
      }

      // Update version
      this.setVersion(backup.version);

      console.log("Data restored from backup:", backup.label);
      return true;
    } catch (error) {
      console.error("Failed to restore from backup:", error);
      return false;
    }
  }

  // Delete a specific backup
  deleteBackup(backupId) {
    try {
      const backups = this.getBackups();
      const filteredBackups = backups.filter((b) => b.timestamp !== backupId);

      return this.safeSetItem(this.BACKUP_KEY, filteredBackups);
    } catch (error) {
      console.error("Failed to delete backup:", error);
      return false;
    }
  }

  // Clean up old backups (keep only 3 most recent)
  cleanupOldBackups() {
    try {
      const backups = this.getBackups();
      const recentBackups = backups.slice(0, 3);

      return this.safeSetItem(this.BACKUP_KEY, recentBackups);
    } catch (error) {
      console.error("Failed to cleanup old backups:", error);
      return false;
    }
  }

  // Export data for external backup
  exportData() {
    try {
      const exportData = {
        version: this.STORAGE_VERSION,
        exportDate: new Date().toISOString(),
        data: {
          playground: this.safeGetItem(this.PLAYGROUND_KEY),
          uiPreferences: this.safeGetItem(this.UI_PREFERENCES_KEY),
        },
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error("Failed to export data:", error);
      return null;
    }
  }

  // Import data from external backup
  importData(jsonString) {
    try {
      const importData = JSON.parse(jsonString);

      // Validate import data structure
      if (!importData.data || typeof importData.data !== "object") {
        throw new Error("Invalid import data format");
      }

      // Create backup before importing
      this.createBackup("Pre-import backup");

      // Import playground data
      if (importData.data.playground) {
        this.safeSetItem(this.PLAYGROUND_KEY, importData.data.playground);
      }

      // Import UI preferences
      if (importData.data.uiPreferences) {
        this.safeSetItem(
          this.UI_PREFERENCES_KEY,
          importData.data.uiPreferences
        );
      }

      // Update version
      this.setVersion(importData.version || this.STORAGE_VERSION);

      console.log("Data imported successfully");
      return true;
    } catch (error) {
      console.error("Failed to import data:", error);
      return false;
    }
  }

  // Get storage usage information
  getStorageInfo() {
    try {
      let totalSize = 0;
      let itemCount = 0;
      const items = {};

      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          const value = localStorage.getItem(key);
          const size = new Blob([value]).size;

          items[key] = {
            size,
            sizeFormatted: this.formatBytes(size),
          };

          totalSize += size;
          itemCount++;
        }
      }

      return {
        totalSize,
        totalSizeFormatted: this.formatBytes(totalSize),
        itemCount,
        items,
        quotaEstimate: this.estimateQuota(),
      };
    } catch (error) {
      console.error("Failed to get storage info:", error);
      return null;
    }
  }

  // Format bytes to human readable format
  formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // Estimate localStorage quota (rough estimate)
  estimateQuota() {
    try {
      // Try to estimate by attempting to store data
      const testKey = "quota-test";
      let estimate = 0;

      // This is a rough estimation method
      // In practice, quota varies by browser and available disk space
      const storageInfo = this.getStorageInfo();

      // Most browsers have 5-10MB localStorage quota
      const estimatedQuota = 5 * 1024 * 1024; // 5MB
      const usagePercentage = (storageInfo.totalSize / estimatedQuota) * 100;

      return {
        estimated: true,
        quota: estimatedQuota,
        quotaFormatted: this.formatBytes(estimatedQuota),
        used: storageInfo.totalSize,
        usedFormatted: storageInfo.totalSizeFormatted,
        usagePercentage: Math.min(usagePercentage, 100),
      };
    } catch (error) {
      console.error("Failed to estimate quota:", error);
      return null;
    }
  }

  // Clear all application data
  clearAllData() {
    try {
      // Create final backup before clearing
      this.createBackup("Pre-clear backup");

      // Remove all app-related keys
      const keysToRemove = [
        this.PLAYGROUND_KEY,
        this.UI_PREFERENCES_KEY,
        this.VERSION_KEY,
        this.MIGRATION_LOG_KEY,
      ];

      keysToRemove.forEach((key) => {
        this.safeRemoveItem(key);
      });

      console.log("All application data cleared");
      return true;
    } catch (error) {
      console.error("Failed to clear all data:", error);
      return false;
    }
  }

  // Log migration activity
  logMigration(fromVersion, toVersion, details) {
    try {
      const migrationLog = this.safeGetItem(this.MIGRATION_LOG_KEY, []);

      migrationLog.push({
        timestamp: Date.now(),
        fromVersion,
        toVersion,
        details,
        success: true,
      });

      // Keep only last 10 migration logs
      const recentLogs = migrationLog.slice(-10);

      this.safeSetItem(this.MIGRATION_LOG_KEY, recentLogs);
    } catch (error) {
      console.error("Failed to log migration:", error);
    }
  }

  // Get migration history
  getMigrationHistory() {
    return this.safeGetItem(this.MIGRATION_LOG_KEY, []).sort(
      (a, b) => b.timestamp - a.timestamp
    );
  }
}

// Create singleton instance
const storageManager = new StorageManager();

export default storageManager;
