/**
 * Drawing App Constants
 * Kid-friendly colors, tools, and settings
 */

// Drawing tools
export type DrawingTool = "pencil" | "brush" | "eraser";

export const TOOLS = {
  pencil: {
    name: "Pencil",
    icon: "\u270F\uFE0F",
    description: "Thin precise lines",
    defaultSize: 2,
  },
  brush: {
    name: "Brush",
    icon: "\uD83D\uDD8C\uFE0F",
    description: "Soft strokes",
    defaultSize: 8,
  },
  eraser: {
    name: "Eraser",
    icon: "\uD83E\uDDFD",
    description: "Remove strokes",
    defaultSize: 20,
  },
} as const;

// Basic kid-friendly color palette
export const BASIC_COLORS = [
  { name: "Red", hex: "#EF4444" },
  { name: "Orange", hex: "#F97316" },
  { name: "Yellow", hex: "#EAB308" },
  { name: "Green", hex: "#22C55E" },
  { name: "Blue", hex: "#3B82F6" },
  { name: "Purple", hex: "#A855F7" },
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
] as const;

// Extended colors for color picker
export const EXTENDED_COLORS = [
  "#EF4444", "#F97316", "#EAB308", "#22C55E",
  "#3B82F6", "#A855F7", "#EC4899", "#14B8A6",
  "#F59E0B", "#84CC16", "#06B6D4", "#8B5CF6",
  "#F43F5E", "#10B981", "#0EA5E9", "#D946EF",
  "#000000", "#6B7280", "#9CA3AF", "#FFFFFF",
] as const;

// Brush size presets
export const SIZE_PRESETS = {
  small: 4,
  medium: 12,
  large: 24,
  huge: 40,
} as const;

export const MIN_BRUSH_SIZE = 1;
export const MAX_BRUSH_SIZE = 50;

// Canvas settings
export const CANVAS_BG_COLOR = "#FFFFFF";

// History limits
export const MAX_HISTORY_STATES = 50;
export const MAX_SAVED_ARTWORKS = 20;

// Storage keys
export const STORAGE_KEY = "drawing-app-progress";
export const ARTWORK_STORAGE_KEY = "drawing-app-artworks";
