import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    onboardingCompleted?: boolean;
    subscriptionTier: string;
    goals: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    } | null;
    dietaryPreferences: string[];
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = `${environment.apiUrl}/users`;
    profile = signal<UserProfile | null>(null);

    constructor(private http: HttpClient) { }

    getProfile(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/profile`).pipe(
            tap(res => {
                if (res.success) this.profile.set(res.data);
            })
        );
    }

    updateProfile(data: Partial<UserProfile>): Observable<any> {
        const payload: any = {
            name: data.name,
            dietaryPreferences: data.dietaryPreferences ?? []
        };

        if (data.goals) {
            payload.caloriesGoal = data.goals.calories;
            payload.proteinGoal = data.goals.protein;
            payload.carbsGoal = data.goals.carbs;
            payload.fatGoal = data.goals.fat;
        }

        return this.http.patch<any>(`${this.apiUrl}/profile`, payload).pipe(
            tap(res => {
                if (res.success) this.getProfile().subscribe();
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
