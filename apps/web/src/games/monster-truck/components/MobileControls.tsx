'use client';

import { UI } from '../lib/constants';
import { useTouchControls } from '../hooks/useControls';

interface MobileControlsProps {
  touchControls: ReturnType<typeof useTouchControls>;
  onHorn: () => void;
  onNos: () => void;
  nosCharge: number;
  nosMaxCharge: number;
  useTilt: boolean;
  onToggleTilt: () => void;
  onCalibrate: () => void;
}

export function MobileControls({
  touchControls,
  onHorn,
  onNos,
  nosCharge,
  nosMaxCharge,
  useTilt,
  onToggleTilt,
  onCalibrate,
}: MobileControlsProps) {
  const { handlers, state } = touchControls;
  const nosPercent = (nosCharge / nosMaxCharge) * 100;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Top controls row */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
        {/* Tilt toggle */}
        <button
          onClick={onToggleTilt}
          className={`
            px-4 py-2 rounded-full text-white font-bold text-sm
            ${useTilt ? 'bg-green-500' : 'bg-gray-500'}
            active:scale-95 transition-transform
          `}
        >
          {useTilt ? '🎮 TILT ON' : '🎮 TILT OFF'}
        </button>

        {/* Calibrate button (only when tilt is on) */}
        {useTilt && (
          <button
            onClick={onCalibrate}
            className="px-4 py-2 rounded-full bg-blue-500 text-white font-bold text-sm active:scale-95"
          >
            ⚙️ CALIBRATE
          </button>
        )}
      </div>

      {/* Side buttons - NOS and Horn */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 pointer-events-auto">
        {/* NOS button */}
        <button
          {...handlers.nos}
          className={`
            w-20 h-20 rounded-full
            flex flex-col items-center justify-center
            text-white font-bold
            ${state.nos ? 'bg-cyan-400 scale-110' : 'bg-cyan-600'}
            ${nosCharge < 10 ? 'opacity-50' : ''}
            transition-all shadow-lg
            active:scale-95
          `}
          style={{ touchAction: 'none' }}
        >
          <span className="text-2xl">🚀</span>
          <span className="text-xs">NOS</span>
          {/* NOS level indicator */}
          <div className="absolute bottom-1 left-2 right-2 h-1 bg-black/30 rounded">
            <div
              className="h-full bg-cyan-300 rounded transition-all"
              style={{ width: `${nosPercent}%` }}
            />
          </div>
        </button>

        {/* Horn button */}
        <button
          {...handlers.horn}
          onTouchStart={(e) => {
            handlers.horn.onTouchStart(e);
            onHorn();
          }}
          onClick={onHorn}
          className={`
            w-20 h-20 rounded-full
            flex flex-col items-center justify-center
            text-white font-bold text-xl
            ${state.horn ? 'bg-yellow-400 scale-110' : 'bg-yellow-600'}
            transition-all shadow-lg
            active:scale-95
          `}
          style={{ touchAction: 'none' }}
        >
          <span className="text-3xl">📯</span>
        </button>
      </div>

      {/* Steering buttons (when tilt is off) */}
      {!useTilt && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 pointer-events-auto">
          <button
            {...handlers.left}
            className={`
              w-16 h-24 rounded-xl
              flex items-center justify-center
              text-white font-bold text-3xl
              ${state.left ? 'bg-blue-400 scale-105' : 'bg-blue-600'}
              transition-all shadow-lg
            `}
            style={{ touchAction: 'none' }}
          >
            ◀
          </button>
          <button
            {...handlers.right}
            className={`
              w-16 h-24 rounded-xl
              flex items-center justify-center
              text-white font-bold text-3xl
              ${state.right ? 'bg-blue-400 scale-105' : 'bg-blue-600'}
              transition-all shadow-lg
            `}
            style={{ touchAction: 'none' }}
          >
            ▶
          </button>
        </div>
      )}

      {/* Bottom pedals */}
      <div className="absolute bottom-0 left-0 right-0 h-32 flex pointer-events-auto">
        {/* Brake pedal */}
        <button
          {...handlers.brake}
          className={`
            flex-1 m-2 rounded-t-3xl
            flex items-center justify-center
            text-white font-bold text-2xl
            ${state.brake ? 'bg-red-500' : 'bg-red-700'}
            transition-all shadow-lg
          `}
          style={{ touchAction: 'none' }}
        >
          <div className="flex flex-col items-center">
            <span className="text-4xl">🛑</span>
            <span>BRAKE</span>
          </div>
        </button>

        {/* Gas pedal */}
        <button
          {...handlers.gas}
          className={`
            flex-1 m-2 rounded-t-3xl
            flex items-center justify-center
            text-white font-bold text-2xl
            ${state.gas ? 'bg-green-400' : 'bg-green-600'}
            transition-all shadow-lg
          `}
          style={{ touchAction: 'none' }}
        >
          <div className="flex flex-col items-center">
            <span className="text-4xl">⛽</span>
            <span>GAS</span>
          </div>
        </button>
      </div>

      {/* Tilt indicator (when tilt is on) */}
      {useTilt && (
        <div className="absolute bottom-36 left-1/2 -translate-x-1/2 pointer-events-none">
          <div className="bg-black/50 px-4 py-2 rounded-full text-white text-sm">
            📱 Tilt phone to steer
          </div>
        </div>
      )}
    </div>
  );
}
