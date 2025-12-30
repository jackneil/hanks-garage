# Virtual Pet - App Design Document

## Overview

**Virtual Pet** is a Tamagotchi-style digital companion that kids care for by feeding, playing, and keeping clean. The pet has needs that change over time, creating a responsibility loop that builds emotional attachment.

**Why Kids Love It:**
- **Ownership** - "This is MY pet!"
- **Responsibility** - Caring for something feels grown-up
- **Emotional attachment** - Pet has personality, expressions
- **Reward loop** - Happy pet = happy kid
- **Daily ritual** - Check on pet becomes habit
- **No real consequences** - Unlike real pets, can't truly die

**Target Player:** Hank Neil, age 8 (and kids 6-14)
**Platform:** Web (mobile + desktop)
**Style:** Cute pixel art, bright colors

---

## Core Loop

```
PET has needs (hunger, happiness, energy, cleanliness)
    |
NEEDS decrease over time
    |
KID checks on pet
    |
FEED when hungry → hunger decreases
    |
PLAY when bored → happiness increases
    |
SLEEP when tired → energy restores
    |
CLEAN when dirty → cleanliness increases
    |
HAPPY pet → unlocks, evolves, rewards
    |
NEGLECTED pet → sad (but recovers, not punishing)
```

### Why This Works

- **Emotional investment** - Pet responds to care
- **Simple cause/effect** - Clear actions, clear results
- **Time-based** - Reasons to return daily
- **Collection** - Multiple pet types to unlock
- **No fail state** - Pet gets sad but never dies
- **Visual feedback** - Happy/sad expressions obvious

---

## Pet System

### Stats (0-100)
| Stat | Decreases By | Refilled By | Effect When Low |
|------|--------------|-------------|-----------------|
| Hunger | 5/hour | Feeding | Sad, won't play |
| Happiness | 3/hour | Playing | Sad expression |
| Energy | 10/hour (awake) | Sleeping | Sluggish, yawning |
| Cleanliness | 2/hour | Bathing | Dirty, flies |

### Pet States
```typescript
type PetMood =
  | "ecstatic"   // All stats > 80
  | "happy"      // All stats > 50
  | "content"    // Average stats 40-60
  | "sad"        // Any stat < 30
  | "miserable"  // Multiple stats < 20
  | "sleeping";  // When put to bed
```

### Evolution System
- Pets evolve based on care quality
- Day 3: Baby → Child
- Day 7: Child → Teen
- Day 14: Teen → Adult
- Better care = cuter evolutions
- Different evolution paths per species

### Pet Species (Unlockable)
| Species | Unlock Condition | Personality |
|---------|------------------|-------------|
| Blobby | Default | Easy to care for |
| Pupper | Reach Day 7 | Needs lots of play |
| Kitcat | Get 3-day streak | Independent |
| Draggo | Perfect care for 5 days | Hungry boy |
| Robo | 1000 total care actions | Low maintenance |
| Alien | Hidden - find easter egg | Random needs |

---

## Interface

### Main Screen
```
+------------------------------------------+
|  ☀️ Day 5         💰 150 coins           |
+------------------------------------------+
|                                          |
|              [PET SPRITE]                |
|                 (•‿•)                    |
|                                          |
|    ❤️ ████████░░  Happiness: 80%         |
|    🍖 ██████░░░░  Hunger: 60%            |
|    ⚡ ████░░░░░░  Energy: 40%            |
|    ✨ █████████░  Clean: 90%             |
|                                          |
+------------------------------------------+
|                                          |
|   [🍎 Feed]  [🎮 Play]  [🛁 Bath]        |
|                                          |
|   [💤 Sleep]  [🎁 Shop]  [📊 Stats]      |
|                                          |
+------------------------------------------+
```

### Mini-Games (Play)
1. **Catch** - Tap falling treats
2. **Fetch** - Throw ball, pet brings back
3. **Dance** - Rhythm tapping game
4. **Hide & Seek** - Find the pet

### Shop Items (Coins earned from mini-games)
| Item | Cost | Effect |
|------|------|--------|
| Apple | 10 | +20 hunger |
| Steak | 30 | +50 hunger |
| Ball | 20 | +30 happiness (play) |
| Bed | 50 | Faster energy restore |
| Hat | 100 | Cosmetic |
| Background | 200 | Room decoration |

---

## Features (Priority Order)

### MVP (Must Have)
1. **Pet sprite** with idle animation
2. **4 stats** that decrease over time
3. **Feed action** with animation
4. **Play mini-game** (simple)
5. **Sleep action**
6. **Bath action**
7. **Mood expressions** (happy, sad, etc)
8. **Progress persistence**

