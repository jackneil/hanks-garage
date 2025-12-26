# Cookie Clicker - Game Design Document

## Overview

**Cookie Clicker** is an idle/incremental game where players tap a giant cookie to earn cookies, then spend those cookies on upgrades and buildings that automatically generate even more cookies. It's the perfect gateway to idle games for kids ages 6-14.

**Why Kids Love It:**
- **Instant gratification** - tap = immediate reward (cookies!)
- **Big numbers** - watching your cookie count grow from 10 to 10,000 to 10,000,000 is deeply satisfying
- **Simple to understand** - no complex rules, just click and buy stuff
- **Always progressing** - even when not playing (idle income), they're earning
- **Collectible upgrades** - fun themed buildings like "Grandma's Bakery" and "Cookie Factory"

**Target Player**: Hank Neil (age 8) and kids 6-14
**Platform**: Web (mobile + desktop)
**Style**: Bright, colorful 2D with fun animations and satisfying feedback

---

## Core Loop

```
TAP the giant cookie
    |
    v
EARN cookies (1 per tap to start, more with upgrades)
    |
    v
BUY buildings (auto-generate cookies per second)
    |
    v
BUY upgrades (multiply your earnings)
    |
    v
WATCH numbers grow (satisfying progression)
    |
    v
UNLOCK achievements (dopamine hits!)
    |
    v
PRESTIGE (optional reset for permanent multipliers)
    |
    v
REPEAT (with better multipliers = faster progress)
```

### Why This Loop Works

Based on the original Cookie Clicker's massive success:
- **Zero barrier to entry** - a toddler can tap a cookie
- **Compounding rewards** - 10 CPS feels amazing when you started at 0
- **Visible progression** - numbers literally just keep going up
- **Idle rewards** - check back later, have more cookies! Magic!
- **"Just one more upgrade"** - the next milestone is always tantalizingly close

---

## Controls

### Mobile (Touch)
- **Tap cookie** - earn cookies (multi-touch supported for chaos tapping)
- **Scroll** - navigate upgrades/buildings list
- **Tap buttons** - purchase buildings and upgrades

### Desktop (Click/Keyboard)
| Input | Action |
|-------|--------|
| Left Click (cookie) | Earn cookies |
| Left Click (buttons) | Purchase items |
| Scroll Wheel | Navigate lists |
| Spacebar | Quick-tap cookie (optional accessibility) |

### Touch Feedback
- Cookie **squishes** when tapped (scale animation)
- **+1** floats up from tap location
- **Sound effect** on each tap (satisfying "pop" or "crunch")
- Cookie **particle crumbs** spray out on tap
- Screen **shake** (subtle) on rapid tapping

---

## Features (Priority Order)

### MVP (Must Have)

#### 1. Giant Tappable Cookie
- Big cookie in center of screen (60%+ of viewport on mobile)
- Satisfying squish animation on tap
- "+1" popup on each tap
- Cookie crumb particles
- Tap sound effect

#### 2. Cookie Counter
- Large, prominent display of total cookies
- Animated number changes (count-up animation)
- Abbreviations for big numbers (1.5M, 2.3B, etc.)
- Cookies per second (CPS) display

#### 3. Basic Buildings (5 for MVP)
| Building | Base Cost | Base CPS | Theme |
|----------|-----------|----------|-------|
| Cursor | 15 | 0.1 | Automatic clicking fingers |
| Grandma | 100 | 1 | Sweet old lady baking cookies |
| Bakery | 1,100 | 8 | Professional cookie bakery |
| Factory | 12,000 | 47 | Industrial cookie production |
| Mine | 130,000 | 260 | Cookie dough mines |

**Scaling**: Each building costs 15% more each purchase.

#### 4. Building Upgrades (2 per building for MVP)
Upgrade example for Grandma:
- "Rolling Pins" (500 cookies): Grandmas are 2x more effective
- "Baking Powder" (5,000 cookies): Grandmas are 2x more effective again

