# Claude Instructions for Hank's Hits

## IMPORTANT: Read This First

**Before doing ANYTHING in this project, read `design/ARCHITECTURE.md` to understand the full technical context.**

---

## What Is This Project?

This is **Hank's Hits** - a web platform where an **8-year-old boy named Hank Neil** can request random things to be built:
- Simple apps (weather, toy finder, jokes)
- **3D Games** (monster truck open world, racing, etc.)
- Whatever random idea pops into his head

**Hank cannot code.** He will just describe what he wants. **You (Claude) build everything.**

---

## Who Is Hank?

- 8 years old (full name: Hank Neil)
- Likes: **trucks**, video games, hunting, golf, soccer, outdoor stuff
- Target audience: kids ages 6-14
- He doesn't know anything about coding, architecture, or technical stuff
- He'll just say things like "I want a monster truck game" or "show me cool toys"

---

## Your Role

You are the **sole developer** of this platform. Hank is the **product owner** who tells you what to build.

When Hank asks for something:
1. **Read `design/ARCHITECTURE.md`** if you haven't already
2. Understand what type of thing he's asking for (app vs game)
3. Use the appropriate template
4. Build it following the established patterns
5. Keep it kid-friendly (big buttons, bright colors, simple navigation)

---

## Tech Stack

| Component | Choice | Notes |
|-----------|--------|-------|
| **Hosting** | Railway only | PostgreSQL + web app |
| **Framework** | Next.js 16 + React 19 | App Router |
| **Auth** | Better Auth + Google SSO | Skip for now, add later |
| **Database** | PostgreSQL + Drizzle ORM | When needed |
| **Styling** | Tailwind + DaisyUI | Kid-friendly theme |
| **3D Games** | React Three Fiber + Rapier | For monster truck, etc |

### 3D Game Stack (IMPORTANT)
```
three@0.182.0
@react-three/fiber@9.4.2     # React ^19
@react-three/rapier@2.2.0    # Physics
@react-three/drei@10.7.7     # Helpers
ecctrl@1.0.97                # Vehicle controller + joystick
```

### Next.js + R3F Rules
1. **Always use `"use client"`** for R3F components
2. **Always use dynamic import** with `{ ssr: false }`:
   ```tsx
   const Game = dynamic(() => import('./Game'), { ssr: false });
   ```
3. May need in `next.config.ts`:
   ```ts
   transpilePackages: ['three']
   ```

---

## MANDATORY: Compartmentalized Structure

**Each game/widget/app is a SELF-CONTAINED MODULE.** Do NOT pollute shared folders with feature-specific code.

### Why This Matters
- This platform will have MANY games and widgets
- Each feature should be an island - easy to add, easy to remove
- Only extract to `shared/` when a SECOND feature actually needs it
- Don't abstract prematurely

### Folder Structure
```
apps/web/src/
├── app/                           # Next.js routes ONLY
│   ├── games/
│   │   └── monster-truck/
│   │       └── page.tsx           # Just imports from src/games/
│   ├── apps/
│   │   └── weather/
│   │       └── page.tsx           # Just imports from src/apps/
│   └── dashboard/
│       └── page.tsx
│
├── games/                         # SELF-CONTAINED game modules
│   └── monster-truck/
│       ├── components/            # Game-specific components
│       │   ├── Vehicle.tsx
│       │   ├── Terrain.tsx
│       │   └── ...
│       ├── hooks/                 # Game-specific hooks
│       │   ├── useControls.ts
│       │   └── ...
│       ├── lib/                   # Game-specific logic
│       │   ├── store.ts
│       │   ├── sounds.ts
│       │   └── constants.ts
│       ├── Game.tsx               # Main game component
│       └── index.ts               # Exports
│
├── apps/                          # SELF-CONTAINED app modules
│   └── weather/
│       ├── components/
│       ├── lib/
│       └── index.ts
│
├── shared/                        # ONLY truly reusable stuff
│   ├── components/               # Shared UI (buttons, modals)
│   ├── hooks/                    # Shared hooks (useIsMobile)
│   └── lib/                      # Shared utils
│
└── public/                        # Static assets

packages/
├── ui/                            # Shared kid-friendly components
└── db/                            # Database (when needed)
```

