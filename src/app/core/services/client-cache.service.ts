import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';

export interface CachedValue<T> {
    userId?: string;
    data: T;
    cachedAt: string;
    expiresAt?: string;
    version: number;
}

@Injectable({
    providedIn: 'root'
})
export class ClientCacheService {
    private readonly prefix = 'foodbot.cache.v1';
    private readonly version = 1;

    constructor(
        @Inject(PLATFORM_ID) private platformId: object,
        private authService: AuthService
    ) { }

    get<T>(key: string): CachedValue<T> | null {
        if (!this.canUseStorage()) return null;

        const raw = localStorage.getItem(this.storageKey(key));
        if (!raw) return null;

        try {
            const entry = JSON.parse(raw) as CachedValue<T>;
            if (entry.version !== this.version) {
                this.remove(key);
                return null;
            }
            return entry;
        } catch {
            this.remove(key);
            return null;
        }
    }

    getFresh<T>(key: string): T | null {
        const entry = this.get<T>(key);
        if (!entry || !this.isFresh(entry)) return null;
        return entry.data;
    }

    set<T>(key: string, data: T, ttlMs?: number): void {
        if (!this.canUseStorage()) return;

        const now = Date.now();
        const entry: CachedValue<T> = {
            userId: this.userScope(),
            data,
            cachedAt: new Date(now).toISOString(),
            expiresAt: ttlMs ? new Date(now + ttlMs).toISOString() : undefined,
            version: this.version
        };

        try {
            localStorage.setItem(this.storageKey(key), JSON.stringify(entry));
        } catch {
            // Storage can be full or unavailable; cache failure should never block the app.
        }
    }

    remove(key: string): void {
        if (!this.canUseStorage()) return;
        localStorage.removeItem(this.storageKey(key));
    }

    clearUser(userId = this.userScope()): void {
        if (!this.canUseStorage()) return;

        const scope = this.scopePrefix(userId);
        for (let index = localStorage.length - 1; index >= 0; index--) {
            const key = localStorage.key(index);
            if (key?.startsWith(scope)) {
                localStorage.removeItem(key);
            }
        }
    }

    isFresh(entry: CachedValue<unknown>): boolean {
        if (!entry.expiresAt) return true;
        return new Date(entry.expiresAt).getTime() > Date.now();
    }

    private storageKey(key: string): string {
        return `${this.scopePrefix(this.userScope())}.${key}`;
    }

    private scopePrefix(userId?: string): string {
        return `${this.prefix}.${userId || 'anonymous'}`;
    }

    private userScope(): string | undefined {
        return this.authService.user()?.id;
    }

    private canUseStorage(): boolean {
        return isPlatformBrowser(this.platformId);
    }
}
