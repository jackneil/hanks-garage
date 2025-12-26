# Chess - Game Design Document

## Overview

**Chess** is a classic two-player strategy board game where players compete to checkmate their opponent's king. For Hank's Hits, we're building a kid-friendly version with colorful pieces, move highlighting, AI opponents at various skill levels, and encouraging feedback that teaches strategy while keeping it fun.

**Why Chess for Kids (Ages 6-14)?**
- **Develops critical thinking** - planning moves ahead, cause-and-effect reasoning
- **Improves patience** - learning to think before acting
- **Teaches sportsmanship** - win gracefully, learn from losses
- **Boosts memory** - remembering piece movements and strategies
- **Timeless skill** - a game they'll play their whole lives
- **Educational respect** - parents and teachers approve

**Target Player**: Hank Neil, age 8 (and kids 6-14)
**Platform**: Web (mobile + desktop)
**Style**: Bright, colorful 2D board with friendly piece designs

---

## Core Game Loop

```
CHOOSE game mode (vs AI or vs Friend locally)
    |
SELECT difficulty (if vs AI)
    |
PLAY the game
    |-- Think about move (hints available)
    |-- Tap/click piece to select
    |-- See legal moves highlighted
    |-- Tap/click destination to move
    |-- Watch for captures, checks, special moves
    |
WIN, LOSE, or DRAW
    |
CELEBRATE or ENCOURAGE (no harsh failure messages)
    |
SEE STATS (games won/lost/drawn)
    |
PLAY AGAIN (with option to try harder difficulty)
```

### Why This Loop Works for Kids

1. **Immediate feedback** - legal moves show instantly when selecting a piece
2. **Safety net** - undo button and hints prevent frustration
3. **Visible progress** - stats show improvement over time
4. **Escalating challenge** - multiple AI levels to grow into
5. **Social play** - can play with friends/siblings on same device
6. **No pressure** - no timers by default, take as long as needed

---

## Progression System

### Stats Tracked

| Stat | Description |
|------|-------------|
| Games Won | Total wins against AI and friends |
| Games Lost | Total losses |
| Games Drawn | Stalemate, insufficient material, etc. |
| Current Streak | Consecutive wins |
| Best Streak | Highest win streak ever |
| Pieces Captured | Lifetime total |
| Checkmates Delivered | How many times you've checkmated |
| AI Levels Beaten | Which AI difficulties you've defeated |

### Achievements (Future Enhancement)

| Achievement | Requirement | Celebration |
|-------------|-------------|-------------|
| First Move! | Complete first game | Confetti |
| Scholar's Mate | Win in 4 moves or less | Special animation |
| Dragon Slayer | Beat "Medium" AI | Trophy icon |
| Grandmaster Jr | Beat "Hard" AI | Crown icon |
| Persistence | Play 10 games | Star badge |
| Collection King | Capture 100 pieces total | Medal |

### Rating System (Optional - Phase 2)

- Simple Elo-like rating starting at 800
- Goes up/down based on wins/losses
- Displayed with fun titles:
  - 0-800: "Pawn Pusher"
  - 801-1000: "Knight Rider"
  - 1001-1200: "Bishop Boss"
  - 1201-1400: "Rook Rookie"
  - 1401-1600: "Queen's Guard"
  - 1601+: "Chess Champion"

---

## Controls

### Mobile (Touch)

```
┌─────────────────────────────────────────┐
│  [←]  CHESS - Your Turn!  [Menu] [Undo] │
├─────────────────────────────────────────┤
│                                         │
│         ┌─────────────────┐             │
│         │                 │             │
│         │   CHESS BOARD   │             │
│         │   (8x8 grid)    │             │
│         │                 │             │
│         │  • Tap piece    │             │
│         │    to select    │             │
│         │  • Tap square   │             │
│         │    to move      │             │
│         │                 │             │
│         └─────────────────┘             │
│                                         │
│  Captured:  [♟♟♞]        [♙♙♗]         │
│                                         │
│       [💡 Hint]    [🏳️ Resign]          │
└─────────────────────────────────────────┘
```

