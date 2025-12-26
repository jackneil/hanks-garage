# Checkers - Game Design Document

## Overview

**Checkers** (also known as English Draughts) is a classic 2-player strategy board game where players move pieces diagonally, capture opponents by jumping over them, and race to eliminate all enemy pieces or block them from moving.

**Why Kids Love It:**
- **Simpler than chess** - only diagonal moves, no special piece abilities to memorize
- **Satisfying captures** - jumping over pieces and removing them feels powerful
- **Multi-jump combos** - chain multiple jumps for "wow" moments
- **King promotion** - reaching the other side and getting "crowned" is exciting
- **Quick to learn** - can start playing in under 2 minutes

**Target Player**: Hank Neil, age 8 (and kids 6-14)
**Platform**: Web (mobile + desktop)
**Style**: Clean, colorful 2D board with big, chunky pieces

---

## Core Game Loop

```
SELECT a piece (tap/click)
    |
HIGHLIGHT valid moves (show where it can go)
    |
TAP/CLICK destination to MOVE
    |
CAPTURE enemy pieces by jumping over them
    |
Get KINGED when reaching the far row (can now move backward!)
    |
WIN by capturing all enemy pieces OR blocking them from moving
    |
CELEBRATE with confetti and victory screen
```

### Why This Loop Works
- **Clear feedback** - valid moves are highlighted, invalid moves do nothing
- **Forced captures** - when a jump is available, you MUST take it (adds strategy)
- **Visible progress** - piece counts show who's winning
- **Excitement moments** - multi-jumps and king crowning are dopamine hits

---

## Game Rules (English Draughts)

### Setup
- 8x8 board, only dark squares are used (32 playable squares)
- Each player starts with 12 pieces on their side
- Red (or light) moves first

### Movement
- Regular pieces move diagonally FORWARD one square
- Kings can move diagonally in ANY direction (forward or backward)
- Only move on dark squares

### Capturing
- Jump diagonally over an adjacent enemy piece to an empty square beyond
- The jumped piece is removed from the board
- **Mandatory jumps** - if a capture is available, you MUST take it
- **Multi-jumps** - if another jump is available after landing, you MUST continue jumping

### King Promotion
- When a piece reaches the opponent's back row, it becomes a King
- Kings are marked visually (crown icon or stacked pieces)
- Kings can move and capture in any diagonal direction

### Winning
- Capture all enemy pieces, OR
- Block all enemy pieces so they cannot move

---

## Controls

### Mobile (Touch)
```
+-------------------------------------+
|                                     |
|     [ BOARD - 8x8 grid ]            |
|                                     |
|     TAP piece = SELECT              |
|     (highlights valid moves)        |
|                                     |
|     TAP valid square = MOVE         |
|     (or tap another piece to        |
|      select it instead)             |
|                                     |
+-------------------------------------+
|  [UNDO]     Score: 12-8     [MENU]  |
+-------------------------------------+
```

- **Tap a piece** = select it (piece bounces, valid moves glow)
- **Tap a highlighted square** = move there
- **Tap another piece** = switch selection
- **Tap empty/invalid square** = deselect

### Desktop (Mouse)
- **Click** = same as tap
- **Hover** = subtle highlight on selectable pieces
- **Drag & drop** (optional enhancement) = drag piece to destination

---

## Features (Priority Order)

### MVP (Must Have)
1. **8x8 board rendering** - classic checkerboard with clear dark/light squares
2. **Piece rendering** - red and black (or two kid-friendly colors) circular pieces
3. **Piece selection** - tap/click to select, visual feedback
4. **Valid move highlighting** - glow/highlight squares where selected piece can go
5. **Basic movement** - pieces move diagonally forward
6. **Capture logic** - jump over enemy pieces to remove them
7. **Mandatory jump enforcement** - must capture when available
8. **Multi-jump support** - chain captures in one turn
9. **King promotion** - crown pieces that reach the back row
10. **King movement** - kings can move backward
11. **Win detection** - detect when all enemy pieces captured or blocked
12. **Turn indicator** - clearly show whose turn it is
13. **Piece counter** - show "Red: 8 | Black: 6" style score
14. **New Game button** - restart at any time

