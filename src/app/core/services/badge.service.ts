import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface BadgeProgress {
    key: string;
    name: string;
    description: string;
    category: string;
    icon: string;
    earned: boolean;
    earnedAt: string | null;
    progressCurrent: number;
    progressTarget: number;
    seen: boolean;
}

export interface BadgeSummary {
    badges: BadgeProgress[];
    recentlyEarned: BadgeProgress[];
}

@Injectable({
    providedIn: 'root'
})
export class BadgeService {
    private readonly apiUrl = `${environment.apiUrl}/badges`;

    readonly summary = signal<BadgeSummary | null>(null);
    readonly loading = signal(false);

    constructor(private http: HttpClient) { }

    fetchBadges(): Observable<any> {
        this.loading.set(true);

        return this.http.get<any>(this.apiUrl).pipe(
            tap({
                next: (res) => {
                    if (res.success) {
                        this.summary.set(res.data as BadgeSummary);
                    }
                },
                error: () => {
                    this.summary.set(null);
                    this.loading.set(false);
                },
                complete: () => {
                    this.loading.set(false);
                }
            })
        );
    }

    markSeen(badgeKeys: string[]): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/seen`, { badgeKeys }).pipe(
            tap({
                next: (res) => {
                    if (!res.success || !this.summary()) return;

                    const seenKeys = new Set(badgeKeys);
                    const current = this.summary()!;
                    this.summary.set({
                        badges: current.badges.map(badge => seenKeys.has(badge.key) ? { ...badge, seen: true } : badge),
                        recentlyEarned: current.recentlyEarned.filter(badge => !seenKeys.has(badge.key))
                    });
                }
            })
        );
    }
}
