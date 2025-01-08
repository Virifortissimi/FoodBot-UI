import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="hero">
      <div class="hero-content">
        <h1>Transform Your Diet with AI-Powered Nutrition</h1>
        <p class="hero-subtitle">
          Personalized meal plans, expert nutrition advice, and AI-powered insights to help you achieve your health goals
        </p>
        <div class="hero-actions">
          <a routerLink="/signup" class="btn-primary">Get Started Free</a>
          <a routerLink="/pricing" class="btn-secondary">View Pricing</a>
        </div>
      </div>
      <div class="hero-image">
        <img src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&q=80&w=800" 
             alt="Healthy food with AI-powered nutrition analysis"
             loading="lazy" />
      </div>
    </section>
  `,
  styles: [`
    .hero {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      padding: 4rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
      min-height: 600px;
    }

    .hero-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    h1 {
      font-size: 3.5rem;
      line-height: 1.2;
      margin-bottom: 1.5rem;
      background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.025em;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      color: var(--text-light);
      margin-bottom: 2rem;
      line-height: 1.7;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
    }

    .hero-image {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      border-radius: 24px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }

    .hero-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .hero-image:hover img {
      transform: scale(1.05);
    }

    .btn-primary, .btn-secondary {
      padding: 1rem 2rem;
      border-radius: 12px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: var(--primary);
      color: white;
      box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);
    }

    .btn-secondary {
      background: transparent;
      border: 2px solid var(--primary);
      color: var(--primary);
    }

    .btn-primary:hover {
      background: var(--primary-dark);
      transform: translateY(-2px);
    }

    .btn-secondary:hover {
      background: rgba(37, 99, 235, 0.1);
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      .hero {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 2rem;
      }

      .hero-actions {
        justify-content: center;
      }

      h1 {
        font-size: 2.5rem;
      }

      .hero-image {
        min-height: 300px;
      }
    }
  `]
})
export class HeroComponent {}