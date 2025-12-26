'use client';

import dynamic from 'next/dynamic';

// Dynamic import with no SSR - R3F doesn't work with SSR
const MonsterTruckGame = dynamic(
  () => import('@/games/monster-truck'),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 bg-gradient-to-b from-orange-600 to-red-700 flex flex-col items-center justify-center">
        <div className="text-6xl mb-4 animate-bounce">🚛</div>
        <h1 className="text-4xl font-bold text-white mb-4">Monster Truck Mayhem</h1>
        <div className="w-64 h-2 bg-black/30 rounded-full overflow-hidden">
          <div className="h-full bg-yellow-400 rounded-full animate-pulse" style={{ width: '30%' }} />
        </div>
        <p className="text-white/80 mt-4">Loading game...</p>
      </div>
    ),
  }
);

export default function MonsterTruckPage() {
  return <MonsterTruckGame />;
}
