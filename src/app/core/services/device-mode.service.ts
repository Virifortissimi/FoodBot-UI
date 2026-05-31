import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type DeviceOverride = 'desktop' | 'mobile' | null;

@Injectable({
    providedIn: 'root'
})
export class DeviceModeService {
    private readonly overrideKey = 'fb-device-mode-override';

    readonly isDesktopDevice = signal(false);
    readonly pcMode = signal(false);
    readonly hasManualOverride = signal(false);

    constructor(@Inject(PLATFORM_ID) private platformId: object) { }

    initialize(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const syncMode = () => this.syncMode();

        window.addEventListener('resize', syncMode);
        window.matchMedia('(min-width: 1024px)').addEventListener('change', syncMode);
        window.matchMedia('(hover: hover) and (pointer: fine)').addEventListener('change', syncMode);

        this.syncMode();
    }

    togglePcMode(): boolean {
        if (!isPlatformBrowser(this.platformId)) {
            return this.pcMode();
        }

        const nextMode = this.pcMode() ? 'mobile' : 'desktop';
        localStorage.setItem(this.overrideKey, nextMode);
        this.syncMode();
        return this.pcMode();
    }

    private syncMode(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const detectedDesktop = this.detectDesktopMode();
        const override = this.getOverride();
        const effectiveMode = override === null ? detectedDesktop : override === 'desktop';

        this.isDesktopDevice.set(detectedDesktop);
        this.hasManualOverride.set(override !== null);
        this.pcMode.set(effectiveMode);
        this.applyPcMode(effectiveMode);
    }

    private detectDesktopMode(): boolean {
        return window.matchMedia('(min-width: 1024px)').matches
            || window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    }

    private getOverride(): DeviceOverride {
        const stored = localStorage.getItem(this.overrideKey);
        if (stored === 'desktop' || stored === 'mobile') {
            return stored;
        }

        return null;
    }

    private applyPcMode(enabled: boolean): void {
        if (enabled) {
            document.documentElement.classList.add('pc-mode');
        } else {
            document.documentElement.classList.remove('pc-mode');
        }
    }
}
