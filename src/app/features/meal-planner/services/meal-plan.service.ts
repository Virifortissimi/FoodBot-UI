import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ClientCacheService } from '../../../core/services/client-cache.service';

export interface Meal {
    id: string;
    title: string;
    type: string;
    calories: number;
    time: number;
}

export interface DayPlan {
    name: string;
    meals: Meal[];
}

export interface MealPlanDto {
    id: string;
    name: string;
    planData: string;
    weekStart: string;
    isActive: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class MealPlanService {
    private apiUrl = `${environment.apiUrl}/MealPlans`;
    private readonly currentCacheKey = 'meal-plan.current';
    private readonly currentCacheTtlMs = 30 * 60 * 1000;

    constructor(
        private http: HttpClient,
        private cache: ClientCacheService
    ) { }

    getCurrentPlan() {
        return this.http.get<any>(`${this.apiUrl}/current`).pipe(
            tap(res => {
                if (res.success) {
                    this.cache.set(this.currentCacheKey, res, this.currentCacheTtlMs);
                }
            })
        );
    }

    updatePlan(name: string, planData: string, weekStart: string) {
        return this.http.post<any>(`${this.apiUrl}/update`, { name, planData, weekStart }).pipe(
            tap(res => {
                if (res.success) this.applyMutationResult(res);
            })
        );
    }

    generatePlan(request: { dietaryType: string; allergies: string[]; calorieTarget: number; days?: number }) {
        return this.http.post<any>(`${this.apiUrl}/generate`, request).pipe(
            tap(res => {
                if (res.success) this.applyMutationResult(res);
            })
        );
    }

    getCachedCurrentPlan(): any | null {
        return this.cache.get<any>(this.currentCacheKey)?.data ?? null;
    }

    private applyMutationResult(res: any): void {
        this.cache.set(this.currentCacheKey, res, this.currentCacheTtlMs);
        this.cache.remove('dashboard.analytics');
        this.cache.remove('shopping.latest');
    }
}