### Rules
1. **Route files are thin** - `page.tsx` just imports and renders the module
2. **Game code lives in `src/games/<name>/`** - NOT in generic folders
3. **App code lives in `src/apps/<name>/`** - NOT in generic folders
4. **`shared/` starts EMPTY** - only add when genuinely reused
5. **Each module has its own hooks, lib, components** - self-contained
6. **Tests go alongside the module** - `src/games/monster-truck/__tests__/`

---

## MANDATORY: Progress Validation Schemas

**Every game/app that syncs progress to the server MUST have a Zod validation schema.**

### Why?
- Prevents users from exploiting the API by sending fake data like `{"coins": 999999999}`
- Catches schema mismatches early (before they spam Railway logs)
- Validates all fields have reasonable bounds

### Where Schemas Live
`apps/web/src/lib/progress-schemas.ts`

### When Building a New Game/App

1. **Define your progress type** in `lib/store.ts`:
   ```typescript
   export type MyGameProgress = {
     highScore: number;
     gamesPlayed: number;
     settings: { soundEnabled: boolean };
     lastModified: number;
   };
   ```

2. **Add a matching Zod schema** in `progress-schemas.ts`:
   ```typescript
   const myGameSchema = z.object({
     highScore: z.number().min(0).max(MAX_CURRENCY),
     gamesPlayed: z.number().min(0).max(MAX_COUNT),
     settings: z.object({
       soundEnabled: z.boolean(),
     }),
     lastModified: timestampSchema,
   }).strict();
   ```

3. **Register it** in `PROGRESS_SCHEMAS`:
   ```typescript
   export const PROGRESS_SCHEMAS = {
     // ... existing schemas
     "my-game": myGameSchema,
   };
   ```

### Schema Rules
- Always use `.strict()` to reject unknown fields
- Use `MAX_CURRENCY` (1 trillion) for currencies/scores
- Use `MAX_COUNT` (1 million) for counts
- Use `boundedString` for strings (max 255 chars)
- Use `timestampSchema` for lastModified
- Use `boundedRecord()` for objects with dynamic keys

### If You Skip This
The API will reject all progress saves with:
```
Invalid progress data for my-game: No validation schema for app: my-game
```
And Railway logs will be spammed with errors. Don't be that guy.

---

## MANDATORY: Game/App Metadata

**Every game/app MUST have a `metadata.ts` file for automatic discovery on the home page.**

### Why?
- The home page dynamically discovers games by scanning for `metadata.ts` files
- Without it, your game won't appear on the home page grid
- It defines the card display (emoji, name, category)

### File Location
`src/games/<name>/metadata.ts` or `src/apps/<name>/metadata.ts`

### Required Fields
```typescript
import type { GameMetadata } from "@/shared/lib/game-registry";

export const metadata: GameMetadata = {
  id: "my-game",              // URL slug (matches folder name)
  name: "My Game",            // Display name
  emoji: "🎮",                // Card icon
  category: "arcade",         // Where it appears on home page
  description: "Short desc",  // Optional tooltip
  hidden: false,              // Set true to hide from home page
};
```

### Valid Categories
- `"racing"` - Racing & Driving
- `"board"` - Board Games
- `"arcade"` - Arcade Classics
- `"action"` - Action Games
- `"puzzle"` - Puzzle Games
- `"retro"` - Retro Gaming
- `"apps"` - Fun Apps

---

## MANDATORY: Store Pattern (Zustand)

**Every game/app with progress tracking MUST follow this store pattern.**

### File Location
`src/games/<name>/lib/store.ts`

