'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '../lib/store';

interface GameUIProps {
  speed: number;
  isMobile: boolean;
  onPause: () => void;
  onOpenGarage: () => void;
}

export function GameUI({ speed, isMobile, onPause, onOpenGarage }: GameUIProps) {
  const coins = useGameStore((s) => s.coins);
  const sessionCoins = useGameStore((s) => s.sessionCoins);
  const nosCharge = useGameStore((s) => s.nosCharge);
  const nosMaxCharge = useGameStore((s) => s.nosMaxCharge);
  const starsCollected = useGameStore((s) => s.starsCollected);

  // Coin animation state
  const [animatedCoins, setAnimatedCoins] = useState(coins);
  const [coinDiff, setCoinDiff] = useState(0);

  useEffect(() => {
    if (coins !== animatedCoins) {
      setCoinDiff(coins - animatedCoins);
      setAnimatedCoins(coins);

      // Clear the diff after animation
      const timer = setTimeout(() => setCoinDiff(0), 1500);
      return () => clearTimeout(timer);
    }
  }, [coins, animatedCoins]);

  const nosPercent = (nosCharge / nosMaxCharge) * 100;
  const speedMph = Math.round(speed * 2.237); // Convert m/s to mph

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {/* Top left - Coins */}
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        {/* Coin counter */}
        <div className="bg-black/60 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2">
          <span className="text-3xl">🪙</span>
          <span className="text-2xl font-bold text-yellow-400 font-mono">
            {coins.toLocaleString()}
          </span>
          {/* Coin gain popup */}
          {coinDiff > 0 && (
            <span className="text-green-400 font-bold animate-bounce">
              +{coinDiff}
            </span>
          )}
        </div>

        {/* Stars counter */}
        <div className="bg-black/60 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2">
          <span className="text-2xl">⭐</span>
          <span className="text-xl font-bold text-yellow-300 font-mono">
            {starsCollected}
          </span>
        </div>

        {/* Session coins */}
        <div className="bg-black/40 rounded-lg px-3 py-1 text-sm text-gray-300">
          Session: +{sessionCoins}
        </div>
      </div>

      {/* Top right - NOS and Speed */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
        {/* NOS meter */}
        <div className="bg-black/60 backdrop-blur-sm rounded-xl px-4 py-2 w-40">
          <div className="flex items-center justify-between mb-1">
            <span className="text-cyan-400 font-bold">NOS</span>
            <span className="text-cyan-300 text-sm">{Math.round(nosPercent)}%</span>
          </div>
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-100 ${
                nosPercent > 50
                  ? 'bg-gradient-to-r from-cyan-500 to-cyan-300'
                  : nosPercent > 20
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-300'
                  : 'bg-gradient-to-r from-red-500 to-red-300'
              }`}
              style={{ width: `${nosPercent}%` }}
            />
          </div>
        </div>

        {/* Speedometer */}
        <div className="bg-black/60 backdrop-blur-sm rounded-xl px-4 py-3 text-center">
          <div className="text-4xl font-bold text-white font-mono">
            {speedMph}
          </div>
          <div className="text-xs text-gray-400">MPH</div>
        </div>
      </div>

      {/* Bottom right - Pause and Garage (not on mobile - they have different controls) */}
      {!isMobile && (
        <div className="absolute bottom-4 right-4 flex gap-2 pointer-events-auto">
          <button
            onClick={onOpenGarage}
            className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
          >
            🔧 Garage
          </button>
          <button
            onClick={onPause}
            className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
          >
            ⏸️ Pause
          </button>
        </div>
      )}

      {/* Desktop controls hint */}
      {!isMobile && (
        <div className="absolute bottom-4 left-4 bg-black/50 rounded-lg px-3 py-2 text-xs text-gray-300">
          <div className="font-bold mb-1">Controls:</div>
          <div>WASD / Arrows - Drive</div>
          <div>Space - NOS Boost</div>
          <div>H - Horn</div>
          <div>R - Reset</div>
        </div>
      )}

      {/* Mobile pause button */}
      {isMobile && (
        <div className="absolute top-4 right-20 pointer-events-auto">
          <button
            onClick={onPause}
            className="bg-gray-600/80 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl"
          >
            ⏸️
          </button>
        </div>
      )}
    </div>
  );
}

// Popup for bonuses/achievements
export function BonusPopup({
  text,
  coins,
  onComplete,
}: {
  text: string;
  coins: number;
  onComplete: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none animate-bounce">
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl px-8 py-4 text-center shadow-2xl">
        <div className="text-3xl font-bold text-white mb-1">{text}</div>
        <div className="text-2xl font-bold text-yellow-300">+{coins} 🪙</div>
      </div>
    </div>
  );
}

// Pause menu
export function PauseMenu({
  onResume,
  onGarage,
  onQuit,
}: {
  onResume: () => void;
  onGarage: () => void;
  onQuit: () => void;
}) {
  const coins = useGameStore((s) => s.coins);
  const sessionCoins = useGameStore((s) => s.sessionCoins);
  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const musicEnabled = useGameStore((s) => s.musicEnabled);
  const toggleSound = useGameStore((s) => s.toggleSound);
  const toggleMusic = useGameStore((s) => s.toggleMusic);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <h2 className="text-4xl font-bold text-center text-white mb-6">
          ⏸️ PAUSED
        </h2>

        {/* Session stats */}
        <div className="bg-black/30 rounded-xl p-4 mb-6">
          <div className="flex justify-between text-lg">
            <span className="text-gray-400">Total Coins:</span>
            <span className="text-yellow-400 font-bold">🪙 {coins}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span className="text-gray-400">This Session:</span>
            <span className="text-green-400 font-bold">+{sessionCoins}</span>
          </div>
        </div>

        {/* Settings */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={toggleSound}
            className={`p-3 rounded-xl ${soundEnabled ? 'bg-green-600' : 'bg-gray-600'}`}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          <button
            onClick={toggleMusic}
            className={`p-3 rounded-xl ${musicEnabled ? 'bg-green-600' : 'bg-gray-600'}`}
          >
            {musicEnabled ? '🎵' : '🎵❌'}
          </button>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onResume}
            className="bg-green-600 hover:bg-green-500 text-white py-4 px-8 rounded-xl font-bold text-xl transition-colors"
          >
            ▶️ RESUME
          </button>
          <button
            onClick={onGarage}
            className="bg-orange-600 hover:bg-orange-500 text-white py-4 px-8 rounded-xl font-bold text-xl transition-colors"
          >
            🔧 GARAGE
          </button>
          <button
            onClick={onQuit}
            className="bg-gray-600 hover:bg-gray-500 text-white py-3 px-8 rounded-xl font-bold text-lg transition-colors"
          >
            🏠 QUIT TO MENU
          </button>
        </div>
      </div>
    </div>
  );
}
