import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="terms-container">
      <div class="terms-content">
        <h1>Terms of Service</h1>
        <p class="effective-date">Effective Date: January 1, 1970</p>

        <p class="intro">
          Welcome to Foodbot.africa! These Terms of Service ("Terms") govern your access to and use of the 
          Foodbot.africa website, services, and products ("Services"). By accessing or using our Services, 
          you agree to comply with these Terms. If you do not agree, please do not use our Services.
        </p>

        <section>
          <h2>1. Use of Services</h2>
          <ul>
            <li>You must be at least 18 years old to use our Services.</li>
            <li>You are responsible for maintaining the confidentiality of your account and password and for restricting access to your account.</li>
          </ul>
          
          <h3>Prohibited Activities</h3>
          <p>You agree not to engage in activities that:</p>
          <ul>
            <li>Violate any laws or regulations.</li>
            <li>Disrupt or harm our Services or servers.</li>
            <li>Involve unauthorized access or data extraction.</li>
          </ul>
        </section>

        <section>
          <h2>2. Content and Intellectual Property</h2>
          <ul>
            <li>All content provided on Foodbot.africa, including logos, designs, text, and images, is owned by Foodbot.africa or licensed to us.</li>
            <li>You may not copy, distribute, modify, or create derivative works from any content on our platform without explicit permission.</li>
          </ul>
        </section>

        <section>
          <h2>3. Privacy</h2>
          <p>Your privacy is important to us. Please refer to our Privacy Policy for information on how we collect, use, and protect your personal data.</p>
        </section>

        <section>
          <h2>4. Orders and Payments</h2>
          <ul>
            <li>All information you provide when placing an order must be accurate and complete.</li>
            <li>Payments are processed securely. Foodbot.africa is not responsible for payment gateway errors or issues.</li>
          </ul>
        </section>

        <section>
          <h2>5. Termination</h2>
          <p>We reserve the right to terminate or suspend your access to the Services without prior notice if you violate these Terms.</p>
        </section>

        <section>
          <h2>6. Limitation of Liability</h2>
          <p>Foodbot.africa is not liable for indirect, incidental, or consequential damages arising from your use of our Services. Our maximum liability is limited to the amount you paid for the specific service.</p>
        </section>

        <section>
          <h2>7. Changes to Terms</h2>
          <p>We may update these Terms from time to time. Continued use of our Services constitutes your acceptance of the revised Terms.</p>
        </section>

        <section>
          <h2>8. Governing Law</h2>
          <p>These Terms are governed by the laws of the United States. Any disputes will be resolved in the courts of New York.</p>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>For questions or concerns about these Terms, please contact us at:</p>
          <div class="contact-info">
            <p><strong>Email:</strong> support&#64;foodbot.africa</p>
            <p><strong>Address:</strong> 123 Nutrition Street, Health Valley, NU 12345</p>
            <p><strong>Phone:</strong> +1 (555) 123-4567</p>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .terms-container {
      padding: 2rem;
      background: var(--background);
      min-height: calc(100vh - 64px);
    }

    .terms-content {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 3rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    h1 {
      color: var(--primary);
      margin-bottom: 0.5rem;
    }

    .effective-date {
      color: var(--text-light);
      margin-bottom: 2rem;
    }

    .intro {
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    section {
      margin-bottom: 2.5rem;
    }

    h2 {
      color: var(--text);
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }

    h3 {
      color: var(--text);
      font-size: 1.2rem;
      margin: 1rem 0 0.5rem;
    }

    p {
      margin-bottom: 1rem;
      line-height: 1.6;
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

    .contact-info p {
      margin-bottom: 0.5rem;
    }

    @media (max-width: 768px) {
      .terms-content {
        padding: 2rem;
      }
    }
  `]
})
export class TermsComponent {}