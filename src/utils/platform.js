/**
 * Platform detection — one source of truth for OS-aware UI bits.
 *
 * Computed once at module load. Safe in SSR (returns sensible defaults).
 */
const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
const platform =
  typeof navigator !== "undefined" ? navigator.platform || "" : "";

export const IS_MAC = /Mac|iPhone|iPad|iPod/i.test(platform || ua);
export const IS_TOUCH =
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

/** ⌘ on Mac, Ctrl on Windows/Linux */
export const MOD_KEY = IS_MAC ? "⌘" : "Ctrl";

/** ↵ glyph used universally for Enter/Return */
export const ENTER_KEY = "↵";

/** Concatenated combos for hint text */
export const KEY = {
  run: IS_MAC ? `⌘ ${ENTER_KEY}` : `Ctrl + Enter`,
  save: IS_MAC ? `⌘ S` : `Ctrl + S`,
};
