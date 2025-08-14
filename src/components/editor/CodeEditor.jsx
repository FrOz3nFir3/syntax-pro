import React, {
  useState,
  useRef,
  useEffect,
  memo,
  Suspense,
  lazy,
  useMemo,
} from "react";
import {
  PlayIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  DocumentDuplicateIcon,
  DocumentIcon,
  ChevronDownIcon,
  ArrowPathIcon,
  CheckIcon,
  ClockIcon,
  StopIcon,
} from "@heroicons/react/24/outline";
import { EditorState } from "@codemirror/state";
import { keymap, EditorView } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { foldGutter, codeFolding, bracketMatching } from "@codemirror/language";
import { lineNumbers } from "@codemirror/view";
import { closeBrackets, autocompletion } from "@codemirror/autocomplete";

// Lazy load ReactCodeMirror for better performance
const ReactCodeMirror = lazy(() => import("@uiw/react-codemirror"));

// Lazy load language extensions
const loadLanguage = (language) => {
  switch (language) {
    case "java":
      return import("@codemirror/lang-java").then((m) => m.java());
    case "javascript":
      return import("@codemirror/lang-javascript").then((m) =>
        m.javascript({ jsx: true, typescript: true })
      );
    case "cpp":
      return import("@codemirror/lang-cpp").then((m) => m.cpp());
    case "python":
      return import("@codemirror/lang-python").then((m) => m.python());
    case "rust":
      return import("@codemirror/lang-rust").then((m) => m.rust());
    case "php":
      return import("@codemirror/lang-php").then((m) => m.php());
    default:
      return import("@codemirror/lang-javascript").then((m) =>
        m.javascript({ jsx: true, typescript: true })
      );
  }
};

// Lazy load themes
const loadTheme = (theme) => {
  return import("@uiw/codemirror-themes-all").then((themes) => {
    return themes[theme] || themes.githubLight;
  });
};

// Loading fallback component
const CodeEditorSkeleton = () => (
  <div className="flex flex-col h-full bg-white dark:bg-gray-800 animate-pulse">
    <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="w-20 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
      <div className="flex items-center space-x-1">
        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="w-16 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
    </div>
    <div className="flex-1 p-4">
      <div className="space-y-2">
        <div className="w-full h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="w-3/4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="w-1/2 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="w-5/6 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
    </div>
  </div>
);

