import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { ClientCacheService } from './client-cache.service';

export interface DashboardOverview {
    todayCalories: number;
    calorieGoal: number;
    todayProteinG: number;
    proteinGoalG: number;
    todayWaterMl: number;
    waterGoalMl: number;
    loggingStreakDays: number;
    daysLoggedThisWeek: number;
    entriesThisWeek: number;
    exerciseMinutesThisWeek: number;
    currentWeightKg: number | null;
    weightChangeKg: number | null;
}

export interface DashboardMealPlanSummary {
    hasActivePlan: boolean;
    planName: string;
    weekStart: string | null;
    plannedMeals: number;
    plannedDays: number;
    averageDailyCalories: number;
    averageDailyProteinG: number;
    generatedBy: string;
}

export interface DashboardShoppingSummary {
    hasList: boolean;
    generatedAt: string | null;
    totalItems: number;
    checkedItems: number;
    completionPercent: number;
}

export interface DashboardLearningSummary {
    accessibleCourses: number;
    totalLessons: number;
    completedLessons: number;
    completionPercent: number;
    lastCompletedLessonAt: string | null;
}

export interface DashboardSubscriptionSummary {
    plan: string;
    status: string;
    currentPeriodEnd: string | null;
}

export interface DashboardTrendPoint {
    date: string;
    label: string;
    calories: number;
    waterMl: number;
    entries: number;
}

export interface DashboardRecentMeal {
    id: string;
    name: string;
    loggedAt: string;
    calories: number;
    proteinG: number;
}

export interface DashboardAnalytics {
    overview: DashboardOverview;
    mealPlan: DashboardMealPlanSummary;
    shopping: DashboardShoppingSummary;
    learning: DashboardLearningSummary;
    subscription: DashboardSubscriptionSummary;
    weeklyTrend: DashboardTrendPoint[];
    recentMeals: DashboardRecentMeal[];
}

@Injectable({
    providedIn: 'root'
})
export class DashboardAnalyticsService {
    private readonly apiUrl = `${environment.apiUrl}/dashboard/analytics`;
    private readonly cacheKey = 'dashboard.analytics';
    private readonly cacheTtlMs = 3 * 60 * 1000;

    readonly analytics = signal<DashboardAnalytics | null>(null);
    readonly loading = signal(false);

    constructor(
        private http: HttpClient,
        private cache: ClientCacheService
    ) { }

    fetchAnalytics(): Observable<any> {
        const cached = this.cache.get<DashboardAnalytics>(this.cacheKey);
        if (cached?.data) {
            this.analytics.set(cached.data);
        }

        this.loading.set(true);

        return this.http.get<any>(this.apiUrl).pipe(
            tap({
                next: (res) => {
                    if (res.success) {
                        const analytics = res.data as DashboardAnalytics;
                        this.analytics.set(analytics);
                        this.cache.set(this.cacheKey, analytics, this.cacheTtlMs);
                    }
                },
                error: () => {
                    if (!cached?.data) {
                        this.analytics.set(null);
                    }
                    this.loading.set(false);
                },
                complete: () => {
                    this.loading.set(false);
                }
            })
        );
    }

    clearCache(): void {
        this.cache.remove(this.cacheKey);
    }
}