### Important (Post-MVP)
15. **AI opponent (Easy mode)** - random legal moves for young kids
16. **AI opponent (Medium mode)** - minimax algorithm with depth 2-3
17. **Undo move** - take back last move (with limit: 3 per game)
18. **Move hints** - button to highlight a recommended move
19. **Game history** - show list of moves made
20. **Sound effects** - piece slide, capture pop, king crown fanfare

### Nice to Have (Future)
21. **AI opponent (Hard mode)** - minimax with alpha-beta pruning, depth 5+
22. **Local 2-player mode** - pass-and-play on same device
23. **Online multiplayer** - play against friends (requires websockets)
24. **Move animations** - smooth piece sliding instead of instant teleport
25. **Captured piece display** - show eliminated pieces on the side
26. **Theme options** - different board/piece colors
27. **Tutorial mode** - guided first game for new players
28. **Achievements** - "First Win", "Triple Jump", "King Crusher"

---

## Technical Approach

### Stack
```
Next.js 16 + React 19
TypeScript
Tailwind CSS + DaisyUI
Zustand (for game state)
```

No 3D libraries needed - this is a 2D board game.

### Key Concepts

**Board State:**
```typescript
type PieceType = 'red' | 'black' | 'red-king' | 'black-king' | null;

type BoardState = PieceType[][]; // 8x8 grid

type GameState = {
  board: BoardState;
  currentPlayer: 'red' | 'black';
  selectedPiece: { row: number; col: number } | null;
  validMoves: { row: number; col: number; captures?: { row: number; col: number }[] }[];
  redPieces: number;
  blackPieces: number;
  winner: 'red' | 'black' | null;
  isMultiJumping: boolean; // true when in the middle of a multi-jump
};
```

**Game Logic Functions:**
```typescript
// Core game logic
function getValidMoves(board: BoardState, row: number, col: number): Move[];
function hasCaptures(board: BoardState, player: 'red' | 'black'): boolean;
function makeMove(state: GameState, from: Position, to: Position): GameState;
function checkWinner(board: BoardState): 'red' | 'black' | null;
function shouldPromoteToKing(row: number, player: 'red' | 'black'): boolean;

// AI
function getAIMove(board: BoardState, player: 'black', difficulty: 'easy' | 'medium' | 'hard'): Move;
function minimax(board: BoardState, depth: number, isMaximizing: boolean, alpha: number, beta: number): number;
function evaluateBoard(board: BoardState, player: 'black'): number;
```

### AI Strategy

**Easy Mode:**
- Pick a random legal move
- No look-ahead

**Medium Mode:**
- Minimax algorithm with depth 2-3
- Simple evaluation: piece count + king value (kings worth 1.5x)

**Hard Mode:**
- Minimax with alpha-beta pruning, depth 5-6
- Advanced evaluation:
  - Piece count (regular = 1, king = 1.5)
  - Position value (center control, advancement toward king row)
  - Mobility (number of available moves)

---

## Code Sources (Reference Implementations)

### Primary References

1. **codethejason/checkers** - Vanilla JavaScript, clean commented code
   - GitHub: https://github.com/codethejason/checkers
   - Good for: Board/Pieces/Tiles class structure
   - Uses: Vanilla JS + CSS
   - Features: All standard checkers rules, multi-jumping, king promotion

2. **billjeffries/jsCheckersAI** - JavaScript with Minimax AI
   - GitHub: https://github.com/billjeffries/jsCheckersAI
   - Good for: Minimax + Alpha-Beta pruning implementation
   - Uses: D3.js for visualization
   - Features: Three functions (`min_value()`, `max_value()`, `utility()`)
   - Evaluation: Piece count, king count, position values

