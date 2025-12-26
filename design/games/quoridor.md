# Quoridor - Game Design Document

## Overview

**Quoridor** is a two-player abstract strategy board game where players race to reach the opposite side of the board while strategically placing walls to block their opponent. Originally designed by Mirko Marchesi in 1997, it's a perfect blend of simple rules and deep strategy that kids can learn in minutes but will keep them thinking for years.

**Why Kids Love It:**
- **Easy to learn** - Only two choices per turn: move or place a wall
- **Strategic depth** - Simple rules, complex tactics
- **Head-to-head competition** - Direct competition against a friend or AI
- **Quick games** - 10-15 minutes per match
- **No luck** - Pure skill, no dice or random cards
- **Visible progress** - Watch your pawn get closer to victory!
- **"Gotcha!" moments** - Blocking your opponent feels satisfying

**Target Player**: Hank Neil (age 8) and kids 6-14
**Platform**: Web (mobile + desktop)
**Style**: Colorful pawns, wooden board aesthetic, friendly AI

---

## Core Loop

```
YOUR TURN
    |
    v
CHOOSE: Move your pawn OR Place a wall
    |
    +---> MOVE: Step one space (up, down, left, right)
    |         - Can jump over adjacent opponent
    |
    +---> WALL: Place a 2-space wall to block paths
              - Must not completely block anyone from winning
    |
    v
CHECK: Did you reach the opposite row?
    |
    +--> YES: YOU WIN!
    |
    +--> NO: Opponent's turn
    |
    v
REPEAT until someone wins
```

### Why This Loop Works

Based on Quoridor's award-winning design (Mensa Select winner):
- **Binary choice** - Only two options keeps decisions fast for kids
- **Direct conflict** - You're directly affecting your opponent's path
- **Clear objective** - Get to the other side first (super easy to understand)
- **Visible progress** - Both players see each other getting closer
- **Limited resources** - Only 10 walls each creates tension
- **No stalemates** - Someone MUST win (no draws possible)
- **Comeback potential** - A well-placed wall can flip the game

---

## Game Rules (Complete)

### The Board

- **9x9 grid** of squares (81 total squares)
- Squares are where **pawns** can stand
- Between squares are **grooves** where walls can be placed
- There are 8x9 = 72 horizontal grooves and 9x8 = 72 vertical grooves

```
    A   B   C   D   E   F   G   H   I
  +---+---+---+---+---+---+---+---+---+
9 |   |   |   |   | P2|   |   |   |   |  <-- Player 2 starts here (row 9)
  +---+---+---+---+---+---+---+---+---+
8 |   |   |   |   |   |   |   |   |   |
  +---+===+===+---+---+---+---+---+---+  <-- Example wall between rows 7-8
7 |   |   |   |   |   |   |   |   |   |
  +---+---+---+---+---+---+---+---+---+
6 |   |   |   |   |   |   |   |   |   |
  +---+---+---+---+---+---+---+---+---+
5 |   |   |   |   |   |   |   |   |   |  <-- Center
  +---+---+---+---+---+---+---+---+---+
4 |   |   |   |   |   |   |   |   |   |
  +---+---+---+---+---+---+---+---+---+
3 |   |   |   |   |   |   |   |   |   |
  +---+---+---+---+---+---+---+---+---+
2 |   |   |   |   |   |   |   |   |   |
  +---+---+---+---+---+---+---+---+---+
1 |   |   |   |   | P1|   |   |   |   |  <-- Player 1 starts here (row 1)
  +---+---+---+---+---+---+---+---+---+
```

### Setup

- Each player starts with **1 pawn** and **10 walls**
- **Player 1** (blue) starts in the center of row 1 (E1)
- **Player 2** (orange) starts in the center of row 9 (E9)
- Player 1 moves first

### Movement Rules

1. **Basic Move**: Move your pawn one square orthogonally (up, down, left, right)
   - Cannot move diagonally
   - Cannot move through walls
   - Cannot move off the board

