import React, { useState, useRef, useCallback, memo } from "react";
import {
  DocumentArrowUpIcon,
  DocumentArrowDownIcon,
  ClipboardIcon,
  TrashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import Skeleton from "../skeletons/Skeleton";
import { KEY, IS_TOUCH } from "../../utils/platform";

const OutputLoadingSkeleton = () => (
  <div className="flex flex-col h-full bg-ink dark:bg-ink-900">
    {/* spinner header */}
    <div className="flex items-center justify-center py-6 border-b border-paper/10">
      <div className="flex items-center gap-3">
        <div className="relative w-5 h-5">
          <span className="block w-5 h-5 rounded-full border-2 border-paper/15" />
          <span className="absolute inset-0 w-5 h-5 rounded-full border-2 border-transparent border-t-mustard animate-spin" />
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-mustard">
          executing
        </p>
      </div>
    </div>
    {/* shimmering output lines so the layout feels stable */}
    <Skeleton.Group className="flex-1 p-4 space-y-2.5">
      <Skeleton.Block className="h-3 w-2/3 !bg-paper/15" />
      <Skeleton.Block className="h-3 w-5/6 !bg-paper/15" />
      <Skeleton.Block className="h-3 w-1/2 !bg-paper/15" />
      <Skeleton.Block className="h-3 w-3/4 !bg-paper/15" />
    </Skeleton.Group>
  </div>
);

const InputLoadingSkeleton = () => (
  <div className="flex flex-col h-full bg-paper dark:bg-ink-700">
    <div className="flex items-center justify-center py-6">
      <div className="flex items-center gap-3">
        <DocumentArrowUpIcon className="w-5 h-5 text-mustard animate-bounce" />
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink/65 dark:text-paper/65">
          reading file
        </p>
      </div>
    </div>
    <Skeleton.Group className="flex-1 px-4 pb-4 space-y-2.5">
      <Skeleton.Block className="h-3 w-3/4" />
      <Skeleton.Block className="h-3 w-full" />
      <Skeleton.Block className="h-3 w-2/3" />
    </Skeleton.Group>
  </div>
);

const PanelHeader = ({ label, badge, actions }) => (
  <div className="flex items-center justify-between px-3 sm:px-5 py-2 bg-paper dark:bg-ink-800 border-b border-ink/10 dark:border-paper/10">
    <div className="flex items-center gap-2.5 min-w-0">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/65 dark:text-paper/65">
        {label}
      </span>
      {badge && (
        <span className="font-mono text-[10px] text-ink/40 dark:text-paper/40">
          {badge}
        </span>
      )}
    </div>
    <div className="flex items-center gap-0.5">{actions}</div>
  </div>
);

const PanelBtn = ({ onClick, title, children, danger, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-1.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
      danger
        ? "text-ink/55 hover:text-signal hover:bg-signal/10 dark:text-paper/55 dark:hover:text-signal-200 dark:hover:bg-signal/10"
        : "text-ink/55 hover:text-ink hover:bg-ink/5 dark:text-paper/55 dark:hover:text-paper dark:hover:bg-paper/5"
    }`}
  >
    {children}
  </button>
);

const InputOutputPanels = memo(
  ({
    input = "",
    output = { content: "", timestamp: null, isLoading: false },
    onInputChange,
    onInputImport,
    onOutputClear,
    disabled = false,
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
      if (!file) return;
      setIsImporting(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          onInputImport?.(e.target.result, file.name);
        } finally {
          setIsImporting(false);
          if (inputFileRef.current) inputFileRef.current.value = "";
        }
      };
      reader.onerror = () => {
        setIsImporting(false);
        if (inputFileRef.current) inputFileRef.current.value = "";
      };
      reader.readAsText(file);
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
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    };

    const formatTimestamp = (timestamp) => {
      if (!timestamp) return "";
      return new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    };

    return (
      <div
        className={`flex flex-col h-full overflow-hidden bg-paper-50 dark:bg-ink-700 ${className} ${
          disabled ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        {/* Input */}
        <div className="flex-1 flex flex-col border-b border-ink/10 dark:border-paper/10 min-h-0">
          <PanelHeader
            label="stdin"
            badge={input ? `${input.length} chars` : "empty"}
            actions={
              <>
                <PanelBtn
                  onClick={() => inputFileRef.current?.click()}
                  disabled={disabled || isImporting}
                  title={isImporting ? "Loading…" : "Import file"}
                >
                  {isImporting ? (
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                  ) : (
                    <DocumentArrowUpIcon className="w-4 h-4" />
                  )}
                </PanelBtn>
                <PanelBtn onClick={() => copyToClipboard(input)} title="Copy">
                  <ClipboardIcon className="w-4 h-4" />
                </PanelBtn>
                <PanelBtn
                  onClick={() => onInputChange?.("")}
                  disabled={disabled || !input}
                  title="Clear input"
                  danger
                >
                  <TrashIcon className="w-4 h-4" />
                </PanelBtn>
              </>
            }
          />

          <div className="flex-1 relative overflow-hidden">
            {isImporting ? (
              <InputLoadingSkeleton />
            ) : (
              <textarea
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                disabled={disabled}
                className="w-full h-full p-4 border-none outline-none resize-none bg-paper dark:bg-ink-700 text-ink dark:text-paper font-mono text-sm leading-relaxed placeholder-ink/30 dark:placeholder-paper/30 disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="// stdin — drop a file here or type"
              />
            )}
          </div>
        </div>

        {/* Output */}
        <div className="flex-1 flex flex-col min-h-0">
          <PanelHeader
            label="stdout"
            badge={output.timestamp ? formatTimestamp(output.timestamp) : "—"}
            actions={
              <>
                <PanelBtn
                  onClick={exportOutput}
                  disabled={!output.content}
                  title="Export output"
                >
                  <DocumentArrowDownIcon className="w-4 h-4" />
                </PanelBtn>
                <PanelBtn
                  onClick={() => copyToClipboard(output.content || "")}
                  disabled={!output.content}
                  title="Copy"
                >
                  <ClipboardIcon className="w-4 h-4" />
                </PanelBtn>
                <PanelBtn
                  onClick={onOutputClear}
                  disabled={!output.content}
                  title="Clear output"
                  danger
                >
                  <TrashIcon className="w-4 h-4" />
                </PanelBtn>
              </>
            }
          />

          <div className="flex-1 overflow-hidden">
            {output.isLoading ? (
              <OutputLoadingSkeleton />
            ) : output.content ? (
              <pre className="w-full h-full p-4 overflow-auto bg-ink dark:bg-ink-900 text-paper/95 text-sm font-mono leading-relaxed whitespace-pre-wrap">
                {output.content}
              </pre>
            ) : (
              <EmptyOutputState />
            )}
          </div>
        </div>

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

const EmptyOutputState = () => (
  <div className="flex items-center justify-center h-full bg-paper dark:bg-ink-700 px-6">
    <div className="text-center max-w-xs">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink/45 dark:text-paper/45 mb-3">
        nothing yet
      </p>
      <p className="font-display text-2xl text-ink dark:text-paper mb-2 leading-tight">
        Press <span className="text-mustard">Run</span> to see your output
        here.
      </p>
      {!IS_TOUCH && (
        <p className="text-xs text-ink/45 dark:text-paper/45 italic mt-3">
          {KEY.run} also works.
        </p>
      )}
    </div>
  </div>
);

InputOutputPanels.displayName = "InputOutputPanels";

export default InputOutputPanels;
