# Oregon Trail - Game Design Document

## Overview

**Oregon Trail** is a classic survival/travel simulation game where players lead a party of pioneers from Independence, Missouri to Oregon's Willamette Valley in 1848. Originally created in 1971 as an educational game, it became one of the most beloved computer games of all time. This port brings the timeless experience to Hank's Hits with kid-friendly adjustments - toning down the doom and gloom while preserving the strategic decision-making that makes it compelling.

**Target Player**: Kids ages 6-14, especially Hank (age 8)
**Platform**: Web (mobile + desktop)
**Style**: Retro pixel art with bright, cheerful colors
**Tone**: Educational but fun - less "dysentery death" and more "silly adventure"

### Why Oregon Trail?

1. **Proven engagement**: Played by tens of millions since 1971
2. **Educational value**: Geography, history, resource management, math
3. **Decision-making**: Kids love making choices that affect outcomes
4. **Replayability**: Different choices = different journeys
5. **Perfect for Hank**: Combines outdoor adventure theme with strategy

---

## Core Game Loop

```
PREPARE for the journey (buy supplies at store)
    ↓
TRAVEL west (watch miles tick by)
    ↓
ENCOUNTER random events (river crossing, weather, animals)
    ↓
MAKE DECISIONS (hunt, rest, continue, trade)
    ↓
MANAGE RESOURCES (food, health, wagon parts)
    ↓
REACH LANDMARKS (forts, rivers, mountains)
    ↓
SURVIVE to Oregon (or retry with new strategy)
    ↓
REPEAT (unlock new characters, achievements)
```

### Why This Loop Works

- **Anticipation**: "What will happen next?" drives engagement
- **Agency**: Every decision feels meaningful
- **Drama**: Random events create memorable stories
- **Learning**: Trial and error teaches optimal strategies
- **Accomplishment**: Reaching Oregon is a genuine achievement

---

## Progression System

### Journey Progress

**The Trail**: ~2,000 miles from Missouri to Oregon
- Divided into 15-20 landmarks/checkpoints
- Each segment takes 3-7 days of travel
- Total journey: approximately 5-6 months (game time)
- Playtime: 20-45 minutes per full journey

### Scoring System

| Achievement | Points | Notes |
|------------|--------|-------|
| Reach Oregon | 500 | Base completion bonus |
| Each surviving party member | 100 | Up to 5 people = 500 max |
| Remaining supplies | Variable | $1 value = 1 point |
| Early arrival (bonus for speed) | 50-200 | Based on days remaining |
| Full health party | 100 | All members healthy at end |
| Hunt master | 50 | Collect 1000+ lbs food total |
| Safe crosser | 75 | No injuries at river crossings |

### Persistence (Cross-Session Progress)

**What Gets Saved** (via useAuthSync):
- `gamesCompleted`: Number of successful Oregon arrivals
- `bestScore`: Highest total score achieved
- `totalMilesTraveled`: Cumulative miles across all games
- `partySurvivalRate`: Average party members survived
- `achievementsUnlocked`: Array of achievement IDs
- `preferredOccupation`: Most-used starting profession
- `totalPlaytimeMinutes`: Time spent playing

### Unlockables (Future Phase)

| Item | Unlock Condition | Benefit |
|------|------------------|---------|
| Banker profession | Default | Start with $1,600 |
| Carpenter profession | Complete 1 game | Wagon repairs use fewer parts |
| Farmer profession | Complete 2 games | Slower food consumption |
| Doctor profession | Complete with full party | Better healing odds |
| Trail guide | Reach 1000 total miles | Preview of next event |
| Lucky rabbit's foot | 5 games completed | +10% good event chance |

---

## Engagement Hooks

### Research-Backed Psychological Mechanics

#### 1. Meaningful Choices
- **Every decision matters**: Buy more food or oxen? Cross now or wait?
- **No "right" answer**: Trade-offs force genuine thinking
- **Consequences shown**: See how choices affect outcomes

#### 2. Random Events (Variable Rewards)
- **Surprise factor**: Never know what's coming
- **Positive events too**: Find wild berries, helpful strangers
- **Story generation**: "Remember when we found an abandoned wagon?"

#### 3. Resource Management Tension
- **Scarcity drives engagement**: Can't buy everything
- **Risk/reward decisions**: Hunt for food vs. risk injury
- **Planning ahead**: Winter is coming (literally)

#### 4. Party Attachment
- **Named characters**: Hank gets to name party members
- **Individual health**: Track each person separately
- **Emotional stakes**: "Oh no, Uncle Bob is sick!"

