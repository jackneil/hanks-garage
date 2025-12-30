# Drum Machine - App Design Document

## Overview

**Drum Machine** is an interactive beat maker where kids tap pads to create rhythms. With multiple drum kits, a sequencer grid, and the ability to save beats, it's creative expression through sound.

**Why Kids Love It:**
- **Make noise!** - Tap = instant sound feedback
- **Create something** - "I made this beat!"
- **Instant gratification** - No learning required
- **Multiple kits** - Different sounds to explore
- **Looping magic** - Patterns repeat automatically
- **Share with friends** - Play back their creations

**Target Player:** Hank Neil, age 8 (and kids 6-14)
**Platform:** Web (mobile + desktop)
**Style:** Colorful pads, professional but playful

---

## Core Interaction Loop

```
TAP a pad = instant sound
    |
HEAR the sound immediately
    |
TAP more pads = layer sounds
    |
TOGGLE sequencer mode
    |
CLICK grid squares to program beat
    |
PLAY = hear your pattern loop
    |
ADJUST tempo (faster/slower)
    |
SAVE beat for later
    |
SWITCH kits = new sounds!
```

### Why This Works

- **Zero friction** - Tap = sound, instantly
- **Creative ownership** - "I made this"
- **Experimentation** - Try different combinations
- **Satisfying loops** - Patterns feel musical
- **Progression** - From tapping to composing
- **Social** - Show off to family

---

## Interface

### Live Pad Mode
```
+------------------------------------------+
|  [Kit: Hip Hop ▼]        BPM: [120]      |
+------------------------------------------+
|                                          |
|   [KICK]    [SNARE]    [HAT]    [CLAP]  |
|     🔴        🟠        🟡        🟢     |
|                                          |
|   [TOM 1]   [TOM 2]   [CRASH]   [RIDE]  |
|     🔵        🟣        ⚪        🟤     |
|                                          |
+------------------------------------------+
|         [▶ PLAY]  [⏹ STOP]  [🔄 CLEAR]  |
+------------------------------------------+
|    [PADS]          [SEQUENCER]           |
+------------------------------------------+
```

### Sequencer Mode
```
+------------------------------------------+
|  [Kit: Hip Hop ▼]    BPM: [120] [▶][⏹]  |
+------------------------------------------+
| BEAT:  1   2   3   4   5   6   7   8    |
+------------------------------------------+
| KICK  [●] [ ] [ ] [ ] [●] [ ] [ ] [ ]   |
| SNARE [ ] [ ] [●] [ ] [ ] [ ] [●] [ ]   |
| HAT   [●] [●] [●] [●] [●] [●] [●] [●]   |
| CLAP  [ ] [ ] [ ] [●] [ ] [ ] [ ] [●]   |
| TOM 1 [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ]   |
| TOM 2 [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ]   |
+------------------------------------------+
|  [SAVE BEAT]    [LOAD BEAT]    [SHARE]  |
+------------------------------------------+
```

---

## Features

### Drum Kits
| Kit Name | Style | Sounds |
|----------|-------|--------|
| Hip Hop | Modern beats | Deep kick, snappy snare |
| Rock | Live drums | Punchy, reverb |
| Electronic | Synth drums | 808s, digital |
| Retro | 8-bit | Chiptune sounds |
| Silly | Fun sounds | Farts, boings, honks |
| Animals | Nature | Dog bark, cat meow, etc |

### Sequencer
- 8 or 16 beat grid
- Click to toggle note on/off
- Visual playhead shows current beat
- Adjustable BPM (60-180)
- Loop continuously

### Beat Storage
- Save up to 10 beats locally
- Name your beats
- Cloud sync when logged in
- Load and edit saved beats

---

## Features (Priority Order)

### MVP (Must Have)
1. **8 drum pads** with touch/click response
2. **Visual feedback** when pad hit (glow, animation)
3. **Audio playback** using Web Audio API
4. **At least 2 drum kits** to switch between
5. **BPM control** slider
6. **Sequencer grid** (8 beats × 4 sounds minimum)
7. **Play/Stop controls**
8. **Mobile-responsive** layout

### Important (Fun Factor)
9. **More drum kits** (5-6 total)
10. **16-beat sequencer** option
11. **Pad animations** (ripple, bounce)
12. **Volume control** per pad
13. **Tempo tap** (tap to set BPM)
14. **Swing/groove** setting
15. **Save beats** locally

### Nice to Have
16. **Record mode** (live tap recording)
17. **Export audio** (download WAV)
18. **Share beat** (copy link)
19. **Metronome** option
20. **Effects** (reverb, delay)

---

## Technical Approach

### Stack
```
Next.js 16 + React 19
Web Audio API for low-latency sound
Zustand for state
TypeScript
```

