import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  ENTRY_ANIMATIONS,
  EXIT_ANIMATIONS,
  TRANSITIONS,
} from "../../utils/animations";

const ContextMenu = ({
  children,
  items = [],
  disabled = false,
  className = "",
  onItemClick,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isExiting, setIsExiting] = useState(false);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const handleContextMenu = (e) => {
    if (disabled || items.length === 0) return;

    e.preventDefault();
    e.stopPropagation();

    const rect = triggerRef.current?.getBoundingClientRect();
    let x = e.clientX;
    let y = e.clientY;

    // Adjust position to keep menu within viewport
    const menuWidth = 200; // Approximate menu width
    const menuHeight = items.length * 40; // Approximate item height

    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 10;
    }
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 10;
    }

    setPosition({ x, y });
    setIsVisible(true);
    setIsExiting(false);
  };

  const handleItemClick = (item, index) => {
    if (item.disabled) return;

    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsExiting(false);
    }, 150);

    onItemClick?.(item, index);
    item.onClick?.(item, index);
  };

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        setIsExiting(false);
      }, 150);
    }
  };

  useEffect(() => {
    if (isVisible) {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("contextmenu", handleClickOutside);

      return () => {
        document.removeEventListener("click", handleClickOutside);
        document.removeEventListener("contextmenu", handleClickOutside);
      };
    }
  }, [isVisible]);

  const menuContent = isVisible && (
    <div
      ref={menuRef}
      className={`
        fixed z-50 min-w-48 py-2 bg-white dark:bg-gray-800 
        border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl
        ${isExiting ? EXIT_ANIMATIONS.SCALE_OUT : ENTRY_ANIMATIONS.SCALE_IN}
        ${TRANSITIONS.DEFAULT}
      `}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {items.map((item, index) => {
        if (item.type === "separator") {
          return (
            <div
              key={index}
              className="my-1 border-t border-gray-200 dark:border-gray-600"
            />
          );
        }

        return (
          <button
            key={index}
            onClick={() => handleItemClick(item, index)}
            disabled={item.disabled}
            className={`
              w-full px-4 py-2 text-left text-sm flex items-center gap-3
              transition-all duration-150 hover:scale-105
              ${
                item.disabled
                  ? "text-gray-400 cursor-not-allowed"
                  : item.danger
                  ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }
            `}
          >
            {item.icon && (
              <span className="flex-shrink-0 w-4 h-4">
                {typeof item.icon === "string" ? (
                  <span>{item.icon}</span>
                ) : (
                  item.icon
                )}
              </span>
            )}
            <span className="flex-1">{item.label}</span>
            {item.shortcut && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {item.shortcut}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      <div
        ref={triggerRef}
        onContextMenu={handleContextMenu}
        className={className}
      >
        {children}
      </div>
      {typeof document !== "undefined" &&
        createPortal(menuContent, document.body)}
    </>
  );
};

// Hook for context menu management
export const useContextMenu = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [items, setItems] = useState([]);

  const showContextMenu = (e, menuItems) => {
    e.preventDefault();
    e.stopPropagation();

    setItems(menuItems);
    setPosition({ x: e.clientX, y: e.clientY });
    setIsVisible(true);
  };

  const hideContextMenu = () => {
    setIsVisible(false);
  };

  return {
    isVisible,
    position,
    items,
    showContextMenu,
    hideContextMenu,
  };
};

export default ContextMenu;
