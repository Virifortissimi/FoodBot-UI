import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { ClientCacheService } from './client-cache.service';

export interface PersonalMetrics {
    sex?: 'male' | 'female' | null;
    ageYears?: number | null;
    heightCm?: number | null;
    weightKg?: number | null;
    activityLevel?: 'sedentary' | 'light' | 'moderate' | 'very_active' | null;
    bmr?: number | null;
    tdee?: number | null;
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    onboardingCompleted?: boolean;
    subscriptionTier: string;
    goalIntent?: 'lose' | 'maintain' | 'gain' | null;
    goals: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    } | null;
    personalMetrics?: PersonalMetrics | null;
    dietaryPreferences: string[];
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = `${environment.apiUrl}/users`;
    private readonly profileCacheKey = 'users.profile';
    private readonly profileCacheTtlMs = 15 * 60 * 1000;
    profile = signal<UserProfile | null>(null);

    constructor(
        private http: HttpClient,
        private cache: ClientCacheService
    ) { }

    getProfile(): Observable<any> {
        const cached = this.cache.get<UserProfile>(this.profileCacheKey);
        if (cached?.data) {
            this.profile.set(cached.data);
        }

        return this.http.get<any>(`${this.apiUrl}/profile`).pipe(
            tap(res => {
                if (res.success) {
                    this.profile.set(res.data);
                    this.cache.set(this.profileCacheKey, res.data, this.profileCacheTtlMs);
                }
            })
        );
    }

    updateProfile(data: Partial<UserProfile>): Observable<any> {
        const payload: any = {
            name: data.name,
            dietaryPreferences: data.dietaryPreferences ?? [],
            goalIntent: data.goalIntent ?? undefined
        };

        if (data.goals) {
            payload.caloriesGoal = data.goals.calories;
            payload.proteinGoal = data.goals.protein;
            payload.carbsGoal = data.goals.carbs;
            payload.fatGoal = data.goals.fat;
        }

        if (data.personalMetrics) {
            payload.sex = data.personalMetrics.sex ?? undefined;
            payload.ageYears = data.personalMetrics.ageYears ?? undefined;
            payload.heightCm = data.personalMetrics.heightCm ?? undefined;
            payload.weightKg = data.personalMetrics.weightKg ?? undefined;
            payload.activityLevel = data.personalMetrics.activityLevel ?? undefined;
        }

        return this.http.patch<any>(`${this.apiUrl}/profile`, payload).pipe(
            tap(res => {
                if (res.success) {
                    this.cache.remove(this.profileCacheKey);
                    this.cache.remove('dashboard.analytics');
                    this.getProfile().subscribe();
                }
            })
        );
    }

    completeOnboarding(data: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/onboarding/complete`, data);
    }

    completeOnboardingWithToken(data: any, accessToken: string): Observable<any> {
        const payload = {
            accessToken: (accessToken || '').trim(),
            ...data
        };

        return this.http.post<any>(`${this.apiUrl}/onboarding/complete-with-token`, payload);
    }

    getSubscription(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/subscription`);
    }
}
