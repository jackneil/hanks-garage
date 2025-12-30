# Drawing App - App Design Document

## Overview

**Drawing App** is a kid-friendly digital canvas for creative expression. Simple tools, bright colors, fun stamps, and easy sharing make it perfect for young artists.

**Why Kids Love It:**
- **Creative freedom** - Make anything you want
- **Instant results** - Draw and see immediately
- **No wrong answers** - Art is always valid
- **Fun tools** - Stamps, stickers, effects
- **Save your work** - Keep creations forever
- **Share with family** - Show off masterpieces

**Target Player:** Hank Neil, age 8 (and kids 6-14)
**Platform:** Web (mobile + desktop)
**Style:** Bright, playful, accessible

---

## Core Interaction

```
SELECT a tool (brush, stamp, fill, etc)
    |
CHOOSE a color (color picker or palette)
    |
DRAW on canvas
    |
UNDO mistakes easily
    |
ADD stamps and stickers
    |
SAVE artwork
    |
SHARE or DOWNLOAD
```

### Why This Works

- **No learning curve** - Draw immediately
- **Forgiveness** - Undo is always available
- **Variety** - Many tools to explore
- **Ownership** - "I made this!"
- **No judgment** - Everything is art

---

## Interface

### Main Drawing Screen
```
+------------------------------------------+
| [🔙] [↩️] [↪️]  "My Art"    [💾] [📤]    |
+------------------------------------------+
|                                          |
|                                          |
|            [CANVAS AREA]                 |
|                                          |
|                                          |
|                                          |
+------------------------------------------+
| Tools:                                   |
| [✏️] [🖌️] [🪣] [🧽] [📍] [📝] [✨]       |
+------------------------------------------+
| Colors:                                  |
| [🔴][🟠][🟡][🟢][🔵][🟣][⚫][⚪] [🎨]    |
+------------------------------------------+
| Size: [━━━━●━━━━━]                       |
+------------------------------------------+
```

### Tools
| Icon | Tool | Description |
|------|------|-------------|
| ✏️ | Pencil | Thin precise lines |
| 🖌️ | Brush | Soft strokes |
| 🪣 | Fill | Flood fill area |
| 🧽 | Eraser | Remove strokes |
| 📍 | Stamp | Place stickers |
| 📝 | Text | Add words |
| ✨ | Effects | Sparkles, rainbow |

### Stamp Categories
- **Animals** - Dog, cat, bird, fish, dinosaur
- **Nature** - Tree, flower, sun, cloud, star
- **Food** - Pizza, ice cream, cookie, apple
- **Vehicles** - Car, truck, plane, rocket
- **Shapes** - Heart, star, circle, triangle
- **Emojis** - Happy, sad, silly, cool

---

## Features (Priority Order)

### MVP (Must Have)
1. **Canvas** that fills screen
2. **Pencil tool** with pressure/size
3. **Color palette** (8 basic colors + picker)
4. **Brush size** slider
5. **Eraser tool**
6. **Clear canvas** button
7. **Undo/Redo**
8. **Save artwork** locally

### Important (Fun Factor)
9. **Multiple brush types** (soft, spray, marker)
10. **Stamps/stickers**
11. **Fill tool**
12. **Download as image**
13. **Text tool**
14. **More colors** (full picker)
15. **Gallery** of saved art

### Nice to Have
16. **Layers** (simple - foreground/background)
17. **Special effects** (glitter, rainbow)
18. **Backgrounds** (templates)
19. **Animation** (simple flipbook)
20. **Share** (generate link)

---

## Technical Approach

### Stack
```
Next.js 16 + React 19
HTML5 Canvas API
Zustand for state
TypeScript
```

### Architecture
```
apps/web/src/apps/drawing-app/
├── components/
│   ├── Canvas.tsx           # Main drawing canvas
│   ├── Toolbar.tsx          # Tool selection
│   ├── ColorPicker.tsx      # Color selection
│   ├── BrushSettings.tsx    # Size, opacity
│   ├── StampPicker.tsx      # Stamp selection
│   ├── Gallery.tsx          # Saved artworks
│   └── ShareModal.tsx
├── hooks/
│   ├── useCanvas.ts         # Canvas operations
│   ├── useDrawing.ts        # Drawing logic
│   ├── useHistory.ts        # Undo/redo
│   └── useTouch.ts          # Touch handling
├── lib/
│   ├── store.ts
│   ├── tools.ts             # Tool implementations
│   ├── stamps.ts            # Stamp definitions
│   └── constants.ts
├── stamps/                  # Stamp images
├── App.tsx
└── index.ts
```

