'use client';

/**
 * Hill Climb Racing - Route Page
 *
 * Thin wrapper that imports the game module with SSR disabled.
 */

import dynamic from 'next/dynamic';
import { GameShell } from '@/shared/components';

const HillClimbGame = dynamic(
  () => import('@/games/hill-climb'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-b from-sky-400 to-sky-600 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">🚗</div>
          <div className="text-2xl font-bold text-white">Loading Hill Climb...</div>
        </div>
      </div>
    ),
  }
);

export default function HillClimbPage() {
  return (
    <GameShell gameName="Hill Climb" canPause={false} showPauseButton={false}>
      <HillClimbGame />
    </GameShell>
  );
}