#### 5. Click Upgrades
- "Plastic Mouse" (100 cookies): +1 cookie per click
- "Iron Mouse" (500 cookies): +1 cookie per click
- "Titanium Mouse" (5,000 cookies): +2 cookies per click

#### 6. Basic UI
- Cookie + counter at top
- Buildings list (scrollable)
- Upgrades panel
- Settings button (sound toggle)

### Important for Fun

#### 7. Achievements System
Achievements for milestones - dopamine hits!

| Achievement | Condition | Reward |
|-------------|-----------|--------|
| First Cookie | Click cookie 1 time | Badge + +1% CPS |
| Cookie Novice | Bake 100 cookies total | Badge + +1% CPS |
| Cookie Apprentice | Bake 1,000 cookies total | Badge + +1% CPS |
| Clicker | Click 100 times | Badge |
| Speed Demon | Click 10 times in 1 second | Badge + +5% click power |
| Building Collector | Own 1 of each building | Badge + +10% CPS |
| Upgrade Master | Buy 10 upgrades | Badge + +5% CPS |

Achievement popups appear with confetti/celebration!

#### 8. More Buildings (Extended)
| Building | Base Cost | Base CPS | Theme |
|----------|-----------|----------|-------|
| Bank | 1.4M | 1,400 | Cookie investments |
| Temple | 20M | 7,800 | Ancient cookie rituals |
| Wizard Tower | 330M | 44,000 | Magical cookie conjuring |
| Spaceship | 5.1B | 260,000 | Cookies from space |
| Alchemy Lab | 75B | 1.6M | Transmute gold to cookies |

#### 9. Golden Cookies (Random Events)
- Spawn randomly every 1-5 minutes
- Click within 10 seconds for bonus:
  - "Frenzy" - 7x CPS for 30 seconds
  - "Lucky" - +10% of bank (capped at 15 min of production)
  - "Click Frenzy" - 777x click power for 13 seconds
- Bright golden glow, floats around screen
- Sound notification when spawned

#### 10. Offline Progress
- Calculate cookies earned while away
- Show "Welcome back!" with earnings summary
- Cap at 8 hours of production (prevent exploits)

### Nice to Have

#### 11. Prestige System ("Sugar Lumps")
- Reset progress for permanent multipliers
- Unlock after 1 trillion cookies baked (all time)
- Prestige level = sqrt(cookies baked / 1 trillion)
- Each prestige level = +1% permanent CPS bonus
- Keeps achievements and unlocks special upgrades

#### 12. Seasonal Themes
- Halloween (spooky cookies, pumpkin cursors)
- Christmas (candy cane buildings, santa golden cookies)
- Easter (egg cookies, bunny grandmas)

#### 13. Cookie Skins
- Unlock different cookie appearances
- Chocolate chip, sugar cookie, oreo-style, etc.
- Purely cosmetic, fun to collect

#### 14. Statistics Page
- Total cookies baked (all time)
- Total clicks
- Time played
- Cookies per click history
- Building counts

#### 15. Mini-Games
- "Cookie Storm" - tap falling cookies for bonus
- "Grandma's Challenge" - quick-time baking minigame
- Unlock via prestige

---

## Progression System

### Currency: Cookies (Single Currency)

**No real money, no premium currency** - everything earned through gameplay.

### Earning Cookies

| Source | Rate | Notes |
|--------|------|-------|
| Click | 1 (base) | Increased by upgrades |
| Cursor (each) | 0.1/sec | Auto-clicker |
| Grandma (each) | 1/sec | First real producer |
| Bakery (each) | 8/sec | Major jump |
| Factory (each) | 47/sec | Industrial scale |
| Golden Cookie | Variable | 10-60 sec of production |

### Spending Cookies

All spent on:
- **Buildings** - generate CPS
- **Upgrades** - multiply production
- **Cosmetics** - cookie skins (prestige currency)

### Number Formatting

Kids love big numbers! Format nicely:
| Range | Format |
|-------|--------|
| 0 - 999,999 | 1,234,567 |
| 1M - 999M | 1.234 million |
| 1B - 999B | 1.234 billion |
| 1T+ | 1.234 trillion |

