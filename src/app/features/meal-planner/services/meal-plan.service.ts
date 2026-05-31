import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

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

    constructor(private http: HttpClient) { }

    getCurrentPlan() {
        return this.http.get<any>(`${this.apiUrl}/current`);
    }

    updatePlan(name: string, planData: string, weekStart: string) {
        return this.http.post<any>(`${this.apiUrl}/update`, { name, planData, weekStart });
    }

    generatePlan(request: { dietaryType: string; allergies: string[]; calorieTarget: number; days?: number }) {
        return this.http.post<any>(`${this.apiUrl}/generate`, request);
    }
}
