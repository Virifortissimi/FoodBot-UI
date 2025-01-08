import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-listing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="job-card">
      <h3>{{ title }}</h3>
      <div class="job-meta">
        <span class="location"><i class="fas fa-location-dot"></i> {{ location }}</span>
        <span class="type"><i class="fas fa-briefcase"></i> {{ type }}</span>
      </div>
      <p class="description">{{ description }}</p>
      <button class="apply-button">Apply Now</button>
    </div>
  `,
  styles: [`
    .job-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .job-card:hover {
      transform: translateY(-5px);
    }

    h3 {
      color: var(--primary);
      margin-bottom: 1rem;
    }

    .job-meta {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 1rem;
      color: var(--text-light);
      font-size: 0.9rem;
    }

    .job-meta span {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .description {
      margin-bottom: 1.5rem;
      color: var(--text);
      line-height: 1.6;
    }

    .apply-button {
      background: var(--primary);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .apply-button:hover {
      background: var(--primary-dark);
    }
  `]
})
export class JobListingComponent {
  @Input() title = '';
  @Input() location = '';
  @Input() type = '';
  @Input() description = '';
}