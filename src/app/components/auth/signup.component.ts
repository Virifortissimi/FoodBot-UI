import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormInputComponent } from '../shared/form-input.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterLink, FormInputComponent, FormsModule ],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Create Account</h1>
          <p>Join FoodBot and start your health journey</p>
        </div>

        <form (ngSubmit)="onSubmit()" #signupForm="ngForm" class="auth-form">
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

          <app-form-input
            type="password"
            label="Password"
            placeholder="Choose a strong password"
            icon="lock"
            id="password"
            [required]="true"
            [value]="password"
            [onValueChange]="updatePassword"
          />

          <div class="terms">
            <label class="checkbox-label">
              <input type="checkbox" required />
              <span>I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a></span>
            </label>
          </div>

          <button type="submit" class="submit-button" [disabled]="!signupForm.form.valid">
            Create Account
          </button>
        </form>

        <p class="auth-link">
          Already have an account? <a routerLink="/login">Sign In</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: calc(100vh - 64px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    }

    .auth-card {
      background: white;
      padding: 2.5rem;
      border-radius: 24px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 440px;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .auth-header h1 {
      font-size: 2rem;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }

    .auth-header p {
      color: #64748b;
    }

    .auth-form {
      margin-bottom: 2rem;
    }

    .terms {
      margin-bottom: 1.5rem;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #64748b;
      font-size: 0.875rem;
    }

    .checkbox-label a {
      color: var(--primary);
      text-decoration: none;
      font-weight: 500;
    }

    .checkbox-label a:hover {
      text-decoration: underline;
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

    .submit-button:hover {
      background: var(--primary-dark);
      transform: translateY(-2px);
    }

    .submit-button:disabled {
      background: #94a3b8;
      cursor: not-allowed;
      transform: none;
    }

    .auth-link {
      text-align: center;
      color: #64748b;
    }

    .auth-link a {
      color: var(--primary);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;
    }

    .auth-link a:hover {
      color: var(--primary-dark);
    }
  `]
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  updateName = (value: string) => {
    this.name = value;
  };

  updateEmail = (value: string) => {
    this.email = value;
  };

  updatePassword = (value: string) => {
    this.password = value;
  };

  onSubmit() {
    this.authService.signup({
      name: this.name,
      email: this.email,
      password: this.password
    }).subscribe(() => {
      this.router.navigate(['/dashboard']);
    });
  }
}