2. **Jump Rule**: If your pawn is adjacent to the opponent's pawn:
   - You may jump over them to the square directly behind them
   - If that square is blocked (wall or edge), you may move diagonally to either side
   - You cannot land on the opponent's square

```
Normal Move:          Jump Over:           Diagonal Jump (if blocked):
+---+---+---+         +---+---+---+        +---+---+---+
|   | X |   |         |   | O |   |        |   | O | X |
+---+---+---+         +---+---+---+        +---+===+===+  <-- Wall blocks straight jump
|   | P |   |   -->   | X | P | X |   -->  | X | P | X |
+---+---+---+         +---+---+---+        +---+---+---+
|   | X |   |         |   | X |   |        |   | X |   |
+---+---+---+         +---+---+---+        +---+---+---+

P = Your pawn, O = Opponent, X = Valid moves
```

### Wall Placement Rules

1. **Wall Size**: Each wall is **2 squares wide** (blocks passage between 4 squares total)

2. **Orientation**: Walls can be placed **horizontally** (blocking up/down movement) or **vertically** (blocking left/right movement)

3. **Wall Limit**: Each player has exactly **10 walls** for the entire game
   - Once placed, walls cannot be moved
   - When you run out, you can only move your pawn

4. **Valid Placement**:
   - Walls must be placed in the grooves between squares
   - Walls cannot overlap or cross other walls
   - Walls cannot extend off the board

5. **CRITICAL RULE - Path Must Exist**:
   - **A wall placement is ILLEGAL if it completely blocks ANY player from reaching their goal**
   - Both players must always have at least one path to their goal row
   - This is validated using BFS (Breadth-First Search) pathfinding

```
ILLEGAL wall placement example:
+---+---+---+
|   | P2|   |
+---+===+---+
|===|===|===|  <-- This would trap P2 with no path to row 1
+---+---+---+
|   |   |   |
+---+---+---+
```

### Winning

