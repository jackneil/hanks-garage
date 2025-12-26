# Hank's Weather Buddy - App Design Document

## Overview

**Hank's Weather Buddy** is a kid-friendly weather app that makes checking the weather FUN. Instead of boring numbers and technical jargon, kids see animated weather characters (sun wearing sunglasses, crying rain clouds, dancing snowflakes) and get practical outfit suggestions like "Wear your raincoat today!" or "Shorts and sunscreen weather!"

**Why It's Fun**: Weather apps are boring. This one has personality. The sun is happy and bouncy. The rain cloud looks sad but huggable. The snow is magical. And kids actually WANT to check the weather because they get to see their weather buddies.

**Target Player**: Hank Neil, age 8 (and kids 6-14)
**Platform**: Web (mobile-first, desktop responsive)
**App ID**: `weather`

---

## Core Experience

```
OPEN the app
    |
ENTER your location (zip code or city name)
    |
SEE animated weather with fun character
    |
GET outfit recommendations ("Wear your jacket!")
    |
CHECK 5-day forecast (what's coming up)
    |
LEARN fun weather facts ("Did you know lightning is hotter than the sun?")
```

### The Magic Moment

When a kid opens the app and sees a **happy sun with sunglasses waving at them**, or a **puffy cloud with raindrops as tears**, it transforms a utility app into something they actually enjoy using. Parents can say "Check Weather Buddy to see if you need a jacket" and kids will actually do it.

---

## Controls & Interaction

### Mobile (Primary - Touch)

```
+------------------------------------------+
|  [Location: Denver, CO]  [Settings Gear] |
+------------------------------------------+
|                                          |
|         [ANIMATED WEATHER ICON]          |
|              72 F / 22 C                 |
|           "Sunny & Perfect!"             |
|                                          |
|  +------------------------------------+  |
|  |  WHAT TO WEAR TODAY                |  |
|  |  * T-shirt or light top            |  |
|  |  * Shorts or light pants           |  |
|  |  * Sunglasses + Sunscreen!         |  |
|  +------------------------------------+  |
|                                          |
|  +------------------------------------+  |
|  |  5-DAY FORECAST                    |  |
|  |  Mon  Tue  Wed  Thu  Fri           |  |
|  |  [S]  [S]  [C]  [R]  [S]           |  |
|  |  75   78   70   65   72            |  |
|  +------------------------------------+  |
|                                          |
|  +------------------------------------+  |
|  |  FUN FACT: The hottest             |  |
|  |  temperature ever was 134 F        |  |
|  |  in Death Valley!                  |  |
|  +------------------------------------+  |
|                                          |
+------------------------------------------+
```

### Touch Targets
- **Big buttons**: All interactive elements are 60x60px minimum
- **Swipe gestures**: Swipe up to see more details, swipe horizontally on forecast
- **Tap to refresh**: Pull-down refresh or tap the weather icon

### Desktop (Keyboard + Mouse)

Same layout, but:
- Larger animated weather display in center
- Sidebar for additional info
- Keyboard shortcuts:
  - `R` = Refresh weather
  - `L` = Change location
  - `U` = Toggle F/C units
  - `Escape` = Close modals

### Responsive Breakpoints

| Screen Size | Layout |
|-------------|--------|
| < 480px | Single column, stacked |
| 480-768px | Single column, larger icons |
| 768-1024px | Two columns |
| > 1024px | Full desktop with sidebar |

---

## Features (Priority Order)

### MVP (Must-Have for Launch)

#### 1. Current Weather Display
- **Large animated weather icon** (sunny, cloudy, rainy, snowy, stormy)
- **Temperature** in big, readable text (toggle F/C)
- **Weather description** in simple words ("Sunny and warm!", "Rainy and cool")
- **"Feels like" temperature** for accurate outfit suggestions

#### 2. Location Input
- **Zip code entry** (primary - most reliable)
- **City name search** with autocomplete
- **Save favorite location** (persist in localStorage/DB)
- **Geolocation button** (ask permission, optional)

#### 3. Outfit Recommendations
- Based on temperature + conditions
- Simple, actionable suggestions:
  - "Wear a t-shirt and shorts!"
  - "Bring your umbrella!"
  - "Bundle up with a warm jacket!"
  - "Don't forget sunscreen!"

