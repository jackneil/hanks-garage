'use client';

import { useState } from 'react';
import { useFullscreen } from '../hooks/useFullscreen';
import { IOSInstallPrompt } from './IOSInstallPrompt';

/**
 * Platform-aware fullscreen button
 *
 * - Android/Desktop/iPad: Shows expand icon, uses fullscreen API
 * - iPhone: Shows install icon, opens IOSInstallPrompt
 * - PWA mode: Hidden (already fullscreen)
 */

interface FullscreenButtonProps {
  className?: string;
}

export function FullscreenButton({ className = '' }: FullscreenButtonProps) {
  const { isSupported, isFullscreen, isIPhone, isPWA, toggle } = useFullscreen();
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  // Hide if already in PWA mode (already fullscreen)
  if (isPWA) return null;

  // iPhone: Show install prompt button
  if (isIPhone) {
    return (
      <>
        <button
          onClick={() => setShowIOSPrompt(true)}
          className={`
            w-12 h-12 rounded-full
            bg-blue-600 hover:bg-blue-500
            flex items-center justify-center
            text-white text-2xl
            shadow-lg
            active:scale-95
            transition-all
            ${className}
          `}
          aria-label="Install app for fullscreen"
          title="Add to Home Screen for fullscreen"
        >
          📲
        </button>
        {showIOSPrompt && (
          <IOSInstallPrompt onClose={() => setShowIOSPrompt(false)} />
        )}
      </>
    );
  }

  // Not supported (shouldn't happen for non-iPhone, but safety check)
  if (!isSupported) return null;

  // Android/Desktop/iPad: Standard fullscreen toggle
  return (
    <button
      onClick={toggle}
      className={`
        w-12 h-12 rounded-full
        bg-gray-800/80 hover:bg-gray-700
        flex items-center justify-center
        text-white
        shadow-lg
        active:scale-95
        transition-all
        ${className}
      `}
      aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
    >
      {isFullscreen ? (
        // Compress icon (exit fullscreen)
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7" />
        </svg>
      ) : (
        // Expand icon (enter fullscreen)
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </svg>
      )}
    </button>
  );
}
