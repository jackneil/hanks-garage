# Monster Truck Mayhem - Game Design Document

## Overview

**Monster Truck Mayhem** is a 3D open-world monster truck game where players drive massive trucks through varied terrain, collect coins, upgrade their vehicles, and unlock new trucks. Built for an 8-year-old but designed with the engagement mechanics of successful mobile games like Hill Climb Racing and Offroad Outlaws.

**Target Player**: Hank Neil, age 8 (and kids 6-14)
**Platform**: Web (mobile + desktop)
**Camera**: Third-person, behind the truck
**Style**: Semi-realistic 3D with bright, vibrant colors

---

## Core Game Loop

```
DRIVE around the world
    ↓
COLLECT coins, stars, and mystery boxes
    ↓
UPGRADE your truck (engine, suspension, tires, NOS)
    ↓
UNLOCK new trucks with saved coins
    ↓
EXPLORE new areas and discover secrets
    ↓
REPEAT (with better truck = more fun)
```

### Why This Loop Works
Based on Hill Climb Racing's success (2.5+ billion downloads):
- **Simple to understand** - drive, collect, upgrade
- **Constant rewards** - coins everywhere, always progressing
- **Visible improvement** - truck gets noticeably faster/bouncier
- **"One more run"** - forgiving physics means failures are funny, not frustrating

---

## Progression System

### Currency: Coins (Soft Currency Only)

**No real money, no hard currency** - this is for an 8-year-old. Everything is earned through gameplay.

#### Earning Coins
| Source | Coins | Frequency |
|--------|-------|-----------|
| Gold coin pickup | 10 | Common (100+ in world) |
| Silver star | 25 | Uncommon (50 in world) |
| Gold star | 50 | Rare (20 in world) |
| Mystery box | 100-500 | Very rare (5 in world) |
| Airtime bonus | 5 per second | When all wheels leave ground |
| Flip bonus | 50 | Complete 360 rotation |
| Barrel roll | 75 | Complete side rotation |
| Object destruction | 5-25 | Hit crates, barrels, cars |
| Challenge completion | 200-1000 | Varies by difficulty |

#### Spending Coins

**Truck Upgrades** (4 stats, 5 levels each)
| Upgrade | Effect | Cost Per Level |
|---------|--------|----------------|
| Engine | +20% top speed | 100, 250, 500, 1000, 2500 |
| Suspension | +15% bounce/stability | 100, 250, 500, 1000, 2500 |
| Tires | +20% grip | 100, 250, 500, 1000, 2500 |
| NOS | +10% boost duration | 150, 300, 600, 1200, 3000 |

**Unlock New Trucks**
| Truck | Cost | Special Ability |
|-------|------|-----------------|
| Starter Truck (Mud Crusher) | FREE | Balanced stats |
| Big Red | 2,000 | +25% engine power |
| Bouncy Boy | 3,500 | +50% suspension |
| Grip King | 5,000 | +40% tire grip |
| Speed Demon | 8,000 | Fastest top speed |
| The Beast | 15,000 | Best all-around stats |

**Customization** (purely cosmetic)
| Item | Cost |
|------|------|
| Paint color | 200 |
| Flame decal | 500 |
| Racing stripes | 300 |
| Monster eyes | 400 |
| Skull hood | 750 |

### Progression Pacing

**First 5 minutes (onboarding)**
- Start driving immediately (no tutorial screens)
- First coin within 30 seconds
- Collect ~100 coins
- Prompted to buy first upgrade

**First session (15-30 minutes)**
- Explore starting area
- Collect 300-500 coins
- Upgrade 2-3 stats once
- Notice truck feels different (faster/bouncier)
- Discover a ramp zone
- Find first mystery box

**First week (if played 15 min/day)**
- Max out starter truck
- Unlock second truck
- Complete several challenges
- Discover all zones in main area

---

## Engagement Hooks

### Research-Backed Psychological Mechanics

