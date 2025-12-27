// Cookie Clicker Game - Main exports
// Self-contained game module

export { CookieClickerGame, default } from "./Game";
export { useCookieClickerStore } from "./lib/store";
export type { CookieClickerProgress, CookieClickerState } from "./lib/store";
export type { BuildingId, UpgradeId, AchievementId } from "./lib/constants";
