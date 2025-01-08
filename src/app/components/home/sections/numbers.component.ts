import { Component } from '@angular/core';

@Component({
  selector: 'app-numbers',
  standalone: true,
  template: `
    <section class="numbers">
      <div class="numbers-grid">
        <div class="number-card">
          <div class="number">100K+</div>
          <div class="label">Active Users</div>
        </div>
        <div class="number-card">
          <div class="number">1M+</div>
          <div class="label">Meals Planned</div>
        </div>
        <div class="number-card">
          <div class="number">95%</div>
          <div class="label">Success Rate</div>
        </div>
        <div class="number-card">
          <div class="number">24/7</div>
          <div class="label">AI Support</div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .numbers {
      background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
      padding: 4rem 2rem;
      color: white;
    }

    .numbers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .number-card {
      text-align: center;
    }

    .number {
      font-size: 3rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    .label {
      font-size: 1.25rem;
      opacity: 0.9;
    }
  `]
})
export class NumbersComponent {}