- **Player 1 wins** by reaching any square in row 9 (opponent's starting row)
- **Player 2 wins** by reaching any square in row 1 (opponent's starting row)
- **No draws** - game continues until someone wins

---

## Controls

### Mobile (Touch)

```
+------------------------------------------+
|  [YOUR TURN]     Walls: 8                |
|                                          |
|   +---+---+---+---+---+---+---+---+---+  |
|   |   |   |   |   | O |   |   |   |   |  |
|   +---+---+---+---+---+---+---+---+---+  |
|   |   |   |   |   |   |   |   |   |   |  |
|   +---+---+---+---+---+---+---+---+---+  |
|   |   |   |   |   |   |   |   |   |   |  |
|   +---+---+---+---+---+---+---+---+---+  |
|   |   |   |   | P |   |   |   |   |   |  |
|   +---+---+---+---+---+---+---+---+---+  |
|   |   |   |   |   |   |   |   |   |   |  |
|   +---+---+---+---+---+---+---+---+---+  |
|                                          |
|  [MOVE MODE]    [WALL MODE]              |
|                                          |
+------------------------------------------+
```

**Touch Controls:**
- **Tap a square**: Move your pawn there (if valid)
- **Tap "WALL MODE" button**: Enter wall placement mode
- **In wall mode**:
  - Tap and drag on groove between squares
  - Wall preview shows before placement
  - Tap to confirm, drag to adjust
  - Tap "MOVE MODE" to cancel
- **Touch targets**: All buttons 60x60px minimum

### Desktop (Mouse/Keyboard)

| Input | Action |
|-------|--------|
| Click square | Move pawn to that square (if valid) |
| Click groove | Place wall at that position |
| Hover groove | Preview wall placement |
| Right-click / R | Toggle wall orientation (H/V) |
| Arrow keys | Move pawn |
| U / Ctrl+Z | Undo last move (in practice mode) |
| N | New Game |
| Escape | Cancel wall placement |

---

## Progression System

### Win/Loss Tracking

```typescript
interface QuoridorState {
  // Required for sync
  updatedAt: number;            // Unix timestamp

  // Stats
  gamesPlayed: number;          // Total games played
  gamesWon: number;             // Games won
  gamesLost: number;            // Games lost
  currentWinStreak: number;     // Current consecutive wins
  bestWinStreak: number;        // Best win streak ever

  // Performance metrics
  totalWallsUsed: number;       // Total walls placed across all games
  totalMovesToWin: number;      // Total moves made in winning games
  fastestWin: number | null;    // Fewest moves to win

  // AI difficulty progression
  highestDifficultyBeaten: 'easy' | 'medium' | 'hard' | 'expert' | null;

  // Preferences
  preferences: {
    soundEnabled: boolean;
    showValidMoves: boolean;      // Highlight where you can move
    showPathHint: boolean;        // Show shortest path to goal
    boardTheme: 'wood' | 'colorful' | 'minimal';
  };
}
```

### Computed Stats (for display)

| Stat | Calculation |
|------|-------------|
| Win Rate | `(gamesWon / gamesPlayed) * 100%` |
| Average Walls Used | `totalWallsUsed / gamesPlayed` |
| Average Moves to Win | `totalMovesToWin / gamesWon` |

### Achievements

| Achievement | Condition | Badge |
|-------------|-----------|-------|
| First Steps | Win your first game | Bronze pawn |
| Wall Builder | Use all 10 walls in a single game | Wall icon |
| Speed Runner | Win in under 15 moves | Lightning bolt |
| Streak Master | Win 5 games in a row | Fire icon |
| Strategy King | Beat "Hard" AI | Crown |
| Unstoppable | Beat "Expert" AI | Star |
| No Walls Needed | Win without placing any walls | Open hands |
| Perfect Game | Win against AI that used all its walls | Trophy |

---

## Features (Priority Order)

### MVP (Phase 1) - Core Game

- [ ] 9x9 board rendering with grid
- [ ] Two pawns with distinct colors (blue/orange)
- [ ] Pawn movement with click/tap
- [ ] Wall placement UI (click groove, preview, confirm)
- [ ] Wall collision detection
- [ ] **BFS pathfinding for wall validation** (critical!)
- [ ] Jump-over opponent logic
- [ ] Diagonal jump when blocked
- [ ] Win detection (reach opposite row)
- [ ] Turn indicator
- [ ] Wall count display (remaining walls per player)
- [ ] Basic AI opponent (random valid moves)

### Phase 2 - Playable Game

- [ ] Valid move highlighting (show where pawn can go)
- [ ] Wall preview on hover/touch
- [ ] Invalid wall feedback (shake + message if blocks path)
- [ ] Move/wall placement animations
- [ ] Sound effects (move, wall place, win, error)
- [ ] Undo button (single undo in casual mode)
- [ ] New Game button
- [ ] Game over screen with stats

### Phase 3 - AI Opponent

- [ ] Easy AI: Random moves, random walls
- [ ] Medium AI: Prioritizes moving toward goal, basic blocking
- [ ] Hard AI: Minimax with alpha-beta pruning (depth 2-3)
- [ ] Expert AI: Deeper search + positional evaluation
- [ ] AI difficulty selector
- [ ] AI "thinking" indicator

### Phase 4 - Persistence & Polish

- [ ] Add "quoridor" to VALID_APP_IDS
- [ ] Save stats to localStorage
- [ ] useAuthSync integration
- [ ] Guest warning component
- [ ] Sync indicator
- [ ] Path highlight toggle (show shortest path)
- [ ] Board themes (wood, colorful, minimal)
- [ ] Celebration on win (confetti for player, sad animation for AI)

### Nice-to-Have (Future)

- [ ] Local 2-player mode (pass and play)
- [ ] Online multiplayer (WebSocket)
- [ ] Move history panel with replay
- [ ] Tutorial mode with guided lessons
- [ ] Different board sizes (7x7 for quick games)
- [ ] Tournament mode (best of 3/5)

---

## Technical Approach

### Stack

```
Next.js 16 + React 19
TypeScript
CSS Grid for board layout
Zustand for game state
BFS algorithm for path validation
useAuthSync hook for persistence
```

### Why CSS Grid (Not Canvas)?

For a 9x9 board game like Quoridor, CSS Grid is ideal:
- Simple grid layout for 81 squares
- Easy hover states and click targets
- Smooth CSS transitions for animations
- Better accessibility (keyboard navigation)
- Responsive design with CSS
- No complex rendering logic

Canvas would be overkill for a turn-based board game.

### Core Data Structures

```typescript
// Board position
type Position = {
  row: number;  // 0-8 (0 = bottom, 8 = top)
  col: number;  // 0-8 (0 = left, 8 = right)
};

// Wall definition
type Wall = {
  row: number;      // Row of the wall's starting point
  col: number;      // Column of the wall's starting point
  orientation: 'horizontal' | 'vertical';
};

// Player
type Player = 1 | 2;

// Game state
type GameState = {
  currentPlayer: Player;
  positions: { [K in Player]: Position };
  walls: Wall[];
  wallsRemaining: { [K in Player]: number };
  winner: Player | null;
  moveHistory: Move[];
};

// A move is either a pawn move or a wall placement
type Move =
  | { type: 'move'; to: Position }
  | { type: 'wall'; wall: Wall };
```

### Core Game Logic Functions

```typescript
// Check if a pawn move is valid
function isValidMove(state: GameState, from: Position, to: Position): boolean;

// Check if a wall placement is valid (including BFS path check)
function isValidWallPlacement(state: GameState, wall: Wall): boolean;

// BFS to check if player can reach their goal
function canReachGoal(state: GameState, player: Player): boolean;

// Get all valid moves for current player
function getValidMoves(state: GameState): Position[];

// Get all valid wall placements for current player
function getValidWalls(state: GameState): Wall[];

// Apply a move and return new state
function applyMove(state: GameState, move: Move): GameState;

// Check if game is over
function checkWinner(state: GameState): Player | null;

// Get shortest path length to goal (for AI heuristic)
function getShortestPathLength(state: GameState, player: Player): number;
```

### BFS Path Validation (Critical Algorithm)

```typescript
/**
 * Uses Breadth-First Search to determine if a player can reach their goal row.
 * This MUST be called before placing any wall to ensure legality.
 */
function canReachGoal(state: GameState, player: Player): boolean {
  const goalRow = player === 1 ? 8 : 0;  // P1 goes up, P2 goes down
  const start = state.positions[player];

  const visited = new Set<string>();
  const queue: Position[] = [start];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const key = `${current.row},${current.col}`;

    if (visited.has(key)) continue;
    visited.add(key);

    // Reached goal row!
    if (current.row === goalRow) return true;

    // Check all 4 directions
    for (const neighbor of getNeighbors(current, state)) {
      if (!visited.has(`${neighbor.row},${neighbor.col}`)) {
        queue.push(neighbor);
      }
    }
  }

  return false;  // No path found
}

/**
 * Get valid neighboring squares (respecting walls)
 */
function getNeighbors(pos: Position, state: GameState): Position[] {
  const neighbors: Position[] = [];

  // Up
  if (pos.row < 8 && !isBlockedByWall(pos, { row: pos.row + 1, col: pos.col }, state)) {
    neighbors.push({ row: pos.row + 1, col: pos.col });
  }
  // Down
  if (pos.row > 0 && !isBlockedByWall(pos, { row: pos.row - 1, col: pos.col }, state)) {
    neighbors.push({ row: pos.row - 1, col: pos.col });
  }
  // Right
  if (pos.col < 8 && !isBlockedByWall(pos, { row: pos.row, col: pos.col + 1 }, state)) {
    neighbors.push({ row: pos.row, col: pos.col + 1 });
  }
  // Left
  if (pos.col > 0 && !isBlockedByWall(pos, { row: pos.row, col: pos.col - 1 }, state)) {
    neighbors.push({ row: pos.row, col: pos.col - 1 });
  }

  return neighbors;
}
```

### AI Strategy (Minimax)

```typescript
/**
 * Simple heuristic for AI evaluation:
 * - Lower = better for the player
 * - Uses difference in shortest path lengths
 */
function evaluatePosition(state: GameState, player: Player): number {
  const myPath = getShortestPathLength(state, player);
  const opponentPath = getShortestPathLength(state, player === 1 ? 2 : 1);

  // Prefer positions where we're closer to goal than opponent
  return myPath - opponentPath;
}

/**
 * Minimax with alpha-beta pruning for AI decisions
 */
function minimax(
  state: GameState,
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: boolean
): { score: number; move: Move | null };
```

---

## Code Sources

### Primary References

| Repo | URL | Notes |
|------|-----|-------|
| quoridor-ai | [github.com/danielborowski/quoridor-ai](https://github.com/danielborowski/quoridor-ai) | JavaScript AI with pathfinding |
| quoridor-AI (TypeScript) | [github.com/ir5/quoridor-AI](https://github.com/ir5/quoridor-AI) | TypeScript implementation with AI |
| ranjez/Quoridor | [github.com/ranjez/Quoridor](https://github.com/ranjez/Quoridor) | Clean JavaScript implementation |
| LoicE5/Quoridor | [github.com/LoicE5/Quoridor](https://github.com/LoicE5/Quoridor) | Simple HTML/CSS/JS example |
| btpost/Quoridor | [github.com/btpost/Quoridor](https://github.com/btpost/Quoridor) | Phaser 3 game framework example |
| imevs/quoridor | [github.com/imevs/quoridor](https://github.com/imevs/quoridor) | Online version with SVG graphics |
| QuoridorOnline | [github.com/QuoridorOnline/quoridoronline.github.io](https://github.com/QuoridorOnline/quoridoronline.github.io) | Browser-based implementation |

### Algorithm References

| Resource | URL | Notes |
|----------|-----|-------|
| Quoridor Rules | [officialgamerules.org/game-rules/quoridor/](https://officialgamerules.org/game-rules/quoridor/) | Official rules breakdown |
| Quoridor Strategy | [quoridorstrats.wordpress.com](https://quoridorstrats.wordpress.com/category/strategy/) | Strategy guides |
| Quoridor Wikipedia | [en.wikipedia.org/wiki/Quoridor](https://en.wikipedia.org/wiki/Quoridor) | Game history and rules |
| BFS Pathfinding | [PathFinding.js](https://qiao.github.io/PathFinding.js/visual/) | Visual BFS demonstration |

### Key Implementation Insights

From studying these repos:

1. **Board Representation**: Use a 9x9 grid for squares, separate data structure for walls
2. **Wall Validation**: BFS is the standard approach - check both players can reach goals
3. **AI Difficulty**:
   - Easy: Random valid moves
   - Medium: Shortest path priority
   - Hard: Minimax depth 2-3
   - Expert: Minimax depth 4+ with opening book
4. **Adjacency List**: Makes wall-blocked neighbor checking O(1) instead of iterating all walls

---

## Kid-Friendly Design

### Visual Design

- **Large board squares** - At least 40x40px on mobile, 60x60px on desktop
- **Distinct pawn colors** - Blue (P1) vs Orange (P2), high contrast
- **Wood board theme** - Default warm, friendly aesthetic
- **Clear wall preview** - Semi-transparent wall before placement
- **Glow effect** - Highlight valid squares when hovering pawn
- **Path visualization** - Optional: show shortest path as dotted line

### Board Layout

```
+------------------------------------------+
|  [PLAYER 1]          [PLAYER 2: AI]      |
|   Walls: 7              Walls: 8         |
|   Your Turn!            Thinking...      |
+------------------------------------------+
|                                          |
|   +---+---+---+---+---+---+---+---+---+  |
|   |   |   |   |   | O |   |   |   |   |  |
|   +---+---+---+---+---+---+---+---+---+  |
|   |   |   |   |===|===|   |   |   |   |  | <-- Wall example
|   +---+---+---+---+---+---+---+---+---+  |
|   |   |   |   |   |   |   |   |   |   |  |
|   +---+---+---+---+---+---+---+---+---+  |
|   ...                                    |
|   +---+---+---+---+---+---+---+---+---+  |
|   |   |   |   |   | P |   |   |   |   |  |
|   +---+---+---+---+---+---+---+---+---+  |
|                                          |
+------------------------------------------+
|  [MOVE]  [PLACE WALL]     [UNDO] [NEW]   |
+------------------------------------------+
```

### Touch Friendly

- **Large tap targets** - Entire square is tappable (no precision needed)
- **Mode buttons** - Clear MOVE / WALL MODE toggle
- **Wall placement** - Drag-and-place with snap to groove
- **Confirmation** - Walls preview before final placement
- **Undo available** - Mistake-friendly in practice mode

### Feedback & Celebration

| Event | Feedback |
|-------|----------|
| Valid move available | Square glows green on hover |
| Invalid move | Red flash + shake |
| Wall placed | Satisfying "click" sound + wall slides in |
| Invalid wall | Red X, shake, "This would block their path!" |
| Opponent blocked | "Great wall!" encouragement |
| Player wins | Confetti explosion + "YOU WIN!" banner |
| Player loses | "Good game! Try again?" prompt |
| AI thinking | Animated dots + "Thinking..." |

### Sound Effects

| Event | Sound |
|-------|-------|
| Pawn move | Soft "tap" |
| Wall place | Wood "click" |
| Invalid action | Error buzz |
| Win | Victory fanfare |
| Lose | Gentle "aww" |
| Turn change | Subtle chime |
| AI thinking | Quiet ticking (optional) |

### Accessibility

- **Keyboard navigation** - Arrow keys to select squares, Enter to confirm
- **Screen reader** - Announce moves and board state
- **Color blind mode** - Patterns on pawns, not just colors
- **Move hints** - Option to show valid moves always

---

## File Structure

Following the compartmentalized pattern from CLAUDE.md:

```
apps/web/src/
├── app/
│   └── games/
│       └── quoridor/
│           └── page.tsx                  # Just imports from src/games/quoridor
│
├── games/
│   └── quoridor/                         # SELF-CONTAINED game module
│       ├── components/
│       │   ├── Board.tsx                 # 9x9 grid with squares and grooves
│       │   ├── Square.tsx                # Individual board square
│       │   ├── Pawn.tsx                  # Player pawn component
│       │   ├── Wall.tsx                  # Placed wall component
│       │   ├── WallPreview.tsx           # Ghost wall during placement
│       │   ├── PlayerInfo.tsx            # Player name, walls remaining, turn
│       │   ├── ModeToggle.tsx            # Move/Wall mode selector
│       │   ├── GameControls.tsx          # New Game, Undo buttons
│       │   ├── DifficultySelector.tsx    # AI difficulty picker
│       │   ├── WinScreen.tsx             # Victory celebration
│       │   └── LoseScreen.tsx            # Try again prompt
│       │
│       ├── hooks/
│       │   ├── useQuoridorGame.ts        # Main game logic hook
│       │   ├── useAI.ts                  # AI opponent logic
│       │   ├── useGamePersistence.ts     # localStorage + auth sync
│       │   └── useKeyboardControls.ts    # Arrow key navigation
│       │
│       ├── lib/
│       │   ├── store.ts                  # Zustand store
│       │   ├── gameLogic.ts              # Pure game logic functions
│       │   ├── pathfinding.ts            # BFS implementation
│       │   ├── ai.ts                     # Minimax AI
│       │   ├── constants.ts              # Board size, colors, etc.
│       │   └── sounds.ts                 # Sound effect handlers
│       │
│       ├── types/
│       │   └── index.ts                  # TypeScript types
│       │
│       ├── styles/
│       │   └── board.css                 # Board styling
│       │
│       ├── __tests__/
│       │   ├── gameLogic.test.ts         # Unit tests for game rules
│       │   ├── pathfinding.test.ts       # BFS tests
│       │   ├── ai.test.ts                # AI tests
│       │   └── Game.test.tsx             # Component tests
│       │
│       ├── Game.tsx                      # Main game component
│       └── index.ts                      # Exports
│
└── public/
    └── games/
        └── quoridor/
            └── sounds/
                ├── move.mp3
                ├── wall.mp3
                ├── error.mp3
                ├── win.mp3
                └── lose.mp3
```

### Route File (Thin)

```typescript
// apps/web/src/app/games/quoridor/page.tsx
import dynamic from 'next/dynamic';

const QuoridorGame = dynamic(
  () => import('@/games/quoridor').then(mod => mod.Game),
  { ssr: false }
);

export default function Page() {
  return <QuoridorGame />;
}
```

---

## User Data & Persistence

### App ID

```
appId: "quoridor"
```

### VALID_APP_IDS Update

Add `"quoridor"` to `packages/db/src/schema/app-progress.ts`:

```typescript
export const VALID_APP_IDS = [
  "hill-climb",
  "monster-truck",
  "weather",
  "2048",
  "quoridor",  // <-- Add this
] as const;
```

### What to Save

| Field | Type | Description |
|-------|------|-------------|
| `updatedAt` | `number` | Unix timestamp for merge resolution |
| `gamesPlayed` | `number` | Total games played |
| `gamesWon` | `number` | Total games won |
| `gamesLost` | `number` | Total games lost |
| `currentWinStreak` | `number` | Current consecutive wins |
| `bestWinStreak` | `number` | Best win streak ever |
| `totalWallsUsed` | `number` | Total walls placed (for avg calculation) |
| `totalMovesToWin` | `number` | Total moves in winning games |
| `fastestWin` | `number \| null` | Fewest moves to win |
| `highestDifficultyBeaten` | `string \| null` | Best AI beaten |
| `preferences` | `object` | Sound, hints, theme settings |

### useAuthSync Integration

```typescript
// games/quoridor/hooks/useGamePersistence.ts
import { useAuthSync } from '@/shared/hooks/useAuthSync';
import { useGameStore } from '../lib/store';

export function useGamePersistence() {
  const getState = useGameStore((state) => state.getPersistedState);
  const setState = useGameStore((state) => state.setPersistedState);

  const { isGuest, syncStatus, lastSynced, forceSync } = useAuthSync({
    appId: 'quoridor',
    localStorageKey: 'quoridor-game-state',
    getState,
    setState,
    debounceMs: 3000,  // Sync every 3 seconds
  });

  return { isGuest, syncStatus, lastSynced, forceSync };
}
```

### Behavior Summary

| User Type | Storage | Sync |
|-----------|---------|------|
| Guest | localStorage only | None |
| Logged In | localStorage + Database | Auto-save after each game |

- **On login**: Merges localStorage with DB (takes higher stats)
- **On logout**: Clears localStorage
- **After each game**: Stats updated and synced

---

## Implementation Phases

### Phase 1: Core Board & Movement (MVP)

**Goal**: Two pawns can move on a 9x9 board

1. Create file structure under `apps/web/src/games/quoridor/`
2. Implement types (`Position`, `Wall`, `GameState`, `Move`)
3. Build `Board.tsx` with 9x9 CSS Grid
4. Build `Square.tsx` with click handlers
5. Build `Pawn.tsx` with position and color
6. Implement basic pawn movement (no walls yet)
7. Add turn-based logic (alternate players)
8. Detect win condition (reach opposite row)
9. Add basic AI (random valid moves)

**Deliverable**: Basic playable game without walls

### Phase 2: Wall System

**Goal**: Full wall placement with validation

1. Implement `Wall` type and wall storage
2. Build groove grid overlay for wall placement
3. Implement `WallPreview.tsx` for placement preview
4. Implement `isBlockedByWall()` function
5. Update movement to respect walls
6. Implement BFS pathfinding (`canReachGoal()`)
7. Implement wall validation (`isValidWallPlacement()`)
8. Add wall count display
9. Write comprehensive tests for pathfinding

**Deliverable**: Complete Quoridor rules implemented

### Phase 3: Polish & AI

**Goal**: Fun, polished gameplay with smart AI

1. Add valid move highlighting
2. Add animations (pawn slide, wall drop)
3. Add sound effects
4. Implement jump-over opponent logic
5. Implement diagonal jump when blocked
6. Implement Easy AI (random)
7. Implement Medium AI (shortest path priority)
8. Implement Hard AI (minimax depth 2)
9. Add difficulty selector
10. Add win/lose screens with animations

**Deliverable**: Polished game with 3 AI difficulties

### Phase 4: Persistence & Extras

**Goal**: Stats persistence and kid-friendly polish

1. Add "quoridor" to VALID_APP_IDS
2. Implement Zustand store with persistence
3. Integrate useAuthSync hook
4. Add GuestWarning and SyncIndicator
5. Implement stats tracking
6. Add path hint toggle
7. Add board themes
8. Add undo button
9. Add achievements

**Deliverable**: Complete game with cloud save

---

## Success Metrics

How do we know the game is good?

1. **Hank understands rules in < 2 minutes** - Simple enough for 8-year-olds
2. **Hank beats Easy AI first try** - Not frustrating
3. **Hank struggles with Medium AI** - Provides challenge
4. **Hank asks for "one more game"** - It's actually fun
5. **Hank learns wall blocking strategy** - Depth is discoverable
6. **Hank tries to beat his best streak** - Stats motivate replay
7. **No bugs with path blocking** - BFS always correct

---

## Testing Requirements

### Unit Tests (Critical)

```typescript
// tests for pathfinding.ts
describe('canReachGoal', () => {
  test('returns true when path is clear');
  test('returns true when path goes around walls');
  test('returns false when completely blocked');
  test('handles complex wall configurations');
});

// tests for gameLogic.ts
describe('isValidMove', () => {
  test('allows adjacent moves');
  test('blocks moves through walls');
  test('allows jumping over opponent');
  test('allows diagonal jump when straight blocked');
});

describe('isValidWallPlacement', () => {
  test('allows valid wall placement');
  test('blocks overlapping walls');
  test('blocks path-blocking walls');
  test('validates both players can reach goal');
});
```

### Integration Tests

- Game renders without errors
- Click on square moves pawn
- Wall placement shows preview
- Invalid wall shows error
- Win screen appears on victory
- AI makes valid moves

---

## References

- [Quoridor Official Rules](https://officialgamerules.org/game-rules/quoridor/) - Complete rules
- [Quoridor Wikipedia](https://en.wikipedia.org/wiki/Quoridor) - History and strategy
- [Quoridor Strategy Guide](https://quoridorstrats.wordpress.com/category/strategy/) - Advanced tactics
- [danielborowski/quoridor-ai](https://github.com/danielborowski/quoridor-ai) - JavaScript AI reference
- [ir5/quoridor-AI](https://github.com/ir5/quoridor-AI) - TypeScript implementation
- [PathFinding.js](https://qiao.github.io/PathFinding.js/visual/) - BFS visualization
- [BoardGameGeek Quoridor](https://boardgamegeek.com/boardgame/624/quoridor) - Community discussion
