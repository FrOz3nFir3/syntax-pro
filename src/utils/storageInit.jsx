import storageManager from "./storageManager";
import dataMigration from "./dataMigration";
import backupRestore from "./backupRestore";

// Storage initialization utility
class StorageInit {
  constructor() {
    this.initialized = false;
    this.initPromise = null;
  }

  // Initialize storage system
  async initialize() {
    // Return existing promise if already initializing
    if (this.initPromise) {
      return this.initPromise;
    }

    // Return immediately if already initialized
    if (this.initialized) {
      return { success: true, message: "Already initialized" };
    }

    // Create initialization promise
    this.initPromise = this.performInitialization();

    try {
      const result = await this.initPromise;
      this.initialized = result.success;
      return result;
    } finally {
      this.initPromise = null;
    }
  }

  // Perform the actual initialization
  async performInitialization() {
    try {
      console.log("Initializing storage system...");

      // Step 1: Check storage availability
      const storageAvailable = this.checkStorageAvailability();
      if (!storageAvailable) {
        throw new Error("localStorage is not available");
      }

      // Step 2: Check if migration is needed
      const needsMigration = storageManager.needsMigration();

      if (needsMigration) {
        console.log("Migration needed, running migrations...");

        const migrationResult = await dataMigration.runMigrations();

        if (!migrationResult.success) {
          throw new Error(`Migration failed: ${migrationResult.error}`);
        }

        console.log(
          `Migration completed: ${migrationResult.migrationsRun} migrations run`
        );
      }

      // Step 3: Validate data integrity
      const validation = dataMigration.validateDataIntegrity();
      if (!validation.valid) {
        console.warn("Data integrity issues found:", validation.issues);

        // Try to fix common issues
        await this.attemptDataRepair(validation.issues);
      }

      // Step 4: Setup auto-backup if enabled
      const autoBackupEnabled = this.shouldEnableAutoBackup();
      if (autoBackupEnabled) {
        backupRestore.setupAutoBackup(24); // 24 hours
      }

      // Step 5: Setup storage event listeners
      this.setupStorageEventListeners();

      // Step 6: Cleanup old data if needed
      await this.performMaintenanceTasks();

      console.log("Storage system initialized successfully");

      return {
        success: true,
        message: "Storage system initialized successfully",
        migrationRun: needsMigration,
        dataValid: validation.valid,
        autoBackupEnabled,
      };
    } catch (error) {
      console.error("Storage initialization failed:", error);

      return {
        success: false,
        error: error.message,
        fallbackMode: await this.enableFallbackMode(),
      };
    }
  }

  // Check if localStorage is available
  checkStorageAvailability() {
    try {
      const testKey = "storage-test";
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      console.error("localStorage not available:", error);
      return false;
    }
  }

  // Attempt to repair common data issues
  async attemptDataRepair(issues) {
    try {
      console.log("Attempting to repair data issues...");

      let repaired = false;

      // Create backup before attempting repairs
      storageManager.createBackup("Pre-repair backup");

      for (const issue of issues) {
        if (issue.includes("missing title")) {
          // Fix missing titles
          const playgroundData = storageManager.safeGetItem("playground", {});

          Object.entries(playgroundData).forEach(([folderId, folder]) => {
            if (!folder.title) {
              folder.title = "Untitled Folder";
              folder.updatedAt = Date.now();
              repaired = true;
            }

            if (folder.playgrounds) {
              Object.entries(folder.playgrounds).forEach(
                ([playgroundId, playground]) => {
                  if (!playground.title) {
                    playground.title = "Untitled Playground";
                    playground.updatedAt = Date.now();
                    repaired = true;
                  }
                }
              );
            }
          });

          if (repaired) {
            storageManager.safeSetItem("playground", playgroundData);
          }
        }

        if (issue.includes("Invalid playground data structure")) {
          // Recreate playground structure
          const initialState = dataMigration.createInitialPlaygroundState();
          storageManager.safeSetItem("playground", initialState);
          repaired = true;
        }

        if (issue.includes("Invalid UI preferences structure")) {
          // Recreate UI preferences
          const initialUIPrefs = dataMigration.createInitialUIPreferences();
          storageManager.safeSetItem(
            "syntaxpro-ui-preferences",
            initialUIPrefs
          );
          repaired = true;
        }
      }

      if (repaired) {
        console.log("Data repair completed");
      }

      return repaired;
    } catch (error) {
      console.error("Data repair failed:", error);
      return false;
    }
  }

  // Check if auto-backup should be enabled
  shouldEnableAutoBackup() {
    try {
      // Check user preferences (could be stored in UI preferences)
      const uiPrefs = storageManager.safeGetItem(
        "syntaxpro-ui-preferences",
        {}
      );

      // Default to enabled if not specified
      return uiPrefs.autoBackup !== false;
    } catch (error) {
      console.error("Error checking auto-backup preference:", error);
      return true; // Default to enabled
    }
  }