3. **dtrinh914/react-checkers** - React + TypeScript implementation
   - GitHub: https://github.com/dtrinh914/react-checkers
   - Demo: https://dtrinh914.github.io/react-checkers/
   - Good for: React component structure, custom `useBoard` hook
   - Uses: React, TypeScript (93.4%), react-dnd for drag-drop
   - Features: useBoard hook for state + movement logic

4. **RobinRadic/checkers** - React + TypeScript + MobX
   - GitHub: https://github.com/RobinRadic/checkers
   - Good for: TypeScript type definitions, MobX state management patterns
   - Uses: React 16, TypeScript, MobX, Inversify

### Additional References

5. **b9lab/react-checkers** - Learning-focused React implementation
   - GitHub: https://github.com/b9lab/react-checkers
   - Good for: Clean beginner-friendly React patterns

6. **Gualor/checkers-minimax** - Python but great AI docs
   - GitHub: https://github.com/Gualor/checkers-minimax
   - Good for: Understanding minimax evaluation function concepts

7. **GitHub Topics - Checkers**
   - TypeScript: https://github.com/topics/checkers-game?l=typescript
   - JavaScript: https://github.com/topics/checkers?l=javascript

---

## Kid-Friendly Design

### Visual Design
- **Big chunky pieces** - minimum 50px diameter on mobile
- **High contrast colors** - red vs black (or blue vs orange for more fun)
- **Large board squares** - easy to tap without mis-clicks
- **Clear highlighting** - selected piece glows, valid moves pulse
- **Crown for kings** - visible crown icon, not just a subtle marker

### Touch Targets
- Pieces: **60x60px minimum** (bigger than standard 44px)
- Board squares: Fill available space, minimum 40x40px
- Buttons: **48x48px minimum**

### Feedback & Celebration
- **Piece bounce** when selected
- **Satisfying slide** animation when moving
- **Pop effect** when capturing enemy piece
- **Crown animation** when promoting to king
- **Confetti explosion** on win
- **Encouraging messages** - "Great jump!" "You got a King!"

### Forgiving Gameplay
- **Undo button** - let kids take back mistakes (3 per game)
- **Hint button** - show a valid move if stuck
- **No timer pressure** - take as long as needed
- **Easy AI default** - new players play against Easy first

### Accessibility
- **No small text** - minimum 16px font
- **Clear icons** - crown, piece shapes are obvious
- **Color + shape** - don't rely on color alone (kings have crowns, not just different color)

---

## File Structure

```
apps/web/src/
├── app/
│   └── games/
│       └── checkers/
│           └── page.tsx              # Route: /games/checkers (thin wrapper)
│
├── games/
│   └── checkers/                     # SELF-CONTAINED MODULE
│       ├── components/
│       │   ├── Board.tsx             # 8x8 grid, renders tiles + pieces
│       │   ├── Tile.tsx              # Single square, handles click
│       │   ├── Piece.tsx             # Checker piece (regular or king)
│       │   ├── GameUI.tsx            # Score, turn indicator, buttons
│       │   ├── WinModal.tsx          # Victory celebration
│       │   └── DifficultySelect.tsx  # Easy/Medium/Hard picker
│       │
│       ├── hooks/
│       │   ├── useGameState.ts       # Zustand store for game state
│       │   ├── useValidMoves.ts      # Calculate valid moves for selected piece
│       │   └── useAI.ts              # AI opponent logic
│       │
│       ├── lib/
│       │   ├── gameLogic.ts          # Pure functions: moves, captures, win detection
│       │   ├── ai.ts                 # Minimax algorithm + evaluation
│       │   ├── constants.ts          # Board size, piece values, etc.
│       │   └── types.ts              # TypeScript types
│       │
│       ├── Game.tsx                  # Main game component (composes everything)
│       └── index.ts                  # Public exports
│
└── public/
    └── sounds/
        └── checkers/
            ├── move.mp3
            ├── capture.mp3
            ├── king.mp3
            └── win.mp3
```

