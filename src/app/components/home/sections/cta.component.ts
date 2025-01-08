import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cta',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="cta">
      <div class="cta-content">
        <h2>Ready to Transform Your Diet?</h2>
        <p>Join thousands of users who have already improved their nutrition with FoodBot.</p>
        <div class="cta-buttons">
          <a routerLink="/signup" class="btn-primary">Get Started Free</a>
          <a routerLink="/chat" class="btn-secondary">Try Demo</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .cta {
      background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
      color: white;
      padding: 6rem 2rem;
      text-align: center;
    }

    .cta-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .cta h2 {
      font-size: 2.5rem;
      margin-bottom: 1.5rem;
      color: white;
    }

    .cta p {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .btn-primary, .btn-secondary {
      padding: 1rem 2rem;
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
      transition: transform 0.3s ease;
    }

    .btn-primary {
      background: white;
      color: var(--primary);
    }

    .btn-secondary {
      background: transparent;
      border: 2px solid white;
      color: white;
    }

    .btn-primary:hover, .btn-secondary:hover {
      transform: translateY(-2px);
    }

    @media (max-width: 640px) {
      .cta-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class CTAComponent {}