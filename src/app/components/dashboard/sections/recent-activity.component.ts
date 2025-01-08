import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Activity } from '../../../models/user.model';

@Component({
  selector: 'app-recent-activity',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="recent-activity">
      <h2>Recent Activity</h2>
      <div class="activity-list">
        @for (activity of activities; track activity.timestamp) {
          <div class="activity-item">
            <div class="activity-icon" [ngClass]="activity.type">
              <i [class]="getActivityIcon(activity.type)"></i>
            </div>
            <div class="activity-content">
              <h4>{{ activity.title }}</h4>
              <p>{{ activity.description }}</p>
              <span class="timestamp">{{ activity.timestamp | date:'MMM d, h:mm a' }}</span>
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .recent-activity {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    h2 {
      margin-bottom: 1.5rem;
      color: var(--text);
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      background: var(--background);
      border-radius: 8px;
      transition: transform 0.3s ease;
    }

    .activity-item:hover {
      transform: translateX(5px);
    }

    .activity-icon {
      width: 40px;
      height: 40px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .activity-icon.recipe {
      background: #dbeafe;
      color: #2563eb;
    }

    .activity-icon.meal-plan {
      background: #dcfce7;
      color: #16a34a;
    }

    .activity-icon.consultation {
      background: #fae8ff;
      color: #c026d3;
    }

    .activity-content {
      flex: 1;
    }

    .activity-content h4 {
      margin: 0;
      color: var(--text);
    }

    .activity-content p {
      color: var(--text-light);
      font-size: 0.875rem;
      margin: 0.25rem 0;
    }

    .timestamp {
      font-size: 0.75rem;
      color: var(--text-light);
    }
  `]
})
export class RecentActivityComponent {
  @Input() activities: Activity[] = [];

  getActivityIcon(type: string): string {
    switch (type) {
      case 'recipe':
        return 'fas fa-utensils';
      case 'meal-plan':
        return 'fas fa-calendar-check';
      case 'consultation':
        return 'fas fa-user-md';
      default:
        return 'fas fa-circle';
    }
  }
}