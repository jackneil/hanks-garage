// Drawing App - Main exports
// Self-contained app module

export { DrawingApp, default } from "./DrawingApp";
export { useDrawingStore } from "./lib/store";
export type { SavedArtwork, DrawingSettings, DrawingStats, DrawingAppProgress } from "./lib/store";
export type { DrawingTool } from "./lib/constants";
export {
  TOOLS,
  BASIC_COLORS,
  EXTENDED_COLORS,
  SIZE_PRESETS,
  MIN_BRUSH_SIZE,
  MAX_BRUSH_SIZE,
  CANVAS_BG_COLOR,
  MAX_HISTORY_STATES,
  MAX_SAVED_ARTWORKS,
} from "./lib/constants";