### Canvas Drawing
```typescript
interface DrawingState {
  tool: 'pencil' | 'brush' | 'eraser' | 'fill' | 'stamp' | 'text';
  color: string;
  size: number;
  opacity: number;
}

function handleDraw(
  ctx: CanvasRenderingContext2D,
  state: DrawingState,
  points: Point[]
) {
  ctx.strokeStyle = state.color;
  ctx.lineWidth = state.size;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.globalAlpha = state.opacity;

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    // Smooth curve through points
    const midX = (points[i - 1].x + points[i].x) / 2;
    const midY = (points[i - 1].y + points[i].y) / 2;
    ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, midX, midY);
  }

  ctx.stroke();
}
```

### Undo/Redo System
```typescript
interface HistoryState {
  past: ImageData[];
  present: ImageData;
  future: ImageData[];
}

function undo(history: HistoryState): HistoryState {
  if (history.past.length === 0) return history;

  const newPast = [...history.past];
  const previous = newPast.pop()!;

  return {
    past: newPast,
    present: previous,
    future: [history.present, ...history.future],
  };
}
```

---

## Settings & Progress Saving

### Data Schema
```typescript
interface DrawingAppProgress {
  artworks: SavedArtwork[];
  settings: {
    defaultColor: string;
    defaultSize: number;
    defaultTool: string;
    soundEnabled: boolean;
    showGrid: boolean;
  };
  stats: {
    artworksCreated: number;
    stampUsed: number;
    colorsUsed: string[];
    totalDrawTime: number;
  };
  unlockedStamps: string[];  // Earn more stamps
  lastOpened: string;
}

interface SavedArtwork {
  id: string;
  name: string;
  thumbnail: string;  // Base64 small preview
  dataUrl: string;    // Full image data
  createdAt: string;
  editedAt: string;
}
```

### useAuthSync Integration
```typescript
useAuthSync({
  appId: "drawing-app",
  localStorageKey: "drawing-app-progress",
  getState: store.getProgress,
  setState: store.setProgress,
  debounceMs: 5000,  // Less frequent, artworks are big
});
```

### Storage Considerations
- Thumbnails only synced to cloud (small)
- Full artwork stored locally (IndexedDB)
- Cloud backup optional for logged-in users
- Max 20 saved artworks (to manage storage)

---

## Kid-Friendly Design

### Touch Optimization
- **Large buttons** - 60px minimum
- **Palm rejection** - Ignore accidental touches
- **Two-finger pan** - Move canvas if zoomed
- **Pinch zoom** - Zoom in/out
- **No hover states** - Touch-first design

### Simple UX
- **Big undo button** - Prominent, always visible
- **Clear canvas confirm** - "Are you sure?"
- **Auto-save** - Never lose work
- **Limited palette** - Not overwhelming
- **Preset sizes** - Small/Medium/Large
- **Friendly icons** - Emoji-style

### Safety
- **No upload** - Can't upload external images
- **No sharing** - Download only (parent controls)
- **Local first** - Art stays on device

### Accessibility
- **High contrast** toolbar
- **Large touch targets**
- **Simple gestures**
- **No time limits**

---

## Stamp Library

### Included Stamps (50+)
```typescript
const STAMP_PACKS = {
  animals: [
    'dog', 'cat', 'bird', 'fish', 'turtle', 'rabbit',
    'dinosaur', 'elephant', 'lion', 'monkey'
  ],
  nature: [
    'tree', 'flower', 'sun', 'moon', 'cloud', 'star',
    'rainbow', 'mountain', 'grass', 'water'
  ],
  food: [
    'pizza', 'icecream', 'cookie', 'apple', 'banana',
    'cake', 'burger', 'donut', 'watermelon', 'candy'
  ],
  vehicles: [
    'car', 'truck', 'plane', 'rocket', 'boat',
    'train', 'helicopter', 'bicycle', 'bus', 'motorcycle'
  ],
  shapes: [
    'heart', 'star', 'circle', 'square', 'triangle',
    'diamond', 'oval', 'pentagon', 'hexagon', 'arrow'
  ],
  emojis: [
    'happy', 'sad', 'silly', 'cool', 'surprised',
    'love', 'sleepy', 'angry', 'thinking', 'party'
  ],
};
```

### Unlockable Stamps (Progression)
- Create 5 drawings → Unlock "Space" pack
- Create 10 drawings → Unlock "Sports" pack
- Create 20 drawings → Unlock "Fantasy" pack

---

## References

### Inspiration
- MS Paint (classic simplicity)
- Procreate Pocket (touch gestures)
- Drawing for Kids (age-appropriate)
- Tayasui Sketches (brush feel)
