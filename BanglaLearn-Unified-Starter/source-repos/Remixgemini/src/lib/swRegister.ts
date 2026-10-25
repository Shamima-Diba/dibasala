// Service Worker Registration and Communication Utilities
import { OFFLINE_LEARNING_MATERIALS } from '../data/offlineMaterials';

export interface ServiceWorkerCacheStats {
  appShellCount: number;
  contentCount: number;
  timestamp: number;
  isRegistered: boolean;
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('[SW Registration] Junior Gemini Service Worker registered with scope:', registration.scope);

      // Pre-cache core learning materials after registration
      if (registration.active) {
        sendMaterialsToServiceWorker(OFFLINE_LEARNING_MATERIALS);
      } else {
        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'activated') {
                sendMaterialsToServiceWorker(OFFLINE_LEARNING_MATERIALS);
              }
            };
          }
        });
      }

      return registration;
    } catch (error) {
      console.warn('[SW Registration] Service worker registration failed:', error);
      return null;
    }
  } else {
    console.warn('[SW Registration] Service workers are not supported in this environment.');
    return null;
  }
}

export function sendMaterialsToServiceWorker(materials: any[]): Promise<boolean> {
  return new Promise((resolve) => {
    if (!navigator.serviceWorker || !navigator.serviceWorker.controller) {
      resolve(false);
      return;
    }

    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => {
      if (event.data && event.data.success) {
        console.log('[SW Utility] Offline materials precached successfully:', event.data.count);
        resolve(true);
      } else {
        resolve(false);
      }
    };

    navigator.serviceWorker.controller.postMessage(
      {
        type: 'PRECACHE_MATERIALS',
        materials
      },
      [messageChannel.port2]
    );
  });
}

export function getSWCacheStats(): Promise<ServiceWorkerCacheStats> {
  return new Promise((resolve) => {
    const defaultStats: ServiceWorkerCacheStats = {
      appShellCount: 0,
      contentCount: 0,
      timestamp: Date.now(),
      isRegistered: false
    };

    if (!navigator.serviceWorker || !navigator.serviceWorker.controller) {
      resolve(defaultStats);
      return;
    }

    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => {
      if (event.data) {
        resolve({
          appShellCount: event.data.appShellCount || 0,
          contentCount: event.data.contentCount || 0,
          timestamp: event.data.timestamp || Date.now(),
          isRegistered: true
        });
      } else {
        resolve({ ...defaultStats, isRegistered: true });
      }
    };

    navigator.serviceWorker.controller.postMessage(
      { type: 'GET_CACHE_STATS' },
      [messageChannel.port2]
    );
  });
}

export function clearSWCache(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!navigator.serviceWorker || !navigator.serviceWorker.controller) {
      resolve(false);
      return;
    }

    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => {
      resolve(!!(event.data && event.data.cleared));
    };

    navigator.serviceWorker.controller.postMessage(
      { type: 'CLEAR_CACHE' },
      [messageChannel.port2]
    );
  });
}