#### 1. "One More Try" Effect
- **Forgiving physics**: Truck can flip but auto-recovers after 3 seconds
- **No death**: Can't "lose" - just reset position with R key or auto-reset
- **Instant restart**: Never more than 2 seconds from action
- **Exaggerated physics**: Bouncy, fun, sometimes silly = failures are entertaining

#### 2. Quick Feedback Loops
- **Constant coin collection**: Coins everywhere, always earning
- **Sound effects**: Satisfying "cha-ching" for coins, vroom for engine
- **Particle explosions**: Confetti burst when collecting stars
- **Score popups**: "+10" floats up when collecting

#### 3. "Final Stretch" Psychology
- **Progress bars**: Show "250/500 coins to next upgrade"
- **"Almost there!" messages**: "Just 50 more coins for Engine Level 2!"
- **Unlock previews**: Show greyed-out trucks with cost, tease what's coming

#### 4. Variable Rewards
- **Mystery boxes**: Random 100-500 coins (dopamine hit from uncertainty)
- **Hidden areas**: Secret spots with bonus coins
- **Stunt bonuses**: Unexpected rewards for cool moves

#### 5. Ownership & Investment
- **Customization**: Paint colors and decals make it "their" truck
- **Named trucks**: Each truck has personality
- **Upgrades are visible**: Bigger exhaust, fatter tires, etc.
- **Save progress**: Never lose coins or upgrades

#### 6. Challenge Variety
- **Timed runs**: "Collect 10 stars in 60 seconds"
- **Distance challenges**: "Reach the mountain peak"
- **Stunt challenges**: "Get 5 seconds of airtime"
- **Destruction derby**: "Smash 20 barrels"

---

## Game Modes

### 1. Free Roam (Default)
- Open world exploration
- No timer, no objectives
- Just drive around and have fun
- All coins and items persist
- Discover hidden areas

### 2. Challenge Mode
Accessed from Challenge Board in the garage.

| Challenge Type | Example | Reward |
|---------------|---------|--------|
| Time Trial | "Reach the lighthouse in 45 seconds" | 300 coins |
| Collection | "Collect 15 stars in the canyon" | 400 coins |
| Stunt | "Get 10 seconds of airtime" | 500 coins |
| Destruction | "Smash 30 objects" | 350 coins |
| Exploration | "Find the hidden cave" | 1000 coins |

Challenges reset daily (or manually).

### 3. Stunt Zone
- Special area with massive ramps
- Stunt combo system
- Flip + Barrel Roll + Long Jump = MEGA COMBO
- Bonus coins for combos

---

## World Design

### Main World: "Monster Valley"

**Size**: ~500m x 500m playable area

#### Zones

| Zone | Terrain | Features | Difficulty |
|------|---------|----------|------------|
| **Starter Meadow** | Flat grass, gentle hills | Easy coins, intro ramp | Easy |
| **Muddy Marsh** | Mud, water puddles | Slower movement, splashes | Easy-Medium |
| **Rocky Ridge** | Boulders, steep hills | Technical driving, hidden caves | Medium |
| **Canyon Run** | Narrow paths, drops | Big jumps, star clusters | Medium-Hard |
| **Stunt Park** | Ramps, loops, half-pipes | Huge airtime, stunt combos | All levels |
| **Junkyard** | Old cars, tires, debris | Destruction paradise | Easy |

#### Key Landmarks
- **The Garage** (spawn point) - see truck collection, upgrades
- **The Big Ramp** - iconic massive ramp visible from anywhere
- **The Lighthouse** - tall structure, challenge destination
- **Mystery Cave** - hidden entrance, bonus coins inside
- **The Loop** - a full 360 loop for stunt challenges

### Boundaries
- Natural cliffs/mountains at edges
- Water (truck drives on but slowly sinks = auto-respawn)
- "Out of bounds" invisible walls feel natural

---

## Controls

### Desktop (Keyboard)
| Key | Action |
|-----|--------|
| W / Arrow Up | Accelerate |
| S / Arrow Down | Brake / Reverse |
| A / Arrow Left | Steer Left |
| D / Arrow Right | Steer Right |
| Space | NOS Boost (when available) |
| H | Horn (HONK!) |
| R | Reset Position |
| ESC | Pause Menu |

