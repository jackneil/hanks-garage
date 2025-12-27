// Minimal service worker - required for PWA "Add to Home Screen" functionality
// This enables the PWA install prompt on iOS and Android

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', () => {
  // No-op - just needed for PWA installability
});
