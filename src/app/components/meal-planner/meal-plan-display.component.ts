import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MealPlan } from '../../models/meal-plan.model';

@Component({
  selector: 'app-meal-plan-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="meal-plan">
      <h2>Your AI-Generated Meal Plan</h2>
      
      <div class="days-grid">
        @for (day of mealPlan.days; track day.date) {
          <div class="day-card">
            <div class="day-header">
              <h3>{{ day.date | date:'EEEE' }}</h3>
              <span class="date">{{ day.date | date:'MMM d' }}</span>
            </div>
            
            <div class="meals">
              <div class="meal">
                <span class="meal-time">Breakfast</span>
                <p class="meal-name">{{ day.breakfast.name }}</p>
              </div>
              <div class="meal">
                <span class="meal-time">Lunch</span>
                <p class="meal-name">{{ day.lunch.name }}</p>
              </div>
              <div class="meal">
                <span class="meal-time">Dinner</span>
                <p class="meal-name">{{ day.dinner.name }}</p>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .meal-plan {
      margin-top: 3rem;
    }

    h2 {
      text-align: center;
      margin-bottom: 2rem;
      color: white;
    }

    .days-grid {
      display: grid;
      gap: 1.5rem;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }

    .day-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: transform 0.3s ease;
    }

    .day-card:hover {
      transform: translateY(-5px);
    }

    .day-header {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .day-header h3 {
      color: white;
      margin: 0;
    }

    .date {
      color: #94a3b8;
      font-size: 0.875rem;
    }

    .meals {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .meal {
      padding: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      transition: background-color 0.3s ease;
    }

    .meal:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .meal-time {
      display: block;
      font-size: 0.875rem;
      color: #94a3b8;
      margin-bottom: 0.25rem;
    }

    .meal-name {
      color: white;
      font-weight: 500;
    }
  `]
})
export class MealPlanDisplayComponent {
  @Input() mealPlan!: MealPlan;
}