### Why This Structure
- **Self-contained** - all checkers code in `src/games/checkers/`
- **Route is thin** - `page.tsx` just imports and renders `<Game />`
- **Easy to delete** - remove one folder to remove the entire game
- **Follows CLAUDE.md** - compartmentalized as required

---

## User Data & Persistence

### App ID
```typescript
appId: "checkers"
```

### What to Save (Progress Data Schema)
```typescript
type CheckersProgress = {
  // Lifetime stats
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;

  // Fun stats
  totalPiecesCaptured: number;    // Lifetime captures
  totalKingsEarned: number;       // Lifetime king promotions
  longestJumpChain: number;       // Most captures in one turn

  // Streak tracking
  currentWinStreak: number;
  bestWinStreak: number;

  // Per-difficulty stats
  easyWins: number;
  easyLosses: number;
  mediumWins: number;
  mediumLosses: number;
  hardWins: number;
  hardLosses: number;

  // Timestamp for sync
  lastModified: number;
};
```

### Integration with useAuthSync

**Step 1: Add to VALID_APP_IDS**
```typescript
// packages/db/src/schema/app-progress.ts
export const VALID_APP_IDS = [
  "hill-climb",
  "monster-truck",
  "weather",
  "checkers",        // <-- ADD THIS
] as const;
```

**Step 2: Create Zustand store with persistence**
```typescript
// src/games/checkers/hooks/useGameState.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const LOCAL_STORAGE_KEY = 'checkers-progress';

export const useCheckersStore = create(
  persist<CheckersState>(
    (set, get) => ({
      // Progress data
      progress: {
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0,
        totalPiecesCaptured: 0,
        totalKingsEarned: 0,
        longestJumpChain: 0,
        currentWinStreak: 0,
        bestWinStreak: 0,
        easyWins: 0,
        easyLosses: 0,
        mediumWins: 0,
        mediumLosses: 0,
        hardWins: 0,
        hardLosses: 0,
        lastModified: Date.now(),
      },

      // Actions
      recordWin: (difficulty: 'easy' | 'medium' | 'hard', piecesCaptured: number, kingsEarned: number, longestChain: number) => {
        set((state) => {
          const newStreak = state.progress.currentWinStreak + 1;
          return {
            progress: {
              ...state.progress,
              gamesPlayed: state.progress.gamesPlayed + 1,
              gamesWon: state.progress.gamesWon + 1,
              totalPiecesCaptured: state.progress.totalPiecesCaptured + piecesCaptured,
              totalKingsEarned: state.progress.totalKingsEarned + kingsEarned,
              longestJumpChain: Math.max(state.progress.longestJumpChain, longestChain),
              currentWinStreak: newStreak,
              bestWinStreak: Math.max(state.progress.bestWinStreak, newStreak),
              [`${difficulty}Wins`]: state.progress[`${difficulty}Wins`] + 1,
              lastModified: Date.now(),
            }
          };
        });
      },

      recordLoss: (difficulty: 'easy' | 'medium' | 'hard', piecesCaptured: number, kingsEarned: number, longestChain: number) => {
        set((state) => ({
          progress: {
            ...state.progress,
            gamesPlayed: state.progress.gamesPlayed + 1,
            gamesLost: state.progress.gamesLost + 1,
            totalPiecesCaptured: state.progress.totalPiecesCaptured + piecesCaptured,
            totalKingsEarned: state.progress.totalKingsEarned + kingsEarned,
            longestJumpChain: Math.max(state.progress.longestJumpChain, longestChain),
            currentWinStreak: 0, // Reset streak on loss
            [`${difficulty}Losses`]: state.progress[`${difficulty}Losses`] + 1,
            lastModified: Date.now(),
          }
        }));
      },

      getProgress: () => get().progress,
      setProgress: (data) => set({ progress: data }),
    }),
    {
      name: LOCAL_STORAGE_KEY,
    }
  )
);
```