**Touch Controls:**
1. **Tap piece** to select it (highlights legal moves)
2. **Tap highlighted square** to move there
3. **Tap elsewhere** to deselect
4. **Swipe/drag** (alternative) - drag piece to destination

### Desktop (Mouse + Keyboard)

**Mouse:**
- **Click piece** to select
- **Click destination** to move
- **Click and drag** - drag piece directly to destination

**Keyboard Shortcuts:**
| Key | Action |
|-----|--------|
| U | Undo last move |
| H | Show hint |
| N | New game |
| ESC | Open menu |
| R | Resign game |

### Control Options

| Option | Default | Description |
|--------|---------|-------------|
| Drag to move | ON | Enable click-and-drag |
| Tap to move | ON | Enable tap-tap selection |
| Show legal moves | ON | Highlight valid squares |
| Show last move | ON | Highlight the last move played |
| Confirm moves | OFF | Require double-tap to confirm |
| Sound effects | ON | Piece sounds, captures, etc. |

---

## Features (Priority Order)

### Phase 1: MVP (Core Chess)

**Must-have for playable game:**

- [ ] Chessboard display (8x8 with alternating colors)
- [ ] All 6 piece types with proper movement
- [ ] Legal move validation (no moving into check)
- [ ] Move highlighting (show valid squares on selection)
- [ ] Piece capture mechanics
- [ ] Check and checkmate detection
- [ ] Stalemate detection
- [ ] Basic AI opponent (random legal moves)
- [ ] Mobile touch controls (tap to select/move)
- [ ] Desktop click controls
- [ ] New game / reset button
- [ ] Turn indicator ("White's Turn" / "Black's Turn")

**Time estimate:** 4-6 hours

### Phase 2: Kid-Friendly Polish

**Important for engagement:**

