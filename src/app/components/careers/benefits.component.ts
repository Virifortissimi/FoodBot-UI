import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-benefits',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="benefits">
      <h2>Why Join Us?</h2>
      <div class="benefits-grid">
        <div class="benefit-card">
          <i class="fas fa-laptop-house"></i>
          <h3>Remote-First</h3>
          <p>Work from anywhere in the world with flexible hours</p>
        </div>
        <div class="benefit-card">
          <i class="fas fa-heart"></i>
          <h3>Health & Wellness</h3>
          <p>Comprehensive health coverage and wellness programs</p>
        </div>
        <div class="benefit-card">
          <i class="fas fa-chart-line"></i>
          <h3>Growth</h3>
          <p>Learning budget and career development opportunities</p>
        </div>
        <div class="benefit-card">
          <i class="fas fa-users"></i>
          <h3>Great Team</h3>
          <p>Work with passionate people who care about making a difference</p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .benefits {
      padding: 4rem 0;
      background: var(--background);
    }

    h2 {
      text-align: center;
      margin-bottom: 3rem;
      color: var(--text);
    }

    .benefits-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .benefit-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .benefit-card:hover {
      transform: translateY(-5px);
    }

    .benefit-card i {
      font-size: 2.5rem;
      color: var(--primary);
      margin-bottom: 1.5rem;
    }

    .benefit-card h3 {
      margin-bottom: 1rem;
      color: var(--text);
    }

    .benefit-card p {
      color: var(--text-light);
      line-height: 1.6;
    }
  `]
})
export class BenefitsComponent {}