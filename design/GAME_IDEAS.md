# Hank's Hits - Game & App Ideas

This document contains researched game and app ideas for the Hank's Hits platform. Each item has been vetted for kid-friendliness (ages 6-14) and technical feasibility.

---

## Current Games

| Game | Status | Route |
|------|--------|-------|
| Monster Truck | Implemented | `/games/monster-truck` |
| Hill Climb Racing | Implemented | `/games/hill-climb` |

---

## Original Games (Build from Scratch)

Simple, addictive games that work great on mobile with touch controls.

| Game | Description | Difficulty | Why Kids Love It |
|------|-------------|------------|------------------|
| Flappy Bird | Tap to fly, avoid pipes | Easy | One-button, instant retry, addictive |
| Endless Runner | Auto-run, jump obstacles, collect coins | Easy | Fast-paced, coins to collect |
| 2048 | Slide tiles, merge numbers to reach 2048 | Medium | Puzzle satisfaction, "just one more" |
| Snake | Eat food, grow longer, don't hit yourself | Easy | Classic, simple controls |
| Memory Match | Flip cards, find matching pairs | Easy | Brain game, works for young kids |
| Cookie Clicker | Tap to earn cookies, buy upgrades | Easy | Numbers go up = dopamine |
| Platformer | Jump on platforms, collect stars | Medium | Like Mario, exploration |

### Implementation Notes
- All games should work with touch (mobile) and keyboard (desktop)
- Big, kid-friendly UI with celebrations on achievements
- Auto-save progress to localStorage
- No ads, no in-app purchases

---

## Board Games

Classic strategy games with AI opponents.

