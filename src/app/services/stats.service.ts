import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface UsageStats {
  distribution: {
    label: string;
    value: number;
  }[];
  goals: {
    goal: string;
    successRate: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  getUsageStats(): Observable<UsageStats> {
    return of({
      distribution: [
        { label: 'Meal Planning', value: 40 },
        { label: 'Nutrition Tracking', value: 25 },
        { label: 'AI Chat Support', value: 20 },
        { label: 'Recipe Discovery', value: 15 }
      ],
      goals: [
        { goal: 'Weight Management', successRate: 85 },
        { goal: 'Better Nutrition', successRate: 92 },
        { goal: 'Meal Planning', successRate: 88 },
        { goal: 'Health Improvement', successRate: 90 }
      ]
    });
  }
}