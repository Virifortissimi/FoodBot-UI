import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="features-container">
      <header class="features-header">
        <h1>Powerful Features</h1>
        <p class="subtitle">Everything you need to achieve your nutrition goals</p>
      </header>

      <div class="features-grid">
        <div class="feature-card">
          <i class="fas fa-robot"></i>
          <h3>AI Chat Assistant</h3>
          <p>Get instant answers to your nutrition questions and personalized recommendations 24/7.</p>
          <a routerLink="/chat" class="feature-link">Try Now <i class="fas fa-arrow-right"></i></a>
        </div>

        <div class="feature-card">
          <i class="fas fa-calendar-check"></i>
          <h3>Smart Meal Planning</h3>
          <p>Generate customized meal plans based on your preferences, dietary restrictions, and health goals.</p>
          <a routerLink="/meal-planner" class="feature-link">Plan Meals <i class="fas fa-arrow-right"></i></a>
        </div>

        <div class="feature-card">
          <i class="fas fa-user-md"></i>
          <h3>Expert Nutritionists</h3>
          <p>Connect with certified nutritionists for personalized guidance and consultations.</p>
          <a routerLink="/nutritionist" class="feature-link">Book Consultation <i class="fas fa-arrow-right"></i></a>
        </div>

        <div class="feature-card">
          <i class="fas fa-chart-line"></i>
          <h3>Progress Tracking</h3>
          <p>Monitor your nutrition goals and track your progress with detailed analytics and insights.</p>
          <a routerLink="/dashboard" class="feature-link">View Dashboard <i class="fas fa-arrow-right"></i></a>
        </div>

        <div class="feature-card">
          <i class="fas fa-utensils"></i>
          <h3>Recipe Discovery</h3>
          <p>Explore thousands of healthy recipes tailored to your dietary preferences and restrictions.</p>
          <a routerLink="/recipes" class="feature-link">Browse Recipes <i class="fas fa-arrow-right"></i></a>
        </div>

        <div class="feature-card">
          <i class="fas fa-mobile-alt"></i>
          <h3>Cross-Platform Access</h3>
          <p>Access FoodBot from any device - desktop, tablet, or mobile phone.</p>
          <a routerLink="/signup" class="feature-link">Get Started <i class="fas fa-arrow-right"></i></a>
        </div>
      </div>

      <section class="cta-section">
        <h2>Ready to Transform Your Nutrition?</h2>
        <p>Join thousands of users who have already improved their health with FoodBot.</p>
        <div class="cta-buttons">
          <a routerLink="/signup" class="btn-primary">Start Free Trial</a>
          <a routerLink="/pricing" class="btn-secondary">View Pricing</a>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .features-container {
      padding: 4rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .features-header {
      text-align: center;
      margin-bottom: 4rem;
    }

    .features-header h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .subtitle {
      font-size: 1.25rem;
      color: var(--text-light);
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .feature-card {
      background: white;
      padding: 2rem;
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-5px);
    }

    .feature-card i {
      font-size: 2.5rem;
      color: var(--primary);
      margin-bottom: 1.5rem;
    }

    .feature-card h3 {
      margin-bottom: 1rem;
      color: var(--text);
    }

    .feature-card p {
      color: var(--text-light);
      margin-bottom: 1.5rem;
      line-height: 1.6;
    }

    .feature-link {
      color: var(--primary);
      text-decoration: none;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: gap 0.3s ease;
    }

    .feature-link:hover {
      gap: 0.75rem;
    }

    .cta-section {
      text-align: center;
      padding: 4rem 2rem;
      background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
      border-radius: 16px;
      color: white;
    }

    .cta-section h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: white;
    }

    .cta-section p {
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

    @media (max-width: 768px) {
      .features-header h1 {
        font-size: 2.5rem;
      }

      .cta-section h2 {
        font-size: 2rem;
      }

      .cta-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class FeaturesComponent {}