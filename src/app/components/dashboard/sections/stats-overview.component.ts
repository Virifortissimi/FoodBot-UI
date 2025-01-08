import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAnalytics } from '../../../models/auth.model';

@Component({
  selector: 'app-stats-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-grid">
      <div class="stat-card">
        <i class="fas fa-calendar-check"></i>
        <h3>Meal Plans</h3>
        <p class="stat-number">{{ analytics?.mealPlansGenerated || 0 }}</p>
        <p class="stat-trend up">+12% this month</p>
      </div>
      <div class="stat-card">
        <i class="fas fa-utensils"></i>
        <h3>Recipes Viewed</h3>
        <p class="stat-number">{{ analytics?.recipesViewed || 0 }}</p>
        <p class="stat-trend up">+8% this month</p>
      </div>
      <div class="stat-card">
        <i class="fas fa-comments"></i>
        <h3>Chat Interactions</h3>
        <p class="stat-number">{{ analytics?.chatInteractions || 0 }}</p>
        <p class="stat-trend down">-3% this month</p>
      </div>
      <div class="stat-card">
        <i class="fas fa-user-md"></i>
        <h3>Consultations</h3>
        <p class="stat-number">{{ analytics?.nutritionConsultations || 0 }}</p>
        <p class="stat-trend up">+5% this month</p>
      </div>
    </div>
  `,
  styles: [`
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
      transition: transform 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px);
    }

    .stat-card i {
      font-size: 2rem;
      color: var(--primary);
      margin-bottom: 1rem;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: bold;
      color: var(--primary);
      margin: 0.5rem 0;
    }

    .stat-trend {
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
    }

    .stat-trend.up {
      color: #10b981;
    }

    .stat-trend.down {
      color: #ef4444;
    }

    .stat-trend::before {
      font-family: "Font Awesome 6 Free";
      font-weight: 900;
    }

    .stat-trend.up::before {
      content: "\\f062";
    }

    .stat-trend.down::before {
      content: "\\f063";
    }
  `]
})
export class StatsOverviewComponent {
  @Input() analytics: UserAnalytics | null = null;
}