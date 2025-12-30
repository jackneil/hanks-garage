import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type GameStatus,
  type SequencerPattern,
  type SavedBeat,
  DRUM_KITS,
  DEFAULT_BPM,
  GRID_STEPS,
  createEmptyPattern,
} from "./constants";

// Progress data (persisted)
export type DrumMachineProgress = {
  savedBeats: SavedBeat[];
  favoriteKitId: string;
  settings: {
    defaultBpm: number;
    defaultKitId: string;
    soundEnabled: boolean;
    volume: number;
  };
  stats: {
    beatsCreated: number;
    totalPlayTime: number;
    padsHit: number;
  };
  lastModified: number;
};

// Full state
export type DrumMachineState = {
  status: GameStatus;
  mode: "pads" | "sequencer";

  currentKitId: string;
  bpm: number;
  pattern: SequencerPattern;

  currentStep: number;
  isPlaying: boolean;

  activePads: Set<string>; // Currently pressed pads (for visual feedback)

  progress: DrumMachineProgress;
};

type DrumMachineActions = {
  setMode: (mode: "pads" | "sequencer") => void;
  setKit: (kitId: string) => void;
  setBpm: (bpm: number) => void;

  // Pad mode
  triggerPad: (soundId: string) => void;
  releasePad: (soundId: string) => void;

  // Sequencer mode
  toggleStep: (soundId: string, step: number) => void;
  clearPattern: () => void;

  // Playback
  startPlayback: () => void;
  stopPlayback: () => void;
  advanceStep: () => void;

  // Beats
  saveBeat: (name: string) => void;
  loadBeat: (beat: SavedBeat) => void;
  deleteBeat: (beatId: string) => void;

  // Progress
  getProgress: () => DrumMachineProgress;
  setProgress: (data: DrumMachineProgress) => void;
};

const defaultProgress: DrumMachineProgress = {
  savedBeats: [],
  favoriteKitId: "hip-hop",
  settings: {
    defaultBpm: DEFAULT_BPM,
    defaultKitId: "hip-hop",
    soundEnabled: true,
    volume: 0.8,
  },
  stats: {
    beatsCreated: 0,
    totalPlayTime: 0,
    padsHit: 0,
  },
  lastModified: Date.now(),
};

function createInitialState(): Partial<DrumMachineState> {
  return {
    status: "idle",
    mode: "pads",
    currentKitId: "hip-hop",
    bpm: DEFAULT_BPM,
    pattern: createEmptyPattern(),
    currentStep: 0,
    isPlaying: false,
    activePads: new Set(),
  };
}

// Audio engine
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
}

export function playDrumSound(
  kitId: string,
  soundId: string,
  volume: number,
  enabled: boolean
) {
  if (!enabled) return;

  const kit = DRUM_KITS.find(k => k.id === kitId);
  if (!kit) return;

  const sound = kit.sounds.find(s => s.id === soundId);
  if (!sound) return;

  try {
    const ctx = getAudioContext();
    const masterGain = ctx.createGain();
    masterGain.gain.value = volume;
    masterGain.connect(ctx.destination);

    if (sound.noise) {
      // Create noise for hi-hats, snares, etc.
      const bufferSize = ctx.sampleRate * sound.decay;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      // Filter for tone
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = sound.frequency;
      filter.Q.value = 1;

      const env = ctx.createGain();
      env.gain.setValueAtTime(0.5, ctx.currentTime);
      env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + sound.decay);

      noise.connect(filter);
      filter.connect(env);
      env.connect(masterGain);

      noise.start();
      noise.stop(ctx.currentTime + sound.decay);
    } else {
      // Oscillator-based sounds
      const osc = ctx.createOscillator();
      osc.type = sound.type;
      osc.frequency.setValueAtTime(sound.frequency, ctx.currentTime);

      // Pitch bend for kick drums
      if (sound.frequency < 100) {
        osc.frequency.exponentialRampToValueAtTime(
          Math.max(sound.frequency * 0.5, 20),
          ctx.currentTime + sound.decay
        );
      }

      const env = ctx.createGain();
      env.gain.setValueAtTime(0.8, ctx.currentTime);
      env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + sound.decay);

      // Optional filter
      if (sound.filterFreq) {
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = sound.filterFreq;
        osc.connect(filter);
        filter.connect(env);
      } else {
        osc.connect(env);
      }

      env.connect(masterGain);

      osc.start();
      osc.stop(ctx.currentTime + sound.decay + 0.1);
    }
  } catch {
    // Audio not supported
  }
}

