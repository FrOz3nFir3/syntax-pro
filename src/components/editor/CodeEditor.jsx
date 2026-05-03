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

import Skeleton from "../skeletons/Skeleton";
import { KEY, IS_TOUCH } from "../../utils/platform";

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

// Loading fallback — uses the shared Skeleton primitive for cohesion.
const CodeEditorSkeleton = () => (
  <Skeleton.Group className="flex flex-col h-full bg-paper-50 dark:bg-ink-700">
    <div className="flex items-center justify-between px-4 py-2.5 bg-paper dark:bg-ink-800 border-b border-ink/10 dark:border-paper/10">
      <div className="flex items-center gap-3">
        <Skeleton.Circle className="w-3 h-3" />
        <Skeleton.Block className="w-28 h-4" />
        <Skeleton.Block className="w-16 h-5" />
      </div>
      <div className="flex items-center gap-1">
        <Skeleton.Block className="w-8 h-8 rounded-lg" />
        <Skeleton.Block className="w-8 h-8 rounded-lg" />
        <Skeleton.Block className="w-8 h-8 rounded-lg" />
        <Skeleton.Block className="w-20 h-9 rounded-lg !bg-mustard/40" />
      </div>
    </div>
    <div className="flex-1 p-5 space-y-2.5 bg-paper dark:bg-ink-700">
      <Skeleton.Block className="h-3 w-1/3" />
      <Skeleton.Block className="h-3 w-2/3" />
      <Skeleton.Block className="h-3 w-1/2" />
      <Skeleton.Block className="h-3 w-3/4" />
    </div>
  </Skeleton.Group>
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

    // Keymap callbacks live in refs so the keymap extension can stay memo-stable
    // while always calling the *latest* onRun / onSave handlers.
    const onRunRef = useRef(onRun);
    const onStopRef = useRef(onStop);
    const onSaveRef = useRef(onSave);
    const isRunningRef = useRef(isRunning);
    useEffect(() => {
      onRunRef.current = onRun;
      onStopRef.current = onStop;
      onSaveRef.current = onSave;
      isRunningRef.current = isRunning;
    }, [onRun, onStop, onSave, isRunning]);

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
        keymap.of([
          {
            key: "Mod-Enter",
            preventDefault: true,
            run: () => {
              if (isRunningRef.current) onStopRef.current?.();
              else onRunRef.current?.();
              return true;
            },
          },
          {
            key: "Mod-s",
            preventDefault: true,
            run: () => {
              onSaveRef.current?.();
              return true;
            },
          },
          ...defaultKeymap,
          ...historyKeymap,
        ]),
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
        className={`flex flex-col h-full bg-paper-50 dark:bg-ink-700 ${className}`}
      >
        {/* Toolbar */}
        {showToolbar && (
          <div className="flex flex-wrap gap-3 items-center justify-between px-3 sm:px-5 py-2.5 bg-paper dark:bg-ink-800 border-b border-ink/10 dark:border-paper/10">
            {/* Title cluster */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Functional save-status dot — replaces the skeuomorphic macOS dots */}
              <SaveStatusDot
                isSaving={isSaving}
                lastSaved={lastSaved}
                autoSaveEnabled={autoSaveEnabled}
              />
              <span className="font-display text-base sm:text-lg text-ink dark:text-paper truncate max-w-[12rem] sm:max-w-xs leading-none">
                {title}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/55 dark:text-paper/55 px-1.5 py-0.5 border border-ink/15 dark:border-paper/15 rounded">
                {language}
              </span>
              {lastSaved && (
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/45 dark:text-paper/45 hidden md:inline">
                  · saved {new Date(lastSaved).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
            </div>

            {/* Actions cluster */}
            <div className="flex flex-wrap items-center gap-1 sm:flex-shrink-0">
              <ToolIconButton onClick={handleImportClick} title="Import file (⌘O)">
                <DocumentArrowUpIcon className="w-4 h-4" />
              </ToolIconButton>

              <ToolIconButton onClick={handleExport} title="Export file">
                <DocumentArrowDownIcon className="w-4 h-4" />
              </ToolIconButton>

              <ToolIconButton onClick={copyToClipboard} title="Copy to clipboard">
                <DocumentDuplicateIcon className="w-4 h-4" />
              </ToolIconButton>

              {/* Theme Dropdown */}
              <div className="relative theme-dropdown">
                <button
                  onClick={() => setThemeDropdownVisible(!themeDropdownVisible)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-[0.14em] text-ink/65 dark:text-paper/65 hover:text-ink dark:hover:text-paper hover:bg-ink/5 dark:hover:bg-paper/5 rounded-lg transition-colors"
                  title="Change theme"
                >
                  <span>Theme</span>
                  <ChevronDownIcon className={`w-3 h-3 transition-transform ${themeDropdownVisible ? "rotate-180" : ""}`} />
                </button>

                {themeDropdownVisible && (
                  <div className="absolute top-full right-0 mt-1.5 w-52 bg-paper-50 dark:bg-ink-700 border border-ink/10 dark:border-paper/10 rounded-xl shadow-lift z-50 max-h-72 overflow-y-auto py-1.5 animate-fade-in">
                    {themeOptions.map((themeOption) => {
                      const active = theme === themeOption.value;
                      return (
                        <button
                          key={themeOption.value}
                          onClick={() => handleThemeChange(themeOption.value)}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between ${
                            active
                              ? "text-ink dark:text-paper font-medium"
                              : "text-ink/70 dark:text-paper/70 hover:bg-ink/5 dark:hover:bg-paper/5"
                          }`}
                        >
                          <span>{themeOption.label}</span>
                          {active && <span className="w-1.5 h-1.5 rounded-full bg-signal" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Auto-save toggle */}
              {toggleAutoSave && (
                <button
                  onClick={toggleAutoSave}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-[0.14em] rounded-lg transition-colors ${
                    autoSaveEnabled
                      ? "bg-mint-100 text-mint-400 dark:bg-mint-400/15 dark:text-mint-200"
                      : "text-ink/55 dark:text-paper/55 hover:bg-ink/5 dark:hover:bg-paper/5"
                  }`}
                  title={`Auto-save is ${autoSaveEnabled ? "on" : "off"}`}
                >
                  <ClockIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Auto</span>
                </button>
              )}

              <div className="w-px h-5 bg-ink/15 dark:bg-paper/15 mx-1" />

              {onSave && (
                <button
                  onClick={onSave}
                  disabled={isSaving}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    isSaving
                      ? "bg-ink/8 text-ink/45 cursor-not-allowed dark:bg-paper/8 dark:text-paper/45"
                      : "text-ink/75 hover:text-ink hover:bg-ink/5 dark:text-paper/75 dark:hover:text-paper dark:hover:bg-paper/5"
                  }`}
                  title={`Save (${KEY.save})`}
                >
                  {isSaving ? (
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckIcon className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">{isSaving ? "Saving" : "Save"}</span>
                </button>
              )}

              {onRun && (
                <>
                  {!isRunning ? (
                    <button
                      onClick={onRun}
                      className="
                        flex items-center gap-2 px-4 sm:px-5 py-2 text-sm font-semibold rounded-lg
                        bg-mustard text-ink border border-mustard-500
                        shadow-press hover:shadow-lift hover:bg-mustard-300
                        hover:-translate-y-px active:translate-y-0
                        transition-all duration-150
                        dark:shadow-press-dark
                      "
                      title={`Run code (${KEY.run})`}
                    >
                      <PlayIcon className="w-4 h-4" />
                      <span>Run</span>
                      {!IS_TOUCH && (
                        <kbd className="hidden lg:inline font-mono text-[10px] tracking-normal text-ink/55 px-1.5 py-0.5 rounded border border-ink/20 leading-none">
                          {KEY.run}
                        </kbd>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={onStop}
                      className="
                        flex items-center gap-2 px-4 sm:px-5 py-2 text-sm font-semibold rounded-lg
                        bg-signal text-paper border border-signal-500
                        shadow-soft hover:shadow-lift hover:bg-signal-500
                        hover:-translate-y-px active:translate-y-0
                        transition-all duration-150
                      "
                      title="Stop execution"
                    >
                      <StopIcon className="w-4 h-4" />
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

const ToolIconButton = ({ onClick, title, children }) => (
  <button
    onClick={onClick}
    title={title}
    className="p-2 text-ink/65 hover:text-ink hover:bg-ink/5 dark:text-paper/65 dark:hover:text-paper dark:hover:bg-paper/5 rounded-lg transition-colors"
  >
    {children}
  </button>
);

/**
 * Live save-status dot.
 *  - mustard pulse  → currently saving
 *  - mint solid     → saved (last save < 5s ago)
 *  - mint ring      → saved (older), auto-save on
 *  - ink/40 ring    → never saved / auto-save off
 */
const SaveStatusDot = ({ isSaving, lastSaved, autoSaveEnabled }) => {
  const recentlySaved = lastSaved && Date.now() - new Date(lastSaved).getTime() < 5000;

  let label = "ready";
  let dot = (
    <span className="block w-2.5 h-2.5 rounded-full border border-ink/40 dark:border-paper/40" />
  );

  if (isSaving) {
    label = "saving…";
    dot = (
      <span className="relative block w-2.5 h-2.5">
        <span className="absolute inset-0 rounded-full bg-mustard animate-ping opacity-60" />
        <span className="relative block w-2.5 h-2.5 rounded-full bg-mustard" />
      </span>
    );
  } else if (recentlySaved) {
    label = "saved";
    dot = <span className="block w-2.5 h-2.5 rounded-full bg-mint-400" />;
  } else if (lastSaved) {
    label = autoSaveEnabled ? "auto-save on" : "saved";
    dot = (
      <span className="block w-2.5 h-2.5 rounded-full border-[1.5px] border-mint-400" />
    );
  }

  return (
    <span
      className="inline-flex items-center justify-center w-4 h-4"
      title={label}
      aria-label={label}
    >
      {dot}
    </span>
  );
};

export default CodeEditor;
