import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FeaturesWheelComponent } from './features-wheel.component';

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [CommonModule, RouterLink, FeaturesWheelComponent],
  template: `
    <section class="features-section">
      <div class="content">
        <h2>Powerful Features</h2>
        <p class="subtitle">Everything you need for better nutrition</p>
        <a routerLink="/features" class="learn-more">
          Learn More <i class="fas fa-arrow-right"></i>
        </a>
      </div>
      <app-features-wheel />
    </section>
  `,
  styles: [`
    .features-section {
      padding: 6rem 2rem;
      background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4rem;
    }

    .content {
      max-width: 400px;
    }

    h2 {
      font-size: 2.5rem;
      color: white;
      margin-bottom: 1rem;
    }

    .subtitle {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 2rem;
    }

    .learn-more {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: white;
      text-decoration: none;
      font-weight: 500;
      padding: 0.75rem 1.5rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .learn-more:hover {
      background: rgba(255, 255, 255, 0.2);
      gap: 0.75rem;
    }

    @media (max-width: 1024px) {
      .features-section {
        flex-direction: column;
        text-align: center;
      }

      .content {
        max-width: 600px;
      }
    }
  `]
})
export class FeaturesSectionComponent {}