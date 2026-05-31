import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';

export interface NutritionLog {
    id: string;
    name: string;
    type: string;
    time: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    amountMl?: number;
    durationMin?: number;
    caloriesBurned?: number;
    source?: string;
}

export interface NutritionGoals {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

export interface StravaStatus {
    isConnected: boolean;
    athleteName?: string | null;
    athleteUsername?: string | null;
    lastSyncedAt?: string | null;
    accessTokenExpiresAt?: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class NutritionService {
    private apiUrl = `${environment.apiUrl}/nutrition`;

    todayLogs = signal<NutritionLog[]>([]);
    goals = signal<NutritionGoals | null>(null);
    stravaStatus = signal<StravaStatus | null>(null);

    constructor(private http: HttpClient) { }

    getTodayData(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/today`).pipe(
            tap(res => {
                if (res.success) {
                    const entries = (res.data.entries || []).map((entry: any) => ({
                        id: entry.id,
                        name: entry.name ?? entry.data?.recipeName ?? 'Meal',
                        type: entry.type ?? entry.logType ?? 'Meal',
                        time: entry.time ?? entry.loggedDate ?? new Date().toISOString(),
                        calories: Number(entry.calories ?? entry.data?.calories ?? 0),
                        protein: Number(entry.protein ?? entry.data?.proteinG ?? 0),
                        carbs: Number(entry.carbs ?? entry.data?.carbsG ?? 0),
                        fat: Number(entry.fat ?? entry.data?.fatG ?? 0),
                        amountMl: Number(entry.amountMl ?? entry.data?.amountMl ?? 0),
                        durationMin: Number(entry.durationMin ?? entry.data?.durationMin ?? 0),
                        caloriesBurned: Number(entry.caloriesBurned ?? entry.data?.caloriesBurned ?? 0),
                        source: entry.source ?? 'manual'
                    }));

                    const goals = res.data.goals
                        ? {
                            calories: Number(res.data.goals.calories ?? res.data.goals.calorieTarget ?? 0),
                            protein: Number(res.data.goals.protein ?? res.data.goals.proteinTargetG ?? 0),
                            carbs: Number(res.data.goals.carbs ?? res.data.goals.carbTargetG ?? 0),
                            fat: Number(res.data.goals.fat ?? res.data.goals.fatTargetG ?? 0)
                        }
                        : null;

                    this.todayLogs.set(entries);
                    this.goals.set(goals);
                    this.stravaStatus.set(res.data.strava ?? null);
                }
            })
        );
    }

    logMeal(meal: Omit<NutritionLog, 'id' | 'time'>): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/log`, meal).pipe(
            tap(res => {
                if (res.success) this.getTodayData().subscribe();
            })
        );
    }

    logWater(input: { amountMl: number; loggedAt?: string | null }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/water-log`, input).pipe(
            tap(res => {
                if (res.success) this.getTodayData().subscribe();
            })
        );
    }

    logExercise(exercise: { activity: string; durationMin: number; caloriesBurned?: number | null }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/exercise-log`, exercise).pipe(
            tap(res => {
                if (res.success) this.getTodayData().subscribe();
            })
        );
    }

    deleteLog(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/log/${id}`).pipe(
            tap(res => {
                if (res.success) this.getTodayData().subscribe();
            })
        );
    }

    updateGoals(goals: NutritionGoals): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/goals`, goals).pipe(
            tap(res => {
                if (res.success) {
                    this.goals.set({
                        calories: Number(res.data.calories ?? res.data.calorieTarget ?? goals.calories),
                        protein: Number(res.data.protein ?? res.data.proteinTargetG ?? goals.protein),
                        carbs: Number(res.data.carbs ?? res.data.carbTargetG ?? goals.carbs),
                        fat: Number(res.data.fat ?? res.data.fatTargetG ?? goals.fat)
                    });
                }
            })
        );
    }

    getStravaConnectUrl(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/strava/connect-url`);
    }

    connectStrava(code: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/strava/connect`, { code }).pipe(
            tap(res => {
                if (res.success) {
                    this.stravaStatus.set(res.data ?? null);
                }
            })
        );
    }

    importStrava(daysBack = 14): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/strava/import`, { daysBack }).pipe(
            tap(res => {
                if (res.success) {
                    this.getTodayData().subscribe();
                }
            })
        );
    }

    disconnectStrava(): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/strava/connection`).pipe(
            tap(res => {
                if (res.success) {
                    this.stravaStatus.set({ isConnected: false });
                }
            })
        );
    }
}
