'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Platform-aware fullscreen hook
 *
 * Platform support:
 * - iPhone: NO fullscreen API (Apple never shipped it). Returns isSupported=false.
 * - iPad: Fullscreen API works (Safari 16.4+) with unprefixed requestFullscreen()
 * - Android: Standard fullscreen API
 * - Desktop: Standard fullscreen API
 * - Chrome/Firefox on iOS: Same as Safari (Apple forces WKWebView)
 */

interface UseFullscreenReturn {
  isSupported: boolean;
  isFullscreen: boolean;
  isIPhone: boolean;
  isIPad: boolean;
  isPWA: boolean;
  toggle: () => Promise<void>;
  enter: () => Promise<void>;
  exit: () => Promise<void>;
}

function detectPlatform() {
  if (typeof window === 'undefined') {
    return { isIPhone: false, isIPad: false, isPWA: false };
  }

  const ua = navigator.userAgent;

  // Detect iPhone (not iPad)
  const isIPhone = /iPhone/.test(ua) && !/iPad/.test(ua);

  // Detect iPad (including iPadOS which reports as Mac)
  const isIPad = /iPad/.test(ua) ||
    (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);

  // Detect if running as installed PWA
  const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

  return { isIPhone, isIPad, isPWA };
}

function isFullscreenSupported(): boolean {
  if (typeof document === 'undefined') return false;

  const { isIPhone } = detectPlatform();

  // iPhone has no fullscreen API support (Apple never shipped it)
  if (isIPhone) return false;

  // Check for fullscreen API support
  return !!(
    document.fullscreenEnabled ||
    (document as Document & { webkitFullscreenEnabled?: boolean }).webkitFullscreenEnabled
  );
}

export function useFullscreen(elementRef?: React.RefObject<HTMLElement>): UseFullscreenReturn {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { isIPhone, isIPad, isPWA } = detectPlatform();
  const isSupported = isFullscreenSupported();

  // Sync fullscreen state with document
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleFullscreenChange = () => {
      const fullscreenElement = document.fullscreenElement ||
        (document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement;
      setIsFullscreen(!!fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    // Initial state
    handleFullscreenChange();

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const enter = useCallback(async () => {
    if (!isSupported) return;

    const element = elementRef?.current || document.documentElement;

    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if ((element as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen) {
        await (element as HTMLElement & { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen();
      }
    } catch (err) {
      // iPadOS 18 can sometimes fail silently - log but don't crash
      console.warn('Fullscreen request failed:', err);
    }
  }, [isSupported, elementRef]);

  const exit = useCallback(async () => {
    if (typeof document === 'undefined') return;

    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as Document & { webkitExitFullscreen?: () => Promise<void> }).webkitExitFullscreen) {
        await (document as Document & { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen();
      }
    } catch (err) {
      console.warn('Exit fullscreen failed:', err);
    }
  }, []);

  const toggle = useCallback(async () => {
    if (isFullscreen) {
      await exit();
    } else {
      await enter();
    }
  }, [isFullscreen, enter, exit]);

  return {
    isSupported,
    isFullscreen,
    isIPhone,
    isIPad,
    isPWA,
    toggle,
    enter,
    exit,
  };
}
