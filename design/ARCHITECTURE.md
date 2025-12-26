# Hank's Hits - Architecture Design Document

## Executive Summary

A web platform for 8-year-old Hank Neil to play 3D games and use simple apps. **Claude builds and maintains all code.**

**Site Name:** Hank's Hits
**Hosting:** Railway only (PostgreSQL + web app)

---

## Tech Stack

| Component | Version | Notes |
|-----------|---------|-------|
| **Next.js** | 16.1.1 | App Router |
| **React** | 19.2.3 | Latest |
| **Tailwind** | 4.x | CSS |
| **DaisyUI** | 5.x | Kid-friendly theme |
| **Hosting** | Railway | Everything in one place |

### 3D Game Stack (Confirmed Compatible)

| Package | Version | Peer Deps |
|---------|---------|-----------|
| `three` | 0.182.0 | N/A |
| `@react-three/fiber` | 9.4.2 | React ^19.0.0 |
| `@react-three/rapier` | 2.2.0 | React ^19, R3F ^9.0.4 |
| `@react-three/drei` | 10.7.7 | React ^19, R3F ^9.0.0 |
| `ecctrl` | 1.0.97 | React >=19.1.0, three >=0.177.0 |

**All packages verified compatible with our React 19.2.3**

---

## Infrastructure: Railway Only

```
┌─────────────────────────────────────────┐
│              RAILWAY                     │
├─────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    │
│  │  Next.js    │───▶│ PostgreSQL  │    │
│  │  Web App    │    │  (later)    │    │
│  └─────────────┘    └─────────────┘    │
└─────────────────────────────────────────┘
```

---

## 3D Game Architecture

### React Three Fiber + Rapier

```tsx
// CRITICAL: Must use dynamic import with ssr: false
import dynamic from 'next/dynamic';

const MonsterTruckGame = dynamic(
  () => import('@/components/game/MonsterTruckGame'),
  { ssr: false }
);

export default function GamePage() {
  return <MonsterTruckGame />;
}
```

### Vehicle Physics (Rapier)

```tsx
// components/game/Vehicle.tsx
"use client";

import { RigidBody, useRapier } from '@react-three/rapier';
import { useFrame } from '@react-three/fiber';

export function MonsterTruck() {
  // Chassis with wheel rays for suspension
  // Low stiffness for bouncy monster truck feel
  // Large wheel radius for ground clearance
}
```

### Mobile Controls

**Tilt Steering (DeviceOrientationEvent):**
```typescript
// hooks/useDeviceOrientation.ts
export function useDeviceOrientation() {
  const [gamma, setGamma] = useState(0); // Left/right tilt

  useEffect(() => {
    // iOS 13+ requires permission
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      // Request permission flow
    }

    const handleOrientation = (event: DeviceOrientationEvent) => {
      // gamma: -90 to 90 degrees (left/right tilt)
      // Map to steering: -30° to +30° = full turn
      const steering = Math.max(-1, Math.min(1, (event.gamma || 0) / 30));
      setGamma(steering);
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  return { steering: gamma };
}
```

**Touch Pedals:**
```
┌─────────────────────────────────────────┐
│                                         │
│     [TILT PHONE LEFT/RIGHT = STEER]     │
│                                         │
│           3D GAME VIEW                  │
│      (camera behind truck)              │
│                                         │
│                          [🔊 HORN]      │
├──────────────┬──────────────────────────┤
│    BRAKE     │           GAS            │
│     ◀──      │           ──▶            │
└──────────────┴──────────────────────────┘
```

### Desktop Controls

| Key | Action |
|-----|--------|
| W / ↑ | Accelerate |
| S / ↓ | Brake / Reverse |
| A / ← | Steer Left |
| D / → | Steer Right |
| Space | Handbrake |
| H | Horn |
| R | Reset position |

---

## Game Design Principles (Research)

### What Makes Monster Truck Games Fun