### Required Elements

1. **Progress Type** - What gets saved to the server:
   ```typescript
   export type MyGameProgress = {
     highScore: number;
     gamesPlayed: number;
     // ... your fields
     lastModified: number;  // ALWAYS include this
   };
   ```

2. **getProgress/setProgress Functions** - Required for cloud sync:
   ```typescript
   const useMyGameStore = create<State & Actions>()(
     persist(
       (set, get) => ({
         progress: defaultProgress,

         // REQUIRED for cloud sync
         getProgress: () => get().progress,
         setProgress: (data: MyGameProgress) => set({ progress: data }),

         // ... your game logic
       }),
       {
         name: "my-game-state",
         partialize: (state) => ({ progress: state.progress }),
       }
     )
   );
   ```

3. **Always update lastModified** when progress changes:
   ```typescript
   set({
     progress: {
       ...state.progress,
       score: newScore,
       lastModified: Date.now(),  // ALWAYS update this
     },
   });
   ```

---

## MANDATORY: Index Exports

**Every game/app MUST have an `index.ts` that exports the main component and store.**

### File Location
`src/games/<name>/index.ts`

### Template
```typescript
// <GameName> Game - Main exports
// Self-contained game module

export { MyGame, default } from "./Game";
export { useMyGameStore } from "./lib/store";
export type { MyGameProgress } from "./lib/store";
```

---

## New Game/App Checklist

When building a new game or app, you MUST create these files:

1. **`metadata.ts`** - For home page discovery
2. **`lib/store.ts`** - With Progress type, getProgress, setProgress
3. **`index.ts`** - Main exports
4. **`Game.tsx`** - Main component (use `"use client"`)
5. **Progress schema** - In `apps/web/src/lib/progress-schemas.ts`
6. **Route page** - In `app/games/<name>/page.tsx` (thin wrapper)

### Verification
After creating a new game, check:
- [ ] Does it appear on the home page?
- [ ] Does progress save to localStorage?
- [ ] Are there no schema errors in Railway logs?
- [ ] Does the profile page show proper stats for this game?

---

## MANDATORY: Profile Page Stats Display

**Every game/app MUST have a case in the game stat extractor to display stats on the profile page.**

### Why?
- Without an entry, the profile page shows generic or no stats for your game
- Users expect to see their progress details (wins, high scores, records)
- Generic fallback only shows highScore - missing rich stats like accuracy, streaks, etc.

### Where It Lives
`apps/web/src/apps/profile/lib/gameStatExtractor.ts`

### When Building a New Game/App

Add a case to the `extractGameStats` switch statement:

```typescript
case "my-game":
  return {
    ...baseInfo,
    primaryStat: data.highScore
      ? { label: "High Score", value: formatNumber(data.highScore as number) }
      : null,
    secondaryStats: [
      data.gamesPlayed && { label: "Games", value: String(data.gamesPlayed) },
      data.totalXYZ && { label: "XYZ", value: String(data.totalXYZ) },
    ].filter(Boolean) as { label: string; value: string }[],
  };
```

### Guidelines
1. **primaryStat** - The main stat displayed prominently (high score, wins, level)
2. **secondaryStats** - Up to 3 supporting stats (games played, accuracy, streaks)
3. **Use correct field names** - Check your store's Progress type for exact field names
4. **Show meaningful stats** - Win/loss records, accuracy percentages, best streaks
5. **Don't use `data.wins`** - Most stores use `gamesWon`, not `wins`

### If You Skip This
The profile page will fall through to the default case and only show a generic "High Score" or nothing at all. Your users will be sad.

---

## Monster Truck Game Details

### Controls
**Mobile (Touch + Tilt):**
- Tilt phone left/right = steer (DeviceOrientationEvent gamma)
- Touch pedals: left = brake, right = gas
- Requires HTTPS for tilt
- iOS needs permission request

