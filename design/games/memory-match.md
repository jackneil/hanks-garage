# Memory Match - Game Design Document

## Overview

**Memory Match** is a classic card-flipping memory game where players find matching pairs of cards. The game is perfect for kids ages 6-14 because it exercises memory and concentration while providing instant visual rewards.

**Why Kids Love It:**
- **Simple rules** - flip two cards, find matches, clear the board
- **Quick rounds** - games finish in 1-5 minutes (great attention span fit)
- **Sense of accomplishment** - visible progress as pairs disappear
- **Fun themes** - animals, trucks, emojis make it personal
- **No failures** - you always eventually win, just compete against your best time

**Target Player**: Hank Neil, age 8 (and kids 6-14)
**Platform**: Web (mobile-first + desktop)
**Session Length**: 1-5 minutes per round
**Style**: Bright, colorful cards with satisfying flip animations

---

## Core Game Loop

```
FLIP first card (reveals image)
    |
FLIP second card
    |
    +---> MATCH! --> Cards stay revealed, celebration effect
    |                     |
    |                     v
    +---> NO MATCH --> Cards flip back after 1 second
                              |
                              v
                     REMEMBER positions for next attempt
                              |
                              v
               REPEAT until all pairs found
                              |
                              v
                   WIN! --> Show time, moves, celebration
```

### Why This Loop Works

From cognitive research on memory games:
- **Pattern recognition** - our brains love finding patterns
- **Spatial memory** - remembering positions creates mental engagement
- **Instant feedback** - matches feel rewarding, misses teach
- **Clear end state** - you always win, it's just about efficiency
- **Variable challenge** - difficulty scales with grid size

---

## Controls

### Mobile (Touch)
| Action | Gesture |
|--------|---------|
| Flip card | Tap card |
| View card | Hold tap |
| Start new game | Tap "New Game" button |

**Touch targets**: Minimum 60x60px cards (larger on bigger screens)

### Desktop (Mouse/Keyboard)
| Action | Input |
|--------|-------|
| Flip card | Click card |
| Flip card (keyboard) | Arrow keys to navigate + Enter/Space |
| Start new game | Click button or press N |
| Pause | Escape key |

### Accessibility
- Full keyboard navigation with visible focus ring
- Tab through cards in grid order
- Screen reader announcements for flips and matches

---

## Features (Priority Order)

### MVP (Must Have for Launch)

1. **Core Gameplay**
   - Card grid (4x4 = 8 pairs for MVP)
   - Click to flip cards (max 2 at a time)
   - Match detection with 1-second reveal on mismatch
   - Move counter
   - Timer (counts up)
   - Win detection when all pairs matched

