import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactFormComponent } from './contact-form.component';
import { ContactInfoComponent } from './contact-info.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ContactFormComponent, ContactInfoComponent],
  template: `
    <div class="contact-container">
      <header class="contact-header">
        <h1>Contact Us</h1>
        <p class="subtitle">We'd love to hear from you</p>
      </header>

      <div class="contact-content">
        <app-contact-form />
        <app-contact-info />
      </div>
    </div>
  `,
  styles: [`
    .contact-container {
      padding: 4rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .contact-header {
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

    .contact-content {
      display: grid;
      grid-template-columns: 3fr 2fr;
      gap: 4rem;
      align-items: start;
    }

    @media (max-width: 768px) {
      .contact-content {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ContactComponent {}