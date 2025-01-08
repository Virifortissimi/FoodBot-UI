import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookieTypeComponent } from './cookie-type.component';
import { LegalHeaderComponent } from '../shared/legal-header.component';

@Component({
  selector: 'app-cookie-policy',
  standalone: true,
  imports: [CommonModule, CookieTypeComponent, LegalHeaderComponent],
  template: `
    <div class="policy-container">
      <div class="policy-content">
        <app-legal-header
          title="Cookie Policy"
          description="Learn about how we use cookies to improve your experience"
        />

        <section>
          <h2>1. What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your device when you visit a website. 
            They help websites remember your preferences, improve site functionality, and analyze usage.
          </p>
        </section>

        <section>
          <h2>2. How We Use Cookies</h2>
          <div class="cookie-types">
            <app-cookie-type
              title="Essential Cookies"
              description="These cookies are necessary for the website to function properly. Without them, certain features and services may not be available."
            />
            <app-cookie-type
              title="Performance Cookies"
              description="These cookies help us understand how visitors interact with our website by collecting anonymized usage data."
            />
            <app-cookie-type
              title="Functional Cookies"
              description="These cookies remember your preferences and settings to enhance your experience."
            />
            <app-cookie-type
              title="Targeting/Advertising Cookies"
              description="These cookies deliver personalized advertisements and track their effectiveness."
            />
          </div>
        </section>

        <section>
          <h2>3. Third-Party Cookies</h2>
          <p>
            We may allow third-party service providers to use cookies on our website to collect 
            information about your online activities. These third parties include analytics 
            providers (e.g., Google Analytics) and advertising partners.
          </p>
        </section>

        <section>
          <h2>4. Your Cookie Choices</h2>
          <p>You have the right to control and manage cookies:</p>
          <ul>
            <li>
              <strong>Browser Settings:</strong> Most web browsers allow you to manage or 
              disable cookies through settings.
            </li>
            <li>
              <strong>Opt-Out Tools:</strong> You can opt out of certain cookies used for 
              interest-based advertising through industry opt-out tools.
            </li>
          </ul>
        </section>

        <section>
          <h2>5. Updates to This Cookie Policy</h2>
          <p>
            We may update this Cookie Policy from time to time. Changes will be posted on 
            this page with an updated "Effective Date."
          </p>
        </section>

        <section class="contact-section">
          <h2>6. Contact Us</h2>
          <p>If you have any questions about our Cookie Policy, please contact us at:</p>
          <div class="contact-info">
            <p><strong>Email:</strong> privacy&#64;foodbot.africa</p>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .policy-container {
      padding: 2rem;
      background: var(--background);
      min-height: calc(100vh - 64px);
    }

    .policy-content {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 3rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    section {
      margin-bottom: 2.5rem;
    }

    h2 {
      color: var(--text);
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }

    p {
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    .cookie-types {
      display: grid;
      gap: 1.5rem;
      margin-top: 1.5rem;
    }

    ul {
      list-style-type: disc;
      margin-left: 1.5rem;
      margin-bottom: 1rem;
    }

    li {
      margin-bottom: 0.5rem;
      line-height: 1.6;
    }

    .contact-info {
      background: var(--background);
      padding: 1.5rem;
      border-radius: 8px;
      margin-top: 1rem;
    }
  `]
})
export class CookiePolicyComponent {}