### Mobile (Touch + Tilt)

```
┌─────────────────────────────────────────┐
│                                         │
│     [TILT PHONE LEFT/RIGHT = STEER]     │
│                                         │
│           3D GAME VIEW                  │
│      (camera behind truck)              │
│                                         │
│   [NOS]                     [HORN]      │
├──────────────────┬──────────────────────┤
│      BRAKE       │         GAS          │
│       ◀──        │         ──▶          │
│   (tap = brake)  │  (tap = accelerate)  │
└──────────────────┴──────────────────────┘
```

**Tilt Steering**:
- DeviceOrientationEvent (gamma axis)
- -30° to +30° tilt = full steering range
- Smoothing filter to prevent jitter
- Requires HTTPS
- iOS permission request on first use

**Fallback**: If tilt unavailable, show left/right steering buttons

---

## User Interface

### In-Game HUD
```
┌─────────────────────────────────────────┐
│ [Coins: 1,234]              [NOS: ████] │
│                                         │
│                                         │
│          GAME VIEW                      │
│                                         │
│                                         │
│ [Speed: 45 mph]           [PAUSE]       │
└─────────────────────────────────────────┘
```

- **Coin counter**: Top-left, always visible, animates when collecting
- **NOS meter**: Top-right, fills over time, depletes on use
- **Speedometer**: Bottom-left, simple mph/kph
- **Pause button**: Bottom-right (or ESC on desktop)

### Pause Menu
- Resume
- Garage (upgrades/customization)
- Challenges
- Settings (sound, controls)
- Quit to Main Menu

### Garage Screen
- 3D view of current truck (rotatable)
- Upgrade buttons with progress bars
- Truck selector (swipe through owned trucks)
- Customization tab (paint, decals)
- Coin balance prominent

---

## Audio Design

### Sound Effects
| Sound | Trigger | Style |
|-------|---------|-------|
| Engine idle | Always running | Low rumble, monster truck |
| Engine rev | Accelerating | Rising pitch, powerful |
| Coin collect | Touch coin | Bright "cha-ching" |
| Star collect | Touch star | Magical sparkle + fanfare |
| Mystery box | Open box | Slot machine sound + celebration |
| Crash/bump | Hit objects | Satisfying crunch |
| Horn | Press H | Deep truck horn, fun |
| NOS activate | Use boost | Whoooosh + fire sound |
| Airtime | Wheels leave ground | Wind rushing |
| Landing | Wheels touch ground | Suspension bounce |

### Music
- Upbeat, energetic background track
- Not distracting, loops well
- Different vibe per zone (optional)
- Volume slider in settings

---

## Child-Friendly Design (Age 8)

### Touch Targets
- All buttons minimum **60x60 pixels** (larger than standard 44px)
- Fat fingers = no accidental taps

### Visual Clarity
- **High contrast** text
- **Bright colors** - no dark/scary themes
- **Simple icons** - universally understood
- **Large fonts** - minimum 16px, headers 24px+

### Forgiving Gameplay
- **No death** - can't lose or fail
- **Auto-recovery** - flip for 3+ seconds = auto-reset
- **Always progress** - even crashing earns a few coins
- **Celebration, not punishment** - failures are funny

### Reading Level
- Short, simple words
- Icons alongside text
- No complex instructions
- Learn by doing, not reading

### Safety
- **No chat or multiplayer** (for now)
- **No real money** transactions
- **No external links** in game
- **No personal data** collection

---

## Technical Approach

### Stack
```
Next.js 16 + React 19
@react-three/fiber 9.4 - 3D rendering
@react-three/rapier 2.2 - Physics engine
@react-three/drei 10.7 - Helpers (sky, camera, etc.)
ecctrl 1.0 - Vehicle controls
zustand 5.0 - State management
```

