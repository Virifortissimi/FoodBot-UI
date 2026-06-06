import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

const BROWSER_DATA_RESET_KEY = 'foodbot_browser_reset_version';
const BROWSER_DATA_RESET_VERSION = '2026-06-06-browser-data-reset';

@Injectable({
  providedIn: 'root'
})
export class BrowserDataResetService {
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  async initialize(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (localStorage.getItem(BROWSER_DATA_RESET_KEY) === BROWSER_DATA_RESET_VERSION) {
      return;
    }

    localStorage.clear();
    sessionStorage.clear();

    await Promise.allSettled([
      this.clearCacheStorage(),
      this.updateServiceWorkers()
    ]);

    localStorage.setItem(BROWSER_DATA_RESET_KEY, BROWSER_DATA_RESET_VERSION);
    window.location.reload();
  }

  private async clearCacheStorage(): Promise<void> {
    if (!('caches' in window)) {
      return;
    }

    const cacheNames = await window.caches.keys();
    await Promise.all(cacheNames.map(cacheName => window.caches.delete(cacheName)));
  }

  private async updateServiceWorkers(): Promise<void> {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker.getRegistrations) {
      return;
    }

    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map(registration => registration.update()));
  }
}
