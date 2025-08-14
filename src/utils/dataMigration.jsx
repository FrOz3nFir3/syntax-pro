import storageManager from "./storageManager";

// Data migration utilities
class DataMigration {
  constructor() {
    this.migrations = new Map();
    this.setupMigrations();
  }

  // Setup all available migrations
  setupMigrations() {
    // Migration from 0.0.0 to 1.0.0 (initial structure)
    this.addMigration("0.0.0", "1.0.0", this.migrateToV1);

    // Future migrations can be added here
    // this.addMigration('1.0.0', '1.1.0', this.migrateToV1_1);
  }

  // Add a migration
  addMigration(fromVersion, toVersion, migrationFunction) {
    const key = `${fromVersion}->${toVersion}`;
    this.migrations.set(key, {
      fromVersion,
      toVersion,
      migrate: migrationFunction.bind(this),
    });
  }

  // Run all necessary migrations
  async runMigrations() {
    try {
      const currentVersion = storageManager.getCurrentVersion();
      const targetVersion = storageManager.STORAGE_VERSION;

      console.log(
        `Starting migration from ${currentVersion} to ${targetVersion}`
      );

      if (storageManager.compareVersions(currentVersion, targetVersion) >= 0) {
        console.log("No migration needed");
        return { success: true, migrationsRun: 0 };
      }

      // Create backup before migration
      const backup = storageManager.createBackup("Pre-migration backup");
      if (!backup) {
        throw new Error("Failed to create pre-migration backup");
      }

      let migrationsRun = 0;
      let currentVer = currentVersion;

      // Run migrations in sequence
      while (storageManager.compareVersions(currentVer, targetVersion) < 0) {
        const nextMigration = this.findNextMigration(currentVer);

        if (!nextMigration) {
          console.warn(
            `No migration path found from ${currentVer} to ${targetVersion}`
          );
          break;
        }

        console.log(
          `Running migration: ${nextMigration.fromVersion} -> ${nextMigration.toVersion}`
        );

        const migrationResult = await nextMigration.migrate();

        if (!migrationResult.success) {
          throw new Error(`Migration failed: ${migrationResult.error}`);
        }

        // Update version after successful migration
        storageManager.setVersion(nextMigration.toVersion);
        storageManager.logMigration(
          nextMigration.fromVersion,
          nextMigration.toVersion,
          migrationResult.details
        );

        currentVer = nextMigration.toVersion;
        migrationsRun++;
      }

      console.log(`Migration completed. ${migrationsRun} migrations run.`);

      return {
        success: true,
        migrationsRun,
        fromVersion: currentVersion,
        toVersion: currentVer,
      };
    } catch (error) {
      console.error("Migration failed:", error);

      // Attempt to restore from backup if migration fails
      const backups = storageManager.getBackups();
      const preMigrationBackup = backups.find((b) =>
        b.label.includes("Pre-migration")
      );

      if (preMigrationBackup) {
        console.log("Attempting to restore from pre-migration backup...");
        storageManager.restoreFromBackup(preMigrationBackup.timestamp);
      }

      return {
        success: false,
        error: error.message,
        migrationsRun: 0,
      };
    }
  }

  // Find the next migration to run
  findNextMigration(currentVersion) {
    for (const [key, migration] of this.migrations) {
      if (migration.fromVersion === currentVersion) {
        return migration;
      }
    }
    return null;
  }

