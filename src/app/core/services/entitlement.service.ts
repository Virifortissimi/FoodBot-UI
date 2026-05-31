import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface FeatureEntitlement {
    allowed: boolean;
    unlimited: boolean;
    maxAccessibleCount?: number | null;
    dailyLimit?: number | null;
    dailyUsed: number;
    dailyRemaining?: number | null;
    weeklyLimit?: number | null;
    weeklyUsed: number;
    weeklyRemaining?: number | null;
    monthlyLimit?: number | null;
    monthlyUsed: number;
    monthlyRemaining?: number | null;
    message?: string | null;
}

export interface SubscriptionEntitlements {
    planKey: 'free' | 'pro' | 'coach';
    planName: string;
    mealPlannerGeneration: FeatureEntitlement;
    manualMealPlanEditing: FeatureEntitlement;
    recipeBrowse: FeatureEntitlement;
    recipeChat: FeatureEntitlement;
    aiCoach: FeatureEntitlement;
    shoppingListGeneration: FeatureEntitlement;
    shoppingListInteraction: FeatureEntitlement;
    recipeFavorites: FeatureEntitlement;
    dashboardAnalyticsLevel: 'basic' | 'advanced' | 'coach';
    coursesAccessLevel: 'partial' | 'full';
    apiAccessRequiresApproval: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class EntitlementService {
    private readonly apiUrl = `${environment.apiUrl}/users/entitlements`;

    readonly entitlements = signal<SubscriptionEntitlements | null>(null);
    readonly loading = signal(false);

    constructor(private http: HttpClient) { }

    fetchEntitlements() {
        this.loading.set(true);
        return this.http.get<{ success: boolean; data: SubscriptionEntitlements }>(this.apiUrl).pipe(
            tap({
                next: (response) => {
                    if (response.success) {
                        this.entitlements.set(response.data);
                    }
                },
                error: () => {
                    this.entitlements.set(null);
                    this.loading.set(false);
                },
                complete: () => {
                    this.loading.set(false);
                }
            })
        );
    }

    clear(): void {
        this.entitlements.set(null);
    }
}
