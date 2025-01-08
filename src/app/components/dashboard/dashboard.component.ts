import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AnalyticsService } from '../../services/analytics.service';
import { UserAnalytics } from '../../models/auth.model';
import { StatsOverviewComponent } from './sections/stats-overview.component';
import { NutritionProgressComponent } from './sections/nutrition-progress.component';
import { RecentActivityComponent } from './sections/recent-activity.component';
import { Activity } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    StatsOverviewComponent,
    NutritionProgressComponent,
    RecentActivityComponent
  ],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <div class="user-welcome">
          <h1>Welcome back, {{ userName }}!</h1>
          <p class="subtitle">Track your nutrition journey and stay on top of your health goals</p>
        </div>
        <button class="export-button">
          <i class="fas fa-download"></i>
          Export Data
        </button>
      </header>

      <app-stats-overview [analytics]="analytics" />
      <app-nutrition-progress [analytics]="analytics" />
      <app-recent-activity [activities]="recentActivities" />
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .user-welcome h1 {
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: var(--text-light);
      font-size: 1.1rem;
    }

    .export-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: white;
      border: 1px solid var(--primary);
      color: var(--primary);
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .export-button:hover {
      background: var(--primary);
      color: white;
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  userName = '';
  analytics: UserAnalytics | null = null;
  recentActivities: Activity[] = [
    {
      type: 'recipe',
      title: 'Viewed Recipe',
      timestamp: new Date(),
      description: 'Checked out "Quinoa Buddha Bowl with Roasted Vegetables"'
    },
    {
      type: 'meal-plan',
      title: 'Generated Meal Plan',
      timestamp: new Date(Date.now() - 3600000),
      description: 'Created a new weekly meal plan focused on protein-rich meals'
    },
    {
      type: 'consultation',
      title: 'Nutritionist Consultation',
      timestamp: new Date(Date.now() - 86400000),
      description: 'Had a 30-minute session with Dr. Sarah Johnson'
    }
  ];

  constructor(
    private authService: AuthService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userName = user.name;
      }
    });

    this.analyticsService.getUserAnalytics().subscribe(analytics => {
      this.analytics = analytics;
    });
  }
}