const CodeEditor = memo(
  ({
    value = "",
    onChange,
    language = "javascript",
    theme = "githubLight",
    onRun,
    onStop,
    onSave,
    onImport,
    onExport,
    onThemeChange,
    title = "Untitled",
    isRunning = false,
    isSaving = false,
    autoSaveEnabled = true,
    toggleAutoSave,
    lastSaved,
    height = "100%",
    readOnly = false,
    showToolbar = true,
    className = "",
  }) => {
    const [themeDropdownVisible, setThemeDropdownVisible] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState(null);
    const [currentTheme, setCurrentTheme] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const editorRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
      const loadDeps = async () => {
        setIsLoading(true);
        try {
          const [lang, thm] = await Promise.all([
            loadLanguage(language),
            loadTheme(theme),
          ]);
          setCurrentLanguage(lang);
          setCurrentTheme(thm);
        } catch (error) {
          console.error("Failed to load CodeMirror dependencies:", error);
        } finally {
          setIsLoading(false);
        }
      };
      loadDeps();
    }, [language, theme]);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (themeDropdownVisible && !event.target.closest(".theme-dropdown")) {
          setThemeDropdownVisible(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [themeDropdownVisible]);

    const handleImportClick = () => {
      fileInputRef.current?.click();
    };

    const handleFileImport = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          onImport?.(e.target.result, file.name);
        };
        reader.readAsText(file);
      }
    };

    const handleExport = () => {
      onExport?.();
    };

    const themeOptions = [
      { value: "githubLight", label: "GitHub Light" },
      { value: "githubDark", label: "GitHub Dark" },
      { value: "dracula", label: "Dracula" },
      { value: "atomone", label: "Atom One" },
      { value: "materialLight", label: "Material Light" },
      { value: "materialDark", label: "Material Dark" },
      { value: "nord", label: "Nord" },
      { value: "tokyoNight", label: "Tokyo Night" },
      { value: "vscodeDark", label: "VS Code Dark" },
      { value: "solarizedLight", label: "Solarized Light" },
    ];

    const handleThemeChange = (newTheme) => {
      onThemeChange?.(newTheme);
      setThemeDropdownVisible(false);
    };

    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(value);
        // You could add a toast notification here
      } catch (err) {
        console.error("Failed to copy code:", err);
      }
    };

    const extensions = useMemo(() => {
      const ext = [
        lineNumbers(),
        history(),
        codeFolding(),
        foldGutter(),
        bracketMatching(),
        closeBrackets(),
        autocompletion(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        EditorState.allowMultipleSelections.of(true),
        // Enable proper scrolling behavior
        EditorView.theme({
          "&": {
            height: "100%",
          },
          ".cm-scroller": {
            overflow: "auto",
          },
          ".cm-editor": {
            height: "100%",
          },
          ".cm-focused": {
            outline: "none",
          },
        }),
      ];
      if (currentLanguage) {
        ext.unshift(currentLanguage);
      }
      return ext;
    }, [currentLanguage]);

    if (isLoading) {
      return <CodeEditorSkeleton />;
    }

    return (
      <div
        className={`flex flex-col h-full bg-white dark:bg-slate-900 ${className}`}
      >
        {/* Toolbar */}
        {showToolbar && (
          <div className="flex flex-wrap gap-4  items-center justify-between px-2 sm:px-4 py-2 bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-neutral-600">
            <div className="flex items-center space-x-1 sm:space-x-2 ">
              <DocumentIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300  max-w-20 sm:max-w-32">
                {title}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-1 sm:px-2 py-0.5 sm:py-1 rounded uppercase">
                {language}
              </span>
              {lastSaved && (
                <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
                  Saved {new Date(lastSaved).toLocaleTimeString()}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1  sm:flex-shrink-0">
              <button
                onClick={handleImportClick}
                className="p-1 sm:p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                title="Import File (Ctrl+O)"
              >
                <DocumentArrowUpIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>

              <button
                onClick={handleExport}
                className="p-1 sm:p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                title="Export File"
              >
                <DocumentArrowDownIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>

              <button
                onClick={copyToClipboard}
                className="p-1 sm:p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                title="Copy to Clipboard"
              >
                <DocumentDuplicateIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>

              {/* Theme Dropdown */}
              <div className="relative theme-dropdown">
                <button
                  onClick={() => setThemeDropdownVisible(!themeDropdownVisible)}
                  className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                  title="Change Theme"
                >
                  <span>Theme</span>
                  <ChevronDownIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>

                {themeDropdownVisible && (
                  <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-slate-900 border border-gray-200 dark:border-neutral-600 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                    {themeOptions.map((themeOption) => (
                      <button
                        key={themeOption.value}
                        onClick={() => handleThemeChange(themeOption.value)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors ${
                          theme === themeOption.value
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            : "text-gray-700 dark:text-neutral-300"
                        }`}
                      >
                        {themeOption.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Auto-save toggle */}
              {toggleAutoSave && (
                <button
                  onClick={toggleAutoSave}
                  className={`flex items-center space-x-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded transition-colors ${
                    autoSaveEnabled
                      ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                  title={`Auto-save is ${
                    autoSaveEnabled ? "enabled" : "disabled"
                  }`}
                >
                  <ClockIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Auto</span>
                </button>
              )}

              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

              {onSave && (
                <button
                  onClick={onSave}
                  disabled={isSaving}
                  className={`flex items-center space-x-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded transition-colors ${
                    isSaving
                      ? "bg-blue-400 text-blue-100 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                  title="Save (Ctrl+S)"
                >
                  {isSaving ? (
                    <ArrowPathIcon className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                  ) : (
                    <CheckIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
                  <span>{isSaving ? "Saving..." : "Save"}</span>
                </button>
              )}

              {onRun && (
                <>
                  {!isRunning ? (
                    <button
                      onClick={onRun}
                      className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded transition-colors bg-green-600 hover:bg-green-700 text-white"
                      title="Run Code (Ctrl+Enter)"
                    >
                      <PlayIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Run</span>
                    </button>
                  ) : (
                    <button
                      onClick={onStop}
                      className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded transition-colors bg-red-600 hover:bg-red-700 text-white"
                      title="Stop Execution"
                    >
                      <StopIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Stop</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Code Editor */}
        <div className="flex-1 overflow-hidden h-full">
          <Suspense fallback={<CodeEditorSkeleton />}>
            <ReactCodeMirror
              ref={editorRef}
              value={value}
              onChange={onChange}
              theme={currentTheme}
              extensions={extensions}
              height="100%"
              readOnly={readOnly}
              basicSetup={false} // Disable the default basicSetup
              style={{ height: "100%" }}
            />
          </Suspense>
        </div>

        {/* Hidden file input for import */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".js,.java,.py,.cpp,.rs,.php,.txt"
          onChange={handleFileImport}
          className="hidden"
        />
      </div>
    );
  }
);

CodeEditor.displayName = "CodeEditor";

export default CodeEditor;
