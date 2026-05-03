import React, { useState, useRef, useCallback, useEffect, memo } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
} from "@heroicons/react/24/outline";
import {
  useResponsiveBreakpoint,
  useTouchDevice,
  getTouchFriendlyClasses,
} from "../../utils/responsive";

const EditorLayout = memo(
  ({ children, onFullscreenToggle, isFullscreen = false, className = "" }) => {
    const { currentBreakpoint, isMobile, isTablet, isSmallScreen } =
      useResponsiveBreakpoint();
    const { isTouchDevice } = useTouchDevice();
    const touchClasses = getTouchFriendlyClasses(isTouchDevice);

    const [leftPanelWidth, setLeftPanelWidth] = useState(70); // percentage
    const [rightPanelWidth, setRightPanelWidth] = useState(30); // percentage
    const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
    const [isRightCollapsed, setIsRightCollapsed] = useState(false);
    const [layout, setLayout] = useState("horizontal"); // 'horizontal' or 'vertical'

    const containerRef = useRef(null);
    const isDragging = useRef(false);
    const dragStartX = useRef(0);
    const dragStartY = useRef(0);
    const dragStartLeftWidth = useRef(0);

    // Auto-adjust layout based on screen size
    useEffect(() => {
      if (isSmallScreen) {
        setLayout("vertical");
        // On small screens, show input/output at bottom by default
        setIsRightCollapsed(false);
        setIsLeftCollapsed(false);
        setLeftPanelWidth(45); // Code editor takes 45% height (more space)
        setRightPanelWidth(55); // Input/output takes 55% height (more space)
      } else {
        setLayout("horizontal");
        // Reset to default horizontal layout
        setLeftPanelWidth(70);
        setRightPanelWidth(30);
      }
    }, [isSmallScreen]);

    const handleMouseDown = useCallback(
      (e) => {
        if (isSmallScreen) return; // Disable resizing on small screens

        isDragging.current = true;
        dragStartX.current = e.clientX;
        dragStartY.current = e.clientY;
        dragStartLeftWidth.current = leftPanelWidth;

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        document.body.style.cursor =
          layout === "horizontal" ? "col-resize" : "row-resize";
        document.body.style.userSelect = "none";
      },
      [leftPanelWidth, layout, isSmallScreen]
    );

    const handleMouseMove = useCallback(
      (e) => {
        if (!isDragging.current || !containerRef.current || isSmallScreen)
          return;

        const containerRect = containerRef.current.getBoundingClientRect();

        if (layout === "horizontal") {
          const containerWidth = containerRect.width;
          const deltaX = e.clientX - dragStartX.current;
          const deltaPercent = (deltaX / containerWidth) * 100;

          const newLeftWidth = Math.max(
            20,
            Math.min(80, dragStartLeftWidth.current + deltaPercent)
          );
          const newRightWidth = 100 - newLeftWidth;

          setLeftPanelWidth(newLeftWidth);
          setRightPanelWidth(newRightWidth);
        } else {
          const containerHeight = containerRect.height;
          const deltaY = e.clientY - dragStartY.current;
          const deltaPercent = (deltaY / containerHeight) * 100;

          const newLeftWidth = Math.max(
            20,
            Math.min(80, dragStartLeftWidth.current + deltaPercent)
          );
          const newRightWidth = 100 - newLeftWidth;

          setLeftPanelWidth(newLeftWidth);
          setRightPanelWidth(newRightWidth);
        }
      },
      [layout, isSmallScreen]
    );

    const handleMouseUp = useCallback(() => {
      isDragging.current = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }, [handleMouseMove]);

    const toggleLeftPanel = () => {
      // Prevent collapsing if right panel is already collapsed
      if (isRightCollapsed && !isLeftCollapsed) return;

      setIsLeftCollapsed(!isLeftCollapsed);
      if (isLeftCollapsed) {
        // Restore appropriate widths based on layout
        if (isSmallScreen) {
          setLeftPanelWidth(45);
          setRightPanelWidth(55);
        } else {
          setLeftPanelWidth(70);
          setRightPanelWidth(30);
        }
      }
    };

    const toggleRightPanel = () => {
      // Prevent collapsing if left panel is already collapsed
      if (isLeftCollapsed && !isRightCollapsed) return;

      setIsRightCollapsed(!isRightCollapsed);
      if (isRightCollapsed) {
        // Restore appropriate widths based on layout
        if (isSmallScreen) {
          setLeftPanelWidth(45);
          setRightPanelWidth(55);
        } else {
          setLeftPanelWidth(70);
          setRightPanelWidth(30);
        }
      }
    };

    const getLeftPanelStyle = () => {
      if (isLeftCollapsed) {
        return layout === "vertical"
          ? { height: "0%", minHeight: "0" }
          : { width: "0%", minWidth: "0" };
      }
      if (isRightCollapsed) {
        return layout === "vertical" ? { height: "100%" } : { width: "100%" };
      }
      return layout === "vertical"
        ? { height: `${leftPanelWidth}%` }
        : { width: `${leftPanelWidth}%` };
    };

    const getRightPanelStyle = () => {
      if (isRightCollapsed) {
        return layout === "vertical"
          ? { height: "0%", minHeight: "0" }
          : { width: "0%", minWidth: "0" };
      }
      if (isLeftCollapsed) {
        return layout === "vertical" ? { height: "100%" } : { width: "100%" };
      }
      return layout === "vertical"
        ? { height: `${rightPanelWidth}%` }
        : { width: `${rightPanelWidth}%` };
    };

    const layoutClasses = layout === "vertical" ? "flex-col" : "flex-row";
    const resizeHandleClasses =
      layout === "vertical"
        ? "h-1 w-full cursor-row-resize hover:bg-mustard dark:hover:bg-mustard"
        : "w-1 h-full cursor-col-resize hover:bg-mustard dark:hover:bg-mustard";

    return (
      <div
        ref={containerRef}
        className={`flex ${layoutClasses} h-full bg-paper-50 dark:bg-ink-700 ${className} overflow-hidden`}
        data-layout={layout}
        data-breakpoint={currentBreakpoint}
      >
        {/* Left Panel (Code Editor) */}
        <div
          className={`
          relative flex flex-col bg-paper dark:bg-ink-700 transition-all duration-300 ease-in-out
          ${
            layout === "vertical"
              ? "border-b border-ink/10 dark:border-paper/10"
              : "border-r border-ink/10 dark:border-paper/10"
          }
        `}
          style={getLeftPanelStyle()}
        >
          {!isLeftCollapsed && (
            <>
              {/* Left Panel Header */}
              <div className="flex items-center justify-between px-2 sm:px-4 py-2 bg-paper-50 dark:bg-ink-700 border-b border-ink/10 dark:border-paper/10">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/55 dark:text-paper/55">
                  editor
                </h3>
                <div className="flex items-center space-x-1">
                  {onFullscreenToggle && (
                    <button
                      onClick={onFullscreenToggle}
                      className={`
                      ${isTouchDevice ? touchClasses.iconButton : "p-1"} 
                      text-ink/55 hover:text-ink dark:text-paper/55 dark:hover:text-paper 
                      transition-colors rounded
                    `}
                      title={
                        isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"
                      }
                    >
                      {isFullscreen ? (
                        <ArrowsPointingInIcon
                          className={`${isSmallScreen ? "w-5 h-5" : "w-4 h-4"}`}
                        />
                      ) : (
                        <ArrowsPointingOutIcon
                          className={`${isSmallScreen ? "w-5 h-5" : "w-4 h-4"}`}
                        />
                      )}
                    </button>
                  )}
                  <button
                    onClick={toggleLeftPanel}
                    disabled={isRightCollapsed}
                    className={`
                    ${isTouchDevice ? touchClasses.iconButton : "p-1"} 
                    ${
                      isRightCollapsed
                        ? "text-ink/25 dark:text-paper/25 cursor-not-allowed"
                        : "text-ink/55 hover:text-ink dark:text-paper/55 dark:hover:text-paper"
                    }
                    transition-colors rounded
                  `}
                    title={
                      isRightCollapsed
                        ? "Cannot collapse - other panel is collapsed"
                        : "Collapse Panel"
                    }
                  >
                    <ChevronLeftIcon
                      className={`${isSmallScreen ? "w-5 h-5" : "w-4 h-4"}`}
                    />
                  </button>
                </div>
              </div>

              {/* Left Panel Content */}
              <div className="flex-1 overflow-hidden">
                {children?.codeEditor}
              </div>
            </>
          )}

          {/* Collapsed Left Panel Button */}
          {isLeftCollapsed && (
            <button
              onClick={toggleLeftPanel}
              className={`absolute ${
                layout === "vertical"
                  ? "top-4 left-1/2 transform -translate-x-1/2"
                  : "top-1/2 left-0 transform -translate-y-1/2"
              } bg-mustard hover:bg-mustard-300 text-ink p-2 ${
                layout === "vertical" ? "rounded-b-md" : "rounded-r-md"
              } shadow-lg transition-colors z-10`}
              title="Expand Code Editor"
            >
              {layout === "vertical" ? (
                <ChevronRightIcon className="w-4 h-4 rotate-90" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Resize Handle */}
        {!isLeftCollapsed && !isRightCollapsed && !isSmallScreen && (
          <div
            className={`
            bg-ink/8 dark:bg-paper/8 transition-colors relative group
            ${resizeHandleClasses}
          `}
            onMouseDown={handleMouseDown}
          >
            <div
              className={`
            absolute group-hover:bg-mustard/40
            ${
              layout === "vertical"
                ? "inset-x-0 -top-1 -bottom-1"
                : "inset-y-0 -left-1 -right-1"
            }
          `}
            />
          </div>
        )}

        {/* Right Panel (Input/Output) */}
        <div
          className="relative flex flex-col bg-paper dark:bg-ink-700 transition-all duration-300 ease-in-out"
          style={getRightPanelStyle()}
        >
          {!isRightCollapsed && (
            <>
              {/* Right Panel Header */}
              <div className="flex items-center justify-between px-2 sm:px-4 py-2 bg-paper-50 dark:bg-ink-700 border-b border-ink/10 dark:border-paper/10">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/55 dark:text-paper/55">
                  i/o
                </h3>
                <button
                  onClick={toggleRightPanel}
                  disabled={isLeftCollapsed}
                  className={`p-1 transition-colors ${
                    isLeftCollapsed
                      ? "text-ink/25 dark:text-paper/25 cursor-not-allowed"
                      : "text-ink/55 hover:text-ink dark:text-paper/55 dark:hover:text-paper"
                  }`}
                  title={
                    isLeftCollapsed
                      ? "Cannot collapse - other panel is collapsed"
                      : "Collapse Panel"
                  }
                >
                  <ChevronRightIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* Right Panel Content */}
              <div className="flex-1 overflow-hidden">
                {children?.inputOutput}
              </div>
            </>
          )}

          {/* Collapsed Right Panel Button */}
          {isRightCollapsed && (
            <button
              onClick={toggleRightPanel}
              className={`absolute ${
                layout === "vertical"
                  ? "bottom-4 left-1/2 transform -translate-x-1/2"
                  : "top-1/2 right-0 transform -translate-y-1/2"
              } bg-mustard hover:bg-mustard-300 text-ink p-2 ${
                layout === "vertical" ? "rounded-t-md" : "rounded-l-md"
              } shadow-lg transition-colors z-10`}
              title="Expand Input/Output"
            >
              {layout === "vertical" ? (
                <ChevronLeftIcon className="w-4 h-4 -rotate-90" />
              ) : (
                <ChevronLeftIcon className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>
    );
  }
);

EditorLayout.displayName = "EditorLayout";

export default EditorLayout;
