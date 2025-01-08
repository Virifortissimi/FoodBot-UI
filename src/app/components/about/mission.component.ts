import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mission',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="mission">
      <h2>Our Mission</h2>
      <p class="mission-text">
        At FoodBot, we're on a mission to revolutionize nutrition through AI technology. 
        We believe that personalized nutrition should be accessible to everyone, combining 
        cutting-edge artificial intelligence with expert nutritional science to help people 
        make better food choices and live healthier lives.
      </p>
      <div class="mission-stats">
        <div class="stat">
          <span class="stat-number">100K+</span>
          <span class="stat-label">Users Helped</span>
        </div>
        <div class="stat">
          <span class="stat-number">1M+</span>
          <span class="stat-label">Meals Planned</span>
        </div>
        <div class="stat">
          <span class="stat-number">95%</span>
          <span class="stat-label">Success Rate</span>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .mission {
      padding: 4rem 0;
      text-align: center;
    }

    h2 {
      color: var(--primary);
      margin-bottom: 2rem;
    }

    .mission-text {
      max-width: 800px;
      margin: 0 auto 3rem;
      font-size: 1.25rem;
      line-height: 1.7;
      color: var(--text);
    }

    .mission-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: bold;
      color: var(--primary);
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: var(--text-light);
      font-size: 1.1rem;
    }
  `]
})
export class MissionComponent {}