### Important (Fun Factor)
9. **Coins and shop**
10. **Multiple food types**
11. **Better mini-games**
12. **Pet sounds** (happy chirps, sad sounds)
13. **Evolution system**
14. **Day counter**
15. **Notification** when stats low

### Nice to Have
16. **Multiple pet species**
17. **Cosmetic items** (hats, accessories)
18. **Room customization**
19. **Pet tricks** (teach commands)
20. **Visit friends' pets**

---

## Technical Approach

### Stack
```
Next.js 16 + React 19
Zustand for state
TypeScript
CSS animations for pet
```

### Architecture
```
apps/web/src/apps/virtual-pet/
├── components/
│   ├── Pet.tsx              # Pet sprite + animations
│   ├── StatBars.tsx         # Need indicators
│   ├── ActionButtons.tsx    # Feed, play, etc
│   ├── MiniGame.tsx         # Play mini-games
│   └── Shop.tsx             # Buy items
├── hooks/
│   ├── usePetSimulation.ts  # Time-based stat changes
│   ├── useNotifications.ts  # Alert when needs low
│   └── useSound.ts
├── lib/
│   ├── store.ts
│   ├── evolution.ts         # Evolution logic
│   ├── species.ts           # Pet type definitions
│   └── constants.ts
├── App.tsx
└── index.ts
```

### Time Simulation
```typescript
// Calculate stats based on time away
function updateStatsFromTime(pet: Pet, lastChecked: Date): Pet {
  const now = new Date();
  const hoursAway = (now - lastChecked) / (1000 * 60 * 60);

  // Cap at 24 hours to prevent total depletion
  const cappedHours = Math.min(hoursAway, 24);

  return {
    ...pet,
    hunger: Math.max(0, pet.hunger - (5 * cappedHours)),
    happiness: Math.max(0, pet.happiness - (3 * cappedHours)),
    energy: pet.sleeping
      ? Math.min(100, pet.energy + (10 * cappedHours))
      : Math.max(0, pet.energy - (10 * cappedHours)),
    cleanliness: Math.max(0, pet.cleanliness - (2 * cappedHours)),
  };
}
```

---

## Settings & Progress Saving

### Data Schema
```typescript
interface VirtualPetProgress {
  pet: {
    name: string;
    species: string;
    stage: "baby" | "child" | "teen" | "adult";
    hunger: number;
    happiness: number;
    energy: number;
    cleanliness: number;
    sleeping: boolean;
    bornAt: string;
    lastFed: string;
    lastPlayed: string;
  };
  coins: number;
  inventory: InventoryItem[];
  unlockedSpecies: string[];
  unlockedCosmetics: string[];
  stats: {
    daysCaredFor: number;
    totalFeedings: number;
    totalPlaySessions: number;
    longestStreak: number;
    currentStreak: number;
  };
  settings: {
    soundEnabled: boolean;
    notificationsEnabled: boolean;
    petName: string;
  };
  lastChecked: string;  // Critical for time-based simulation
}
```

### useAuthSync Integration
```typescript
useAuthSync({
  appId: "virtual-pet",
  localStorageKey: "virtual-pet-progress",
  getState: store.getProgress,
  setState: store.setProgress,
  debounceMs: 1000,  // More frequent saves for pet state
});
```

---

## Kid-Friendly Design

- **No death** - Pet gets sad but never dies
- **Quick recovery** - Stats bounce back fast when cared for
- **Forgiving timing** - 24-hour cap on neglect
- **Clear feedback** - Obvious expressions and stat bars
- **Positive reinforcement** - Celebrations when fed, played with
- **Simple math** - Clear cause/effect
- **Cute design** - Big eyes, soft colors
- **Sounds** - Happy chirps, gentle alerts

### Notifications (Optional)
- "Your pet is hungry!" after 4 hours low
- "Time to play!" daily reminder
- Never more than 2 per day
- Parents can disable

---

## Pet Animations

### Required Sprites/States
| State | Animation |
|-------|-----------|
| Idle | Breathing, blinking |
| Happy | Bouncing, hearts |
| Eating | Chomp chomp |
| Playing | Jumping, spinning |
| Sleeping | Zzz, eyes closed |
| Sad | Tears, droopy |
| Dirty | Flies, brown marks |
| Bath | Bubbles, splashing |

### Animation Approach
CSS keyframe animations or sprite sheets
- Simple enough for 8-frame loops
- Responsive to state changes

---

## References

### Open Source
- [elisavetTriant/tamagotchi-virtual-pet](https://github.com/elisavetTriant/tamagotchi-virtual-pet)
- [tugcecerit/Tamagotchi-Game](https://github.com/tugcecerit/Tamagotchi-Game)
- [cconsta1/tamagotchi](https://github.com/cconsta1/tamagotchi)

### Inspiration
- Original Tamagotchi (1996)
- Neopets
- Pou mobile app
