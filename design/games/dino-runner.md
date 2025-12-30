# Dino Runner - Game Design Document

## Overview

**Dino Runner** is a clone of Chrome's offline dinosaur game - a simple endless runner where players tap/press to make a T-Rex jump over cacti and duck under pterodactyls. The game speeds up over time, creating increasingly tense gameplay.

**Why Kids Love It:**
- **Instantly recognizable** - Every kid knows this game from Chrome
- **One-button simplicity** - Tap to jump, that's it
- **Escalating challenge** - Gets harder the longer you survive
- **Quick rounds** - 30 seconds to 2 minutes typical
- **High score bragging** - Easy to compare with friends
- **No learning curve** - Start playing immediately

**Target Player:** Hank Neil, age 8 (and kids 6-14)
**Platform:** Web (mobile + desktop)
**Style:** Pixel art monochrome with optional color themes

---

## Core Game Loop

```
GROUND scrolls left continuously
    |
OBSTACLES spawn (cacti, birds)
    |
TAP/SPACE to JUMP (hold for higher)
    |
DOWN ARROW to DUCK (avoid birds)
    |
SURVIVE = SCORE increases
    |
HIT obstacle = GAME OVER
    |
SEE score vs high score
    |
TAP to restart
    |
REPEAT ("One more try!")
```

### Why This Loop Works

- **Automatic progression** - No decisions, just reactions
- **Increasing tension** - Speed ramps up creating "zone" state
- **Simple mastery** - Timing is everything
- **Near-miss dopamine** - Close calls feel amazing
- **Milestone celebrations** - Every 100 points = flash

---

## Controls

### Mobile (Touch)
| Input | Action |
|-------|--------|
| Tap anywhere | Jump |
| Swipe down / Two-finger tap | Duck |

### Desktop (Keyboard)
| Input | Action |
|-------|--------|
| Spacebar / Up Arrow | Jump |
| Down Arrow | Duck |
| Enter | Restart |

### Control Feel
- **Jump:** Instant vertical impulse, gravity pulls back down
- **Hold jump:** Longer press = higher/longer jump
- **Duck:** Instantly shrinks hitbox, dino crouches

---

## Game Mechanics

### Physics
```typescript
const GRAVITY = 0.6;
const JUMP_VELOCITY = -12;
const MAX_JUMP_VELOCITY = -15; // Hold for higher jump
const GROUND_Y = 150;
const INITIAL_SPEED = 6;
const MAX_SPEED = 13;
const SPEED_INCREMENT = 0.001; // Per frame
```

### Obstacle Types

| Type | Height | Behavior |
|------|--------|----------|
| Small Cactus | 35px | Jump over |
| Large Cactus | 50px | Jump over |
| Cactus Group | 70px wide | Jump over |
| Pterodactyl Low | Flies at jump height | Duck under |
| Pterodactyl High | Flies high | Jump or ignore |

### Scoring
- Score increments every frame based on distance
- Every 100 points = screen flash + sound
- High score persisted locally and to cloud

### Day/Night Cycle
- Starts as day (light background)
- Every 700 points = toggle day/night
- Purely cosmetic but satisfying

---

## Features (Priority Order)

### MVP (Must Have)
1. **Running dino** with leg animation
2. **Jump mechanic** with variable height
3. **Cactus obstacles** spawning randomly
4. **Collision detection** with game over
5. **Score counter** incrementing over time
6. **Game over screen** with restart
7. **High score persistence**
8. **Mobile touch support**

### Important (Fun Factor)
9. **Duck mechanic** for pterodactyls
10. **Pterodactyl obstacles** (after 400 points)
11. **Speed ramping** over time
12. **100-point milestone flash**
13. **Sound effects** (jump, milestone, crash)
14. **Day/night cycle**
15. **Ground texture scrolling**

### Nice to Have
16. **Different dino skins** (unlockable)
17. **Power-ups** (shield, slow-mo)
18. **Themes** (space, underwater, jungle)
19. **Easter eggs** at score milestones
20. **Daily challenge mode**

---

## Technical Approach

### Stack
```
Next.js 16 + React 19
Canvas API (2D game loop)
Zustand for state
TypeScript
```

### Architecture
```
apps/web/src/games/dino-runner/
├── components/
│   ├── DinoCanvas.tsx      # Main canvas + game loop
│   ├── GameOverlay.tsx     # Start, game over screens
│   └── ScoreDisplay.tsx    # Current + high score
├── hooks/
│   ├── useGameLoop.ts
│   ├── useControls.ts
│   └── useSound.ts
├── lib/
│   ├── store.ts            # Zustand store
│   ├── physics.ts          # Jump, collision
│   ├── obstacles.ts        # Spawn logic
│   └── constants.ts
├── Game.tsx
└── index.ts
```

---

## Settings & Progress Saving

### Data Schema
```typescript
interface DinoRunnerProgress {
  highScore: number;
  gamesPlayed: number;
  totalDistance: number;      // Lifetime meters run
  longestRun: number;         // Best single run duration (ms)
  milestonesReached: number;  // Times hit 100-point milestones
  unlockedSkins: string[];    // Dino skins earned
  settings: {
    soundEnabled: boolean;
    theme: "classic" | "color" | "neon";
  };
  lastPlayed: string;
}
```

### useAuthSync Integration
```typescript
useAuthSync({
  appId: "dino-runner",
  localStorageKey: "dino-runner-progress",
  getState: store.getProgress,
  setState: store.setProgress,
  debounceMs: 3000,
});
```

---

## Kid-Friendly Design

- **Forgiving hitboxes** - Slightly smaller than visual
- **Gradual difficulty** - Starts slow, ramps gently
- **Clear visual contrast** - Black dino on light ground
- **Big score display** - Easy to read while playing
- **Instant restart** - No delay or menus
- **No punishment** - Just "Game Over" and try again
- **Celebration at milestones** - Screen flash, sound effect

---

## References

### Open Source
- [AbinandhMJ/Dino-Game-Clone](https://github.com/AbinandhMJ/Dino-Game-Clone)
- [nicksantiago/trex-runner](https://github.com/nicksantiago/trex-runner)
- [nicksantiago/chromedino](https://github.com/nicksantiago/chromedino)

### Original
- Chrome's built-in dinosaur game (chrome://dino)