#### 4. Basic Animated Icons
- **Sunny**: Happy sun with sunglasses, gentle bounce animation
- **Cloudy**: Puffy white clouds drifting slowly
- **Rainy**: Sad cloud with animated raindrops falling
- **Stormy**: Dark cloud with lightning flash
- **Snowy**: Happy cloud with dancing snowflakes
- **Windy**: Trees swaying, leaves blowing

### Important (Post-MVP)

#### 5. 5-Day Forecast
- Mini weather icons for each day
- Day of week labels
- High/low temperatures
- Tap for more details on each day

#### 6. Fun Weather Facts
- Random weather facts on each load
- Age-appropriate and interesting:
  - "Lightning is 5x hotter than the sun's surface!"
  - "Snowflakes can take up to an hour to fall!"
  - "A hurricane can release energy equal to 10,000 nuclear bombs!"
- Rotate facts or show new one on tap

#### 7. Weather Alerts (Kid-Friendly)
- Translate scary weather alerts into understandable terms
- Examples:
  - "Heat Advisory" -> "It's going to be SUPER hot! Drink lots of water!"
  - "Winter Storm Warning" -> "Big snow coming! Maybe a snow day?"
  - "Tornado Watch" -> "Stormy weather possible. Stay inside with family."
- Visual indicator (orange/red banner at top)

### Nice-to-Have (Future)

#### 8. Multiple Saved Locations
- Save grandma's house, vacation spots
- Quick switch between locations
- Weather comparison view

#### 9. Weather Sounds
- Optional ambient sounds matching weather
- Rain sounds for rainy days
- Cheerful chirping for sunny days
- Wind whooshing for windy days

#### 10. Weather Achievements
- "Checked weather 7 days in a row!"
- "Saw your first thunderstorm!"
- "Survived a heat wave!"
- Just for fun, no gameplay impact

#### 11. Weather History
- "This time last week it was..."
- Simple temperature graph
- Record highs/lows for today

---

## Technical Approach

### Stack

```
Next.js 16 + React 19
TypeScript
Tailwind CSS + DaisyUI
Zustand (state management)
React Query / SWR (data fetching)
Framer Motion (animations)
```

### Weather API Integration

The app needs a reliable, free-tier weather API. See **API Options** section below.

### State Management (Zustand Store)

```typescript
// apps/web/src/apps/weather/lib/store.ts

interface WeatherState {
  // User preferences
  location: string | null;           // Saved zip/city
  units: 'fahrenheit' | 'celsius';   // Temperature units
  savedLocations: string[];          // Multiple saved locations

  // Current weather data (cached)
  currentWeather: WeatherData | null;
  forecast: ForecastDay[] | null;
  lastFetched: number | null;        // Timestamp for cache

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  setLocation: (location: string) => void;
  setUnits: (units: 'fahrenheit' | 'celsius') => void;
  addSavedLocation: (location: string) => void;
  removeSavedLocation: (location: string) => void;
  fetchWeather: () => Promise<void>;
  clearError: () => void;
}

interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    temp_f: number;
    temp_c: number;
    feelslike_f: number;
    feelslike_c: number;
    condition: {
      text: string;
      code: number;  // Maps to our animated icons
    };
    humidity: number;
    wind_mph: number;
    is_day: boolean;
  };
}

interface ForecastDay {
  date: string;
  day: {
    maxtemp_f: number;
    mintemp_f: number;
    maxtemp_c: number;
    mintemp_c: number;
    condition: {
      text: string;
      code: number;
    };
    daily_chance_of_rain: number;
  };
}
```

### Data Persistence Pattern

Using the established `useAuthSync` hook pattern:

```typescript
// apps/web/src/apps/weather/hooks/useWeatherSync.ts

import { useAuthSync } from '@/shared/hooks/useAuthSync';
import { useWeatherStore } from '../lib/store';

export function useWeatherSync() {
  const { location, units, savedLocations } = useWeatherStore();

  return useAuthSync({
    appId: 'weather',  // Already in VALID_APP_IDS!
    localStorageKey: 'hank-weather-prefs',
    getState: () => ({
      location,
      units,
      savedLocations,
      lastUpdated: Date.now(),
    }),
    setState: (data) => {
      if (data.location) useWeatherStore.getState().setLocation(data.location);
      if (data.units) useWeatherStore.getState().setUnits(data.units);
      if (data.savedLocations) {
        data.savedLocations.forEach((loc: string) =>
          useWeatherStore.getState().addSavedLocation(loc)
        );
      }
    },
  });
}
```

