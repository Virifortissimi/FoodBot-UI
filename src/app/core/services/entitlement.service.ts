import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ClientCacheService } from './client-cache.service';

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
    private readonly cacheKey = 'entitlements';
    private readonly cacheTtlMs = 10 * 60 * 1000;

    readonly entitlements = signal<SubscriptionEntitlements | null>(null);
    readonly loading = signal(false);

    constructor(
        private http: HttpClient,
        private cache: ClientCacheService
    ) { }

    fetchEntitlements() {
        const cached = this.cache.get<SubscriptionEntitlements>(this.cacheKey);
        if (cached?.data) {
            this.entitlements.set(this.normalizeEntitlements(cached.data));
        }

        this.loading.set(true);
        return this.http.get<{ success: boolean; data: any }>(this.apiUrl).pipe(
            tap({
                next: (response) => {
                    if (response.success) {
                        const entitlements = this.normalizeEntitlements(response.data);
                        this.entitlements.set(entitlements);
                        this.cache.set(this.cacheKey, entitlements, this.cacheTtlMs);
                    }
                },
                error: () => {
                    if (!cached?.data) {
                        this.entitlements.set(null);
                    }
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
        this.cache.remove(this.cacheKey);
    }

    private normalizeEntitlements(raw: any): SubscriptionEntitlements {
        const features = raw?.features ?? raw?.Features ?? raw ?? {};

        return {
            planKey: raw?.planKey ?? raw?.PlanKey ?? 'free',
            planName: raw?.planName ?? raw?.PlanName ?? 'Free',
            mealPlannerGeneration: this.normalizeFeature(features.mealPlannerGeneration ?? raw?.mealPlannerGeneration),
            manualMealPlanEditing: this.normalizeFeature(features.manualMealPlanEditing ?? raw?.manualMealPlanEditing),
            recipeBrowse: this.normalizeFeature(features.recipeBrowse ?? raw?.recipeBrowse),
            recipeChat: this.normalizeFeature(features.recipeChat ?? raw?.recipeChat),
            aiCoach: this.normalizeFeature(features.aiCoach ?? raw?.aiCoach, false),
            shoppingListGeneration: this.normalizeFeature(features.shoppingListGeneration ?? raw?.shoppingListGeneration),
            shoppingListInteraction: this.normalizeFeature(features.shoppingListInteraction ?? raw?.shoppingListInteraction),
            recipeFavorites: this.normalizeFeature(features.recipeFavorites ?? raw?.recipeFavorites),
            dashboardAnalyticsLevel: raw?.dashboardAnalyticsLevel ?? raw?.DashboardAnalyticsLevel ?? 'basic',
            coursesAccessLevel: raw?.coursesAccessLevel ?? raw?.CoursesAccessLevel ?? 'partial',
            apiAccessRequiresApproval: raw?.apiAccessRequiresApproval ?? raw?.ApiAccessRequiresApproval ?? true
        };
    }

    private normalizeFeature(raw: any, defaultAllowed = true): FeatureEntitlement {
        const resetPeriod = raw?.resetPeriod ?? raw?.ResetPeriod;
        const limit = raw?.limit ?? raw?.Limit ?? null;
        const used = raw?.used ?? raw?.Used ?? 0;
        const remaining = raw?.remaining ?? raw?.Remaining ?? null;

        return {
            allowed: raw?.allowed ?? raw?.Allowed ?? defaultAllowed,
            unlimited: raw?.unlimited ?? raw?.Unlimited ?? false,
            maxAccessibleCount: raw?.maxAccessibleCount ?? raw?.MaxAccessibleCount ?? null,
            dailyLimit: resetPeriod === 'daily' ? limit : (raw?.dailyLimit ?? raw?.DailyLimit ?? null),
            dailyUsed: resetPeriod === 'daily' ? used : (raw?.dailyUsed ?? raw?.DailyUsed ?? 0),
            dailyRemaining: resetPeriod === 'daily' ? remaining : (raw?.dailyRemaining ?? raw?.DailyRemaining ?? null),
            weeklyLimit: resetPeriod === 'weekly' ? limit : (raw?.weeklyLimit ?? raw?.WeeklyLimit ?? null),
            weeklyUsed: resetPeriod === 'weekly' ? used : (raw?.weeklyUsed ?? raw?.WeeklyUsed ?? 0),
            weeklyRemaining: resetPeriod === 'weekly' ? remaining : (raw?.weeklyRemaining ?? raw?.WeeklyRemaining ?? null),
            monthlyLimit: resetPeriod === 'monthly' ? limit : (raw?.monthlyLimit ?? raw?.MonthlyLimit ?? null),
            monthlyUsed: resetPeriod === 'monthly' ? used : (raw?.monthlyUsed ?? raw?.MonthlyUsed ?? 0),
            monthlyRemaining: resetPeriod === 'monthly' ? remaining : (raw?.monthlyRemaining ?? raw?.MonthlyRemaining ?? null),
            message: raw?.message ?? raw?.Message ?? null
        };
    }
}