From [Offroad Outlaws](https://play.google.com/store/apps/details?id=com.battlecreek.offroadoutlaws):
- Complete vehicle customization (suspension, wheels)
- Diverse terrain (mud, hills, desert)
- Authentic physics that "feel" right

From [Open World Game Design](https://gamedesignskills.com/game-design/game-progression/):
- Core loop: Drive → Find stuff → Unlock rewards → Better truck
- Collectibles in "mini-clusters" (mini-adventures)
- Meaningful rewards (not just points)

### Kid-Friendly (Age 8)

- **Forgiving physics** - truck can flip but auto-recovers
- **Big buttons** (44px minimum)
- **Celebrations** - confetti when collecting stuff
- **Horn button** - kids love honking
- **Simple controls** - just gas, brake, steer

---

## Project Structure

```
hank-neil/
├── apps/
│   └── web/
│       ├── src/
│       │   ├── app/
│       │   │   ├── page.tsx              # Landing
│       │   │   ├── dashboard/page.tsx    # Game launcher
│       │   │   └── games/
│       │   │       └── monster-truck/
│       │   │           └── page.tsx      # Dynamic import
│       │   ├── components/
│       │   │   └── game/
│       │   │       ├── MonsterTruckGame.tsx
│       │   │       ├── Vehicle.tsx
│       │   │       ├── Terrain.tsx
│       │   │       ├── FollowCamera.tsx
│       │   │       ├── MobileControls.tsx
│       │   │       └── GameUI.tsx
│       │   ├── hooks/
│       │   │   ├── useDeviceOrientation.ts
│       │   │   ├── useKeyboardControls.ts
│       │   │   └── useTouchControls.ts
│       │   └── lib/
│       │       └── gameStore.ts          # Zustand
│       └── public/
│           └── games/
│               └── monster-truck/
│                   ├── models/
│                   └── textures/
├── packages/
│   ├── ui/               # Shared components
│   └── db/               # Database (later)
├── design/
│   └── ARCHITECTURE.md   # This file
├── CLAUDE.md             # Claude instructions
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## Next.js Configuration

```ts
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['three'],
  experimental: {
    // May need for R3F
  },
};

export default nextConfig;
```

---

## Performance Considerations

### Mobile WebGL

From [WebGL Mobile Challenges](https://blog.pixelfreestudio.com/webgl-in-mobile-development-challenges-and-solutions/):
- Mobile GPUs less powerful than desktop
- Complex 3D can crash browsers
- Need aggressive optimization

**Optimizations:**
1. LOD (Level of Detail) for distant objects - use drei's `<Detailed>`
2. Limit draw calls by merging objects
3. Cap frame rate on weak devices (30fps)
4. Use `<PerformanceMonitor>` from R3F
5. Reduce shadow resolution on mobile
6. Simple low-poly models for vehicles

### Terrain

From [THREE.Terrain](https://github.com/IceCreamYou/THREE.Terrain):
- Procedural generation (Perlin/Simplex noise)
- Chunk loading for large worlds
- GPU shaders for performance

---

## Implementation Phases

### Phase 1: Drivable Truck (MVP)
- [ ] Set up React Three Fiber scene
- [ ] Create ground plane with basic texture
- [ ] Build truck with Rapier physics
- [ ] Third-person camera following truck
- [ ] Keyboard controls (WASD)
- [ ] Basic lighting and skybox

### Phase 2: Mobile Controls
- [ ] Touch pedals overlay (gas/brake)
- [ ] DeviceOrientationEvent for tilt steering
- [ ] iOS permission request flow
- [ ] Fallback: on-screen steering buttons

### Phase 3: Terrain & World
- [ ] Procedural terrain with hills/valleys
- [ ] Ramps and jumps
- [ ] Boundaries

### Phase 4: Collectibles & Fun
- [ ] Stars scattered around (50-100)
- [ ] Star counter UI
- [ ] Particle effects on collection
- [ ] Sound effects (engine, horn)
- [ ] Destructible crates/barrels

### Phase 5: Polish & Expand
- [ ] Better truck model (GLTF)
- [ ] Multiple truck options
- [ ] Save progress
- [ ] Themed zones

---

## Current Status

- [x] Turborepo + pnpm workspace
- [x] Next.js 16 app with React 19
- [x] DaisyUI kid theme ("Hank's Hits")
- [x] Layout with title
- [ ] **Next: Landing page**
- [ ] **Then: Phase 1 (drivable truck)**

---

## Key References

- [pmndrs racing-game](https://github.com/pmndrs/racing-game) - Open source R3F racing game
- [ecctrl](https://github.com/pmndrs/ecctrl) - Vehicle controller with joystick
- [react-three-rapier car example](https://github.com/pmndrs/react-three-rapier/blob/main/demo/src/examples/car/CarExample.tsx)
- [DeviceOrientationEvent MDN](https://developer.mozilla.org/en-US/docs/Web/API/Device_orientation_events)
- [sbcode Car Physics](https://sbcode.net/threejs/physics-car/)
- [Offroad Outlaws](https://play.google.com/store/apps/details?id=com.battlecreek.offroadoutlaws) - Design inspiration
