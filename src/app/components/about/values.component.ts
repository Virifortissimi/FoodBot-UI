import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-values',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="values">
      <h2>Our Values</h2>
      <div class="values-grid">
        <div class="value-card">
          <i class="fas fa-brain"></i>
          <h3>Innovation</h3>
          <p>Pushing the boundaries of AI and nutrition science to create breakthrough solutions.</p>
        </div>
        <div class="value-card">
          <i class="fas fa-heart"></i>
          <h3>Empathy</h3>
          <p>Understanding and caring about our users' unique health journeys and challenges.</p>
        </div>
        <div class="value-card">
          <i class="fas fa-shield-alt"></i>
          <h3>Trust</h3>
          <p>Building reliable, science-based solutions that users can depend on.</p>
        </div>
        <div class="value-card">
          <i class="fas fa-users"></i>
          <h3>Inclusivity</h3>
          <p>Making personalized nutrition accessible and beneficial for everyone.</p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .values {
      padding: 4rem 0;
      background: var(--background);
    }

    h2 {
      text-align: center;
      margin-bottom: 3rem;
    }

    .values-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .value-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .value-card:hover {
      transform: translateY(-5px);
    }

    .value-card i {
      font-size: 2.5rem;
      color: var(--primary);
      margin-bottom: 1.5rem;
    }

    .value-card h3 {
      margin-bottom: 1rem;
      color: var(--text);
    }

    .value-card p {
      color: var(--text-light);
      line-height: 1.6;
    }
  `]
})
export class ValuesComponent {}