import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
  memo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  selectCurrentPlayground,
  updateCode,
  updateTheme,
} from "../slices/playgroundSlice.jsx";
import { useTheme } from "../contexts/ThemeContext.jsx";
import {
  EditorLayout,
  CodeEditor,
  InputOutputPanels,
} from "../components/editor";
import ModalWrapper from "../components/ui/ModalWrapper.jsx";
import { useButtonToggle } from "../hooks/useButtonToggle.jsx";
import AppLayout from "../components/layout/AppLayout";
import { codeExecutionApi } from "../utils/api.js";
// Import the new API utility

const languageOptions = [
  { value: "javascript", label: "Javascript", id: 93 }, // Judge0 uses 93 for JS
  { value: "java", label: "Java", id: 91 }, // Judge0 uses 91 for Java (OpenJDK 15)
  { value: "python", label: "Python", id: 71 }, // Same as before
  { value: "cpp", label: "C++", id: 54 }, // Same as before
  { value: "rust", label: "Rust", id: 73 }, // Same as before
  { value: "php", label: "Php", id: 68 }, // Same as before
];

const PlaygroundContent = memo(
  ({
    isFullscreen,
    modal,
    updateModal,
    playground,
    folderId,
    playgroundId,
    onFullscreenToggle,
    currentCode,
    handleCodeChange,
    currentTheme,
    handleRun,
    handleStop,
    handleSave,
    handleImport,
    handleExport,
    handleThemeChange,
    isRunning,
    isSaving,
    autoSaveEnabled,
    toggleAutoSave,
    lastSaved,
    input,
    output,
    handleInputChange,
    handleInputImport,
    handleOutputClear,
    theme,
  }) => {
    const editorComponents = useMemo(
      () => ({
        codeEditor: (
          <CodeEditor
            value={currentCode}
            onChange={handleCodeChange}
            language={playground.language}
            theme={currentTheme}
            onRun={handleRun}
            onStop={handleStop}
            onSave={handleSave}
            onImport={handleImport}
            onExport={handleExport}
            onThemeChange={handleThemeChange}
            title={playground.title}
            isRunning={isRunning}
            isSaving={isSaving}
            autoSaveEnabled={autoSaveEnabled}
            toggleAutoSave={toggleAutoSave}
            lastSaved={lastSaved}
            readOnly={isRunning}
            height="100%"
            showToolbar={true}
          />
        ),
        inputOutput: (
          <InputOutputPanels
            input={input}
            output={output}
            onInputChange={handleInputChange}
            onInputImport={handleInputImport}
            onOutputClear={handleOutputClear}
            disabled={isRunning}
            theme={theme}
          />
        ),
      }),
      [
        currentCode,
        handleCodeChange,
        playground.language,
        playground.title,
        currentTheme,
        handleRun,
        handleStop,
        handleSave,
        handleImport,
        handleExport,
        handleThemeChange,
        isRunning,
        isSaving,
        autoSaveEnabled,
        toggleAutoSave,
        lastSaved,
        input,
        output,
        handleInputChange,
        handleInputImport,
        handleOutputClear,
        theme,
      ]
    );

    return (
      <div
        className={`flex flex-col bg-paper dark:bg-ink-800 ${
          isFullscreen
            ? "fixed inset-0 z-50 h-screen"
            : "h-[100dvh] sm:h-[calc(100vh-4rem)]"
        }`}
      >
        <div className="flex-1 overflow-hidden">
          <EditorLayout
            onFullscreenToggle={onFullscreenToggle}
            isFullscreen={isFullscreen}
          >
            {editorComponents}
          </EditorLayout>
        </div>
      </div>
    );
  }
);

PlaygroundContent.displayName = "PlaygroundContent";

