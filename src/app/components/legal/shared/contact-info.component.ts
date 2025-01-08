import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-info',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="contact-section">
      <h2>Contact Us</h2>
      <p>For questions or concerns about these Terms, please contact us at:</p>
      <div class="contact-info">
        <p><strong>Email:</strong> support&#64;foodbot.africa</p>
        <p><strong>Address:</strong> 123 Nutrition Street, Health Valley, NU 12345</p>
        <p><strong>Phone:</strong> +1 (555) 123-4567</p>
      </div>
    </section>
  `,
  styles: [`
    .contact-section {
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid #e2e8f0;
    }

    h2 {
      color: var(--text);
      font-size: 1.5rem;
      margin-bottom: 1rem;
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
  `]
})
export class ContactInfoComponent {}