### Key Components
```
apps/web/src/
├── app/games/monster-truck/
│   └── page.tsx              # Dynamic import, no SSR
├── components/game/
│   ├── MonsterTruckGame.tsx  # Main canvas + physics world
│   ├── Vehicle.tsx           # Truck body + wheels + physics
│   ├── Terrain.tsx           # Ground mesh + collision
│   ├── FollowCamera.tsx      # Third-person camera
│   ├── Collectible.tsx       # Coin/star with animation
│   ├── Destructible.tsx      # Breakable objects
│   ├── MobileControls.tsx    # Touch overlay
│   └── GameUI.tsx            # HUD elements
├── hooks/
│   ├── useKeyboardControls.ts
│   ├── useDeviceOrientation.ts
│   └── useTouchControls.ts
└── lib/
    ├── gameStore.ts          # Zustand: coins, upgrades, trucks
    └── constants.ts          # Balance values, costs, etc.
```

### Performance
- **Mobile first**: Cap at 30fps on weak devices
- **LOD**: Reduce detail for distant objects
- **Object pooling**: Reuse collectible instances
- **Lazy loading**: Don't load all zones at once

### Save System
- **Phase 1**: localStorage (simple, instant)
- **Phase 2**: Database sync when auth is added

---

## Implementation Phases

### Phase 1: Core Driving (MVP)
- [ ] R3F scene with physics world
- [ ] Truck with 4-wheel raycast vehicle
- [ ] Flat terrain with collision
- [ ] Third-person camera
- [ ] WASD keyboard controls
- [ ] Basic lighting and sky

**Deliverable**: A truck that drives around a flat world

### Phase 2: Mobile + Controls
- [ ] Touch pedals (gas/brake)
- [ ] Tilt steering (DeviceOrientationEvent)
- [ ] iOS permission handling
- [ ] Fallback steering buttons
- [ ] Responsive layout

**Deliverable**: Playable on phone

### Phase 3: World Building
- [ ] Terrain with hills and valleys
- [ ] Multiple ground textures
- [ ] Ramps and jumps
- [ ] World boundaries
- [ ] Zone markers

**Deliverable**: Interesting world to explore

### Phase 4: Collectibles + Rewards
- [ ] Coin pickups with particles
- [ ] Star pickups with celebration
- [ ] Mystery boxes
- [ ] Coin counter HUD
- [ ] Collection sound effects

**Deliverable**: Reason to drive around

### Phase 5: Progression System
- [ ] Zustand store for game state
- [ ] Garage UI for upgrades
- [ ] Truck stats affect physics
- [ ] Multiple trucks to unlock
- [ ] localStorage persistence

**Deliverable**: Progression loop working

### Phase 6: Challenges + Polish
- [ ] Challenge system
- [ ] Stunt detection (airtime, flips)
- [ ] Destructible objects
- [ ] More sound effects
- [ ] Performance optimization

**Deliverable**: Full game experience

### Phase 7: Customization + Extras
- [ ] Paint colors
- [ ] Decals
- [ ] Better truck models (GLTF)
- [ ] More zones
- [ ] Achievements

**Deliverable**: Complete, polished game

---

## Success Metrics

How do we know the game is good?

1. **Hank plays for 15+ minutes** without getting bored
2. **Hank asks to play again** the next day
3. **Hank talks about unlocking trucks** (progression working)
4. **Hank shows friends** (it's actually fun)
5. **No frustration** - deaths/failures don't cause upset

---

## References

- [Hill Climb Racing](https://en.wikipedia.org/wiki/Hill_Climb_Racing) - 2.5B downloads, gold standard for mobile physics games
- [Offroad Outlaws](https://apps.apple.com/us/app/offroad-outlaws/id1193687498) - Open world truck game with great customization
- [pmndrs/racing-game](https://github.com/pmndrs/racing-game) - Open source R3F racing game
- [ecctrl](https://github.com/pmndrs/ecctrl) - React Three Fiber vehicle controller
- [Game Economy Design](https://machinations.io/articles/what-is-game-economy-design) - Currency and progression best practices
- [Mobile Game Retention](https://moldstud.com/articles/p-mobile-game-development-understanding-the-power-of-retention-mechanics) - Engagement hooks research
