import React, {
  useState,
  useRef,
  useCallback,
  memo,
  Suspense,
  lazy,
} from "react";
import {
  PlusIcon,
  XMarkIcon,
  DocumentArrowUpIcon,
  DocumentArrowDownIcon,
  ClipboardIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

// Lazy load CodeMirror for better performance
const ReactCodeMirror = lazy(() => import("@uiw/react-codemirror"));

// Loading skeleton for output
const OutputLoadingSkeleton = () => (
  <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 animate-pulse">
    <ArrowPathIcon className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-500" />
    <p className="text-sm font-medium">Running your code...</p>
    <div className="mt-4 space-y-2 w-full max-w-md px-4">
      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
    </div>
  </div>
);

// Loading skeleton for input import
const InputLoadingSkeleton = () => (
  <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 animate-pulse bg-white dark:bg-slate-800">
    <DocumentArrowUpIcon className="w-8 h-8 mx-auto mb-4 animate-bounce text-green-500" />
    <p className="text-sm font-medium">Loading file...</p>
    <div className="mt-4 space-y-2 w-full max-w-md px-4">
      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-4/5"></div>
    </div>
  </div>
);

// Lazy load language extensions
const loadLanguageExtensions = async () => {
  const [{ json }, { xml }] = await Promise.all([
    import("@codemirror/lang-json"),
    import("@codemirror/lang-xml"),
  ]);
  return { json, xml };
};

// Lazy load themes
const loadThemes = async () => {
  const { githubLight, githubDark } = await import(
    "@uiw/codemirror-themes-all"
  );
  return { githubLight, githubDark };
};

const InputOutputPanels = memo(
  ({
    input = "",
    output = { content: "", timestamp: null, isLoading: false },
    onInputChange,
    onInputImport,
    onOutputClear,
    disabled = false,
    theme = "light",
    className = "",
  }) => {
    const [isImporting, setIsImporting] = useState(false);
    const inputFileRef = useRef(null);

    const handleInputChange = useCallback(
      (value) => {
        onInputChange?.(value);
      },
      [onInputChange]
    );

    const handleFileImport = (event) => {
      const file = event.target.files[0];
      if (file) {
        setIsImporting(true);
        const reader = new FileReader();

        reader.onload = (e) => {
          try {
            onInputImport?.(e.target.result, file.name);
          } catch (error) {
            console.error("Error importing file:", error);
          } finally {
            setIsImporting(false);
            // Reset the file input so the same file can be selected again
            if (inputFileRef.current) {
              inputFileRef.current.value = "";
            }
          }
        };

        reader.onerror = () => {
          console.error("Error reading file");
          setIsImporting(false);
          if (inputFileRef.current) {
            inputFileRef.current.value = "";
          }
        };

        reader.readAsText(file);
      }
    };

    const exportOutput = () => {
      if (!output.content) return;

      const blob = new Blob([output.content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "output.txt";
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    };

    const copyToClipboard = async (content) => {
      try {
        await navigator.clipboard.writeText(content);
        // Could add toast notification here
      } catch (err) {
        console.error("Failed to copy to clipboard:", err);
      }
    };

    const getLanguageExtension = async (type) => {
      const extensions = await loadLanguageExtensions();
      switch (type) {
        case "json":
          return extensions.json();
        case "xml":
          return extensions.xml();
        default:
          return [];
      }
    };

    const formatTimestamp = (timestamp) => {
      if (!timestamp) return "";
      return new Date(timestamp).toLocaleTimeString();
    };

    return (
      <div
        className={`flex flex-col h-full overflow-hidden ${className} ${
          disabled ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        {/* Input Panel */}
        <div className="flex-1 flex flex-col border-b border-gray-200 dark:border-gray-600 min-h-0">
          {/* Input Header */}
          <div className="flex items-center justify-between px-2 sm:px-4 py-2 bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-neutral-600">
            <h3 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
              Input
            </h3>

            <div className="flex items-center space-x-0.5 sm:space-x-1">
              <button
                onClick={() => inputFileRef.current?.click()}
                disabled={disabled || isImporting}
                className={`p-1 transition-colors rounded ${
                  isImporting
                    ? "text-green-500 cursor-not-allowed"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                title={isImporting ? "Loading file..." : "Import File"}
              >
                {isImporting ? (
                  <ArrowPathIcon className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                ) : (
                  <DocumentArrowUpIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
              </button>

              <button
                onClick={() => copyToClipboard(input)}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                title="Copy to Clipboard"
              >
                <ClipboardIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>

              <button
                onClick={() => onInputChange?.("")}
                disabled={disabled}
                className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Clear Input"
              >
                <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Input Content */}
          <div className="flex-1 relative overflow-hidden">
            {isImporting ? (
              <InputLoadingSkeleton />
            ) : (
              <textarea
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                disabled={disabled}
                className="w-full h-full p-2 sm:p-3 border-none outline-none resize-none bg-white dark:bg-slate-800 text-gray-900 dark:text-neutral-100 text-sm overflow-y-auto disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="Enter your input here..."
              />
            )}
          </div>
        </div>

        {/* Output Panel */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Output Header */}
          <div className="flex items-center justify-between px-2 sm:px-4 py-2 bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-neutral-600">
            <div className="flex items-center space-x-1 sm:space-x-2 min-w-0 flex-1">
              <h3 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                Output
              </h3>
              {output.timestamp && (
                <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
                  {formatTimestamp(output.timestamp)}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-0.5 sm:space-x-1 flex-shrink-0">
              <button
                onClick={exportOutput}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                title="Export Output"
              >
                <DocumentArrowDownIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>

              <button
                onClick={() => copyToClipboard(output.content || "")}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                title="Copy to Clipboard"
              >
                <ClipboardIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>

              <button
                onClick={onOutputClear}
                className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                title="Clear Output"
              >
                <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Output Content */}
          <div className="flex-1 overflow-hidden">
            {output.isLoading ? (
              <OutputLoadingSkeleton />
            ) : output.content ? (
              <pre className="w-full h-full p-2 sm:p-3 overflow-y-auto overflow-x-auto bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-neutral-100 text-xs sm:text-sm font-mono whitespace-pre-wrap">
                {output.content}
              </pre>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:bg-slate-800 dark:text-gray-400">
                <div className="text-center">
                  <EyeSlashIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No output yet</p>
                  <p className="text-sm">Run your code to see results</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={inputFileRef}
          type="file"
          accept=".txt,.json,.xml,.csv"
          onChange={handleFileImport}
          className="hidden"
        />
      </div>
    );
  }
);

InputOutputPanels.displayName = "InputOutputPanels";

export default InputOutputPanels;
