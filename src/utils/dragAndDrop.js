// Drag and Drop utilities with visual feedback
import React from "react";

export const DRAG_TYPES = {
  PROJECT: "project",
  FOLDER: "folder",
  FILE: "file",
};

export const DRAG_STATES = {
  IDLE: "idle",
  DRAGGING: "dragging",
  DRAG_OVER: "dragOver",
  DROP_READY: "dropReady",
};

// Visual feedback classes for drag states
export const DRAG_VISUAL_FEEDBACK = {
  dragging: {
    source: "opacity-50 scale-95 rotate-2 shadow-2xl z-50 cursor-grabbing",
    ghost:
      "opacity-75 scale-110 rotate-1 shadow-xl border-2 border-blue-500 border-dashed",
  },
  dragOver: {
    target:
      "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 border-dashed scale-105",
    indicator: "border-blue-500 bg-blue-500/10",
  },
  dropReady: {
    target:
      "bg-green-50 dark:bg-green-900/20 border-2 border-green-500 border-solid animate-pulse",
    indicator: "border-green-500 bg-green-500/20",
  },
  invalid: {
    target:
      "bg-red-50 dark:bg-red-900/20 border-2 border-red-500 border-dashed",
    indicator: "border-red-500 bg-red-500/10",
  },
};

// Create drag ghost element
export const createDragGhost = (element, data) => {
  const ghost = element.cloneNode(true);
  ghost.style.cssText = `
    position: fixed;
    top: -1000px;
    left: -1000px;
    width: ${element.offsetWidth}px;
    height: ${element.offsetHeight}px;
    pointer-events: none;
    z-index: 1000;
    opacity: 0.8;
    transform: rotate(2deg) scale(1.05);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border-radius: 8px;
  `;

  document.body.appendChild(ghost);
  return ghost;
};

// Remove drag ghost
export const removeDragGhost = (ghost) => {
  if (ghost && ghost.parentNode) {
    ghost.parentNode.removeChild(ghost);
  }
};

// Create drop indicator
export const createDropIndicator = (position = "bottom") => {
  const indicator = document.createElement("div");
  indicator.className = `
    absolute w-full h-1 bg-blue-500 rounded-full opacity-0 
    transition-all duration-200 animate-pulse
    ${position === "top" ? "-top-0.5" : "-bottom-0.5"}
  `;
  indicator.style.opacity = "1";
  return indicator;
};