Show exact number on hover/long-press.

---

## Engagement Hooks

### 1. Variable Ratio Reinforcement (Golden Cookies)
- Random spawn timing keeps players watching
- Unknown reward creates anticipation
- "Maybe the next one is a huge bonus!"

### 2. Progress Bars Everywhere
- Building progress: "5/10 Grandmas (need 50 more cookies)"
- Upgrade unlocks: "125/200 cookies for next upgrade"
- Achievement progress: "Click 50/100 times"

### 3. Prestige Meta-Progression
- "Start over but FASTER" is compelling
- Permanent bonuses feel like real progress
- "What if I prestige at 100 lumps vs 50?"

### 4. Idle Compounding
- Come back to MORE cookies
- Builds habit of checking
- "Let me just see how many cookies I got..."

### 5. Collection Completion
- "I need all 50 achievements!"
- "Only 2 more buildings to unlock!"
- "Gotta catch 'em all" psychology

### 6. Sound Design
- Satisfying "crunch" on each click
- "Cha-ching!" when buying
- Victory fanfare for achievements
- Subtle "whoosh" for golden cookies

---

## Technical Approach

### Stack
```
Next.js 16 + React 19    # App framework
TypeScript               # Type safety
Zustand + persist        # State management
Tailwind + DaisyUI       # Styling
Framer Motion            # Animations (cookie squish, popups)
Howler.js                # Sound effects
```

### State Management (Zustand)

```typescript
interface CookieClickerState {
  // Core
  cookies: number;
  cookiesPerClick: number;
  cookiesPerSecond: number;
  totalCookiesBaked: number;
  totalClicks: number;

  // Buildings
  buildings: Record<BuildingId, number>; // count owned

  // Upgrades
  purchasedUpgrades: string[]; // upgrade IDs

  // Achievements
  unlockedAchievements: string[];

  // Prestige
  prestigeLevel: number;
  sugarLumps: number;

  // Settings
  soundEnabled: boolean;
  musicEnabled: boolean;

  // Timestamps
  lastTick: number; // For offline calculation
  lastSaved: number;
}

interface CookieClickerActions {
  // Core gameplay
  clickCookie: () => void;
  tick: (deltaMs: number) => void;

  // Purchases
  buyBuilding: (buildingId: string) => boolean;
  buyUpgrade: (upgradeId: string) => boolean;

  // Prestige
  canPrestige: () => boolean;
  performPrestige: () => void;

  // Calculations
  calculateCPS: () => number;
  calculateClickPower: () => number;
  getBuildingCost: (buildingId: string) => number;

  // Utility
  calculateOfflineProgress: () => number;
  resetProgress: () => void;
}
```

### Game Loop

```typescript
// In Game.tsx or a hook
useEffect(() => {
  const interval = setInterval(() => {
    const now = Date.now();
    const delta = now - lastTickRef.current;
    lastTickRef.current = now;

    // Add cookies based on CPS
    const cps = calculateCPS();
    const earned = cps * (delta / 1000);
    addCookies(earned);
  }, 50); // 20 ticks per second for smooth UI

  return () => clearInterval(interval);
}, []);
```

### Offline Progress

```typescript
function calculateOfflineProgress() {
  const now = Date.now();
  const lastTick = store.getState().lastTick;
  const offlineMs = now - lastTick;

  // Cap at 8 hours
  const cappedMs = Math.min(offlineMs, 8 * 60 * 60 * 1000);

  const cps = calculateCPS();
  return cps * (cappedMs / 1000);
}
```

### Performance Considerations
- Use `requestAnimationFrame` for cookie animation, not interval
- Debounce localStorage saves (every 5 seconds)
- Memoize CPS calculation
- Virtualize building list if many buildings

---

## Code Sources (GitHub References)

### Primary References

