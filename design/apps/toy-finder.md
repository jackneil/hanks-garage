# Toy Finder - App Design Document

## Overview

**Toy Finder** is a kid-friendly app for browsing trending toys and building wishlists for birthdays, Christmas, or whenever Hank wants to beg his parents for something new. Kids can explore toys by category, add favorites to their wishlist with priority levels, and share that wishlist with family.

**Target User**: Hank Neil, age 8 (and kids 6-14)
**Platform**: Web (mobile + desktop)
**Purpose**: Browse toys, build wishlist, share with family

The app is essentially a kid-powered gift registry. Instead of parents guessing what to buy, Hank can show them exactly what he wants - with priorities so they know what's REALLY important.

---

## Core Experience

### The Wishlist Loop

```
BROWSE trending toys by category
    |
DISCOVER cool new toys (big images, ratings)
    |
TAP "I WANT THIS!" to add to wishlist
    |
SET PRIORITY (Need It / Want It / Maybe)
    |
SHARE wishlist link with family
    |
CHECK wishlist before birthday/Christmas
    |
CELEBRATE when toys arrive!
```

### Why This Works

- **Visual browsing** - Kids shop with their eyes, not search bars
- **Simple decisions** - Just "Add" or "Skip", no complex filtering
- **Priority system** - Teaches decision-making without being a drag
- **Shareable** - Parents/grandparents get exact links (no guessing)
- **Anticipation** - Building a wishlist is half the fun

---

## Controls & Navigation

### Mobile (Primary)

```
+---------------------------------------+
|  [<]  TOY FINDER           [Wishlist] |
+---------------------------------------+
|  [Action]  [LEGO]  [Games]  [Outdoor] |  <- Category tabs (swipeable)
+---------------------------------------+
|                                       |
|  +-------------+  +-------------+     |
|  |   [IMAGE]   |  |   [IMAGE]   |     |
|  |  Toy Name   |  |  Toy Name   |     |
|  |  $29.99     |  |  $49.99     |     |
|  | [I WANT IT] |  | [I WANT IT] |     |
|  +-------------+  +-------------+     |
|                                       |
|  +-------------+  +-------------+     |
|  |   [IMAGE]   |  |   [IMAGE]   |     |
|  |  Toy Name   |  |  Toy Name   |     |
|  |  $19.99     |  |  $39.99     |     |
|  | [I WANT IT] |  | [I WANT IT] |     |
|  +-------------+  +-------------+     |
|                                       |
+---------------------------------------+
```

- **2-column grid** on mobile
- **Large touch targets** (60x60px minimum for buttons)
- **Infinite scroll** or load more
- **Pull to refresh** for new toys

### Desktop

```
+------------------------------------------------------------------+
|  [Logo] TOY FINDER                              [Wishlist (12)]   |
+------------------------------------------------------------------+
|                                                                    |
|  Categories: [All] [Action Figures] [LEGO] [Video Games]          |
|              [Outdoor] [Arts & Crafts] [Vehicles] [Dolls]         |
|                                                                    |
|  Age: [All Ages] [6-8] [9-12] [13+]     Sort: [Trending]          |
+------------------------------------------------------------------+
|                                                                    |
|  +-----------+  +-----------+  +-----------+  +-----------+       |
|  |  [IMAGE]  |  |  [IMAGE]  |  |  [IMAGE]  |  |  [IMAGE]  |       |
|  | Toy Name  |  | Toy Name  |  | Toy Name  |  | Toy Name  |       |
|  | $29.99    |  | $49.99    |  | $19.99    |  | $39.99    |       |
|  |[I WANT IT]|  |[I WANT IT]|  |[I WANT IT]|  |[I WANT IT]|       |
|  +-----------+  +-----------+  +-----------+  +-----------+       |
|                                                                    |
+------------------------------------------------------------------+
```

- **4-column grid** on desktop
- **Hover states** for cards (subtle lift effect)
- **Keyboard navigation** supported
- **Filter sidebar** optional (collapsed by default)

---

## Features (Priority Order)

### MVP (Phase 1) - Must Have

