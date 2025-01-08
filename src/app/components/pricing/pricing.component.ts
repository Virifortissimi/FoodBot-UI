import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="pricing-container">
      <header class="pricing-header">
        <h1>Simple, Transparent Pricing</h1>
        <p>Choose the plan that's right for you</p>
      </header>

      <div class="pricing-grid">
        <div class="pricing-card">
          <div class="plan-name">Free</div>
          <div class="plan-price">$0</div>
          <div class="plan-billing">forever</div>
          <ul class="plan-features">
            <li><i class="fas fa-check"></i> Unlimited meal ingredients</li>
            <li><i class="fas fa-check"></i> 1 AI chat interactions/month</li>
            <li><i class="fas fa-check"></i> Basic nutrition tracking</li>
          </ul>
          <a routerLink="/signup" class="plan-button">Get Started</a>
        </div>

        <div class="pricing-card popular">
          <div class="popular-badge">Most Popular</div>
          <div class="plan-name">Pro - Basic</div>
          <div class="plan-price">$1.99</div>
          <div class="plan-billing">per month</div>
          <ul class="plan-features">
            <li><i class="fas fa-check"></i> Basic meal planning</li>
            <li><i class="fas fa-check"></i> 10 AI chat interactions/month</li>
            <li><i class="fas fa-check"></i> Basic nutrition tracking</li>
            <li><i class="fas fa-check"></i> Community support</li>
          </ul>
          <a routerLink="/signup" class="plan-button">Start Free Trial</a>
        </div>
        
        <div class="pricing-card">
          <div class="plan-name">Pro - Advanced</div>
          <div class="plan-price">$4.99</div>
          <div class="plan-billing">per month</div>
          <ul class="plan-features">
            <li><i class="fas fa-check"></i> Advanced meal planning</li>
            <li><i class="fas fa-check"></i> Unlimited AI chat</li>
            <li><i class="fas fa-check"></i> Detailed nutrition analysis</li>
            <li><i class="fas fa-check"></i> 1 nutritionist consultation/month</li>
            <li><i class="fas fa-check"></i> Recipe customization</li>
            <li><i class="fas fa-check"></i> Priority support</li>
          </ul>
          <a routerLink="/signup" class="plan-button">Start Free Trial</a>
        </div>

        <div class="pricing-card">
          <div class="plan-name">Enterprise</div>
          <div class="plan-price">Custom</div>
          <div class="plan-billing">tailored solutions</div>
          <ul class="plan-features">
            <li><i class="fas fa-check"></i> Everything in Pro</li>
            <li><i class="fas fa-check"></i> Custom AI training</li>
            <li><i class="fas fa-check"></i> Dedicated support team</li>
            <li><i class="fas fa-check"></i> API access</li>
            <li><i class="fas fa-check"></i> Custom integrations</li>
          </ul>
          <a routerLink="/contact" class="plan-button">Contact Sales</a>
        </div>
      </div>

      <section class="faq">
        <h2>Frequently Asked Questions</h2>
        <div class="faq-grid">
          <div class="faq-item">
            <h3>Can I cancel anytime?</h3>
            <p>Yes, you can cancel your subscription at any time. No questions asked.</p>
          </div>
          <div class="faq-item">
            <h3>What payment methods do you accept?</h3>
            <p>We accept all major credit cards, PayPal, and Apple Pay.</p>
          </div>
          <div class="faq-item">
            <h3>Is there a free trial?</h3>
            <p>Yes, all paid plans come with a 14-day free trial.</p>
          </div>
          <div class="faq-item">
            <h3>Can I switch plans?</h3>
            <p>You can upgrade or downgrade your plan at any time.</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .pricing-container {
      padding: 4rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .pricing-header {
      text-align: center;
      margin-bottom: 4rem;
    }

    .pricing-header h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .pricing-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      text-align: left;
      position: relative;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .pricing-card:hover {
      transform: translateY(-5px);
    }

    .pricing-card.popular {
      border: 2px solid var(--primary);
    }

    .popular-badge {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--primary);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.875rem;
    }

    .plan-name {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 1rem;
    }

    .plan-price {
      font-size: 3rem;
      font-weight: bold;
      color: var(--primary);
      margin-bottom: 0.5rem;
    }

    .plan-billing {
      color: var(--text-light);
      margin-bottom: 2rem;
    }

    .plan-features {
      list-style: none;
      padding: 0;
      margin-bottom: 2rem;
    }

    .plan-features li {
      margin-bottom: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .plan-features i {
      color: var(--primary);
    }

    .plan-button {
      display: inline-block;
      padding: 1rem 2rem;
      background: var(--primary);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      transition: background-color 0.3s;
    }

    .plan-button:hover {
      background: var(--primary-dark);
    }

    .faq {
      margin-top: 6rem;
    }

    .faq h2 {
      text-align: center;
      margin-bottom: 3rem;
    }

    .faq-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
    }

    .faq-item h3 {
      margin-bottom: 0.5rem;
      color: var(--primary);
    }

    @media (max-width: 768px) {
      .pricing-header h1 {
        font-size: 2rem;
      }

      .faq-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PricingComponent {}