2. **Single Theme**
   - Animals theme (cat, dog, lion, bear, etc.)
   - Simple, recognizable illustrations
   - Card back design (Hank's Hits logo or pattern)

3. **Basic UI**
   - Game board (centered, responsive)
   - Stats bar (moves, time)
   - "New Game" button
   - Win modal with stats

4. **Basic Animations**
   - CSS 3D flip animation on card reveal
   - Scale bounce on match
   - Fade out matched pairs (or keep visible with checkmark)

### Important for Fun (Phase 2)

5. **Difficulty Levels**
   - Easy: 4x3 grid (6 pairs) - younger kids
   - Medium: 4x4 grid (8 pairs) - default
   - Hard: 5x4 grid (10 pairs)
   - Expert: 6x4 grid (12 pairs)

6. **Theme Selection**
   - Animals (default)
   - Vehicles (trucks, cars, planes - for Hank!)
   - Emojis (faces, foods, sports)
   - Dinosaurs (always a hit with kids)

7. **Sound Effects**
   - Card flip: soft "whoosh" or "flip" sound
   - Match found: happy chime/ding
   - No match: soft "boop" or gentle buzz
   - Game win: celebration fanfare

8. **Celebration Effects**
   - Confetti burst on each match
   - Big celebration on game win
   - Star rating based on moves (3 stars = perfect memory)

### Nice to Have (Phase 3)

9. **Best Times Leaderboard**
   - Per difficulty level
   - Show top 5 times
   - Personal best indicator

10. **Card Themes Pack**
    - Sports (balls, equipment)
    - Space (planets, rockets)
    - Food (fruits, sweets)
    - Monsters (friendly ones)

11. **Challenge Mode**
    - "Beat the Clock" - must finish in X seconds
    - "Perfect Memory" - no misses allowed
    - Daily challenge with preset shuffle

12. **Multiplayer (Local)**
    - Two-player turn-based
    - Each match = your point
    - Winner has most pairs when done

13. **Hints System**
    - Show one card briefly (costs 5 seconds)
    - Limited hints per game
    - Disable for "pure" runs

---

## Progression System

### Star Rating (Per Game)

| Rating | Criteria | Bonus |
|--------|----------|-------|
| 3 Stars | Perfect efficiency (pairs * 2 moves) | +50 XP |
| 2 Stars | Under 1.5x optimal moves | +30 XP |
| 1 Star | Completed the game | +10 XP |

### Unlockables

| Milestone | Unlock |
|-----------|--------|
| First win | Vehicles theme |
| 5 wins | Emojis theme |
| 10 wins | Dinosaurs theme |
| 25 wins | Space theme |
| 50 wins | Monsters theme |
| 100 wins | Custom back design |

### Achievements

- **First Match!** - Find your first pair
- **Sharp Memory** - Complete a game with no misses
- **Speed Demon** - Complete medium in under 30 seconds
- **Dedicated** - Play 10 games
- **Theme Collector** - Unlock all themes

---

## Technical Approach

### Stack

```
React 19 + TypeScript
CSS (flip animations via transform)
Zustand (state management)
localStorage + useAuthSync (persistence)
```

### Key Components

```typescript
// Card component props
interface CardProps {
  id: number;
  imageId: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
}

// Game state
interface MemoryMatchState {
  cards: Card[];
  flippedCards: number[]; // max 2
  matchedPairs: number;
  moves: number;
  timeStarted: number | null;
  timeEnded: number | null;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  theme: string;
}

// Persisted state (saved to DB)
interface MemoryMatchProgress {
  updatedAt: number;
  bestTimes: {
    easy: number | null;
    medium: number | null;
    hard: number | null;
    expert: number | null;
  };
  totalMatches: number;
  gamesPlayed: number;
  favoriteTheme: string;
  unlockedThemes: string[];
  achievements: string[];
}
```

### Animation Approach

Use CSS 3D transforms for the card flip - performant and smooth:

```css
.card {
  perspective: 1000px;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card.flipped {
  transform: rotateY(180deg);
}

.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.card-front {
  transform: rotateY(180deg);
}
```

### Shuffle Algorithm

Fisher-Yates shuffle for fair randomization:

```typescript
function shuffleCards<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
```

---

## Code Sources (GitHub References)

These open-source implementations can be referenced for patterns and ideas:

### Primary References

| Repository | Stars | Why It's Useful |
|------------|-------|-----------------|
| [WOW-Memory-Match](https://github.com/AaronCCWong/WOW-Memory-Match) | React | React component structure, game logic |
| [memory-game](https://github.com/Fahdroussafi/memory-game) | 20+ | Modern React, clean CSS animations |
| [react-memory-game](https://github.com/lukemoderwell/react-memory-game) | 50+ | Minimal React implementation |
| [memory-card-game](https://github.com/devhobbyist/memory-card-game) | - | TypeScript, accessibility features |

### Animation References

| Repository | Focus |
|------------|-------|
| [flip-card-react](https://github.com/AaronCCWong/flip-card-react) | 3D CSS flip component |
| [react-flip-card](https://github.com/bluelovers/react-flip-card) | Flip animation library |

### Implementation Notes

From analyzing these repos:
- Most use a flat array of cards with `id`, `imageId`, `isFlipped`, `isMatched`
- Matching logic: compare `imageId` of two flipped cards
- Timer starts on first flip, not on game load
- Use `setTimeout` for the brief mismatch reveal (800-1200ms)
- CSS 3D transforms are the standard for flip animations

---

## Kid-Friendly Design

### Visual Design

**Colors:**
- Card backs: Bright blue or fun pattern (Hank's Hits brand color)
- Matched cards: Subtle green glow or checkmark
- Background: Soft gradient, not distracting
- Text: High contrast, readable

**Typography:**
- Large, friendly font (minimum 18px)
- Numbers big and bold (moves, timer)
- Celebration text: Extra large, fun font

**Card Themes (Examples):**

| Theme | Card Images |
|-------|-------------|
| Animals | Cat, Dog, Lion, Bear, Elephant, Giraffe, Monkey, Penguin |
| Vehicles | Monster Truck, Fire Truck, Plane, Train, Rocket, Boat, Tractor, Motorcycle |
| Emojis | Grinning, Laughing, Heart Eyes, Cool, Thinking, Fire, Star, Rainbow |
| Dinosaurs | T-Rex, Triceratops, Stegosaurus, Brachiosaurus, Pterodactyl, Velociraptor, Ankylosaurus, Spinosaurus |

### Celebration Moments

| Event | Effect |
|-------|--------|
| Match found | Confetti burst + happy sound |
| Streak (3+ matches) | "On Fire!" text popup |
| Game complete | Full-screen confetti + fanfare |
| New best time | Extra celebration + "New Record!" |
| 3-star finish | Stars animate in + special sound |

### Forgiving Design

- **No penalties** - misses just flip back, no score deduction
- **Always winnable** - can't lose, just improve
- **Encouraging messages** - "Keep going!", "Almost there!"
- **Visible progress** - show matched pairs count

### Sound Design

| Sound | Description | Volume |
|-------|-------------|--------|
| Card flip | Quick "fwip" sound | Quiet |
| Match | Cheerful "ding ding!" | Medium |
| Mismatch | Gentle "boop" (not sad) | Quiet |
| Win | Party sounds, fanfare | Full |
| Button click | Soft "pop" | Quiet |

**Sound toggle always visible** - some kids like quiet play

---

## File Structure

Following the compartmentalized structure from CLAUDE.md:

```
apps/web/src/
├── app/
│   └── games/
│       └── memory-match/
│           └── page.tsx           # Route - just imports Game component
│
├── games/
│   └── memory-match/
│       ├── components/
│       │   ├── Card.tsx           # Individual card with flip animation
│       │   ├── CardGrid.tsx       # Grid layout of cards
│       │   ├── GameBoard.tsx      # Main game area
│       │   ├── StatsBar.tsx       # Moves, timer, difficulty
│       │   ├── DifficultySelect.tsx
│       │   ├── ThemeSelect.tsx
│       │   ├── WinModal.tsx       # Victory screen with stats
│       │   └── Celebration.tsx    # Confetti and effects
│       │
│       ├── hooks/
│       │   ├── useGameLogic.ts    # Core match/flip logic
│       │   ├── useTimer.ts        # Game timer
│       │   └── useSounds.ts       # Sound effects
│       │
│       ├── lib/
│       │   ├── store.ts           # Zustand store
│       │   ├── constants.ts       # Grid sizes, themes
│       │   ├── sounds.ts          # Sound file paths
│       │   └── utils.ts           # Shuffle, helpers
│       │
│       ├── Game.tsx               # Main game component
│       └── index.ts               # Exports
│
└── public/
    └── games/
        └── memory-match/
            ├── cards/
            │   ├── animals/
            │   │   ├── cat.svg
            │   │   ├── dog.svg
            │   │   └── ...
            │   ├── vehicles/
            │   ├── emojis/
            │   └── dinosaurs/
            ├── sounds/
            │   ├── flip.mp3
            │   ├── match.mp3
            │   ├── mismatch.mp3
            │   └── win.mp3
            └── card-back.svg
```

---

## User Data & Persistence

### App ID Configuration

Add to `packages/db/src/schema/app-progress.ts`:

```typescript
export const VALID_APP_IDS = [
  "hill-climb",
  "monster-truck",
  "weather",
  "memory-match",  // ADD THIS
] as const;
```

### What to Save

```typescript
interface MemoryMatchProgress {
  // Required for merge resolution
  updatedAt: number;  // Unix timestamp

  // Best times per difficulty (milliseconds)
  bestTimes: {
    easy: number | null;
    medium: number | null;
    hard: number | null;
    expert: number | null;
  };

  // Aggregate stats
  totalMatches: number;      // All-time matches found
  gamesPlayed: number;       // Total games completed
  perfectGames: number;      // Games with no misses

  // Preferences
  favoriteTheme: string;     // Last used theme
  soundEnabled: boolean;

  // Progression
  unlockedThemes: string[];  // Array of unlocked theme IDs
  achievements: string[];    // Array of achievement IDs
}
```

### useAuthSync Integration

```typescript
// In Game.tsx
import { useAuthSync } from '@/shared/hooks/useAuthSync';
import { useMemoryMatchStore } from './lib/store';

export function MemoryMatchGame() {
  const store = useMemoryMatchStore();

  const { isGuest, syncStatus, lastSynced } = useAuthSync({
    appId: 'memory-match',
    localStorageKey: 'memory-match-progress',
    getState: () => store.getProgress(),
    setState: (data) => store.setProgress(data),
    debounceMs: 2000,
  });

  return (
    <div>
      <GuestWarning />
      <SyncIndicator status={syncStatus} lastSynced={lastSynced} />
      {/* Game content */}
    </div>
  );
}
```

### localStorage Key

```
memory-match-progress
```

### Merge Strategy

When syncing guest progress on login:
- Best times: Keep the FASTER time for each difficulty
- Total matches: Keep the HIGHER count
- Themes unlocked: Union of both sets
- Achievements: Union of both sets

---

## Implementation Phases

### Phase 1: MVP (Core Game)
- [ ] Set up file structure (`src/games/memory-match/`)
- [ ] Card component with CSS flip animation
- [ ] CardGrid with 4x4 layout
- [ ] Game logic: flip, match, mismatch timing
- [ ] Move counter
- [ ] Timer (starts on first flip)
- [ ] Win detection and basic modal
- [ ] Animals theme (8 images)
- [ ] Responsive design (mobile-first)

**Deliverable**: Playable memory game with one theme

### Phase 2: Polish & Features
- [ ] Difficulty selector (4 grid sizes)
- [ ] Theme selector (4 themes)
- [ ] Sound effects (flip, match, win)
- [ ] Celebration confetti on match
- [ ] Better win modal with stats
- [ ] Keyboard navigation
- [ ] Settings (sound toggle)

**Deliverable**: Fun, polished experience

### Phase 3: Persistence & Progression
- [ ] Add "memory-match" to VALID_APP_IDS
- [ ] Create Zustand store for game + progress
- [ ] Integrate useAuthSync
- [ ] Best times per difficulty
- [ ] Total stats tracking
- [ ] Theme unlocks based on wins
- [ ] GuestWarning and SyncIndicator

**Deliverable**: Progress saves across sessions

### Phase 4: Extras
- [ ] Achievements system
- [ ] Challenge mode (timed, perfect)
- [ ] More themes (space, monsters, sports)
- [ ] Local two-player mode
- [ ] Hint system
- [ ] Daily challenge

**Deliverable**: Full-featured game with replay value

---

## Success Metrics

How do we know the game is good?

1. **Hank plays multiple rounds** - comes back for "one more"
2. **Tries different difficulties** - engages with progression
3. **Wants to beat his time** - competitive with himself
4. **Picks favorite theme** - personalization matters
5. **Shows friends/family** - proud of his scores
6. **No frustration** - always feels achievable

---

## References

### Game Design
- [Memory Game UX Research](https://www.nngroup.com/articles/memory-recognition-heuristics/) - Recognition vs recall
- [Card Game UI Patterns](https://uxdesign.cc/designing-card-games-101-aa2b4c4c2a3) - Best practices
- [Kids Game Design](https://www.gamedeveloper.com/design/designing-games-for-children) - Age-appropriate design

### Open Source Implementations
- [WOW-Memory-Match](https://github.com/AaronCCWong/WOW-Memory-Match) - React + TypeScript reference
- [memory-game](https://github.com/Fahdroussafi/memory-game) - Clean modern implementation
- [react-memory-game](https://github.com/lukemoderwell/react-memory-game) - Minimal React example
- [memory-card-game](https://github.com/devhobbyist/memory-card-game) - Good accessibility patterns

### CSS Animation
- [CSS 3D Flip Card](https://www.w3schools.com/howto/howto_css_flip_card.asp) - Tutorial
- [Creating a 3D Flip Card Animation](https://css-tricks.com/snippets/css/flip-card-animation/) - CSS-Tricks reference

### Sound Effects (Free Sources)
- [Freesound.org](https://freesound.org/) - CC-licensed sounds
- [Mixkit](https://mixkit.co/free-sound-effects/game/) - Free game sounds
- [Zapsplat](https://www.zapsplat.com/sound-effect-category/game-sounds/) - Game sound library

### Card Art (Free Sources)
- [OpenGameArt](https://opengameart.org/) - Free game assets
- [Kenney.nl](https://kenney.nl/assets) - High-quality free assets
- [Icons8](https://icons8.com/illustrations) - Illustrations
