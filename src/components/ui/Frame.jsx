import React from "react";

/**
 * Frame — the signature corner-bracket motif from the Syntax Pro logo.
 * Renders L-shaped corner brackets just outside the wrapped element.
 *
 * Props:
 *   corners: "diagonal" (default, matches logo: TR + BL) | "all"
 *   tone:    "signal" | "ink" | "mustard"
 *   size:    "sm" | "md" | "lg"
 *   hover:   when true, corners only render on hover/focus of the parent
 *   animate: when true, corners fade-in on mount
 */

const SIZES = {
  sm: {
    cls: "w-3 h-3",
    // 1.5px borders via arbitrary values, per side
    sides: {
      t: "border-t-[1.5px]",
      r: "border-r-[1.5px]",
      b: "border-b-[1.5px]",
      l: "border-l-[1.5px]",
    },
    pos: {
      tl: "-top-1.5 -left-1.5",
      tr: "-top-1.5 -right-1.5",
      bl: "-bottom-1.5 -left-1.5",
      br: "-bottom-1.5 -right-1.5",
    },
  },
  md: {
    cls: "w-5 h-5",
    sides: {
      t: "border-t-2",
      r: "border-r-2",
      b: "border-b-2",
      l: "border-l-2",
    },
    pos: {
      tl: "-top-2 -left-2",
      tr: "-top-2 -right-2",
      bl: "-bottom-2 -left-2",
      br: "-bottom-2 -right-2",
    },
  },
  lg: {
    cls: "w-9 h-9",
    sides: {
      t: "border-t-[3px]",
      r: "border-r-[3px]",
      b: "border-b-[3px]",
      l: "border-l-[3px]",
    },
    pos: {
      // bracket sits mostly outside — vertex aligns with the corner
      tl: "-top-2 -left-2",
      tr: "-top-2 -right-2",
      bl: "-bottom-2 -left-2",
      br: "-bottom-2 -right-2",
    },
  },
};

const TONES = {
  signal: "border-signal",
  ink: "border-ink dark:border-paper",
  mustard: "border-mustard-500",
};

const Frame = ({
  children,
  corners = "diagonal",
  tone = "signal",
  size = "md",
  hover = false,
  animate = false,
  className = "",
  innerClassName = "",
  as: Tag = "div",
}) => {
  const s = SIZES[size];
  const t = TONES[tone];
  const base = `absolute pointer-events-none ${s.cls} ${t} transition-opacity duration-300`;
  const hoverCls = hover
    ? "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
    : "opacity-100";
  const animCls = animate ? "animate-frame-in" : "";

  const showTL = corners === "all";
  const showTR = true;
  const showBL = true;
  const showBR = corners === "all";

  return (
    <Tag className={`relative group ${className}`}>
      {showTL && (
        <span
          aria-hidden
          className={`${base} ${hoverCls} ${animCls} ${s.pos.tl} ${s.sides.t} ${s.sides.l}`}
        />
      )}
      {showTR && (
        <span
          aria-hidden
          className={`${base} ${hoverCls} ${animCls} ${s.pos.tr} ${s.sides.t} ${s.sides.r}`}
        />
      )}
      {showBL && (
        <span
          aria-hidden
          className={`${base} ${hoverCls} ${animCls} ${s.pos.bl} ${s.sides.b} ${s.sides.l}`}
        />
      )}
      {showBR && (
        <span
          aria-hidden
          className={`${base} ${hoverCls} ${animCls} ${s.pos.br} ${s.sides.b} ${s.sides.r}`}
        />
      )}
      <div className={innerClassName}>{children}</div>
    </Tag>
  );
};

export default Frame;