| Feature | Description | Why It's Essential |
|---------|-------------|--------------------|
| **Browse Toys Grid** | Visual grid of toys with images, names, prices | Core experience - can't have toy finder without toys |
| **Categories** | Filter by: Action Figures, LEGO, Video Games, Outdoor, Arts & Crafts, Vehicles, Dolls, Other | Kids think in categories, not keywords |
| **Add to Wishlist** | "I WANT THIS!" button on each toy | The whole damn point |
| **View Wishlist** | See all added toys in one place | Users need to see what they've saved |
| **Remove from Wishlist** | Swipe or X button to remove | Change their minds constantly |
| **Basic Persistence** | Save wishlist to localStorage | Don't lose data on refresh |

### Phase 2 - Important for Fun

| Feature | Description | Why It Matters |
|---------|-------------|----------------|
| **Priority Levels** | NEED IT (fire emoji), WANT IT (star), MAYBE (meh) | Parents need to know what's really important |
| **Share Wishlist** | Generate shareable link | So grandma can see what to buy |
| **Age Filter** | Filter toys by age range (6-8, 9-12, 13+) | Age-appropriate results |
| **Sort Options** | Trending, Price Low-High, Price High-Low, Newest | Basic organization |
| **Auth Sync** | Sync wishlist to database when logged in | Access wishlist on any device |
| **Toy Detail View** | Full-screen view with description, reviews | More info before adding |

### Phase 3 - Nice to Have

| Feature | Description | Why It's Cool |
|---------|-------------|---------------|
| **Price Tracking** | Show if price dropped since adding | "It's on sale, Dad!" |
| **Multiple Wishlists** | Birthday list, Christmas list, etc. | Organize by occasion |
| **Notes** | Add personal notes to wishlist items | "The blue one, not red" |
| **Affiliate Links** | Direct buy links (generates revenue) | Monetization path |
| **Search Bar** | Text search for specific toys | Power user feature |
| **Trending Badge** | "Hot!" badge on popular items | Social proof |
| **Recently Viewed** | Quick access to recently viewed toys | Easy re-finding |

### Phase 4 - Future Expansion

