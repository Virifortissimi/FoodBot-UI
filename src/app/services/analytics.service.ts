import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserAnalytics } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  getUserAnalytics(): Observable<UserAnalytics> {
    // Simulate analytics data - In production, this would connect to a backend
    return of({
      mealPlansGenerated: 12,
      recipesViewed: 45,
      nutritionConsultations: 3,
      chatInteractions: 28,
      weeklyProgress: [
        {
          date: new Date(),
          calories: 2100,
          protein: 120,
          carbs: 250,
          fat: 70
        }
        // Add more weekly data points here
      ]
    });
  }
}