### What Gets Saved

| Data | localStorage | Database (auth) |
|------|--------------|-----------------|
| Primary location (zip/city) | Yes | Yes |
| Temperature units (F/C) | Yes | Yes |
| Saved locations list | Yes | Yes |
| Last fetched weather | Yes (cache) | No |
| Fun facts seen | No | No |

---

## API Options

### Option 1: WeatherAPI.com (RECOMMENDED)

**Why**: Generous free tier, simple API, good documentation, forecast included.

**Free Tier**:
- 1,000,000 calls/month
- Current weather + 3-day forecast
- Autocomplete for location search
- Weather alerts included

**Setup**:
1. Sign up at https://www.weatherapi.com/signup.aspx
2. Get API key from dashboard
3. Add to `.env.local`:
   ```
   WEATHERAPI_KEY=your_api_key_here
   ```

**API Endpoints**:
```typescript
// Current weather + forecast
const response = await fetch(
  `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=5&aqi=no`
);

// Location autocomplete
const response = await fetch(
  `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${query}`
);
```

**Weather Condition Codes** (for icon mapping):
| Code | Condition | Our Icon |
|------|-----------|----------|
| 1000 | Sunny/Clear | sunny |
| 1003 | Partly Cloudy | partly-cloudy |
| 1006-1009 | Cloudy/Overcast | cloudy |
| 1063, 1180-1201 | Rain | rainy |
| 1087, 1273-1282 | Thunder | stormy |
| 1066, 1210-1225 | Snow | snowy |
| 1030, 1135 | Fog/Mist | foggy |

### Option 2: OpenWeatherMap

**Why**: Very popular, well-documented, reliable.

**Free Tier**:
- 1,000 calls/day (60 calls/minute)
- Current weather only (forecast needs paid tier)
- Geocoding API for location search

**Setup**:
1. Sign up at https://openweathermap.org/appid
2. Get API key (takes a few hours to activate)
3. Add to `.env.local`:
   ```
   OPENWEATHERMAP_KEY=your_api_key_here
   ```

**API Endpoints**:
```typescript
// Current weather
const response = await fetch(
  `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&appid=${API_KEY}&units=imperial`
);

// Geocoding (zip to coordinates)
const response = await fetch(
  `https://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},us&appid=${API_KEY}`
);
```

**Limitations**: Free tier doesn't include forecast. Need "One Call 3.0" for that.

### Option 3: Tomorrow.io (Visual Crossing Alternative)

**Why**: Modern API, good free tier, ML-powered forecasts.

**Free Tier**:
- 500 calls/day
- Current + 6-day forecast
- Weather alerts

**Setup**:
1. Sign up at https://www.tomorrow.io/weather-api/
2. Get API key from dashboard
3. Add to `.env.local`:
   ```
   TOMORROW_IO_KEY=your_api_key_here
   ```

### API Recommendation

**Go with WeatherAPI.com** for these reasons:
1. Most generous free tier (1M calls/month)
2. Includes 5-day forecast in free tier
3. Location autocomplete built-in
4. Weather alerts included
5. Simple, clean API design
6. Good condition codes for icon mapping

---

## Kid-Friendly Design

### Visual Design Principles

1. **BIG everything** - Large fonts, large buttons, large icons
2. **Bright, happy colors** - Even rain clouds should feel friendly
3. **Animations that delight** - Subtle bounces, gentle sways, playful movements
4. **Simple language** - No "precipitation" or "barometric pressure"
5. **Personality** - Weather characters have expressions and feelings

### Weather Characters (Animated Icons)

| Weather | Character | Animation | Personality |
|---------|-----------|-----------|-------------|
| Sunny | Sun with sunglasses | Gentle pulse, occasional wink | Cool and happy |
| Partly Cloudy | Sun peeking behind cloud | Cloud drifts, sun peeks | Playful hide-and-seek |
| Cloudy | Fluffy white clouds | Slow drift across | Calm and peaceful |
| Rainy | Sad cloud with tears | Raindrops fall, cloud frowns | Sad but huggable |
| Stormy | Dark cloud with lightning | Lightning flashes, cloud grumbles | Grumpy but not scary |
| Snowy | Happy cloud with snowflakes | Snowflakes dance and twirl | Magical and exciting |
| Windy | Swirly wind lines | Lines whoosh across | Energetic and wild |
| Foggy | Sleepy cloud yawning | Slow fade in/out | Dreamy and quiet |

### Color Palette

```css
/* Weather colors */
--sunny: #FFD93D;        /* Warm yellow */
--cloudy: #A8D8EA;       /* Soft blue-gray */
--rainy: #6C9BCF;        /* Blue */
--stormy: #5C6BC0;       /* Purple-blue */
--snowy: #E3F2FD;        /* Light blue-white */
--windy: #81C784;        /* Green */