  // Setup storage event listeners
  setupStorageEventListeners() {
    try {
      // Listen for storage events from other tabs
      window.addEventListener("storage", (event) => {
        if (
          event.key === "playground" ||
          event.key === "syntaxpro-ui-preferences"
        ) {
          console.log("Storage changed in another tab:", event.key);

          // Dispatch custom event for React components to listen to
          window.dispatchEvent(
            new CustomEvent("storage-changed", {
              detail: {
                key: event.key,
                oldValue: event.oldValue,
                newValue: event.newValue,
              },
            })
          );
        }
      });

      // Listen for quota exceeded events
      window.addEventListener("storage-quota-exceeded", (event) => {
        console.warn("Storage quota exceeded:", event.detail);

        // Try to free up space
        this.handleQuotaExceeded();
      });

      // Listen for auto-backup events
      window.addEventListener("auto-backup-created", (event) => {
        console.log("Auto-backup created:", event.detail.backup.label);
      });
    } catch (error) {
      console.error("Error setting up storage event listeners:", error);
    }
  }

  // Handle storage quota exceeded
  async handleQuotaExceeded() {
    try {
      console.log("Handling storage quota exceeded...");

      // Clean up old backups
      storageManager.cleanupOldBackups();

      // Remove migration logs if they exist
      storageManager.safeRemoveItem("syntaxpro-migration-log");

      // Notify user
      window.dispatchEvent(
        new CustomEvent("show-notification", {
          detail: {
            type: "warning",
            title: "Storage Space Low",
            message:
              "Storage space is running low. Old backups have been cleaned up.",
            autoClose: false,
          },
        })
      );
    } catch (error) {
      console.error("Error handling quota exceeded:", error);
    }
  }

  // Perform maintenance tasks
  async performMaintenanceTasks() {
    try {
      console.log("Performing maintenance tasks...");

      // Clean up old backups (keep only 5 most recent)
      storageManager.cleanupOldBackups();

      // Clean up old migration logs (keep only 10 most recent)
      const migrationLogs = storageManager.safeGetItem(
        "syntaxpro-migration-log",
        []
      );
      if (migrationLogs.length > 10) {
        const recentLogs = migrationLogs.slice(-10);
        storageManager.safeSetItem("syntaxpro-migration-log", recentLogs);
      }

      // Check storage usage and warn if high
      const storageInfo = storageManager.getStorageInfo();
      if (storageInfo && storageInfo.quotaEstimate) {
        const usagePercentage = storageInfo.quotaEstimate.usagePercentage;

        if (usagePercentage > 80) {
          window.dispatchEvent(
            new CustomEvent("show-notification", {
              detail: {
                type: "warning",
                title: "Storage Usage High",
                message: `Storage is ${usagePercentage.toFixed(
                  1
                )}% full. Consider backing up and cleaning old data.`,
                autoClose: false,
              },
            })
          );
        }
      }
    } catch (error) {
      console.error("Error performing maintenance tasks:", error);
    }
  }

  // Enable fallback mode (in-memory storage)
  async enableFallbackMode() {
    try {
      console.log("Enabling fallback mode...");

      // Create in-memory storage fallback
      window.syntaxProFallbackStorage = {
        playground: dataMigration.createInitialPlaygroundState(),
        uiPreferences: dataMigration.createInitialUIPreferences(),
      };

      // Dispatch event to notify components
      window.dispatchEvent(
        new CustomEvent("fallback-mode-enabled", {
          detail: {
            message: "Running in fallback mode. Data will not be persisted.",
          },
        })
      );

      return true;
    } catch (error) {
      console.error("Failed to enable fallback mode:", error);
      return false;
    }
  }

  // Get initialization status
  getStatus() {
    return {
      initialized: this.initialized,
      initializing: !!this.initPromise,
      storageAvailable: this.checkStorageAvailability(),
      currentVersion: storageManager.getCurrentVersion(),
      targetVersion: storageManager.STORAGE_VERSION,
      needsMigration: storageManager.needsMigration(),
    };
  }

  // Reset storage system (for testing/debugging)
  async reset() {
    try {
      console.log("Resetting storage system...");

      // Stop auto-backup
      backupRestore.stopAutoBackup();

      // Clear all data
      storageManager.clearAllData();

      // Reset initialization state
      this.initialized = false;
      this.initPromise = null;

      // Re-initialize
      return await this.initialize();
    } catch (error) {
      console.error("Error resetting storage system:", error);
      return { success: false, error: error.message };
    }
  }
}

// Create singleton instance
const storageInit = new StorageInit();

export default storageInit;
