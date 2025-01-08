import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAnalytics } from '../../../models/auth.model';

@Component({
  selector: 'app-nutrition-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="nutrition-progress">
      <h2>Weekly Nutrition Progress</h2>
      <div class="progress-grid">
        @for (progress of analytics?.weeklyProgress || []; track progress.date) {
          <div class="progress-card">
            <div class="date-header">
              <h4>{{ progress.date | date:'EEE' }}</h4>
              <span class="date">{{ progress.date | date:'MMM d' }}</span>
            </div>
            
            <div class="nutrient-stats">
              <div class="nutrient">
                <span class="label">Calories</span>
                <div class="progress-bar">
                  <div 
                    class="progress" 
                    [style.width]="(progress.calories / 2500 * 100) + '%'"
                  ></div>
                </div>
                <span class="value">{{ progress.calories }}</span>
              </div>
              
              <div class="nutrient">
                <span class="label">Protein</span>
                <div class="progress-bar">
                  <div 
                    class="progress" 
                    [style.width]="(progress.protein / 150 * 100) + '%'"
                  ></div>
                </div>
                <span class="value">{{ progress.protein }}g</span>
              </div>
              
              <div class="nutrient">
                <span class="label">Carbs</span>
                <div class="progress-bar">
                  <div 
                    class="progress" 
                    [style.width]="(progress.carbs / 300 * 100) + '%'"
                  ></div>
                </div>
                <span class="value">{{ progress.carbs }}g</span>
              </div>
              
              <div class="nutrient">
                <span class="label">Fat</span>
                <div class="progress-bar">
                  <div 
                    class="progress" 
                    [style.width]="(progress.fat / 80 * 100) + '%'"
                  ></div>
                </div>
                <span class="value">{{ progress.fat }}g</span>
              </div>
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .nutrition-progress {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    h2 {
      margin-bottom: 1.5rem;
      color: var(--text);
    }

    .progress-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .progress-card {
      background: var(--background);
      padding: 1rem;
      border-radius: 8px;
    }

    .date-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .date {
      color: var(--text-light);
      font-size: 0.875rem;
    }

    .nutrient-stats {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .nutrient {
      display: grid;
      grid-template-columns: 60px 1fr 50px;
      align-items: center;
      gap: 0.5rem;
    }

    .label {
      font-size: 0.875rem;
      color: var(--text-light);
    }

    .value {
      font-size: 0.875rem;
      color: var(--text);
      text-align: right;
    }

    .progress-bar {
      height: 8px;
      background: #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress {
      height: 100%;
      background: var(--primary);
      border-radius: 4px;
      transition: width 0.3s ease;
    }
  `]
})
export class NutritionProgressComponent {
  @Input() analytics: UserAnalytics | null = null;
}