| Game | Description | Library/Approach |
|------|-------------|------------------|
| Chess | Classic chess with AI opponent | [chessboard.js](https://chessboardjs.com/) + [chess.js](https://github.com/jhlywa/chess.js) |
| Checkers | Classic checkers with jump rules | [codethejason/checkers](https://github.com/codethejason/checkers) |
| Quoridor | Move pawn + place walls to block opponent | Build from scratch (9x9 grid) |

### Quoridor Rules
- 9x9 board
- Each player has 1 pawn + 10 walls
- On your turn: move pawn one space OR place a wall
- Walls block paths (but can't completely trap opponent)
- Win by reaching the opposite side first
- Won Mensa Mind Game award 1997

---

## Classic Games (Ports)

Nostalgic games with existing open-source implementations.

| Game | Description | Source |
|------|-------------|--------|
| Oregon Trail | Classic survival/travel game | [attilabuti/Oregon-Trail-Browser](https://github.com/attilabuti/Oregon-Trail-Browser) or [nsafai/Oregon-Trail-Game](https://github.com/nsafai/Oregon-Trail-Game) |

---

## Retro Arcade (Emulators)

Embed classic console emulators for NES, SNES, Game Boy, and more.

### Primary Tool
**[EmulatorJS](https://github.com/EmulatorJS/EmulatorJS)** - Self-hosted JavaScript emulation
- Built on optimized RetroArch/libretro cores
- Designed as embeddable plugin
- Built-in virtual gamepad for mobile
- No backend required

### Supported Systems
- NES (Nintendo Entertainment System)
- SNES (Super Nintendo)
- Game Boy / Game Boy Color
- Game Boy Advance
- Sega Genesis / Mega Drive
- N64 (limited, memory intensive)

### Legal ROM Sources (Homebrew)

| Source | Content |
|--------|---------|
| [Homebrew Hub](https://hh.gbdev.io/) | 1,564 homebrew games - GB, GBA, NES |
| [Internet Archive RetroPie Collection](https://archive.org/details/retro-pie-homebrew-collection) | Bulk download - all systems |
| [Romhacking.net Homebrew](https://www.romhacking.net/homebrew/) | Community homebrew |
| [SNES Central](https://snescentral.com/homebrew.php) | SNES demos and homebrew |
| [PDRoms](https://pdroms.de/) | Public domain ROMs |
| [Zophar's Domain](https://www.zophar.net/pdroms/nes.html) | NES public domain |

### User Uploads
Allow kids to upload their own ROMs (stored in browser localStorage/IndexedDB).

### Implementation Notes
- Pre-load a curated selection of quality homebrew games
- Categories: Action, Puzzle, Sports, Adventure
- Save states stored locally
- Touch controls overlay for mobile

---

## Apps

Simple, fun utilities that kids enjoy.

| App | Description | Why Kids Like It |
|-----|-------------|------------------|
| Weather | Fun weather with kid graphics, outfit suggestions | "What should I wear today?" |
| Joke Generator | Random kid-friendly jokes | Instant laughs, shareable with friends |
| Toy Finder | Trending toys right now | "What do I want for my birthday?" |

### Weather App Ideas
- Animated weather icons (sun with sunglasses, cloud crying rain)
- Outfit recommendations based on temperature
- Fun facts about the weather

### Joke Generator Ideas
- Dad jokes, knock-knock jokes, puns
- Share button to copy joke
- Rate jokes (funny/not funny)

### Toy Finder Ideas
- Pull from Amazon/Target trending toys API
- Filter by age, category
- Wishlist feature

---

## Priority Order

When building new games, prioritize by:

1. **Quick Wins** (Easy to build, high engagement)
   - 2048
   - Snake
   - Memory Match
   - Flappy Bird

2. **Medium Effort** (Moderate complexity)
   - Chess (using libraries)
   - Checkers (using libraries)
   - Cookie Clicker
   - Endless Runner

3. **Larger Projects** (More complex)
   - Retro Arcade (EmulatorJS integration)
   - Oregon Trail (port existing)
   - Quoridor (build from scratch)
   - Platformer (custom engine)

4. **Apps** (When variety is needed)
   - Joke Generator (simplest)
   - Weather (needs API)
   - Toy Finder (needs API + scraping)

---

## User Data & Persistence

All games and apps integrate with the platform's auth/persistence system for logged-in users.

### Key Files
| Component | Path |
|-----------|------|
| DB Schema | `packages/db/src/schema/app-progress.ts` |
| API Route | `apps/web/src/app/api/progress/[appId]/route.ts` |
| Sync Hook | `apps/web/src/shared/hooks/useAuthSync.ts` |
| UI Components | `apps/web/src/shared/components/{GuestWarning,SyncIndicator,LoginButton}.tsx` |

### Adding a New Game/App

1. **Add to VALID_APP_IDS** in `packages/db/src/schema/app-progress.ts`:
```typescript
export const VALID_APP_IDS = [
  "hill-climb",
  "monster-truck",
  "weather",
  "your-new-app",  // Add here
] as const;
```

2. **No database migration needed** - uses JSONB blob storage

3. **Integrate useAuthSync hook** in game component:
```typescript
const { isGuest, syncStatus, lastSynced } = useAuthSync({
  appId: "your-app-id",
  localStorageKey: "your-app-state",
  getState: () => currentState,
  setState: (data) => updateState(data),
  debounceMs: 2000,
});
```

4. **Add UI components**:
```tsx
<GuestWarning />  {/* Shows "Playing as Guest" warning */}
<SyncIndicator status={syncStatus} lastSynced={lastSynced} />
```

### Data Structure Pattern

Each game's persisted state should include:
```typescript
interface GameState {
  // Required for merge resolution
  updatedAt: number;  // Unix timestamp

  // Game-specific data
  highScore: number;
  level: number;
  coins: number;
  unlockedItems: string[];
  preferences: {
    soundEnabled: boolean;
    // ...
  };
}
```

### Behavior

| User Type | Storage | Sync |
|-----------|---------|------|
| Guest | localStorage only | None |
| Logged In | localStorage + DB | Auto-save every 2s |

- **On login**: Merges localStorage with DB (last-write-wins)
- **On logout**: Clears localStorage
- **Offline**: Falls back to localStorage, syncs when online

---

## Design Requirements (All Games)

Per CLAUDE.md and ARCHITECTURE.md:

- **Big buttons** (44x44px minimum) - small fingers
- **Bright colors** - blue (primary), green (secondary), orange (accent)
- **Simple navigation** - minimal clicks
- **Celebrations** - confetti/particles when winning
- **Sound effects** - satisfying feedback
- **Auto-recovery** - don't punish failures harshly
- **Mobile-first** - touch controls, responsive
- **No auth required** - instant play
- **Local storage** - save progress without accounts

---

## Research Sources

- [EmulatorJS GitHub](https://github.com/EmulatorJS/EmulatorJS)
- [Homebrew Hub](https://hh.gbdev.io/)
- [chessboard.js](https://chessboardjs.com/)
- [Quoridor Wikipedia](https://en.wikipedia.org/wiki/Quoridor)
- [Oregon Trail GitHub](https://github.com/attilabuti/Oregon-Trail-Browser)
- [PDRoms](https://pdroms.de/)
- [MomJunction - Online Games for Kids](https://www.momjunction.com/articles/online-games-websites_00465432/)
- [Plays.org](https://plays.org/)
- [itch.io Endless Runner Games](https://itch.io/games/tag-endless-runner)