  // Migration from 0.0.0 to 1.0.0
  async migrateToV1() {
    try {
      console.log("Running migration to v1.0.0...");

      // Get existing playground data
      const existingData = storageManager.safeGetItem("playground");

      if (!existingData) {
        // No existing data, create initial structure
        const initialState = this.createInitialPlaygroundState();
        storageManager.safeSetItem("playground", initialState);

        return {
          success: true,
          details: "Created initial playground structure",
        };
      }

      // Migrate existing data structure
      const migratedData = this.migratePlaygroundStructure(existingData);

      // Save migrated data
      if (!storageManager.safeSetItem("playground", migratedData)) {
        throw new Error("Failed to save migrated data");
      }

      // Initialize UI preferences if they don't exist
      const existingUIPrefs = storageManager.safeGetItem(
        "syntaxpro-ui-preferences"
      );
      if (!existingUIPrefs) {
        const initialUIPrefs = this.createInitialUIPreferences();
        storageManager.safeSetItem("syntaxpro-ui-preferences", initialUIPrefs);
      }

      return {
        success: true,
        details: "Migrated playground structure and initialized UI preferences",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Create initial playground state
  createInitialPlaygroundState() {
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

    const now = Date.now();
    const folderId = crypto.randomUUID();

    return {
      [folderId]: {
        title: "Getting Started",
        createdAt: now,
        updatedAt: now,
        color: "#3b82f6",
        description: "Welcome to Syntax Pro! Start coding with these examples.",
        playgrounds: {
          [crypto.randomUUID()]: {
            id: 71,
            title: "Hello Python",
            language: "python",
            code: languageMap.python.defaultCode,
            theme: "tokyoNight",
            createdAt: now,
            updatedAt: now,
            isFavorite: false,
            lastRun: null,
            description: "A simple Python hello world example",
            tags: ["beginner", "hello-world"],
            executionCount: 0,
            averageExecutionTime: 0,
          },
          [crypto.randomUUID()]: {
            id: 63,
            title: "Hello JavaScript",
            language: "javascript",
            code: languageMap.javascript.defaultCode,
            theme: "tokyoNight",
            createdAt: now,
            updatedAt: now,
            isFavorite: true,
            lastRun: null,
            description: "A simple JavaScript hello world example",
            tags: ["beginner", "hello-world"],
            executionCount: 0,
            averageExecutionTime: 0,
          },
        },
      },
    };
  }

  // Migrate existing playground structure
  migratePlaygroundStructure(existingData) {
    const migratedData = {};

    Object.entries(existingData).forEach(([folderId, folder]) => {
      // Ensure folder has required fields
      migratedData[folderId] = {
        title: folder.title || "Untitled Folder",
        createdAt: folder.createdAt || Date.now(),
        updatedAt: folder.updatedAt || Date.now(),
        color: folder.color || "#3b82f6",
        description: folder.description || "",
        playgrounds: {},
      };

      // Migrate playgrounds within folder
      if (folder.playgrounds) {
        Object.entries(folder.playgrounds).forEach(
          ([playgroundId, playground]) => {
            migratedData[folderId].playgrounds[playgroundId] = {
              id: playground.id,
              title: playground.title || "Untitled Playground",
              language: playground.language || "javascript",
              code: playground.code || "",
              theme: playground.theme || "tokyoNight",
              createdAt: playground.createdAt || Date.now(),
              updatedAt: playground.updatedAt || Date.now(),
              isFavorite: playground.isFavorite || false,
              lastRun: playground.lastRun || null,
              description: playground.description || "",
              tags: playground.tags || [],
              executionCount: playground.executionCount || 0,
              averageExecutionTime: playground.averageExecutionTime || 0,
            };
          }
        );
      }
    });

    return migratedData;
  }

  // Create initial UI preferences
  createInitialUIPreferences() {
    return {
      theme: "dark",
      sidebarCollapsed: false,
      editorLayout: "horizontal",
      preferences: {
        fontSize: 14,
        tabSize: 2,
        wordWrap: true,
        autoSave: true,
        showLineNumbers: true,
        showMinimap: false,
      },
      search: {
        query: "",
        filters: {
          language: "all",
          favorites: false,
        },
      },
    };
  }

  // Validate data integrity after migration
  validateDataIntegrity() {
    try {
      const playgroundData = storageManager.safeGetItem("playground");
      const uiPreferences = storageManager.safeGetItem(
        "syntaxpro-ui-preferences"
      );

      const issues = [];

      // Validate playground data
      if (!playgroundData || typeof playgroundData !== "object") {
        issues.push("Invalid playground data structure");
      } else {
        Object.entries(playgroundData).forEach(([folderId, folder]) => {
          if (!folder.title) {
            issues.push(`Folder ${folderId} missing title`);
          }

          if (!folder.playgrounds || typeof folder.playgrounds !== "object") {
            issues.push(`Folder ${folderId} has invalid playgrounds structure`);
          } else {
            Object.entries(folder.playgrounds).forEach(
              ([playgroundId, playground]) => {
                if (!playground.title || !playground.language) {
                  issues.push(
                    `Playground ${playgroundId} missing required fields`
                  );
                }
              }
            );
          }
        });
      }

      // Validate UI preferences
      if (!uiPreferences || typeof uiPreferences !== "object") {
        issues.push("Invalid UI preferences structure");
      }

      return {
        valid: issues.length === 0,
        issues,
      };
    } catch (error) {
      return {
        valid: false,
        issues: [`Validation error: ${error.message}`],
      };
    }
  }

  // Get migration status
  getMigrationStatus() {
    const currentVersion = storageManager.getCurrentVersion();
    const targetVersion = storageManager.STORAGE_VERSION;
    const needsMigration = storageManager.needsMigration();
    const migrationHistory = storageManager.getMigrationHistory();

    return {
      currentVersion,
      targetVersion,
      needsMigration,
      migrationHistory,
      availableMigrations: Array.from(this.migrations.keys()),
    };
  }
}

// Create singleton instance
const dataMigration = new DataMigration();

export default dataMigration;