| Feature | Description |
|---------|-------------|
| Price alerts (notify when price drops) |
| "Bought" tracking (mark items purchased) |
| Gift registry mode (others mark what they're buying) |
| Integration with Amazon/Target cart |
| Barcode scanner for in-store scanning |

---

## Technical Approach

### Stack

```
Next.js 16 + React 19
TypeScript
Tailwind + DaisyUI
Zustand for state management
useAuthSync hook for persistence
```

### Data Flow

```
┌─────────────────┐      ┌─────────────────┐
│   Toy Data      │      │   User State    │
│   (API/JSON)    │      │   (Zustand)     │
└────────┬────────┘      └────────┬────────┘
         │                        │
         ▼                        ▼
┌─────────────────────────────────────────┐
│           React Components              │
│  - ToyGrid                              │
│  - ToyCard                              │
│  - WishlistView                         │
│  - CategoryTabs                         │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│           Persistence Layer             │
│  - Guest: localStorage                  │
│  - Auth: useAuthSync → PostgreSQL       │
└─────────────────────────────────────────┘
```

### State Management (Zustand)

```typescript
interface ToyFinderState {
  // Wishlist
  wishlistItems: WishlistItem[];
  addToWishlist: (toy: Toy, priority: Priority) => void;
  removeFromWishlist: (toyId: string) => void;
  updatePriority: (toyId: string, priority: Priority) => void;

  // Browsing state (NOT persisted)
  selectedCategory: Category | null;
  ageFilter: AgeRange | null;
  sortBy: SortOption;

  // Viewed toys (persisted for "recently viewed")
  recentlyViewed: string[]; // toy IDs, max 20
  addToRecentlyViewed: (toyId: string) => void;

  // Favorites categories (persisted)
  favoriteCategories: Category[];
}

interface WishlistItem {
  toyId: string;
  priority: 'need' | 'want' | 'maybe';
  addedAt: string; // ISO date
  notes?: string;
}

type Category =
  | 'action-figures'
  | 'lego'
  | 'video-games'
  | 'outdoor'
  | 'arts-crafts'
  | 'vehicles'
  | 'dolls'
  | 'other';

type AgeRange = '6-8' | '9-12' | '13+' | 'all';
type SortOption = 'trending' | 'price-low' | 'price-high' | 'newest';
type Priority = 'need' | 'want' | 'maybe';
```

---

## Data Sources

### Recommended Approach: Curated JSON + Affiliate Links

**Why this is the best option for Hank's Hits:**

1. **No API complexity** - Don't need affiliate accounts or API keys
2. **Full control** - Curate what toys appear (age-appropriate only)
3. **Fast** - No external API calls, instant loading
4. **Free** - No API costs
5. **Reliable** - No rate limits or downtime from third parties
6. **Revenue potential** - Add affiliate links to Amazon/Target later

### Data Structure

```typescript
// toys.json - curated list of toys
interface Toy {
  id: string;                  // Unique ID
  name: string;                // Display name
  description: string;         // Short description
  price: number;               // USD
  originalPrice?: number;      // For "on sale" display
  imageUrl: string;            // Product image
  category: Category;          // Primary category
  ageRange: AgeRange;          // Recommended age
  brand?: string;              // LEGO, Hasbro, Nintendo, etc.
  rating?: number;             // 1-5 stars
  reviewCount?: number;        // Number of reviews
  trending?: boolean;          // Show "Hot!" badge
  inStock: boolean;            // Availability
  affiliateLinks?: {           // Buy links (Phase 3)
    amazon?: string;
    target?: string;
    walmart?: string;
  };
  addedDate: string;           // When added to catalog
  tags?: string[];             // For search/filtering
}
```

### Sample toys.json

```json
{
  "toys": [
    {
      "id": "lego-technic-monster-jam",
      "name": "LEGO Technic Monster Jam Megalodon",
      "description": "Build and race the awesome shark-themed monster truck!",
      "price": 19.99,
      "imageUrl": "/toys/lego-monster-jam.jpg",
      "category": "lego",
      "ageRange": "6-8",
      "brand": "LEGO",
      "rating": 4.8,
      "reviewCount": 1247,
      "trending": true,
      "inStock": true,
      "addedDate": "2025-01-01"
    },
    {
      "id": "nintendo-switch-mario-kart",
      "name": "Mario Kart 8 Deluxe",
      "description": "Race your friends on the Nintendo Switch!",
      "price": 49.99,
      "imageUrl": "/toys/mario-kart-8.jpg",
      "category": "video-games",
      "ageRange": "6-8",
      "brand": "Nintendo",
      "rating": 4.9,
      "reviewCount": 52341,
      "trending": true,
      "inStock": true,
      "addedDate": "2025-01-01"
    }
  ],
  "lastUpdated": "2025-01-15"
}
```

### Alternative Data Sources (For Reference)

| Source | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Curated JSON** | Full control, free, fast, no API headaches | Manual updates needed | **RECOMMENDED for MVP** |
| **Amazon Product API** | Huge catalog, real prices | Requires affiliate account, complex auth, rate limits | Good for Phase 3+ |
| **Target API** | Good toy selection | Requires partnership | Maybe later |
| **Walmart API** | Decent selection | Requires approval | Maybe later |
| **Web Scraping** | Any site | ToS violations, fragile, legal risk | **DON'T DO THIS** |

### Updating the Catalog

For MVP, manually update toys.json:
1. Check trending toys on Amazon/Target before holidays
2. Add 10-20 new toys per month
3. Remove discontinued items
4. Update prices quarterly

Later: Build admin tool or automate with API.

---

## User Data & Persistence

### App Registration

**appId**: `"toy-finder"`

Add to `packages/db/src/schema/app-progress.ts`:

```typescript
export const VALID_APP_IDS = [
  "hill-climb",
  "monster-truck",
  "weather",
  "toy-finder",  // ADD THIS
] as const;
```

### What Gets Saved

```typescript
// Data saved to localStorage (guest) or database (authenticated)
interface ToyFinderProgressData {
  wishlistItems: WishlistItem[];
  favoriteCategories: Category[];
  recentlyViewed: string[]; // Last 20 toy IDs
  lastVisited: string; // ISO date
}
```

### useAuthSync Integration

```typescript
// src/apps/toy-finder/lib/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const LOCAL_STORAGE_KEY = 'toy-finder-progress';

export const useToyFinderStore = create<ToyFinderState>()(
  persist(
    (set, get) => ({
      // ... state and actions
    }),
    {
      name: LOCAL_STORAGE_KEY,
      partialize: (state) => ({
        wishlistItems: state.wishlistItems,
        favoriteCategories: state.favoriteCategories,
        recentlyViewed: state.recentlyViewed,
      }),
    }
  )
);

// src/apps/toy-finder/hooks/useToyFinderSync.ts
import { useAuthSync } from '@/shared/hooks/useAuthSync';
import { useToyFinderStore } from '../lib/store';

export function useToyFinderSync() {
  const store = useToyFinderStore();

  return useAuthSync({
    appId: 'toy-finder',
    localStorageKey: 'toy-finder-progress',
    getState: () => ({
      wishlistItems: store.wishlistItems,
      favoriteCategories: store.favoriteCategories,
      recentlyViewed: store.recentlyViewed,
      lastVisited: new Date().toISOString(),
    }),
    setState: (data) => {
      if (data.wishlistItems) {
        useToyFinderStore.setState({
          wishlistItems: data.wishlistItems,
          favoriteCategories: data.favoriteCategories || [],
          recentlyViewed: data.recentlyViewed || [],
        });
      }
    },
  });
}
```

---

## Kid-Friendly Design

### Touch Targets
- **All buttons minimum 60x60px** - fat kid fingers
- **"I WANT THIS!" button is the biggest** - primary action
- **Card tap area is entire card** - easy to hit

### Visual Design

| Element | Style |
|---------|-------|
| **Colors** | Bright, saturated (blue primary, green secondary, orange accent) |
| **Images** | Large, high-quality product photos |
| **Text** | Big, readable (16px min, headers 24px+) |
| **Icons** | Simple, colorful, alongside text |
| **Animations** | Subtle bounces when adding to wishlist |

### Priority Indicators

| Priority | Visual | Emoji |
|----------|--------|-------|
| **NEED IT** | Red badge, larger | Fire emoji |
| **WANT IT** | Orange badge | Star emoji |
| **MAYBE** | Gray badge | Thinking emoji |

### Wishlist Empty State

```
+---------------------------------------+
|                                       |
|            (sad toy icon)             |
|                                       |
|      Your wishlist is empty!          |
|                                       |
|    Go find some awesome toys          |
|                                       |
|        [BROWSE TOYS]                  |
|                                       |
+---------------------------------------+
```

### Add to Wishlist Animation

1. Button says "I WANT THIS!"
2. Tap button
3. Button briefly shows checkmark + "ADDED!"
4. Confetti burst (subtle, 0.5s)
5. Wishlist counter increments with bounce
6. Button returns to normal state

### Share Wishlist Screen

```
+---------------------------------------+
|    Share Your Wishlist!               |
+---------------------------------------+
|                                       |
|   Show this to Mom, Dad, Grandma,     |
|   or anyone who wants to buy you      |
|   something awesome!                  |
|                                       |
|   +-------------------------------+   |
|   | hankshits.com/wish/abc123     |   |
|   +-------------------------------+   |
|                                       |
|   [COPY LINK]    [SHARE]              |
|                                       |
+---------------------------------------+
```

---

## File Structure

Following the compartmentalized structure from CLAUDE.md:

```
apps/web/src/
├── app/
│   └── apps/
│       └── toy-finder/
│           ├── page.tsx              # Main app page (thin, imports from src/apps/)
│           └── wishlist/
│               └── [shareId]/
│                   └── page.tsx      # Shareable wishlist view
│
├── apps/
│   └── toy-finder/                   # SELF-CONTAINED module
│       ├── components/
│       │   ├── ToyGrid.tsx           # Grid of toy cards
│       │   ├── ToyCard.tsx           # Individual toy card
│       │   ├── ToyDetailModal.tsx    # Full toy view
│       │   ├── WishlistView.tsx      # Wishlist page
│       │   ├── WishlistItem.tsx      # Single wishlist item
│       │   ├── CategoryTabs.tsx      # Category filter tabs
│       │   ├── FilterBar.tsx         # Age/sort filters
│       │   ├── ShareModal.tsx        # Share wishlist modal
│       │   ├── PriorityPicker.tsx    # Need/Want/Maybe selector
│       │   └── EmptyState.tsx        # Empty wishlist state
│       ├── hooks/
│       │   ├── useToyFinderSync.ts   # Auth sync wrapper
│       │   ├── useToys.ts            # Fetch/filter toys
│       │   └── useShare.ts           # Generate share link
│       ├── lib/
│       │   ├── store.ts              # Zustand store
│       │   ├── types.ts              # TypeScript types
│       │   └── constants.ts          # Categories, priorities
│       ├── data/
│       │   └── toys.json             # Curated toy catalog
│       ├── ToyFinderApp.tsx          # Main app component
│       └── index.ts                  # Exports
│
└── public/
    └── apps/
        └── toy-finder/
            └── images/
                └── toys/             # Toy product images
```

### Route Files (Thin)

```tsx
// apps/web/src/app/apps/toy-finder/page.tsx
import { ToyFinderApp } from '@/apps/toy-finder';

export const metadata = {
  title: 'Toy Finder | Hank\'s Hits',
  description: 'Find awesome toys and build your wishlist!',
};

export default function ToyFinderPage() {
  return <ToyFinderApp />;
}
```

---

## Implementation Phases

### Phase 1: Core Browsing (MVP)

- [ ] Set up folder structure
- [ ] Create toys.json with 20-30 curated toys
- [ ] Build ToyCard component with image, name, price
- [ ] Build ToyGrid with 2-col mobile / 4-col desktop
- [ ] Add CategoryTabs with 8 categories
- [ ] "I WANT THIS!" button (adds to local state)
- [ ] Basic WishlistView with remove button
- [ ] localStorage persistence (no auth)

**Deliverable**: Browse toys, add to wishlist, persists locally

### Phase 2: Wishlist Features

- [ ] Priority picker (Need/Want/Maybe)
- [ ] Priority badges on wishlist items
- [ ] Age filter
- [ ] Sort options (trending, price)
- [ ] Toy detail modal (tap card for more info)
- [ ] Empty state with CTA

**Deliverable**: Full wishlist management

### Phase 3: Sharing & Sync

- [ ] Add "toy-finder" to VALID_APP_IDS
- [ ] Implement useToyFinderSync hook
- [ ] Test guest → auth migration
- [ ] Generate shareable wishlist links
- [ ] Public wishlist view page
- [ ] Copy link / native share

**Deliverable**: Share wishlist with family

### Phase 4: Polish & Extras

- [ ] Add animation for wishlist add
- [ ] Recently viewed section
- [ ] Search bar
- [ ] Trending badges
- [ ] Affiliate links (revenue)
- [ ] Price tracking (track price changes)

**Deliverable**: Polished, complete app

---

## Success Metrics

How do we know the app is working?

1. **Hank adds 5+ toys** to wishlist in first session
2. **Hank shares link** with parents/grandparents
3. **Wishlist gets checked** before birthday/Christmas
4. **Hank returns** to add/update wishlist
5. **Parents find it useful** - easier than guessing

---

## References

- [Amazon Best Sellers - Toys](https://www.amazon.com/Best-Sellers-Toys-Games/zgbs/toys-and-games) - Trending toy research
- [Target Top Toys](https://www.target.com/c/top-toys/-/N-5xtz9) - Holiday toy lists
- [Common Sense Media](https://www.commonsensemedia.org/) - Age-appropriate recommendations
- [Nielsen Kids Study](https://www.nielsen.com/insights/) - How kids browse and shop
- [Touch Target Guidelines](https://www.nngroup.com/articles/touch-target-size/) - Mobile UX best practices

---

## Notes for Implementation

1. **Start with static JSON** - Don't overcomplicate with APIs initially
2. **Mobile-first** - Hank uses an iPad, design for touch first
3. **Big images matter** - Kids judge toys by how they look
4. **The button text matters** - "I WANT THIS!" is way more fun than "Add to Wishlist"
5. **Sharing is the killer feature** - This is how parents/grandparents use it