- [ ] Colorful, friendly piece designs (not scary)
- [ ] Move sound effects (slide, capture, check)
- [ ] Last move highlighting (show what opponent did)
- [ ] Captured pieces display (show what's been taken)
- [ ] Undo button (at least 1 move back)
- [ ] Simple AI difficulty levels (Easy, Medium)
- [ ] Win/lose celebration animations
- [ ] Encouraging messages ("Good move!", "Nice capture!")
- [ ] Hint system (suggests a good move)
- [ ] Pawn promotion UI (pick Queen/Rook/Bishop/Knight)

**Time estimate:** 3-4 hours

### Phase 3: Persistence & Stats

**For returning players:**

- [ ] Stats tracking (wins/losses/draws)
- [ ] useAuthSync integration for logged-in users
- [ ] localStorage for guest players
- [ ] SyncIndicator and GuestWarning components
- [ ] Game history (last 10 games)
- [ ] Favorite piece color preference

**Time estimate:** 2-3 hours

### Phase 4: Enhanced AI

**For growing challenge:**

- [ ] Medium AI (minimax depth 2)
- [ ] Hard AI (minimax depth 4 or Stockfish.js)
- [ ] "Super Hard" AI (Stockfish at higher strength)
- [ ] AI "thinking" indicator with fun animation
- [ ] AI difficulty auto-adjust based on player skill

**Time estimate:** 3-5 hours

### Phase 5: Learning Features (Nice-to-Have)

**For education:**

- [ ] Move tutorial (explains each piece on first play)
- [ ] Special moves tutorial (castling, en passant)
- [ ] "Why was that a good move?" explanation
- [ ] Puzzle mode (mate in 1, mate in 2)
- [ ] Opening book hints ("This is called the Italian Game")

**Time estimate:** 5-8 hours

### Phase 6: Extras (Nice-to-Have)

**For variety:**

- [ ] Custom board themes (wood, marble, space)
- [ ] Custom piece sets (classic, cartoon, animals)
- [ ] Game timer option (for older kids)
- [ ] Online multiplayer (future - requires server)
- [ ] Share game as link/image

**Time estimate:** 5-10 hours

---

## Technical Approach

### Libraries & Packages

**Chess Logic:**
```bash
npm install chess.js
```

- **chess.js** - Complete chess logic library
  - GitHub: https://github.com/jhlywa/chess.js
  - Handles: move validation, check/checkmate, stalemate, FEN, PGN
  - MIT licensed
  - ~20KB gzipped

**Chess Board UI:**
```bash
npm install react-chessboard
```

- **react-chessboard** - React component for chess board
  - GitHub: https://github.com/Clariity/react-chessboard
  - Works with chess.js out of the box
  - Drag-and-drop support
  - Customizable piece images
  - Mobile touch support
  - MIT licensed

**AI (Simple):**
- For Easy mode: Random legal moves (built-in to chess.js)
- For Medium mode: Minimax with alpha-beta pruning (custom implementation)

**AI (Advanced - Optional):**
```bash
npm install stockfish
# OR use CDN version
```

- **stockfish.js** - Port of Stockfish engine to JavaScript
  - GitHub: https://github.com/official-stockfish/Stockfish
  - WebAssembly version for performance
  - Can set skill level 0-20
  - Runs in web worker (no UI blocking)
  - GPL licensed (careful with distribution)

**Alternative for AI without Stockfish:**
- `js-chess-engine` - simpler, lighter AI
- Custom minimax with basic evaluation function

### Installation Commands

```bash
# Navigate to web app
cd apps/web

# Install chess packages
pnpm add chess.js react-chessboard

# Optional: Install Stockfish for advanced AI
pnpm add stockfish
```

### Types

```bash
# chess.js includes TypeScript types
# react-chessboard includes TypeScript types
```

---

## Code Sources & Documentation

### Primary Libraries

| Library | URL | Purpose |
|---------|-----|---------|
| chess.js | https://github.com/jhlywa/chess.js | Game logic, validation |
| react-chessboard | https://github.com/Clariity/react-chessboard | Board UI component |
| Stockfish.js | https://github.com/official-stockfish/Stockfish | Strong AI engine |

### Reference Implementations

| Resource | URL | Notes |
|----------|-----|-------|
| chessboard.js | https://chessboardjs.com/ | Alternative UI (jQuery-based, not React) |
| lichess.org | https://lichess.org | Open-source chess site for inspiration |
| chess.com kids | https://www.chess.com/kids | Kid-friendly design reference |

### API Documentation

**chess.js main methods:**
```typescript
import { Chess } from 'chess.js';

const game = new Chess();

// Get legal moves for a square
game.moves({ square: 'e2', verbose: true });

// Make a move
game.move({ from: 'e2', to: 'e4' });

// Check game state
game.isCheck();
game.isCheckmate();
game.isStalemate();
game.isDraw();
game.isGameOver();

// Get current position as FEN
game.fen();

// Undo last move
game.undo();

// Get current turn
game.turn(); // 'w' or 'b'
```

**react-chessboard usage:**
```tsx
import { Chessboard } from 'react-chessboard';

<Chessboard
  position={game.fen()}
  onPieceDrop={onDrop}
  customBoardStyle={{
    borderRadius: '8px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
  }}
  customDarkSquareStyle={{ backgroundColor: '#779952' }}
  customLightSquareStyle={{ backgroundColor: '#edeed1' }}
  boardWidth={400}
/>
```

---

## Kid-Friendly Design

### Visual Design

**Board Colors (Default Theme):**
- Light squares: `#EDEED1` (cream/light green)
- Dark squares: `#779952` (forest green)
- Selected piece: `#F6F669` (bright yellow)
- Legal moves: `#829769` with circles
- Last move: `#CDD26A` (highlighted)
- Check indicator: `#E84855` (red glow on king)

**Piece Style:**
- Default: Classic Merida pieces (clear, recognizable)
- Alternative: Cartoon-style pieces for younger kids
- Pieces should be large and easy to tap (60x60px minimum)

**Typography:**
- Large, readable fonts (minimum 16px)
- Fun, friendly font for titles (like "Fredoka One")
- Clear labels for everything

### Encouraging Messages

**On good moves:**
- "Nice move!"
- "Great choice!"
- "You're thinking ahead!"
- "That's smart!"

**On captures:**
- "Got 'em!"
- "Nice capture!"
- "One down!"

**On check:**
- "Check! Keep going!"
- "The king is in danger!"

**On winning:**
- "CHECKMATE! You won!"
- "Amazing! You're a chess champion!"
- Confetti animation
- Victory sound effect

**On losing:**
- "Good game! Want to try again?"
- "That was a tough opponent!"
- "You'll get 'em next time!"
- NO harsh language, NO "you lost"

**On draw:**
- "It's a draw! Great battle!"
- "Neither side wins - that's called a stalemate!"

### Accessibility

- High contrast between pieces and board
- Colorblind-friendly themes available
- Large touch targets (44px minimum, 60px preferred)
- No time pressure by default
- Undo button always available
- Hints always available

### Sound Effects

| Event | Sound |
|-------|-------|
| Piece pickup | Soft "pick up" sound |
| Piece move | Sliding/placing sound |
| Capture | Satisfying "capture" sound |
| Check | Alert sound (not scary) |
| Checkmate | Victory fanfare |
| Illegal move | Gentle "nope" sound |
| Undo | Rewind sound |

---

## File Structure

Following the project's compartmentalized structure:

```
apps/web/src/
├── app/
│   └── games/
│       └── chess/
│           └── page.tsx           # Route - dynamic imports Game
│
├── games/
│   └── chess/                     # SELF-CONTAINED module
│       ├── components/
│       │   ├── Board.tsx          # Chessboard wrapper component
│       │   ├── GameControls.tsx   # Undo, hint, new game buttons
│       │   ├── CapturedPieces.tsx # Shows captured pieces
│       │   ├── TurnIndicator.tsx  # Shows whose turn it is
│       │   ├── GameOverModal.tsx  # Win/lose/draw celebration
│       │   ├── PromotionModal.tsx # Pawn promotion picker
│       │   ├── SettingsMenu.tsx   # Game options
│       │   └── DifficultySelect.tsx # AI level picker
│       │
│       ├── hooks/
│       │   ├── useChessGame.ts    # Main game logic hook
│       │   ├── useChessAI.ts      # AI opponent logic
│       │   └── useChessSync.ts    # Auth sync wrapper
│       │
│       ├── lib/
│       │   ├── store.ts           # Zustand store for game state
│       │   ├── constants.ts       # Piece values, colors, etc.
│       │   ├── ai.ts              # Minimax AI implementation
│       │   ├── sounds.ts          # Sound effect utilities
│       │   └── messages.ts        # Encouraging messages
│       │
│       ├── types/
│       │   └── index.ts           # TypeScript types
│       │
│       ├── __tests__/
│       │   ├── Game.test.tsx      # Component tests
│       │   ├── ai.test.ts         # AI logic tests
│       │   └── store.test.ts      # Store tests
│       │
│       ├── Game.tsx               # Main game component
│       └── index.ts               # Exports
│
└── public/
    └── games/
        └── chess/
            ├── pieces/            # Custom piece images (optional)
            └── sounds/            # Sound effects
                ├── move.mp3
                ├── capture.mp3
                ├── check.mp3
                └── win.mp3
```

---

## User Data & Persistence

### App ID

```typescript
appId: "chess"
```

### VALID_APP_IDS Update

In `packages/db/src/schema/app-progress.ts`:

```typescript
export const VALID_APP_IDS = [
  "hill-climb",
  "monster-truck",
  "weather",
  "chess",  // ADD THIS
] as const;
```

### Data Structure

```typescript
interface ChessGameState {
  // Required for merge resolution
  updatedAt: number;  // Unix timestamp

  // Game statistics
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    gamesLost: number;
    gamesDrawn: number;
    currentStreak: number;
    bestStreak: number;
    totalPiecesCaptured: number;
    totalCheckmates: number;
  };

  // AI progress
  aiBeaten: {
    easy: boolean;
    medium: boolean;
    hard: boolean;
    superHard: boolean;
  };

  // Preferences
  preferences: {
    favoriteColor: 'white' | 'black' | 'random';
    boardTheme: 'default' | 'wood' | 'marble';
    pieceSet: 'classic' | 'cartoon';
    soundEnabled: boolean;
    showLegalMoves: boolean;
    showLastMove: boolean;
  };

  // Optional rating system
  rating?: number;

  // Last game (for "Continue" feature)
  lastGame?: {
    fen: string;
    moves: string[];
    vsAI: boolean;
    aiDifficulty?: 'easy' | 'medium' | 'hard' | 'superHard';
  };
}
```

### Default State

```typescript
const defaultChessState: ChessGameState = {
  updatedAt: Date.now(),
  stats: {
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0,
    gamesDrawn: 0,
    currentStreak: 0,
    bestStreak: 0,
    totalPiecesCaptured: 0,
    totalCheckmates: 0,
  },
  aiBeaten: {
    easy: false,
    medium: false,
    hard: false,
    superHard: false,
  },
  preferences: {
    favoriteColor: 'random',
    boardTheme: 'default',
    pieceSet: 'classic',
    soundEnabled: true,
    showLegalMoves: true,
    showLastMove: true,
  },
};
```

### useAuthSync Integration

```typescript
// games/chess/hooks/useChessSync.ts
import { useAuthSync } from '@/shared/hooks/useAuthSync';
import { useChessStore } from '../lib/store';

export function useChessSync() {
  const getState = useChessStore((s) => s.getPersistedState);
  const setState = useChessStore((s) => s.loadPersistedState);

  return useAuthSync({
    appId: 'chess',
    localStorageKey: 'hank-chess-state',
    getState,
    setState,
    debounceMs: 2000,
    onSyncComplete: (source) => {
      console.log(`Chess state synced from ${source}`);
    },
  });
}
```

### Store Implementation

```typescript
// games/chess/lib/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChessGameState } from '../types';

interface ChessStore extends ChessGameState {
  // Actions
  recordWin: (vsAI: boolean, difficulty?: string) => void;
  recordLoss: () => void;
  recordDraw: () => void;
  addCapturedPiece: () => void;
  updatePreferences: (prefs: Partial<ChessGameState['preferences']>) => void;

  // Persistence helpers
  getPersistedState: () => ChessGameState;
  loadPersistedState: (data: ChessGameState) => void;
}

export const useChessStore = create<ChessStore>()(
  persist(
    (set, get) => ({
      // Initial state
      ...defaultChessState,

      recordWin: (vsAI, difficulty) => set((state) => {
        const newStreak = state.stats.currentStreak + 1;
        return {
          updatedAt: Date.now(),
          stats: {
            ...state.stats,
            gamesPlayed: state.stats.gamesPlayed + 1,
            gamesWon: state.stats.gamesWon + 1,
            currentStreak: newStreak,
            bestStreak: Math.max(state.stats.bestStreak, newStreak),
            totalCheckmates: state.stats.totalCheckmates + 1,
          },
          aiBeaten: vsAI && difficulty ? {
            ...state.aiBeaten,
            [difficulty]: true,
          } : state.aiBeaten,
        };
      }),

      recordLoss: () => set((state) => ({
        updatedAt: Date.now(),
        stats: {
          ...state.stats,
          gamesPlayed: state.stats.gamesPlayed + 1,
          gamesLost: state.stats.gamesLost + 1,
          currentStreak: 0,
        },
      })),

      recordDraw: () => set((state) => ({
        updatedAt: Date.now(),
        stats: {
          ...state.stats,
          gamesPlayed: state.stats.gamesPlayed + 1,
          gamesDrawn: state.stats.gamesDrawn + 1,
        },
      })),

      addCapturedPiece: () => set((state) => ({
        stats: {
          ...state.stats,
          totalPiecesCaptured: state.stats.totalPiecesCaptured + 1,
        },
      })),

      updatePreferences: (prefs) => set((state) => ({
        updatedAt: Date.now(),
        preferences: { ...state.preferences, ...prefs },
      })),

      getPersistedState: () => {
        const { recordWin, recordLoss, recordDraw, addCapturedPiece,
                updatePreferences, getPersistedState, loadPersistedState,
                ...state } = get();
        return state;
      },

      loadPersistedState: (data) => set(data),
    }),
    {
      name: 'hank-chess-state',
    }
  )
);
```

---

## AI Implementation

### Easy Mode (Random)

```typescript
function getRandomMove(game: Chess): Move | null {
  const moves = game.moves({ verbose: true });
  if (moves.length === 0) return null;
  return moves[Math.floor(Math.random() * moves.length)];
}
```

### Medium Mode (Minimax)

```typescript
// Simple piece values
const PIECE_VALUES = {
  p: 1,   // pawn
  n: 3,   // knight
  b: 3,   // bishop
  r: 5,   // rook
  q: 9,   // queen
  k: 100, // king
};

function evaluateBoard(game: Chess): number {
  // Sum up piece values
  // Positive = white advantage, Negative = black advantage
}

function minimax(
  game: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number {
  // Standard minimax with alpha-beta pruning
  // Depth 2-3 for Medium
}

function getBestMove(game: Chess, depth: number): Move | null {
  // Find best move using minimax
}
```

### Hard Mode (Stockfish.js)

```typescript
// Use Web Worker to run Stockfish
const stockfish = new Worker('/stockfish/stockfish.js');

stockfish.postMessage('uci');
stockfish.postMessage('setoption name Skill Level value 10');
stockfish.postMessage(`position fen ${game.fen()}`);
stockfish.postMessage('go depth 10');

stockfish.onmessage = (event) => {
  if (event.data.startsWith('bestmove')) {
    const move = event.data.split(' ')[1];
    // Apply move
  }
};
```

---

## Implementation Phases (Timeline)

### Week 1: MVP

1. Set up file structure
2. Install chess.js and react-chessboard
3. Basic board rendering
4. Move validation and highlighting
5. Simple "random moves" AI
6. Mobile touch controls
7. Basic game over detection

### Week 2: Polish

1. Captured pieces display
2. Sound effects
3. Undo functionality
4. Hint system
5. AI difficulty levels (Easy, Medium)
6. Encouraging messages
7. Win/lose animations

### Week 3: Persistence

1. Add "chess" to VALID_APP_IDS
2. Create Zustand store
3. Integrate useAuthSync
4. Add GuestWarning and SyncIndicator
5. Test sync flow

### Week 4: Enhancement

1. Hard AI with Stockfish.js
2. Pawn promotion UI
3. Board themes
4. Settings menu
5. Testing and polish

---

## Success Metrics

How do we know the chess game is good?

1. **Hank finishes a game** without giving up mid-way
2. **Hank beats Easy AI** on first few tries (not too hard)
3. **Hank struggles with Medium** but keeps trying (good challenge)
4. **Hank asks about pieces** - showing interest in learning
5. **Hank plays again** - the loop is working
6. **No frustration crying** - forgiving enough with hints/undo
7. **Hank challenges siblings** - using local 2-player mode

---

## References

- [chess.js Documentation](https://github.com/jhlywa/chess.js)
- [react-chessboard Documentation](https://github.com/Clariity/react-chessboard)
- [Stockfish.js](https://github.com/official-stockfish/Stockfish)
- [chessboard.js Examples](https://chessboardjs.com/examples)
- [Chess.com Kids](https://www.chess.com/kids) - Design inspiration
- [Lichess](https://lichess.org) - Open-source chess reference
- [Minimax Algorithm](https://en.wikipedia.org/wiki/Minimax) - AI basics
- [Chess for Kids Research](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6885950/) - Educational benefits