#### 5. Geographic Milestones
- **Real landmarks**: Chimney Rock, Fort Laramie, Blue Mountains
- **Progress visualization**: See how far you've come
- **Goal proximity**: "Only 200 miles to Oregon!"

#### 6. Replayability Through Randomization
- **Different events each game**: 30+ random encounters
- **Weather variance**: Some trips are harsh, some mild
- **Trading opportunities**: Random traders with different deals

---

## Features (Priority Order)

### MVP (Phase 1) - Core Experience

1. **Party Setup**
   - Name your party (5 members including leader)
   - Choose departure month (March-July)
   - Starting profession (affects starting money)

2. **Supply Store (Matt's General Store)**
   - Oxen ($40 each, need 2-6)
   - Food ($0.20/lb, need 200+ lbs)
   - Clothing ($10/set, 1 per person)
   - Ammunition ($2/box, for hunting)
   - Spare parts ($10-20 each)
     - Wagon wheels
     - Wagon axles
     - Wagon tongues

3. **Travel System**
   - Daily travel (12-25 miles/day based on pace)
   - Pace settings: Steady, Strenuous, Grueling
   - Weather effects on speed
   - Food consumption (auto-calculated)

4. **Random Events** (20+ events)
   - Positive: Find abandoned supplies, helpful stranger
   - Neutral: Meet other travelers, reach landmark
   - Negative: Weather delay, minor illness, lost trail
   - Severe: Broken wagon part, major illness, theft

5. **Health System** (Kid-Friendly)
   - Good / Fair / Poor / Very Poor
   - Sickness causes slowdown, not instant death
   - Resting restores health
   - Multiple "Very Poor" warnings before anyone dies

6. **Hunting Mini-Game**
   - Simple tap/click shooting
   - Animals: squirrels (small), rabbits (small), deer (medium), buffalo (large)
   - Limit: Can only carry 100-200 lbs back to wagon
   - Ammo consumption

7. **River Crossings**
   - Options: Ford, caulk wagon, ferry, wait
   - Risk/reward based on water depth
   - Ferry costs money but safe
   - Depth varies by season

8. **Win Condition**
   - Reach Willamette Valley, Oregon
   - At least 1 party member survives
   - Celebration screen with score

### Phase 2 - Enhanced Experience

9. **Trading Posts**
   - Buy/sell supplies at landmarks
   - Prices vary by location (higher as you go west)
   - Trade with other travelers (random encounters)

10. **Weather System**
    - Seasons affect temperature
    - Rain slows travel
    - Snow can be dangerous (late departures)
    - Displays current conditions

11. **Multiple Routes**
    - Choose path at certain forks
    - Longer/safer vs shorter/dangerous
    - Barlow Toll Road vs Columbia River

12. **Achievements System**
    - Bronze/Silver/Gold tiers
    - Examples: "Speed Runner" (arrive by September), "Feast Master" (hunt 500 lbs in one trip)

### Phase 3 - Nice-to-Have

13. **Character Customization**
    - Pick avatars for party members
    - Choose wagon color

14. **Event Log/Journal**
    - Record of the journey
    - Can review past trips

15. **Sound Effects & Music**
    - Wagon wheels, wildlife
    - Upbeat trail music
    - Celebration sounds

16. **Animated Scenes**
    - River crossings
    - Hunting
    - Arrival celebration

---

## Controls

### Mobile (Touch)

```
┌─────────────────────────────────────────┐
│                                         │
│   [Game Scene / Current View]           │
│                                         │
│   Status: Day 45 | Miles: 847          │
│   Food: 423 lbs | Health: Good         │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  [Continue]  [Hunt]  [Rest]  [Status]  │
│                                         │
│           [Trade]  [Menu]              │
│                                         │
└─────────────────────────────────────────┘
```

- **Large tap buttons** (60px minimum)
- **Simple navigation**: Big buttons for main actions
- **Swipe**: Scroll through status screens
- **Hunting**: Tap on animals to shoot

### Desktop (Keyboard + Click)

| Key | Action |
|-----|--------|
| Space/Enter | Continue/Confirm |
| 1-6 | Select menu options |
| H | Hunt |
| R | Rest |
| S | Status |
| T | Trade (when available) |
| Esc | Pause/Menu |

### Hunting Mini-Game Controls

**Mobile**: Tap on animals
**Desktop**: Click on animals or use arrow keys + space

- Animals move across screen
- Limited time per hunting session (30 seconds)
- Ammo counter visible
- "Carry back" limit shown

---

## Technical Approach

### Recommended Source: attilabuti/Oregon-Trail-Browser

After analyzing the three repos:

| Repo | Pros | Cons | Recommendation |
|------|------|------|----------------|
| **attilabuti/Oregon-Trail-Browser** | Faithful recreation, WASM for performance, clean structure, audio assets included, active releases (v1.3.0), demo at oregontrail.run | WASM adds complexity, may need significant refactoring | **PORT THIS ONE** |
| **nsafai/Oregon-Trail-Game** | Pure vanilla JS, easy to understand, OOP design (Game, Caravan, Event, UI classes), modern ES6+ syntax | Simpler feature set, educational project quality | Good reference for logic |
| **warnock/oregon-trail-game** | Good specs/documentation, jQuery-based, health/illness mechanics, 128 commits | jQuery dependency (anti-pattern), Bootstrap styling conflicts with DaisyUI | Reference only |

### Port Strategy

1. **Extract game logic from attilabuti repo**:
   - Core game loop (travel, events, resources)
   - Event probability tables
   - Balance values (food consumption, travel rates)
   - Historical data (landmarks, distances)

2. **Rewrite UI in React**:
   - Convert view templates to React components
   - Replace CSS with Tailwind/DaisyUI
   - Implement with kid-friendly colors

3. **Reference nsafai for OOP patterns**:
   - Game class → useOregonTrailStore (Zustand)
   - Caravan class → Party state
   - Event class → Event system
   - UI class → React components

4. **Skip from warnock**:
   - Don't use jQuery patterns
   - But reference their specs for edge cases

### Stack

```
React 19 + Next.js 16
Zustand (state management)
Tailwind + DaisyUI (styling)
Canvas API (hunting mini-game)
Howler.js (audio, if adding sounds)
```

### Key Components Architecture

```typescript
// Store structure
interface OregonTrailState {
  // Party
  party: PartyMember[];
  leader: string;
  occupation: Occupation;

  // Journey
  currentDay: number;
  milesTraveled: number;
  currentLandmark: Landmark;
  pace: 'steady' | 'strenuous' | 'grueling';

  // Resources
  food: number;
  oxen: number;
  clothing: number;
  ammunition: number;
  spareParts: { wheels: number; axles: number; tongues: number };
  money: number;

  // Conditions
  weather: Weather;
  health: HealthStatus;

  // Game state
  gamePhase: 'setup' | 'travel' | 'event' | 'landmark' | 'finished';
  currentEvent: Event | null;

  // Persistence
  gamesCompleted: number;
  bestScore: number;
  achievements: string[];
}
```

---

## Code Sources (Detailed Analysis)

### Primary: attilabuti/Oregon-Trail-Browser
**URL**: https://github.com/attilabuti/Oregon-Trail-Browser

**What to extract:**
- `/js/` - Core game logic
- `/audio/` - Sound effects (wagon, river, hunting)
- `/views/` - Template structure for screens
- Event probability tables
- Historical landmark data
- Food/supply consumption rates

**Live demo**: https://oregontrail.run (analyze for gameplay reference)

### Reference: nsafai/Oregon-Trail-Game
**URL**: https://github.com/nsafai/Oregon-Trail-Game

**What to reference:**
- OOP class structure
- Event handling patterns
- Modern JS syntax examples
- Tutorial system implementation

### Documentation: warnock/oregon-trail-game
**URL**: https://github.com/warnock/oregon-trail-game

**What to reference:**
- Detailed spec documents
- Health/illness mechanics
- Day/distance calculations
- Edge case handling

---

## Kid-Friendly Design

### Tone Adjustments

**Original (Dark)** → **Hank's Hits Version (Light)**

| Original | Kid-Friendly Version |
|----------|---------------------|
| "You have died of dysentery" | "You got a tummy ache! Time to rest up." |
| "Your party member has died" | "Billy is too tired to continue. He'll wait at the fort for help." |
| "You have been bitten by a snake" | "Yikes! A sneaky snake gave you a nibble. Apply bandage!" |
| "Cholera has struck your party" | "Uh oh, the water here tastes funny. Better boil it next time!" |
| "You drowned while crossing" | "Splash! Your wagon got a bit wet. Lost some supplies." |

### Health States (Kid Names)

| Internal State | Display Name | Icon |
|---------------|--------------|------|
| Good | "Feeling Great!" | 😊 |
| Fair | "A Little Tired" | 😐 |
| Poor | "Not So Good" | 😟 |
| Very Poor | "Really Sick" | 🤒 |

### Death Handling (IMPORTANT)

- **Party members don't "die"** - they "stay behind at the last fort to get better"
- **Game over** = "Your wagon broke down! A helpful farmer will take you back to Independence to try again."
- **Softened language throughout**: No graves, no death messages
- **Recovery is always possible**: Rest + time = health restored

### Educational Value (Sneaky Learning)

- **Geography**: Real landmarks, rivers, mountains
- **History**: 1848 context, pioneer life
- **Math**: Resource management, money calculations
- **Decision-making**: Cause and effect
- **Reading**: Text-based narrative

### Visual Design

- **Bright color palette**: Blues, greens, oranges (not brown/grey)
- **Friendly pixel art**: Cute wagon, happy animals
- **Clear icons**: Universal symbols for actions
- **Large text**: Minimum 18px for readability
- **Progress bar**: Visual representation of journey

---

## File Structure

```
apps/web/src/
├── app/
│   └── games/
│       └── oregon-trail/
│           └── page.tsx              # Dynamic import, ssr: false
│
├── games/
│   └── oregon-trail/
│       ├── components/
│       │   ├── GameSetup.tsx         # Party creation, store shopping
│       │   ├── TravelScreen.tsx      # Main travel view
│       │   ├── EventModal.tsx        # Random event display
│       │   ├── HuntingGame.tsx       # Hunting mini-game (Canvas)
│       │   ├── RiverCrossing.tsx     # River crossing decision
│       │   ├── StatusPanel.tsx       # Party health, supplies
│       │   ├── StoreUI.tsx           # General store interface
│       │   ├── LandmarkScreen.tsx    # Reached landmark celebration
│       │   ├── GameOverScreen.tsx    # Win/lose summary
│       │   └── ProgressBar.tsx       # Journey progress visualization
│       │
│       ├── lib/
│       │   ├── store.ts              # Zustand store
│       │   ├── events.ts             # Event definitions + probabilities
│       │   ├── landmarks.ts          # Trail landmarks data
│       │   ├── constants.ts          # Balance values, prices
│       │   ├── calculations.ts       # Food consumption, travel distance
│       │   └── gameLogic.ts          # Core game mechanics
│       │
│       ├── hooks/
│       │   ├── useGameLoop.ts        # Day advancement, event triggers
│       │   ├── useHunting.ts         # Hunting mini-game logic
│       │   └── usePersistence.ts     # useAuthSync wrapper
│       │
│       ├── types/
│       │   └── index.ts              # TypeScript interfaces
│       │
│       ├── assets/
│       │   ├── images/               # Pixel art sprites
│       │   └── sounds/               # Audio files (Phase 3)
│       │
│       ├── __tests__/
│       │   ├── store.test.ts
│       │   ├── calculations.test.ts
│       │   └── events.test.ts
│       │
│       ├── Game.tsx                  # Main game component
│       └── index.ts                  # Exports
│
└── public/
    └── games/
        └── oregon-trail/
            └── images/               # Static assets
```

---

## User Data & Persistence

### App Registration

**appId**: `"oregon-trail"`

Add to `packages/db/src/schema/app-progress.ts`:
```typescript
export const VALID_APP_IDS = [
  "hill-climb",
  "monster-truck",
  "weather",
  "oregon-trail",  // ← ADD THIS
] as const;
```

### Saved Data Structure

```typescript
interface OregonTrailProgress {
  // Journey stats
  gamesCompleted: number;          // Total successful completions
  gamesAttempted: number;          // Total games started
  bestScore: number;               // Highest score achieved
  fastestJourney: number;          // Fewest days to Oregon

  // Cumulative stats
  totalMilesTraveled: number;      // Sum across all games
  totalFoodHunted: number;         // Pounds of food hunted
  totalRiversCrossed: number;      // River crossings completed
  totalDaysTraveled: number;       // Days across all journeys

  // Party stats
  totalPartySaved: number;         // Party members who made it
  totalPartyLost: number;          // Party members left behind
  partyMemberNames: string[];      // Names used (for name suggestions)

  // Achievements
  achievementsUnlocked: string[];  // Achievement IDs

  // Preferences
  preferredOccupation: string;     // Most-used starting profession
  lastDepartureMonth: number;      // Last selected month

  // Meta
  lastPlayedAt: number;            // Timestamp
  totalPlaytimeMinutes: number;    // Session time tracking
}
```

### useAuthSync Integration

```typescript
// In games/oregon-trail/hooks/usePersistence.ts
import { useAuthSync } from '@/shared/hooks/useAuthSync';
import { useOregonTrailStore } from '../lib/store';

export function useOregonTrailPersistence() {
  const store = useOregonTrailStore();

  return useAuthSync({
    appId: 'oregon-trail',
    localStorageKey: 'oregon-trail-progress',
    getState: () => ({
      gamesCompleted: store.gamesCompleted,
      gamesAttempted: store.gamesAttempted,
      bestScore: store.bestScore,
      fastestJourney: store.fastestJourney,
      totalMilesTraveled: store.totalMilesTraveled,
      totalFoodHunted: store.totalFoodHunted,
      totalRiversCrossed: store.totalRiversCrossed,
      totalDaysTraveled: store.totalDaysTraveled,
      totalPartySaved: store.totalPartySaved,
      totalPartyLost: store.totalPartyLost,
      partyMemberNames: store.partyMemberNames,
      achievementsUnlocked: store.achievementsUnlocked,
      preferredOccupation: store.preferredOccupation,
      lastDepartureMonth: store.lastDepartureMonth,
      lastPlayedAt: Date.now(),
      totalPlaytimeMinutes: store.totalPlaytimeMinutes,
    }),
    setState: (data) => {
      store.loadProgress(data);
    },
  });
}
```

---

## Achievements

| ID | Name | Description | Unlock Condition |
|----|------|-------------|------------------|
| `first_journey` | Trailblazer | Complete your first journey | Reach Oregon once |
| `full_party` | Family Reunion | Arrive with all 5 party members | 5 survivors |
| `speed_demon` | Speed Demon | Arrive before September | < 150 days |
| `big_hunter` | Sharpshooter | Hunt 500 lbs in one trip | Single hunt ≥ 500 lbs |
| `safe_crossing` | River Dancer | Cross 5 rivers without incident | No crossing injuries |
| `money_bags` | Frugal Pioneer | Arrive with $500+ remaining | End money ≥ $500 |
| `health_nut` | Wellness Warrior | Arrive with all members in Good health | All "Feeling Great!" |
| `ten_journeys` | Trail Master | Complete 10 journeys | gamesCompleted ≥ 10 |
| `survivor` | Against All Odds | Complete journey after losing 3+ party members | Finish with ≤ 2 members |
| `no_hunt` | Vegetarian Trail | Complete without hunting | 0 hunting trips |

---

## Implementation Phases

### Phase 1: MVP (1-2 weeks)
- [ ] Set up file structure
- [ ] Create Zustand store with basic state
- [ ] Implement party setup screen
- [ ] Build general store (Matt's Store)
- [ ] Create travel screen with basic loop
- [ ] Add 10+ random events
- [ ] Implement health system (simplified)
- [ ] Add river crossings (basic)
- [ ] Build win/lose screens
- [ ] Add to VALID_APP_IDS

**Deliverable**: Playable journey from start to finish

### Phase 2: Enhanced Experience (1 week)
- [ ] Hunting mini-game (Canvas)
- [ ] Trading at landmarks
- [ ] Weather effects
- [ ] More events (20+)
- [ ] Achievement system
- [ ] useAuthSync integration

**Deliverable**: Full game with persistence

### Phase 3: Polish (1 week)
- [ ] Pixel art assets
- [ ] Sound effects
- [ ] Animations
- [ ] Multiple routes
- [ ] Character avatars
- [ ] Event log/journal

**Deliverable**: Polished, complete experience

---

## Success Metrics

How we know Oregon Trail is working:

1. **Hank finishes a full journey** (20-30 minute engagement)
2. **Hank talks about "what happened"** (memorable events)
3. **Hank wants to try different choices** (replay value)
4. **Hank names party members after family/friends** (personal investment)
5. **Hank asks "where is Chimney Rock?"** (educational curiosity)

---

## References

- [Original Oregon Trail (1971)](https://en.wikipedia.org/wiki/The_Oregon_Trail_(1971_video_game)) - Historical context
- [attilabuti/Oregon-Trail-Browser](https://github.com/attilabuti/Oregon-Trail-Browser) - Primary port source
- [nsafai/Oregon-Trail-Game](https://github.com/nsafai/Oregon-Trail-Game) - OOP reference
- [warnock/oregon-trail-game](https://github.com/warnock/oregon-trail-game) - Spec documentation
- [Oregon Trail Historical Society](https://www.oregontrail.org/) - Real trail info for educational accuracy
- [Internet Archive Oregon Trail](https://archive.org/details/msdos_Oregon_Trail_The_1990) - Play original for reference
