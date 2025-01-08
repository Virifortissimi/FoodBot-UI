import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MealPlan } from '../models/meal-plan.model';

@Injectable({
  providedIn: 'root'
})
export class MealPlanService {
  generateMealPlan(
    dietaryRestrictions: string[],
    healthGoals: string[]
  ): Observable<MealPlan> {
    // Simulate meal plan generation - In production, this would connect to a backend
    return of({} as MealPlan);
  }
}