### Architecture
```
apps/web/src/apps/drum-machine/
├── components/
│   ├── DrumPad.tsx          # Individual pad
│   ├── PadGrid.tsx          # 2×4 pad layout
│   ├── Sequencer.tsx        # Step sequencer grid
│   ├── TransportControls.tsx # Play/Stop/BPM
│   ├── KitSelector.tsx      # Dropdown for kits
│   └── BeatLibrary.tsx      # Save/Load UI
├── hooks/
│   ├── useAudioEngine.ts    # Web Audio context
│   ├── useSequencer.ts      # Timing/playback
│   └── useMIDI.ts           # Optional MIDI input
├── lib/
│   ├── store.ts
│   ├── kits.ts              # Kit definitions
│   ├── scheduler.ts         # Precise timing
│   └── constants.ts
├── sounds/                  # Audio files per kit
├── App.tsx
└── index.ts
```

### Web Audio Approach
```typescript
// Low-latency audio playback
class AudioEngine {
  private context: AudioContext;
  private buffers: Map<string, AudioBuffer>;

  async loadKit(kit: DrumKit) {
    // Pre-load all samples
    for (const sound of kit.sounds) {
      const buffer = await this.loadSample(sound.url);
      this.buffers.set(sound.id, buffer);
    }
  }

  playSound(soundId: string, time?: number) {
    const buffer = this.buffers.get(soundId);
    if (!buffer) return;

    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.context.destination);
    source.start(time ?? 0);
  }
}
```

### Sequencer Timing
```typescript
// Precise timing using Web Audio scheduler
function scheduleSequence(pattern: boolean[][], bpm: number) {
  const secondsPerBeat = 60 / bpm;
  const now = audioContext.currentTime;

  for (let beat = 0; beat < pattern[0].length; beat++) {
    const time = now + (beat * secondsPerBeat);
    pattern.forEach((track, trackIndex) => {
      if (track[beat]) {
        audioEngine.playSound(tracks[trackIndex].soundId, time);
      }
    });
  }
}
```

---

## Settings & Progress Saving

### Data Schema
```typescript
interface DrumMachineProgress {
  savedBeats: SavedBeat[];
  favoritKit: string;
  settings: {
    defaultBpm: number;
    defaultKit: string;
    gridSize: 8 | 16;
    soundEnabled: boolean;
    volume: number;
  };
  stats: {
    beatsCreated: number;
    totalPlayTime: number;
    padsHit: number;
  };
  lastPlayed: string;
}

interface SavedBeat {
  id: string;
  name: string;
  kit: string;
  bpm: number;
  pattern: boolean[][];  // tracks × beats
  createdAt: string;
}
```

### useAuthSync Integration
```typescript
useAuthSync({
  appId: "drum-machine",
  localStorageKey: "drum-machine-progress",
  getState: store.getProgress,
  setState: store.setProgress,
  debounceMs: 3000,
});
```

---

## Kid-Friendly Design

- **Big colorful pads** - Easy to tap, hard to miss
- **Instant response** - No perceptible delay
- **Visual feedback** - Pads light up, ripple effect
- **Simple defaults** - Hip Hop kit, 100 BPM
- **"Silly" kit option** - Fart sounds = guaranteed laughs
- **No wrong notes** - Everything sounds good together
- **Clear icons** - Play = ▶, Stop = ⏹
- **Auto-loop** - Set it and forget it
- **Volume control** - For parents' sanity

### Mobile Optimization
- Large touch targets (80px minimum)
- No hover states (touch only)
- Prevent zoom on double-tap
- Lock orientation to portrait

---

## Audio Assets Needed

### Per Kit (8 sounds each)
1. Kick drum
2. Snare drum
3. Hi-hat (closed)
4. Clap
5. Tom (high)
6. Tom (low)
7. Crash cymbal
8. Ride cymbal / extra percussion

### Format
- MP3 or WAV
- 44.1kHz, 16-bit
- Short samples (< 2 seconds)
- Normalized volume

### Sources (Royalty-Free)
- [FreeSound.org](https://freesound.org)
- [SampleSwap](https://sampleswap.org)
- [99Sounds](https://99sounds.org)

---

## References

### Open Source
- [dmeldrum6/WebAudio-Drum-Machine](https://github.com/dmeldrum6/WebAudio-Drum-Machine)
- [Google Chrome Labs Shiny Drum Machine](https://googlechromelabs.github.io/web-audio-samples/demos/shiny-drum-machine/)
- [amilajack/drum-machine](https://github.com/amilajack/drum-machine)

### Inspiration
- Native Instruments Maschine
- Roland TR-808/909
- GarageBand Drummer