// Drag and drop hook
export const useDragAndDrop = ({
  type,
  data,
  onDragStart,
  onDragEnd,
  onDrop,
  canDrop = () => true,
  canDrag = () => true,
}) => {
  const dragRef = React.useRef(null);
  const dropRef = React.useRef(null);
  const [dragState, setDragState] = React.useState(DRAG_STATES.IDLE);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isOver, setIsOver] = React.useState(false);
  const ghostRef = React.useRef(null);

  // Drag handlers
  const handleDragStart = (e) => {
    if (!canDrag()) {
      e.preventDefault();
      return;
    }

    setIsDragging(true);
    setDragState(DRAG_STATES.DRAGGING);

    // Create drag ghost
    if (dragRef.current) {
      ghostRef.current = createDragGhost(dragRef.current, data);
    }

    // Set drag data
    e.dataTransfer.setData(`application/json`, JSON.stringify({ type, data }));
    e.dataTransfer.effectAllowed = "move";

    // Add visual feedback to source
    if (dragRef.current) {
      dragRef.current.classList.add(
        ...DRAG_VISUAL_FEEDBACK.dragging.source.split(" ")
      );
    }

    onDragStart?.(data);
  };

  const handleDragEnd = (e) => {
    setIsDragging(false);
    setDragState(DRAG_STATES.IDLE);

    // Remove visual feedback
    if (dragRef.current) {
      dragRef.current.classList.remove(
        ...DRAG_VISUAL_FEEDBACK.dragging.source.split(" ")
      );
    }

    // Remove ghost
    if (ghostRef.current) {
      removeDragGhost(ghostRef.current);
      ghostRef.current = null;
    }

    onDragEnd?.(data);
  };

  // Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();

    if (!isOver) {
      setIsOver(true);
      setDragState(DRAG_STATES.DRAG_OVER);

      // Add visual feedback to target
      if (dropRef.current) {
        dropRef.current.classList.add(
          ...DRAG_VISUAL_FEEDBACK.dragOver.target.split(" ")
        );
      }
    }
  };

  const handleDragLeave = (e) => {
    // Only trigger if leaving the drop zone entirely
    if (!dropRef.current?.contains(e.relatedTarget)) {
      setIsOver(false);
      setDragState(DRAG_STATES.IDLE);

      // Remove visual feedback
      if (dropRef.current) {
        dropRef.current.classList.remove(
          ...DRAG_VISUAL_FEEDBACK.dragOver.target.split(" "),
          ...DRAG_VISUAL_FEEDBACK.dropReady.target.split(" "),
          ...DRAG_VISUAL_FEEDBACK.invalid.target.split(" ")
        );
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    setDragState(DRAG_STATES.IDLE);

    try {
      const dragData = JSON.parse(e.dataTransfer.getData("application/json"));

      if (canDrop(dragData)) {
        // Success feedback
        if (dropRef.current) {
          dropRef.current.classList.remove(
            ...DRAG_VISUAL_FEEDBACK.dragOver.target.split(" ")
          );
          dropRef.current.classList.add(
            ...DRAG_VISUAL_FEEDBACK.dropReady.target.split(" ")
          );

          setTimeout(() => {
            if (dropRef.current) {
              dropRef.current.classList.remove(
                ...DRAG_VISUAL_FEEDBACK.dropReady.target.split(" ")
              );
            }
          }, 500);
        }

        onDrop?.(dragData, data);
      } else {
        // Error feedback
        if (dropRef.current) {
          dropRef.current.classList.add(
            ...DRAG_VISUAL_FEEDBACK.invalid.target.split(" ")
          );

          setTimeout(() => {
            if (dropRef.current) {
              dropRef.current.classList.remove(
                ...DRAG_VISUAL_FEEDBACK.invalid.target.split(" ")
              );
            }
          }, 500);
        }
      }
    } catch (error) {
      console.error("Error handling drop:", error);
    }
  };

  // Drag source props
  const dragProps = {
    ref: dragRef,
    draggable: canDrag(),
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
  };

  // Drop target props
  const dropProps = {
    ref: dropRef,
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop,
  };

  return {
    dragProps,
    dropProps,
    isDragging,
    isOver,
    dragState,
  };
};

// Sortable list utilities
export const useSortable = ({
  items,
  onReorder,
  keyExtractor = (item, index) => index,
}) => {
  const [draggedItem, setDraggedItem] = React.useState(null);
  const [draggedOverItem, setDraggedOverItem] = React.useState(null);

  const handleDragStart = (item, index) => {
    setDraggedItem({ item, index });
  };

  const handleDragOver = (item, index) => {
    if (draggedItem && draggedItem.index !== index) {
      setDraggedOverItem({ item, index });
    }
  };

  const handleDrop = (item, index) => {
    if (draggedItem && draggedItem.index !== index) {
      const newItems = [...items];
      const draggedItemData = newItems[draggedItem.index];

      // Remove dragged item
      newItems.splice(draggedItem.index, 1);

      // Insert at new position
      const insertIndex = draggedItem.index < index ? index - 1 : index;
      newItems.splice(insertIndex, 0, draggedItemData);

      onReorder(newItems);
    }

    setDraggedItem(null);
    setDraggedOverItem(null);
  };

  const getSortableProps = (item, index) => {
    const isDragged = draggedItem?.index === index;
    const isDraggedOver = draggedOverItem?.index === index;

    return {
      key: keyExtractor(item, index),
      draggable: true,
      onDragStart: () => handleDragStart(item, index),
      onDragOver: (e) => {
        e.preventDefault();
        handleDragOver(item, index);
      },
      onDrop: () => handleDrop(item, index),
      className: `
        ${isDragged ? DRAG_VISUAL_FEEDBACK.dragging.source : ""}
        ${isDraggedOver ? DRAG_VISUAL_FEEDBACK.dragOver.target : ""}
        transition-all duration-200
      `,
    };
  };

  return {
    getSortableProps,
    isDragging: !!draggedItem,
    draggedItem,
    draggedOverItem,
  };
};

export default {
  DRAG_TYPES,
  DRAG_STATES,
  DRAG_VISUAL_FEEDBACK,
  createDragGhost,
  removeDragGhost,
  createDropIndicator,
  useDragAndDrop,
  useSortable,
};