export const useDrumMachineStore = create<DrumMachineState & DrumMachineActions>()(
  persist(
    (set, get) => ({
      ...createInitialState() as DrumMachineState,
      progress: defaultProgress,

      setMode: (mode) => set({ mode }),

      setKit: (kitId) => {
        const kit = DRUM_KITS.find(k => k.id === kitId);
        if (!kit) return;

        // Reset pattern for new kit
        const pattern: SequencerPattern = {};
        kit.sounds.forEach(sound => {
          pattern[sound.id] = new Array(GRID_STEPS).fill(false);
        });

        set({ currentKitId: kitId, pattern });
      },

      setBpm: (bpm) => set({ bpm }),

      triggerPad: (soundId) => {
        const state = get();
        playDrumSound(
          state.currentKitId,
          soundId,
          state.progress.settings.volume,
          state.progress.settings.soundEnabled
        );

        const activePads = new Set(state.activePads);
        activePads.add(soundId);

        set({
          activePads,
          progress: {
            ...state.progress,
            stats: {
              ...state.progress.stats,
              padsHit: state.progress.stats.padsHit + 1,
            },
            lastModified: Date.now(),
          },
        });
      },

      releasePad: (soundId) => {
        const state = get();
        const activePads = new Set(state.activePads);
        activePads.delete(soundId);
        set({ activePads });
      },

      toggleStep: (soundId, step) => {
        const state = get();
        const pattern = { ...state.pattern };
        if (!pattern[soundId]) {
          pattern[soundId] = new Array(GRID_STEPS).fill(false);
        }
        pattern[soundId] = [...pattern[soundId]];
        pattern[soundId][step] = !pattern[soundId][step];
        set({ pattern });
      },

      clearPattern: () => {
        const state = get();
        const kit = DRUM_KITS.find(k => k.id === state.currentKitId);
        if (!kit) return;

        const pattern: SequencerPattern = {};
        kit.sounds.forEach(sound => {
          pattern[sound.id] = new Array(GRID_STEPS).fill(false);
        });
        set({ pattern });
      },

      startPlayback: () => {
        set({ isPlaying: true, currentStep: 0 });
      },

      stopPlayback: () => {
        set({ isPlaying: false, currentStep: 0 });
      },

      advanceStep: () => {
        const state = get();
        if (!state.isPlaying) return;

        const nextStep = (state.currentStep + 1) % GRID_STEPS;

        // Trigger sounds for this step
        const kit = DRUM_KITS.find(k => k.id === state.currentKitId);
        if (kit) {
          kit.sounds.forEach(sound => {
            if (state.pattern[sound.id]?.[state.currentStep]) {
              playDrumSound(
                state.currentKitId,
                sound.id,
                state.progress.settings.volume,
                state.progress.settings.soundEnabled
              );
            }
          });
        }

        set({ currentStep: nextStep });
      },

      saveBeat: (name) => {
        const state = get();
        const beat: SavedBeat = {
          id: Date.now().toString(),
          name,
          kitId: state.currentKitId,
          bpm: state.bpm,
          pattern: { ...state.pattern },
          createdAt: new Date().toISOString(),
        };

        set({
          progress: {
            ...state.progress,
            savedBeats: [...state.progress.savedBeats, beat],
            stats: {
              ...state.progress.stats,
              beatsCreated: state.progress.stats.beatsCreated + 1,
            },
            lastModified: Date.now(),
          },
        });
      },

      loadBeat: (beat) => {
        set({
          currentKitId: beat.kitId,
          bpm: beat.bpm,
          pattern: { ...beat.pattern },
          isPlaying: false,
          currentStep: 0,
        });
      },

      deleteBeat: (beatId) => {
        const state = get();
        set({
          progress: {
            ...state.progress,
            savedBeats: state.progress.savedBeats.filter(b => b.id !== beatId),
            lastModified: Date.now(),
          },
        });
      },

      getProgress: () => get().progress,
      setProgress: (data) => set({ progress: data }),
    }),
    {
      name: "drum-machine-state",
      partialize: (state) => ({
        progress: state.progress,
      }),
    }
  )
);