/* Background gradients based on weather */
--bg-sunny: linear-gradient(180deg, #87CEEB 0%, #FFD93D 100%);
--bg-rainy: linear-gradient(180deg, #6C9BCF 0%, #4A6FA5 100%);
--bg-night: linear-gradient(180deg, #1A237E 0%, #3949AB 100%);
```

### Typography

```css
/* Kid-friendly fonts */
font-family: 'Nunito', 'Comic Neue', sans-serif;

/* Sizes */
--text-temp: 4rem;       /* Temperature - HUGE */
--text-condition: 1.5rem; /* "Sunny and warm!" */
--text-body: 1.125rem;   /* Regular text */
--text-label: 0.875rem;  /* Labels */
```

### Language Examples

| Technical Term | Kid-Friendly Version |
|----------------|---------------------|
| "Precipitation: 80%" | "It's probably going to rain!" |
| "Humidity: 65%" | "It feels a little sticky outside" |
| "Wind: 15 mph" | "It's kinda windy!" |
| "UV Index: 8" | "The sun is strong - wear sunscreen!" |
| "Barometric pressure" | (Don't mention at all) |

### Outfit Recommendation Logic

```typescript
function getOutfitRecommendation(weather: WeatherData): string[] {
  const temp = weather.current.temp_f;
  const condition = weather.current.condition.code;
  const recommendations: string[] = [];

  // Temperature-based clothing
  if (temp >= 80) {
    recommendations.push("T-shirt and shorts");
    recommendations.push("Sandals or sneakers");
    recommendations.push("Sunglasses");
    recommendations.push("Don't forget sunscreen!");
  } else if (temp >= 65) {
    recommendations.push("T-shirt or light long sleeve");
    recommendations.push("Shorts or light pants");
    recommendations.push("Maybe sunglasses");
  } else if (temp >= 50) {
    recommendations.push("Long sleeve shirt or light sweater");
    recommendations.push("Pants or jeans");
    recommendations.push("Light jacket just in case");
  } else if (temp >= 35) {
    recommendations.push("Warm sweater or fleece");
    recommendations.push("Warm pants");
    recommendations.push("Jacket or coat");
    recommendations.push("Maybe a hat");
  } else {
    recommendations.push("Warm winter coat");
    recommendations.push("Hat, gloves, and scarf");
    recommendations.push("Warm boots");
    recommendations.push("Bundle up - it's COLD!");
  }

  // Weather condition additions
  if (isRainy(condition)) {
    recommendations.push("Bring an umbrella!");
    recommendations.push("Rain boots or waterproof shoes");
  }

  if (isSnowy(condition)) {
    recommendations.push("Wear warm boots");
    recommendations.push("Waterproof gloves");
  }

  return recommendations;
}
```

---

## File Structure

Following the project's compartmentalized structure:

```
apps/web/src/
├── app/
│   └── apps/
│       └── weather/
│           └── page.tsx           # Route - just imports from src/apps/
│
├── apps/                          # SELF-CONTAINED app modules
│   └── weather/
│       ├── components/
│       │   ├── WeatherApp.tsx     # Main app container
│       │   ├── WeatherDisplay.tsx # Current weather + animation
│       │   ├── LocationInput.tsx  # Zip/city input with search
│       │   ├── OutfitSuggestions.tsx
│       │   ├── ForecastStrip.tsx  # 5-day forecast row
│       │   ├── FunFact.tsx        # Random weather fact
│       │   ├── WeatherAlert.tsx   # Kid-friendly alerts
│       │   ├── SettingsModal.tsx  # Units, saved locations
│       │   └── icons/
│       │       ├── SunnyIcon.tsx
│       │       ├── CloudyIcon.tsx
│       │       ├── RainyIcon.tsx
│       │       ├── StormyIcon.tsx
│       │       ├── SnowyIcon.tsx
│       │       └── index.ts
│       │
│       ├── hooks/
│       │   ├── useWeather.ts      # Data fetching hook
│       │   ├── useGeolocation.ts  # Browser geolocation
│       │   └── useWeatherSync.ts  # Auth sync wrapper
│       │
│       ├── lib/
│       │   ├── store.ts           # Zustand store
│       │   ├── api.ts             # Weather API calls
│       │   ├── outfit.ts          # Outfit recommendation logic
│       │   ├── funFacts.ts        # Weather facts data
│       │   ├── conditionMap.ts    # API codes -> our icons
│       │   └── constants.ts       # API URLs, defaults
│       │
│       ├── types/
│       │   └── weather.ts         # TypeScript types
│       │
│       ├── __tests__/
│       │   ├── outfit.test.ts
│       │   ├── conditionMap.test.ts
│       │   └── WeatherApp.test.tsx
│       │
│       └── index.ts               # Exports
│
└── public/
    └── apps/
        └── weather/
            └── sounds/            # Optional ambient sounds
                ├── rain.mp3
                └── birds.mp3
```

### Route File (Thin!)

```tsx
// apps/web/src/app/apps/weather/page.tsx
import dynamic from 'next/dynamic';

const WeatherApp = dynamic(
  () => import('@/apps/weather').then(mod => mod.WeatherApp),
  {
    ssr: false,
    loading: () => <WeatherLoadingState />
  }
);

export default function WeatherPage() {
  return <WeatherApp />;
}

function WeatherLoadingState() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-2xl animate-pulse">Loading Weather Buddy...</div>
    </div>
  );
}
```

---

## Environment Variables

```bash
# .env.local

# WeatherAPI.com (recommended)
NEXT_PUBLIC_WEATHER_API_KEY=your_weatherapi_key_here

# OR OpenWeatherMap
# NEXT_PUBLIC_OPENWEATHERMAP_KEY=your_key_here

# OR Tomorrow.io
# NEXT_PUBLIC_TOMORROW_IO_KEY=your_key_here
```

**Note**: Using `NEXT_PUBLIC_` prefix since we're calling from client-side. For production, consider proxying through a Next.js API route to hide the key.

---

## Implementation Phases

### Phase 1: Core Weather Display (MVP)

- [ ] Create `src/apps/weather/` folder structure
- [ ] Set up WeatherAPI.com account and get API key
- [ ] Build `LocationInput` component (zip code entry)
- [ ] Build `WeatherDisplay` with static icons first
- [ ] Add temperature display with F/C toggle
- [ ] Create basic Zustand store
- [ ] Add localStorage persistence

**Deliverable**: Enter zip, see current weather

### Phase 2: Outfit Recommendations + Styling

- [ ] Build `OutfitSuggestions` component
- [ ] Implement outfit logic based on temp + conditions
- [ ] Create kid-friendly color scheme
- [ ] Style all components with DaisyUI
- [ ] Add responsive layout
- [ ] Integrate `useWeatherSync` for DB persistence

**Deliverable**: Weather + outfit recommendations

### Phase 3: Animated Icons

- [ ] Create SVG-based animated weather icons
- [ ] Add Framer Motion animations
- [ ] Map API condition codes to our icons
- [ ] Add day/night variants
- [ ] Background gradient based on weather

**Deliverable**: Delightful animated weather display

### Phase 4: Forecast + Fun Features

- [ ] Build `ForecastStrip` for 5-day forecast
- [ ] Create `FunFact` component with weather facts
- [ ] Add `WeatherAlert` for warnings
- [ ] Multiple saved locations
- [ ] Settings modal

**Deliverable**: Full-featured weather app

### Phase 5: Polish + Extras

- [ ] Add ambient sounds (optional)
- [ ] Loading states and error handling
- [ ] Offline mode with cached data
- [ ] Weather achievements
- [ ] Performance optimization

**Deliverable**: Polished, production-ready app

---

## Testing Strategy

### Unit Tests

```typescript
// apps/web/src/apps/weather/__tests__/outfit.test.ts

describe('getOutfitRecommendation', () => {
  it('recommends sunscreen when hot and sunny', () => {
    const weather = mockWeather({ temp_f: 85, condition: 'sunny' });
    const outfit = getOutfitRecommendation(weather);
    expect(outfit).toContain("Don't forget sunscreen!");
  });

  it('recommends umbrella when rainy', () => {
    const weather = mockWeather({ temp_f: 60, condition: 'rainy' });
    const outfit = getOutfitRecommendation(weather);
    expect(outfit).toContain("Bring an umbrella!");
  });

  it('recommends winter gear when freezing', () => {
    const weather = mockWeather({ temp_f: 25, condition: 'snowy' });
    const outfit = getOutfitRecommendation(weather);
    expect(outfit).toContain("Warm winter coat");
    expect(outfit).toContain("Hat, gloves, and scarf");
  });
});
```

### Component Tests

```typescript
// apps/web/src/apps/weather/__tests__/WeatherApp.test.tsx

describe('WeatherApp', () => {
  it('renders without crashing', () => {
    render(<WeatherApp />);
    expect(screen.getByText(/Weather Buddy/i)).toBeInTheDocument();
  });

  it('shows location input on first load', () => {
    render(<WeatherApp />);
    expect(screen.getByPlaceholderText(/zip code/i)).toBeInTheDocument();
  });

  it('displays weather after location entry', async () => {
    render(<WeatherApp />);
    fireEvent.change(screen.getByPlaceholderText(/zip code/i), {
      target: { value: '80202' }
    });
    fireEvent.click(screen.getByText(/Check Weather/i));

    await waitFor(() => {
      expect(screen.getByText(/Denver/i)).toBeInTheDocument();
    });
  });
});
```

---

## Success Metrics

How do we know Weather Buddy is a hit?

1. **Hank checks weather voluntarily** without being asked
2. **Hank remembers outfit suggestions** and dresses appropriately
3. **Hank shares fun facts** with family ("Did you know...")
4. **Hank asks about other locations** (grandma's house, vacation spot)
5. **No confusion** - Hank understands everything without explanation

---

## Fun Weather Facts Database

```typescript
// apps/web/src/apps/weather/lib/funFacts.ts

export const weatherFacts = [
  "Lightning is 5 times hotter than the surface of the sun!",
  "A single cloud can weigh over a million pounds!",
  "Snowflakes can take up to 1 hour to fall from the clouds!",
  "The fastest wind ever recorded was 253 mph during a tornado!",
  "Rain contains vitamin B12!",
  "A hurricane can release energy equal to 10,000 nuclear bombs!",
  "Crickets chirp faster when it's warmer!",
  "Raindrops can fall as fast as 20 miles per hour!",
  "The wettest place on Earth gets 467 inches of rain per year!",
  "It can be too cold to snow!",
  "Fog is basically a cloud touching the ground!",
  "Hail can be as big as a softball!",
  "Thunder is caused by lightning heating the air so fast it explodes!",
  "A dust devil is a mini tornado!",
  "The coldest temperature ever was -128.6 F in Antarctica!",
  "The hottest temperature ever was 134 F in Death Valley!",
  "Every snowflake has 6 sides!",
  "Wind has no color - we just see what it's moving!",
  "Rainbows are actually full circles - we just see half!",
  "Clouds look white because they reflect all colors of light!"
];

export function getRandomFact(): string {
  return weatherFacts[Math.floor(Math.random() * weatherFacts.length)];
}
```

---

## References

- [WeatherAPI.com Documentation](https://www.weatherapi.com/docs/)
- [OpenWeatherMap API](https://openweathermap.org/api)
- [Tomorrow.io Weather API](https://www.tomorrow.io/weather-api/)
- [Framer Motion](https://www.framer.com/motion/) - For animations
- [React Query](https://tanstack.com/query/latest) - For data fetching
- [Weather Icon Inspiration](https://www.flaticon.com/packs/weather-set-2) - Design reference
