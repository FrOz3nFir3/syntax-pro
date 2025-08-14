import storageManager from "./storageManager";
import dataMigration from "./dataMigration";

// Backup and Restore utilities
class BackupRestore {
  constructor() {
    this.fileInputRef = null;
  }

  // Create and download backup file
  async downloadBackup(filename = null) {
    try {
      const exportData = storageManager.exportData();

      if (!exportData) {
        throw new Error("Failed to export data");
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const defaultFilename = `syntaxpro-backup-${timestamp}.json`;
      const finalFilename = filename || defaultFilename;

      // Create blob and download
      const blob = new Blob([exportData], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = finalFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      URL.revokeObjectURL(url);

      console.log("Backup downloaded successfully:", finalFilename);
      return { success: true, filename: finalFilename };
    } catch (error) {
      console.error("Failed to download backup:", error);
      return { success: false, error: error.message };
    }
  }

  // Upload and restore from backup file
  async uploadBackup() {
    return new Promise((resolve) => {
      try {
        // Create file input if it doesn't exist
        if (!this.fileInputRef) {
          this.fileInputRef = document.createElement("input");
          this.fileInputRef.type = "file";
          this.fileInputRef.accept = ".json";
          this.fileInputRef.style.display = "none";
          document.body.appendChild(this.fileInputRef);
        }

        this.fileInputRef.onchange = async (event) => {
          try {
            const file = event.target.files[0];

            if (!file) {
              resolve({ success: false, error: "No file selected" });
              return;
            }

            if (!file.name.endsWith(".json")) {
              resolve({
                success: false,
                error: "Invalid file type. Please select a JSON file.",
              });
              return;
            }

            const reader = new FileReader();

            reader.onload = async (e) => {
              try {
                const jsonString = e.target.result;
                const result = await this.restoreFromJson(jsonString);
                resolve(result);
              } catch (error) {
                resolve({
                  success: false,
                  error: `Failed to read file: ${error.message}`,
                });
              }
            };

            reader.onerror = () => {
              resolve({ success: false, error: "Failed to read file" });
            };

            reader.readAsText(file);
          } catch (error) {
            resolve({ success: false, error: error.message });
          }
        };

        // Trigger file selection
        this.fileInputRef.click();
      } catch (error) {
        resolve({ success: false, error: error.message });
      }
    });
  }

  // Restore from JSON string
  async restoreFromJson(jsonString) {
    try {
      // Validate JSON
      let importData;
      try {
        importData = JSON.parse(jsonString);
      } catch (error) {
        throw new Error("Invalid JSON format");
      }

      // Validate backup structure
      if (!this.validateBackupStructure(importData)) {
        throw new Error("Invalid backup file structure");
      }

      // Check if migration is needed
      const currentVersion = storageManager.STORAGE_VERSION;
      const backupVersion = importData.version || "0.0.0";

      if (storageManager.compareVersions(backupVersion, currentVersion) > 0) {
        throw new Error(
          "Backup is from a newer version and cannot be restored"
        );
      }

      // Import the data
      const importResult = storageManager.importData(jsonString);

      if (!importResult) {
        throw new Error("Failed to import backup data");
      }

      // Run migrations if needed
      if (storageManager.compareVersions(backupVersion, currentVersion) < 0) {
        console.log("Running migrations after restore...");
        const migrationResult = await dataMigration.runMigrations();

        if (!migrationResult.success) {
          console.warn(
            "Migration after restore failed:",
            migrationResult.error
          );
          // Don't fail the restore, but log the issue
        }
      }

      // Validate data integrity
      const validation = dataMigration.validateDataIntegrity();
      if (!validation.valid) {
        console.warn(
          "Data integrity issues found after restore:",
          validation.issues
        );
      }

      console.log("Backup restored successfully");
      return {
        success: true,
        message: "Backup restored successfully",
        migrationRun:
          storageManager.compareVersions(backupVersion, currentVersion) < 0,
      };
    } catch (error) {
      console.error("Failed to restore backup:", error);
      return { success: false, error: error.message };
    }
  }

  // Validate backup file structure
  validateBackupStructure(importData) {
    try {
      // Check required fields
      if (!importData.data || typeof importData.data !== "object") {
        return false;
      }

      // Check if it has either playground or uiPreferences data
      const hasPlaygroundData =
        importData.data.playground &&
        typeof importData.data.playground === "object";

      const hasUIPreferences =
        importData.data.uiPreferences &&
        typeof importData.data.uiPreferences === "object";

      return hasPlaygroundData || hasUIPreferences;
    } catch (error) {
      console.error("Error validating backup structure:", error);
      return false;
    }
  }

  // Get backup file info without importing
  async getBackupInfo(file) {
    return new Promise((resolve) => {
      try {
        const reader = new FileReader();

        reader.onload = (e) => {
          try {
            const jsonString = e.target.result;
            const data = JSON.parse(jsonString);

            const info = {
              valid: this.validateBackupStructure(data),
              version: data.version || "Unknown",
              exportDate: data.exportDate || "Unknown",
              size: new Blob([jsonString]).size,
              sizeFormatted: storageManager.formatBytes(
                new Blob([jsonString]).size
              ),
              hasPlaygroundData: !!(data.data && data.data.playground),
              hasUIPreferences: !!(data.data && data.data.uiPreferences),
            };

            // Count items if playground data exists
            if (info.hasPlaygroundData) {
              const playground = data.data.playground;
              let folderCount = 0;
              let playgroundCount = 0;

              Object.values(playground).forEach((folder) => {
                folderCount++;
                if (folder.playgrounds) {
                  playgroundCount += Object.keys(folder.playgrounds).length;
                }
              });

              info.folderCount = folderCount;
              info.playgroundCount = playgroundCount;
            }

            resolve(info);
          } catch (error) {
            resolve({
              valid: false,
              error: `Invalid JSON: ${error.message}`,
            });
          }
        };

        reader.onerror = () => {
          resolve({
            valid: false,
            error: "Failed to read file",
          });
        };

        reader.readAsText(file);
      } catch (error) {
        resolve({
          valid: false,
          error: error.message,
        });
      }
    });
  }

  // Auto-backup functionality
  setupAutoBackup(intervalHours = 24) {
    // Clear existing interval
    if (this.autoBackupInterval) {
      clearInterval(this.autoBackupInterval);
    }

    // Set up new interval
    this.autoBackupInterval = setInterval(() => {
      this.createAutoBackup();
    }, intervalHours * 60 * 60 * 1000);

    console.log(`Auto-backup scheduled every ${intervalHours} hours`);
  }

  // Create automatic backup
  createAutoBackup() {
    try {
      const backup = storageManager.createBackup("Auto-backup");

      if (backup) {
        console.log("Auto-backup created successfully");

        // Dispatch custom event for UI notification
        if (window.dispatchEvent) {
          window.dispatchEvent(
            new CustomEvent("auto-backup-created", {
              detail: { backup },
            })
          );
        }
      }
    } catch (error) {
      console.error("Auto-backup failed:", error);
    }
  }

  // Stop auto-backup
  stopAutoBackup() {
    if (this.autoBackupInterval) {
      clearInterval(this.autoBackupInterval);
      this.autoBackupInterval = null;
      console.log("Auto-backup stopped");
    }
  }

  // Clean up resources
  cleanup() {
    this.stopAutoBackup();

    if (this.fileInputRef && this.fileInputRef.parentNode) {
      this.fileInputRef.parentNode.removeChild(this.fileInputRef);
      this.fileInputRef = null;
    }
  }

  // Get backup statistics
  getBackupStats() {
    const backups = storageManager.getBackups();
    const storageInfo = storageManager.getStorageInfo();

    return {
      totalBackups: backups.length,
      oldestBackup:
        backups.length > 0
          ? new Date(Math.min(...backups.map((b) => b.timestamp)))
          : null,
      newestBackup:
        backups.length > 0
          ? new Date(Math.max(...backups.map((b) => b.timestamp)))
          : null,
      totalBackupSize: backups.reduce((total, backup) => {
        const backupSize = new Blob([JSON.stringify(backup)]).size;
        return total + backupSize;
      }, 0),
      storageInfo,
      autoBackupEnabled: !!this.autoBackupInterval,
    };
  }
}

// Create singleton instance
const backupRestore = new BackupRestore();

export default backupRestore;