| Repository | What to Learn |
|------------|---------------|
| [dkrsticevic/CookieClicker](https://github.com/dkrsticevic/CookieClicker) | React Cookie Clicker clone - building/upgrade structure |
| [IanTheBean/CookieClicker](https://github.com/IanTheBean/CookieClicker) | React JS implementation - UI patterns |
| [eszczepan/cookie-clicker](https://github.com/eszczepan/cookie-clicker) | Incrementer game patterns in React |
| [jstolwijk/cookie-clicker-redux-saga](https://github.com/jstolwijk/cookie-clicker-redux-saga) | State management architecture |
| [3oheme/reactclicker](https://github.com/3oheme/reactclicker) | ReactJS patterns for clicker games |

### Idle Game Architecture

| Repository | What to Learn |
|------------|---------------|
| [Mundisoft/idle-rpg](https://github.com/Mundisoft/idle-rpg) | Zustand stores + hooks for idle games |
| [kamenjan/idle-game-engine](https://github.com/kamenjan/idle-game-engine) | React idle game engine patterns |
| [aaronvanston/farmclicker](https://github.com/aaronvanston/farmclicker) | Resource gathering/selling idle patterns |
| [AntonioToni/idle-clicker](https://github.com/AntonioToni/idle-clicker) | ReactJS + TypeScript clicker game |
| [kitnato/farcebook](https://github.com/kitnato/farcebook) | Functional React idle game with atomic state |

### Additional Resources

| Repository | What to Learn |
|------------|---------------|
| [Alaricus/clicker-tutorial-react](https://github.com/Alaricus/clicker-tutorial-react) | React hooks for clicker games (tutorial) |
| [Leoocast/lofi-valley-engine](https://github.com/Leoocast/lofi-valley-engine) | Zustand + TypeScript game engine |
| [codemethis/nanite-clicker](https://github.com/codemethis/nanite-clicker) | Incremental game in React |
| [GitHub Topics: cookie-clicker](https://github.com/topics/cookie-clicker?l=typescript) | TypeScript Cookie Clicker projects |
| [GitHub Topics: idle-game](https://github.com/topics/idle-game?l=typescript) | TypeScript idle game projects |
| [GitHub Topics: incremental-game](https://github.com/topics/incremental-game) | General incremental game patterns |

---

## Kid-Friendly Design (Age 6-14)

### Touch Targets
- Cookie: **Minimum 200x200px**, ideally 60% of mobile viewport width
- Buttons: **Minimum 60x60px** (bigger than standard 44px)
- Good spacing between tap targets

### Visual Design
- **Bright, saturated colors** - blue sky, golden cookie, colorful buildings
- **High contrast** text - dark text on light backgrounds
- **Rounded corners** everywhere - friendly, not sharp
- **Big fonts** - minimum 18px body, 24px+ headers
- **Simple icons** - universally understood symbols

### Feedback & Celebration
- **Every tap feels good** - squish, sound, popup
- **Achievements = party!** - confetti, fanfare, big text
- **Numbers animate** - count up, not instant
- **Progress is visible** - bars, percentages, "almost there!"

### Reading Level
- Short words: "Buy" not "Purchase"
- Simple labels: "Grandma" not "Elderly Cookie Artisan"
- Icons with text for building types
- Tooltips for detailed info (advanced players)

### Safety
- **No external links**
- **No chat or multiplayer**
- **No real money**
- **No personal data** collection
- **Offline-first** - works without internet (after initial load)

### Accessibility
- Large touch targets
- Color not sole indicator (icons + color)
- Sound optional (visual feedback always present)
- Spacebar alternative for clicking

---

## File Structure

```
apps/web/src/
├── app/
│   └── games/
│       └── cookie-clicker/
│           └── page.tsx           # Route - dynamic import wrapper
│
├── games/
│   └── cookie-clicker/
│       ├── components/
│       │   ├── Cookie.tsx         # The big tappable cookie
│       │   ├── CookieCounter.tsx  # Cookie count + CPS display
│       │   ├── BuildingList.tsx   # List of purchasable buildings
│       │   ├── BuildingItem.tsx   # Single building row
│       │   ├── UpgradeList.tsx    # Available upgrades
│       │   ├── UpgradeItem.tsx    # Single upgrade card
│       │   ├── GoldenCookie.tsx   # Random golden cookie spawner
│       │   ├── AchievementPopup.tsx # Achievement unlock celebration
│       │   ├── OfflinePopup.tsx   # "Welcome back" earnings popup
│       │   ├── PrestigeModal.tsx  # Prestige reset confirmation
│       │   └── SettingsMenu.tsx   # Sound/music toggles
│       │
│       ├── hooks/
│       │   ├── useGameLoop.ts     # Main game tick logic
│       │   ├── useClickHandler.ts # Cookie click with animation
│       │   ├── useOfflineProgress.ts # Calculate offline earnings
│       │   ├── useAchievements.ts # Check and unlock achievements
│       │   └── useGoldenCookie.ts # Random golden cookie spawning
│       │
│       ├── lib/
│       │   ├── store.ts           # Zustand store + persist
│       │   ├── constants.ts       # Buildings, upgrades, costs
│       │   ├── calculations.ts    # CPS, costs, prestige formulas
│       │   ├── achievements.ts    # Achievement definitions
│       │   ├── sounds.ts          # Sound effect manager
│       │   └── format.ts          # Number formatting (1.5M, etc)
│       │
│       ├── Game.tsx               # Main game component
│       ├── index.ts               # Exports
│       │
│       └── __tests__/
│           ├── store.test.ts      # Store logic tests
│           ├── calculations.test.ts # Formula tests
│           └── Game.test.tsx      # Component render tests
│
└── public/
    └── games/
        └── cookie-clicker/
            ├── images/
            │   ├── cookie.png     # Main cookie
            │   ├── cookie-crumb.png
            │   ├── golden-cookie.png
            │   └── buildings/     # Building icons
            │       ├── cursor.png
            │       ├── grandma.png
            │       └── ...
            └── sounds/
                ├── click.mp3
                ├── buy.mp3
                ├── achievement.mp3
                └── golden.mp3
```

---

## User Data & Persistence

### App Registration

**appId**: `"cookie-clicker"`

Add to `VALID_APP_IDS` in `packages/db/src/schema/app-progress.ts`:

```typescript
export const VALID_APP_IDS = [
  "hill-climb",
  "monster-truck",
  "weather",
  "cookie-clicker",  // <-- ADD THIS
] as const;
```

### Data to Save

```typescript
interface CookieClickerSaveData {
  // Core progress
  cookies: number;
  totalCookiesBaked: number;
  totalClicks: number;

  // Buildings (count owned)
  buildings: {
    cursor: number;
    grandma: number;
    bakery: number;
    factory: number;
    mine: number;
    bank: number;
    temple: number;
    wizardTower: number;
    spaceship: number;
    alchemyLab: number;
  };

  // Purchased upgrade IDs
  purchasedUpgrades: string[];

  // Achievements (unlocked IDs)
  unlockedAchievements: string[];

  // Prestige
  prestigeLevel: number;
  sugarLumps: number;

  // Settings
  soundEnabled: boolean;
  musicEnabled: boolean;

  // Timestamps
  lastTick: number;       // For offline calculation
  lastSyncedAt: number;   // For server sync
}
```

### useAuthSync Integration

```typescript
// In Game.tsx or a wrapper component
import { useAuthSync } from "@/shared/hooks";
import { useCookieClickerStore } from "./lib/store";

export function CookieClickerSyncWrapper() {
  const getState = useCookieClickerStore((s) => () => ({
    cookies: s.cookies,
    totalCookiesBaked: s.totalCookiesBaked,
    totalClicks: s.totalClicks,
    buildings: s.buildings,
    purchasedUpgrades: s.purchasedUpgrades,
    unlockedAchievements: s.unlockedAchievements,
    prestigeLevel: s.prestigeLevel,
    sugarLumps: s.sugarLumps,
    soundEnabled: s.soundEnabled,
    musicEnabled: s.musicEnabled,
    lastTick: s.lastTick,
  }));

  const setState = useCookieClickerStore((s) => s.loadSavedData);

  const { syncStatus, isGuest } = useAuthSync({
    appId: "cookie-clicker",
    localStorageKey: "cookie-clicker-storage",
    getState,
    setState,
    debounceMs: 5000, // Save every 5 seconds
  });

  return <CookieClickerGame syncStatus={syncStatus} isGuest={isGuest} />;
}
```

### localStorage Key

```
cookie-clicker-storage
```

Zustand persist middleware handles this automatically.

---

## Implementation Phases

### Phase 1: Core Click Loop (MVP)
- [ ] Giant cookie that responds to clicks
- [ ] Cookie counter with animations
- [ ] Click sound effect
- [ ] Basic styling (centered cookie, counter above)

**Deliverable**: You can click a cookie and see number go up

### Phase 2: Buildings
- [ ] Building definitions (5 MVP buildings)
- [ ] Building list UI
- [ ] Purchase logic (costs, scaling)
- [ ] CPS calculation and display
- [ ] Game loop (tick every 50ms)

**Deliverable**: Automatic cookie generation working

### Phase 3: Upgrades
- [ ] Upgrade definitions (click power + building multipliers)
- [ ] Upgrade panel UI
- [ ] Purchase and apply upgrades
- [ ] CPS/click power recalculation

**Deliverable**: Meaningful spending choices

### Phase 4: Persistence
- [ ] Zustand persist middleware
- [ ] Offline progress calculation
- [ ] "Welcome back" popup
- [ ] useAuthSync integration

**Deliverable**: Progress saves and loads

### Phase 5: Polish & Feedback
- [ ] Cookie squish animation (Framer Motion)
- [ ] "+1" popups on click
- [ ] Particle effects (cookie crumbs)
- [ ] Number count-up animations
- [ ] Sound effects for all actions

**Deliverable**: Satisfying game feel

### Phase 6: Achievements
- [ ] Achievement definitions
- [ ] Progress tracking
- [ ] Unlock detection
- [ ] Celebration popups (confetti!)
- [ ] Bonus CPS for achievements

**Deliverable**: Dopamine hits for milestones

### Phase 7: Golden Cookies
- [ ] Random spawn logic
- [ ] Floating animation
- [ ] Click detection
- [ ] Bonus effects (Frenzy, Lucky, Click Frenzy)
- [ ] Visual/audio feedback

**Deliverable**: Exciting random events

### Phase 8: Prestige (Nice to Have)
- [ ] Prestige calculation
- [ ] Reset confirmation UI
- [ ] Permanent bonus application
- [ ] Sugar Lump tracking

**Deliverable**: Meta-progression for dedicated players

---

## Success Metrics

1. **Hank plays for 10+ minutes** without getting bored
2. **Hank checks back** the next day (idle earnings hook worked)
3. **Hank talks about "getting more grandmas"** - understands the loop
4. **Hank shows someone the big numbers** - proud of progress
5. **No confusion** about what to do next - always a clear goal

---

## References

### Game Design
- [Original Cookie Clicker](https://orteil.dashnet.org/cookieclicker/) - The gold standard
- [Cookie Clicker Wiki](https://cookieclicker.fandom.com/) - Mechanics documentation
- [Idle Game Design Breakdown](https://www.gamedeveloper.com/design/the-psychology-behind-idle-games) - Psychology of idle games
- [Incremental Games Reddit](https://www.reddit.com/r/incremental_games/) - Community insights

### Technical
- [Zustand Persist](https://docs.pmnd.rs/zustand/integrations/persisting-store-data) - State persistence
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Howler.js](https://howlerjs.com/) - Audio library
- [React Spring](https://react-spring.io/) - Alternative animation library

### Art/Sound Assets (Free)
- [OpenGameArt](https://opengameart.org/) - Free game assets
- [Kenney.nl](https://kenney.nl/) - Free game assets
- [Freesound](https://freesound.org/) - Sound effects
