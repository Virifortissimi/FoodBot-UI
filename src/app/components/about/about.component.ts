import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamMemberComponent } from './team-member.component';
import { MissionComponent } from './mission.component';
import { ValuesComponent } from './values.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, TeamMemberComponent, MissionComponent, ValuesComponent],
  template: `
    <div class="about-container">
      <header class="about-header">
        <h1>About Foodbot</h1>
        <p class="subtitle">Revolutionizing nutrition through AI technology</p>
      </header>

      <app-mission />
      <app-values />

      <section class="team-section">
        <h2>Our Team</h2>
        <div class="team-grid">
          <app-team-member
            name="Sarah Johnson"
            role="CEO & Founder"
            image="https://i.pravatar.cc/300?u=sarah"
            bio="Former nutritionist with 10+ years of experience in digital health"
          />
          <app-team-member
            name="David Chen"
            role="CTO"
            image="https://i.pravatar.cc/300?u=david"
            bio="AI researcher specializing in nutritional science and machine learning"
          />
          <app-team-member
            name="Maria Rodriguez"
            role="Head of Nutrition"
            image="https://i.pravatar.cc/300?u=maria"
            bio="Certified nutritionist with expertise in personalized diet planning"
          />
        </div>
      </section>
    </div>
  `,
  styles: [`
    .about-container {
      padding: 4rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .about-header {
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

    .team-section {
      margin-top: 4rem;
    }

    h2 {
      text-align: center;
      margin-bottom: 3rem;
      font-size: 2rem;
      color: var(--text);
    }

    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
  `]
})
export class AboutComponent {}