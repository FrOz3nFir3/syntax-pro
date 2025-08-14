import React, { useState, useRef, useEffect, memo } from "react";
import {
  PlayIcon,
  StopIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  CogIcon,
  InformationCircleIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  Bars3Icon,
  ChevronDownIcon,
  CommandLineIcon,
  DocumentDuplicateIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const Toolbar = memo(
  ({
    onRun,
    onStop,
    onSave,
    onImport,
    onExport,
    onClear,
    onSettings,
    isRunning = false,
    executionTime = null,
    status = "idle", // 'idle', 'running', 'success', 'error'
    language = "javascript",
    theme = "light",
    showAdvanced = false,
    onToggleAdvanced,
    className = "",
  }) => {
    const [showTooltip, setShowTooltip] = useState(null);
    const [showDropdown, setShowDropdown] = useState(null);
    const tooltipTimeoutRef = useRef(null);

    const handleTooltipShow = (tooltipId) => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
      tooltipTimeoutRef.current = setTimeout(() => {
        setShowTooltip(tooltipId);
      }, 500);
    };

    const handleTooltipHide = () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
      setShowTooltip(null);
    };

    const getStatusIcon = () => {
      switch (status) {
        case "running":
          return <ClockIcon className="w-4 h-4 text-blue-500 animate-spin" />;
        case "success":
          return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
        case "error":
          return <XCircleIcon className="w-4 h-4 text-red-500" />;
        default:
          return null;
      }
    };

    const getStatusText = () => {
      switch (status) {
        case "running":
          return "Running...";
        case "success":
          return executionTime
            ? `Completed in ${executionTime}ms`
            : "Completed";
        case "error":
          return "Error occurred";
        default:
          return "Ready";
      }
    };

    const shortcuts = {
      run: "Ctrl+Enter",
      save: "Ctrl+S",
      import: "Ctrl+O",
      export: "Ctrl+E",
      clear: "Ctrl+K",
    };

    const ToolbarButton = ({
      onClick,
      icon: Icon,
      label,
      shortcut,
      variant = "default",
      disabled = false,
      loading = false,
      tooltipId,
    }) => {
      const baseClasses =
        "relative flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

      const variants = {
        default:
          "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-blue-500",
        primary:
          "text-white bg-blue-600 border border-blue-600 hover:bg-blue-700 focus:ring-blue-500",
        success:
          "text-white bg-green-600 border border-green-600 hover:bg-green-700 focus:ring-green-500",
        danger:
          "text-white bg-red-600 border border-red-600 hover:bg-red-700 focus:ring-red-500",
        ghost:
          "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800",
      };

      return (
        <button
          onClick={onClick}
          disabled={disabled || loading}
          className={`${baseClasses} ${variants[variant]} ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onMouseEnter={() => handleTooltipShow(tooltipId)}
          onMouseLeave={handleTooltipHide}
        >
          <Icon className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>{label}</span>

          {/* Tooltip */}
          {showTooltip === tooltipId && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg whitespace-nowrap z-50">
              {label} {shortcut && `(${shortcut})`}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          )}
        </button>
      );
    };

    const DropdownButton = ({
      icon: Icon,
      label,
      items,
      tooltipId,
      variant = "default",
    }) => {
      const isOpen = showDropdown === tooltipId;

      return (
        <div className="relative">
          <button
            onClick={() => setShowDropdown(isOpen ? null : tooltipId)}
            className={`relative flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-blue-500`}
            onMouseEnter={() => handleTooltipShow(tooltipId)}
            onMouseLeave={handleTooltipHide}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
            <ChevronDownIcon
              className={`w-3 h-3 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50">
              {items.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick();
                    setShowDropdown(null);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-md last:rounded-b-md"
                >
                  <div className="flex items-center space-x-2">
                    {item.icon && <item.icon className="w-4 h-4" />}
                    <span>{item.label}</span>
                    {item.shortcut && (
                      <span className="ml-auto text-xs text-gray-500">
                        {item.shortcut}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Tooltip */}
          {showTooltip === tooltipId && !isOpen && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg whitespace-nowrap z-50">
              {label}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          )}
        </div>
      );
    };

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (showDropdown && !event.target.closest(".relative")) {
          setShowDropdown(null);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [showDropdown]);

    const fileMenuItems = [
      {
        icon: DocumentArrowUpIcon,
        label: "Import File",
        onClick: onImport,
        shortcut: shortcuts.import,
      },
      {
        icon: DocumentArrowDownIcon,
        label: "Export File",
        onClick: onExport,
        shortcut: shortcuts.export,
      },
      {
        icon: DocumentDuplicateIcon,
        label: "Copy to Clipboard",
        onClick: () => {
          /* handled by parent */
        },
      },
      {
        icon: TrashIcon,
        label: "Clear Editor",
        onClick: onClear,
        shortcut: shortcuts.clear,
      },
    ];

    return (
      <div
        className={`flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 ${className}`}
      >
        {/* Left Section - Main Actions */}
        <div className="flex items-center space-x-2">
          {/* File Operations */}
          <DropdownButton
            icon={Bars3Icon}
            label="File"
            items={fileMenuItems}
            tooltipId="file-menu"
          />
        </div>

        {/* Center Section - Status */}
        <div className="flex items-center space-x-3">
          {/* Language Badge */}
          <div className="px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded">
            {language.toUpperCase()}
          </div>

          {/* Status Indicator */}
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {getStatusText()}
            </span>
          </div>
        </div>

        {/* Right Section - Empty for now */}
        <div className="flex items-center space-x-2">
          {/* Placeholder for future actions */}
        </div>
      </div>
    );
  }
);

Toolbar.displayName = "Toolbar";

export default Toolbar;
