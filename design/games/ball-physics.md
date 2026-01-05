# Ball Physics Chain Reaction - Design Document

## Overview
A hypnotic physics-based arcade game where balls bounce, multiply, and create satisfying chain reactions in a maze-like environment. Control a paddle at the bottom to keep balls in play while they spawn more balls, creating explosive cascades of bouncing spheres. Inspired by Arkanoid/Breakout meets Plinko with particle physics.

## Core Loop
1. **Launch balls** - Start with a few balls bouncing in the arena
2. **Guide with paddle** - Move paddle left/right to redirect balls
3. **Chain reactions** - Balls collide with walls/obstacles and multiply
4. **Score points** - Each new ball spawned = points
5. **Survive** - Keep balls from falling off the bottom
6. **Level up** - More balls = higher score multiplier

The satisfaction comes from watching the exponential growth of balls creating beautiful chaos.

## Progression System
- **Score-based progression** - High score tracking
- **Ball types unlock** - Start with basic balls, unlock special types:
  - Blue balls (standard, spawn 1 new ball on wall hit)
  - Orange balls (power balls, spawn 2 balls on hit)
  - Yellow dots (bonus points)
- **Multiplier system** - More balls on screen = higher point multiplier
- **Combo tracking** - Consecutive wall hits increase combo meter

## Engagement Hooks (Research-Backed)
1. **Exponential growth satisfaction** - Watching numbers/objects multiply is inherently satisfying (see: idle games, Cookie Clicker)
2. **Physics-based unpredictability** - Each playthrough is unique due to realistic ball physics
3. **Visual feedback** - Particle trails, bounce effects, screen shake on big combos
4. **Progressive difficulty** - Player controls pacing (more balls = more chaos)
5. **"Just one more" factor** - Quick rounds (~2-3 min) encourage replays
6. **Mastery curve** - Easy to start, hard to master paddle positioning

## Features (Priority Order)

### Must-Have (MVP)
1. **Physics engine** - Realistic ball bouncing with Rapier physics
2. **Paddle control** - Mouse/touch drag + keyboard arrow keys
3. **Wall maze** - Static obstacles that create interesting bounce patterns
4. **Ball spawning** - Balls multiply on wall collision
5. **Score system** - Track current score and high score
6. **Ball counter** - Show count of each ball type on screen
7. **Game over** - When all balls fall off screen

### Important for Fun
1. **Different ball types** - Blue (standard), orange (power), yellow (bonus)
2. **Multiplier system** - 2x, 5x, 10x based on ball count
3. **Particle effects** - Trails, collision sparks, spawn explosions
4. **Sound effects** - Bounces, spawns, score dings
5. **Pause/resume** - Big pause button in corner
6. **Visual polish** - Grid background, smooth animations

### Nice to Have
1. **Power-ups** - Paddle size increase, ball magnet, slow-mo
2. **Level layouts** - Different wall configurations
3. **Achievements** - "100 balls on screen", "10x multiplier"
4. **Leaderboard** - Compare with other players
5. **Ball skins** - Unlock different visual styles

## Technical Approach

### Stack
- **React Three Fiber** - 3D rendering (balls as spheres)
- **Rapier** - Physics engine for realistic collisions
- **Zustand** - State management (score, ball count, game state)
- **2D canvas fallback** - Simpler rendering if 3D is too heavy

### Architecture
```
src/games/ball-physics/
├── components/
│   ├── Ball.tsx              # Individual ball component
│   ├── Paddle.tsx            # Player-controlled paddle
│   ├── Wall.tsx              # Static obstacle
│   ├── ScoreDisplay.tsx      # HUD showing score/multiplier
│   └── BallCounter.tsx       # Left sidebar ball type counters
├── hooks/
│   ├── usePaddleControl.ts   # Mouse/touch/keyboard input
│   └── useGameLoop.ts        # Game state machine
├── lib/
│   ├── store.ts              # Zustand store (score, balls, state)
│   ├── physics.ts            # Ball spawn logic, collision handlers
│   ├── sounds.ts             # Audio effects
│   └── constants.ts          # Ball colors, spawn rates, scoring
├── Game.tsx                  # Main game component
└── index.ts                  # Exports
```

### Physics Details
- **Gravity** - Slight downward pull (not too strong)
- **Restitution** - High bounciness (0.95) for lively movement
- **Friction** - Very low to keep balls moving
- **Collision detection** - Ball-wall, ball-paddle, ball-boundary
- **Spawn mechanic** - On wall collision, 20% chance to spawn new ball nearby

### Ball Types
```typescript
type BallType = 'blue' | 'orange' | 'yellow-dot';

const BALL_CONFIG = {
  blue: { color: '#3b82f6', spawnChance: 0.2, points: 10 },
  orange: { color: '#f97316', spawnChance: 0.4, points: 25 },
  'yellow-dot': { color: '#fbbf24', spawnChance: 0, points: 50 } // bonus only
};
```

### Game States
- `menu` - Start screen
- `playing` - Active gameplay
- `paused` - Temporarily stopped
- `gameOver` - All balls lost

## Child-Friendly Design

### Age Appropriateness (6-14)
- **No fail punishment** - No "lives" system, just score resets
- **Instant restart** - Big "Play Again" button
- **Satisfying visuals** - Bright colors, smooth motion, particle effects
- **Simple controls** - Just move the paddle (one input axis)
- **Celebration moments** - Particle bursts when spawning balls
- **No time pressure** - Play at your own pace

### UI Guidelines
- **Big pause button** (top left, 60x60px)
- **Clear score display** (top center, large font)
- **Touch-friendly paddle** - Wide drag target (200px wide, 40px tall)
- **Ball counters** - Left side, big icons with "x3" labels
- **High contrast** - Dark blue background, bright colored balls

### Mobile Considerations
- **Touch drag for paddle** - Smooth follow of finger
- **Landscape orientation** - More horizontal space for ball spread
- **Responsive canvas** - Scales to screen size
- **Performance** - Cap max balls at 150 to prevent lag
- **Reduced particles on mobile** - Simpler effects for 60fps

## Success Metrics
- Average session length > 3 minutes
- Replay rate > 60% (players restart after game over)
- High score improvement over time (progression engagement)

## Development Notes
- Start with 2D canvas for rapid prototyping, upgrade to R3F if performance allows
- Use Web Audio API for low-latency sound effects
- Store high score in localStorage (local) and sync to server
- Add visual debug mode (show physics bodies, collision points)

## Inspiration References
- **Arkanoid/Breakout** - Paddle control, ball bouncing
- **Plinko** - Chaotic ball physics, unpredictable outcomes
- **Particle physics demos** - Satisfying visual density
- **Cookie Clicker** - Exponential growth satisfaction

---

**Target completion:** Full MVP in one session
**First playable:** Core physics + paddle + spawning (~1 hour)
**Polish pass:** Sounds, particles, UI (~30 min)
