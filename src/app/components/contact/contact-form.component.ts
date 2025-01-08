import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormInputComponent } from '../shared/form-input.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, FormInputComponent, FormsModule],
  template: `
    <div class="contact-form">
      <h2>Send us a Message</h2>
      <form (ngSubmit)="onSubmit()" #contactForm="ngForm">
        <app-form-input
          type="text"
          label="Full Name"
          placeholder="Enter your name"
          icon="user"
          id="name"
          [required]="true"
          [value]="name"
          [onValueChange]="updateName"
        />

        <app-form-input
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          icon="envelope"
          id="email"
          [required]="true"
          [value]="email"
          [onValueChange]="updateEmail"
        />

        <div class="form-field">
          <label for="message" class="form-label">Message</label>
          <textarea
            id="message"
            [(ngModel)]="message"
            name="message"
            rows="5"
            placeholder="How can we help you?"
            required
            class="form-textarea"
          ></textarea>
        </div>

        <button type="submit" class="submit-button" [disabled]="!contactForm.form.valid">
          Send Message
        </button>
      </form>
    </div>
  `,
  styles: [`
    .contact-form {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    h2 {
      margin-bottom: 2rem;
      color: var(--text);
    }

    .form-field {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: #64748b;
      margin-bottom: 0.5rem;
    }

    .form-textarea {
      width: 100%;
      padding: 0.875rem;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 1rem;
      font-family: inherit;
      resize: vertical;
      transition: all 0.3s ease;
    }

    .form-textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .submit-button {
      width: 100%;
      padding: 1rem;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .submit-button:hover:not(:disabled) {
      background: var(--primary-dark);
      transform: translateY(-2px);
    }

    .submit-button:disabled {
      background: #94a3b8;
      cursor: not-allowed;
    }
  `]
})
export class ContactFormComponent {
  name = '';
  email = '';
  message = '';

  updateName = (value: string) => {
    this.name = value;
  };

  updateEmail = (value: string) => {
    this.email = value;
  };

  onSubmit() {
    // Handle form submission
    console.log({ name: this.name, email: this.email, message: this.message });
  }
}