**Step 3: Use useAuthSync in Game component**
```typescript
// src/games/checkers/Game.tsx
import { useAuthSync } from '@/shared/hooks/useAuthSync';
import { useCheckersStore } from './hooks/useGameState';

export function Game() {
  const store = useCheckersStore();

  const { isAuthenticated, syncStatus, forceSync } = useAuthSync({
    appId: 'checkers',
    localStorageKey: 'checkers-progress',
    getState: () => store.getProgress(),
    setState: (data) => store.setProgress(data),
    debounceMs: 2000,
  });

  // ... game logic
}
```

---

## Implementation Phases

### Phase 1: Board & Basic Movement (MVP Core)
- [ ] Board component (8x8 grid)
- [ ] Tile component with click handling
- [ ] Piece component (red/black)
- [ ] Initial board setup
- [ ] Piece selection
- [ ] Valid move calculation (forward diagonal only)
- [ ] Move execution
- [ ] Turn switching

**Deliverable**: Can move pieces around the board

### Phase 2: Captures & Kings
- [ ] Capture logic (jumping)
- [ ] Piece removal on capture
- [ ] Mandatory capture enforcement
- [ ] Multi-jump support
- [ ] King promotion
- [ ] King backward movement
- [ ] Win detection

**Deliverable**: Full game rules working

### Phase 3: UI Polish
- [ ] GameUI component (score, turn indicator)
- [ ] Highlight valid moves
- [ ] Selected piece visual feedback
- [ ] New Game button
- [ ] Undo button
- [ ] Win modal with confetti

**Deliverable**: Polished playable game

### Phase 4: AI Opponent
- [ ] Easy AI (random moves)
- [ ] Medium AI (minimax depth 2-3)
- [ ] Difficulty selector
- [ ] AI move delay (feels natural, not instant)

**Deliverable**: Can play against computer

### Phase 5: Sound & Persistence
- [ ] Sound effects (move, capture, king, win)
- [ ] Zustand store with localStorage
- [ ] useAuthSync integration
- [ ] Add "checkers" to VALID_APP_IDS
- [ ] Stats display (games won, captures, etc.)

**Deliverable**: Full game with cloud save

### Phase 6: Enhancements (Future)
- [ ] Hard AI (alpha-beta pruning)
- [ ] Move animations
- [ ] Hint button
- [ ] Game history
- [ ] Local 2-player mode
- [ ] Achievements

---

## Success Metrics

1. **Hank can play a full game** against Easy AI without help
2. **Hank understands the rules** after one explanation
3. **Hank feels rewarded** by the crown animation and victory celebration
4. **Hank wants to play again** to beat his win streak
5. **No frustration** from mis-taps (big enough touch targets)
6. **Works on Hank's tablet** (responsive, touch-friendly)

---

## References

### Game Rules
- [Wikipedia: English Draughts](https://en.wikipedia.org/wiki/English_draughts)

### Code References
- [codethejason/checkers](https://github.com/codethejason/checkers) - Vanilla JS, clean implementation
- [billjeffries/jsCheckersAI](https://github.com/billjeffries/jsCheckersAI) - Minimax + Alpha-Beta AI
- [dtrinh914/react-checkers](https://github.com/dtrinh914/react-checkers) - React + TypeScript + useBoard hook
- [RobinRadic/checkers](https://github.com/RobinRadic/checkers) - TypeScript + MobX
- [GitHub: Checkers Topic (TypeScript)](https://github.com/topics/checkers-game?l=typescript)
- [GitHub: Checkers Topic (JavaScript)](https://github.com/topics/checkers?l=javascript)

### AI Algorithms
- [Minimax Algorithm Explained](https://en.wikipedia.org/wiki/Minimax)
- [Alpha-Beta Pruning](https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning)
