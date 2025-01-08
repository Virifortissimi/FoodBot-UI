import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferencesFormComponent } from './preferences-form.component';
import { MealPlanDisplayComponent } from './meal-plan-display.component';
import { MealPlanService } from '../../services/meal-plan.service';
import { MealPlan } from '../../models/meal-plan.model';

@Component({
  selector: 'app-meal-planner',
  standalone: true,
  imports: [CommonModule, PreferencesFormComponent, MealPlanDisplayComponent],
  template: `
    <div class="meal-planner-container">
      <div class="content-wrapper">
        <header class="planner-header">
          <h1>AI Meal Planner</h1>
          <p class="subtitle">Create your personalized meal plan with advanced AI technology</p>
        </header>

        <app-preferences-form
          (planGenerated)="generateMealPlan($event)"
        />

        @if (currentMealPlan) {
          <app-meal-plan-display
            [mealPlan]="currentMealPlan"
          />
        }
      </div>
    </div>
  `,
  styles: [`
    .meal-planner-container {
      min-height: calc(100vh - 64px);
      background: linear-gradient(135deg, #1a1f2c 0%, #2d3748 100%);
      color: white;
      padding: 2rem;
    }

    .content-wrapper {
      max-width: 1200px;
      margin: 0 auto;
    }

    .planner-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #60a5fa 0%, #8b5cf6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.025em;
    }

    .subtitle {
      color: #94a3b8;
      font-size: 1.25rem;
    }
  `]
})
export class MealPlannerComponent {
  currentMealPlan: MealPlan | null = null;

  constructor(private mealPlanService: MealPlanService) {}

  generateMealPlan(preferences: { restrictions: string[], goals: string[] }) {
    this.mealPlanService
      .generateMealPlan(preferences.restrictions, preferences.goals)
      .subscribe(mealPlan => {
        this.currentMealPlan = mealPlan;
      });
  }
}