**Desktop (Keyboard):**
- WASD or Arrow keys
- Space = handbrake
- H = horn
- R = reset position

### What Makes It Fun (Research)
- **Forgiving physics** - truck can flip but auto-recovers
- **Big horn button** - kids love honking
- **Collectibles everywhere** - stars with celebrations
- **Themed zones** - different areas to discover
- **Unlockable trucks** - progression system

---

## Kid-Friendly UI Guidelines

- **Big buttons** (44x44px minimum) - small fingers
- **Bright colors** - blue (primary), green (secondary), orange (accent)
- **Simple navigation** - minimal clicks to get anywhere
- **Celebrations** - confetti/particles when collecting stuff
- **Sound effects** - engine, horn, collection sounds
- **Auto-recovery** - don't punish failures harshly

---

## Things Hank Might Ask For

### Games
- "Make a monster truck game with jumps"
- "I want to crush stuff with a big truck"
- "Add more levels"
- "Make a racing game"

### Simple Apps
- "Show me the weather"
- "What are the coolest toys right now?"
- "Tell me a joke"

### Enhancements
- "Add a horn that honks"
- "Make it louder"
- "Add more trucks"
- "Save my score"

---

## MANDATORY: Design Documents

**Every game, widget, or significant feature MUST have a design document BEFORE implementation.**

### Why Design Docs?
- Forces thinking through the full feature, not just a demo
- Creates a reference for building the complete experience
- Documents engagement hooks, progression, and what makes it FUN
- Prevents half-assed implementations

### Design Doc Requirements
1. **Location**: `design/games/<game-name>.md` or `design/apps/<app-name>.md`
2. **Create BEFORE writing code** - plan first, build second
3. **Include at minimum**:
   - Core gameplay/interaction loop
   - Progression system (what keeps users coming back)
   - Engagement hooks (research-backed)
   - Feature breakdown with priorities
   - Technical approach
   - Child-friendly considerations (big buttons, forgiving, celebratory)

### Design Doc Template
```markdown
# <Feature Name> Design Document

## Overview
One paragraph describing what this is and why it's fun.

## Core Loop
What does the user do repeatedly? Why is it satisfying?

## Progression System
How does the user advance? What do they unlock?

## Engagement Hooks
What keeps them playing? (Research-backed reasons)

## Features (Priority Order)
1. Must-have for MVP
2. Important for fun
3. Nice to have

## Technical Approach
How will this be built?

## Child-Friendly Design
Age-appropriate considerations.
```

---

## MANDATORY: Testing

**Every significant feature MUST have tests.** This prevents breaking things as we add more.

### Test Requirements
1. **Run tests before pushing** - `pnpm test`
2. **Add tests for new components** - at minimum, "renders without crashing"
3. **Test critical game logic** - physics helpers, scoring, controls
4. **Keep tests fast** - should run in <30 seconds total

### Test Commands
```bash
pnpm test        # Run all tests
pnpm test:watch  # Watch mode during development
```

### What to Test
- Page components render without errors
- Game components mount correctly (even if 3D canvas is mocked)
- Utility functions (scoring, physics helpers)
- Hooks (keyboard controls, touch controls)

---

## What NOT To Do

1. **Don't overcomplicate** - Hank doesn't care about perfect architecture
2. **Don't add external services** - Railway only for now
3. **Don't make tiny buttons** - remember, it's for kids
4. **Don't punish failures** - games should be forgiving
5. **Don't skip mobile** - tilt controls are essential
6. **Don't skip tests** - every feature needs basic tests

---

## When In Doubt

1. Read `design/ARCHITECTURE.md`
2. Look at the plan file in `~/.claude/plans/`
3. Keep it simple
4. Make it fun
5. Ask Hank what he wants (he's the boss)

---

## Contact

This project was set up by Hank's dad (Jack). The design documents contain all the technical decisions. Follow them unless Hank or Jack explicitly asks for changes.
