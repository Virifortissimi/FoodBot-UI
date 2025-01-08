import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobListingComponent } from './job-listing.component';
import { BenefitsComponent } from './benefits.component';

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [CommonModule, JobListingComponent, BenefitsComponent],
  template: `
    <div class="careers-container">
      <header class="careers-header">
        <h1>Join Our Team</h1>
        <p class="subtitle">Help us revolutionize nutrition with AI technology</p>
      </header>

      <app-benefits />

      <section class="openings">
        <h2>Open Positions</h2>
        <div class="jobs-grid">
          <app-job-listing
            title="Senior Full Stack Developer"
            location="Remote"
            type="Full-time"
            description="Join our engineering team to build the future of AI-powered nutrition"
          />
          <app-job-listing
            title="AI/ML Engineer"
            location="Remote"
            type="Full-time"
            description="Help develop our core AI algorithms for personalized nutrition"
          />
          <app-job-listing
            title="Registered Dietitian"
            location="Remote"
            type="Full-time"
            description="Provide expert nutrition guidance and validate our AI recommendations"
          />
        </div>
      </section>
    </div>
  `,
  styles: [`
    .careers-container {
      padding: 4rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .careers-header {
      text-align: center;
      margin-bottom: 4rem;
    }

    h1 {
      font-size: 3rem;
      color: var(--primary);
      margin-bottom: 1rem;
    }

    .subtitle {
      font-size: 1.25rem;
      color: var(--text-light);
    }

    .openings {
      margin-top: 4rem;
    }

    h2 {
      text-align: center;
      margin-bottom: 3rem;
      font-size: 2rem;
      color: var(--text);
    }

    .jobs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
  `]
})
export class CareersComponent {}