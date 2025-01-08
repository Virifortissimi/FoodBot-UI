import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="privacy-container">
      <div class="privacy-content">
        <h1>Privacy Policy</h1>
        <p class="effective-date">Effective Date: January 1, 1970</p>

        <p class="intro">
          Foodbot.africa ("we," "our," "us") values your privacy and is committed to protecting your personal information. 
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services, 
          including the Foodbot.africa platform (the "Platform"). By accessing or using our services, you agree to the terms of this Privacy Policy.
        </p>

        <section>
          <h2>1. Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          
          <h3>Personal Information:</h3>
          <p>Name, email address, phone number, and other identifying details you provide when signing up or interacting with our services.</p>
          
          <h3>Non-Personal Information:</h3>
          <p>Browser type, device information, IP address, and usage data collected through cookies and analytics tools.</p>
          
          <h3>Dietary and Health Information:</h3>
          <p>Information related to your dietary preferences, health goals, and meal plans shared on the Platform.</p>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and personalize our services, including generating meal plans tailored to your needs.</li>
            <li>Communicate with you about your account, updates, and promotional offers.</li>
            <li>Improve our Platform by analyzing usage trends and user feedback.</li>
            <li>Comply with legal obligations and protect our rights.</li>
          </ul>
        </section>

        <section>
          <h2>3. Sharing Your Information</h2>
          <p>We do not sell or rent your personal information. However, we may share your information:</p>
          <ul>
            <li><strong>With Service Providers:</strong> Third-party vendors who assist in delivering our services, subject to confidentiality agreements.</li>
            <li><strong>For Legal Reasons:</strong> To comply with legal obligations, enforce our Terms of Service, or protect against fraud or security threats.</li>
            <li><strong>With Your Consent:</strong> When you provide explicit permission to share your data.</li>
          </ul>
        </section>

        <section>
          <h2>4. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar technologies to enhance your experience on our Platform. 
            These tools help us understand how users interact with our services, enabling us to improve functionality. 
            You can control or disable cookies through your browser settings.
          </p>
        </section>

        <section>
          <h2>5. Your Rights</h2>
          <p>You have the following rights regarding your personal information:</p>
          <ul>
            <li>Access and update your data.</li>
            <li>Request deletion of your data, subject to legal and operational requirements.</li>
            <li>Opt-out of marketing communications.</li>
            <li>Restrict or object to certain data processing activities.</li>
          </ul>
          <p>To exercise these rights, contact us at privacy&#64;foodbot.africa</p>
        </section>

        <section>
          <h2>6. Data Security</h2>
          <p>
            We implement reasonable security measures to protect your data from unauthorized access, alteration, or disclosure. 
            However, no system is completely secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2>7. Third-Party Links</h2>
          <p>
            Our Platform may contain links to third-party websites or services. We are not responsible for the privacy practices 
            of these external sites. We encourage you to review their privacy policies before providing any personal information.
          </p>
        </section>

        <section>
          <h2>8. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically to reflect changes in our practices or applicable laws. 
            Any updates will be posted on this page with the "Effective Date" revised accordingly.
          </p>
        </section>

        <section>
          <h2>9. Contact Us</h2>
          <p>If you have questions or concerns about this Privacy Policy, please contact us at:</p>
          <div class="contact-info">
            <p><strong>Email:</strong> privacy&#64;foodbot.africa</p>
            <p><strong>Address:</strong> 123 Nutrition Street, Health Valley, NU 12345</p>
            <p><strong>Phone:</strong> +1 (555) 123-4567</p>
          </div>
        </section>

        <p class="closing">
          Thank you for trusting Foodbot.africa with your personal information. Your privacy is important to us.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .privacy-container {
      padding: 2rem;
      background: var(--background);
      min-height: calc(100vh - 64px);
    }

    .privacy-content {
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

    .closing {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e2e8f0;
      font-style: italic;
      color: var(--text-light);
    }

    @media (max-width: 768px) {
      .privacy-content {
        padding: 2rem;
      }
    }
  `]
})
export class PrivacyComponent {}