const EnhancedPlayground = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const params = useParams();
  const { folderId, playgroundId } = params;

  const folder = useSelector(selectCurrentPlayground);
  const playground = folder?.[folderId]?.playgrounds?.[playgroundId];

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentCode, setCurrentCode] = useState(playground?.code || "");
  const [currentTheme, setCurrentTheme] = useState(
    playground?.theme || "githubLight"
  );
  const [executionStatus, setExecutionStatus] = useState("idle");
  const [executionTime, setExecutionTime] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);

  const [input, setInput] = useState("");
  const [output, setOutput] = useState({
    content: "",
    timestamp: null,
    isLoading: false,
  });

  const [modal, updateModal] = useButtonToggle();
  const codeRef = useRef(currentCode);
  const autoSaveTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    codeRef.current = currentCode;
  }, [currentCode]);

  useEffect(() => {
    if (playground) {
      setCurrentCode(playground.code || "");
      setCurrentTheme(playground.theme || "githubLight");
    }
  }, [playground]);

  const handleCodeChange = useCallback(
    (value) => {
      setCurrentCode(value);

      // Auto-save logic
      if (autoSaveEnabled) {
        // Clear existing timeout
        if (autoSaveTimeoutRef.current) {
          clearTimeout(autoSaveTimeoutRef.current);
        }

        // Set new timeout for auto-save
        autoSaveTimeoutRef.current = setTimeout(() => {
          handleAutoSave(value);
        }, 3000);
      }
    },
    [autoSaveEnabled]
  );

  const handleAutoSave = useCallback(
    async (code) => {
      if (!playground || isSaving) return;

      try {
        setIsSaving(true);
        dispatch(
          updateCode({
            playgroundId,
            folderId,
            code: code || codeRef.current,
          })
        );
        setLastSaved(new Date());
        setExecutionStatus("success");
        setTimeout(() => setExecutionStatus("idle"), 1500);
      } catch (error) {
        console.error("Auto-save failed:", error);
        setExecutionStatus("error");
        setTimeout(() => setExecutionStatus("idle"), 2000);
      } finally {
        setTimeout(() => setIsSaving(false), 500);
      }
    },
    [dispatch, folderId, playgroundId, playground, isSaving]
  );

  const handleThemeChange = useCallback(
    (newTheme) => {
      setCurrentTheme(newTheme);
      dispatch(
        updateTheme({
          folderId,
          playgroundId,
          theme: newTheme,
        })
      );
    },
    [dispatch, folderId, playgroundId]
  );

  const handleSave = useCallback(async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);
      dispatch(
        updateCode({
          playgroundId,
          folderId,
          code: codeRef.current,
        })
      );

      // Clear auto-save timeout since we're manually saving
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      setLastSaved(new Date());
      setExecutionStatus("success");
      setTimeout(() => setExecutionStatus("idle"), 2000);
    } catch (error) {
      console.error("Save failed:", error);
      setExecutionStatus("error");
      setTimeout(() => setExecutionStatus("idle"), 2000);
    } finally {
      setTimeout(() => setIsSaving(false), 800);
    }
  }, [dispatch, folderId, playgroundId, isSaving]);

  /**
   * REFACTORED handleRun FUNCTION with cancellation support
   */
  const handleRun = useCallback(async () => {
    if (!playground || isRunning) return;

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setIsRunning(true);
    setExecutionStatus("running");

    // Clear output and show loading state
    setOutput({ content: "", timestamp: null, isLoading: true });

    const languageConfig = languageOptions.find(
      (lang) => lang.value === playground.language
    );

    if (!languageConfig) {
      setOutput({
        content: `Error: Language "${playground.language}" is not supported.`,
        timestamp: Date.now(),
        isLoading: false,
      });
      setExecutionStatus("error");
      setIsRunning(false);
      return;
    }

    try {
      const result = await codeExecutionApi.executeCode(
        codeRef.current,
        languageConfig.id,
        input,
        abortControllerRef.current.signal
      );

      // Check if request was cancelled
      if (result.cancelled) {
        setOutput({
          content: "Code execution was cancelled.",
          timestamp: Date.now(),
          isLoading: false,
        });
        setExecutionStatus("idle");
        setIsRunning(false);
        return;
      }

      setExecutionTime(result.time ? parseFloat(result.time) * 1000 : null);

      let outputContent = "";
      // The API returned an error (e.g., auth, network)
      if (result.success === false) {
        outputContent = result.message || "An unknown API error occurred.";
        setExecutionStatus("error");
        // The code ran but resulted in a compilation or runtime error
      } else if (result.error) {
        outputContent = result.error;
        setExecutionStatus("error");
        // The code executed successfully
      } else {
        outputContent = result.output;
        setExecutionStatus("success");
      }

      setOutput({
        content: outputContent,
        timestamp: Date.now(),
        isLoading: false,
      });
    } catch (error) {
      // Catch any unexpected errors during the API call itself
      if (error.name === "AbortError" || error.message.includes("cancelled")) {
        setOutput({
          content: "Code execution was cancelled.",
          timestamp: Date.now(),
          isLoading: false,
        });
        setExecutionStatus("idle");
      } else {
        setExecutionStatus("error");
        setOutput({
          content: `Client-side Error: ${error.message}`,
          timestamp: Date.now(),
          isLoading: false,
        });
      }
    } finally {
      setIsRunning(false);
      abortControllerRef.current = null;
    }
  }, [playground, input, isRunning]);

  const handleStop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const handleImport = useCallback((content) => {
    setCurrentCode(content);
  }, []);

  const handleExport = useCallback(() => {
    const blob = new Blob([codeRef.current], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const extension =
      playground?.language === "javascript"
        ? "js"
        : playground?.language === "python"
        ? "py"
        : playground?.language === "java"
        ? "java"
        : playground?.language === "cpp"
        ? "cpp"
        : playground?.language === "rust"
        ? "rs"
        : playground?.language === "php"
        ? "php"
        : "txt";
    link.download = `${playground?.title || "code"}.${extension}`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, [playground]);

  const handleFullscreenToggle = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const handleInputChange = useCallback((content) => {
    setInput(content);
  }, []);

  const handleInputImport = useCallback((content, filename) => {
    setInput(content);
  }, []);

  const handleOutputClear = useCallback(() => {
    setOutput({ content: "", timestamp: null, isLoading: false });
  }, []);

  const toggleAutoSave = useCallback(() => {
    setAutoSaveEnabled((prev) => {
      if (!prev && autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      return !prev;
    });
  }, []);

  // Cleanup auto-save timeout and abort controller on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  if (!playground) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="eyebrow mb-3">404 · playground</p>
            <h2 className="heading-display text-4xl text-ink dark:text-paper mb-4">
              Playground not found
            </h2>
            <Link to="/playgrounds" className="btn-outline">
              Return to playgrounds
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  const contentProps = {
    isFullscreen,
    modal,
    updateModal,
    playground,
    folderId,
    playgroundId,
    onFullscreenToggle: handleFullscreenToggle,
    currentCode,
    handleCodeChange,
    currentTheme,
    handleRun,
    handleStop,
    handleSave,
    handleImport,
    handleExport,
    handleThemeChange,
    isRunning,
    isSaving,
    autoSaveEnabled,
    toggleAutoSave,
    lastSaved,
    input,
    output,
    handleInputChange,
    handleInputImport,
    handleOutputClear,
    theme,
  };

  return isFullscreen ? (
    <PlaygroundContent {...contentProps} />
  ) : (
    <AppLayout
      className="bg-paper dark:bg-ink-800"
      noPadding
      showBreadcrumbs={false}
    >
      <PlaygroundContent {...contentProps} />
    </AppLayout>
  );
};

export default EnhancedPlayground;
