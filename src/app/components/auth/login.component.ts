import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormInputComponent } from '../shared/form-input.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormInputComponent, FormsModule ],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue to FoodBot</p>
        </div>

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="auth-form">
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
            placeholder="Enter your password"
            icon="lock"
            id="password"
            [required]="true"
            [value]="password"
            [onValueChange]="updatePassword"
          />

          <div class="form-footer">
            <label class="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a routerLink="/forgot-password" class="forgot-password">Forgot password?</a>
          </div>

          <button type="submit" class="submit-button" [disabled]="!loginForm.form.valid">
            Sign In
          </button>
        </form>

        <p class="auth-link">
          Don't have an account? <a routerLink="/signup">Create Account</a>
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

    .form-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .remember-me {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #64748b;
      cursor: pointer;
    }

    .forgot-password {
      color: var(--primary);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;
    }

    .forgot-password:hover {
      color: var(--primary-dark);
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
export class LoginComponent {
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  updateEmail = (value: string) => {
    this.email = value;
  };

  updatePassword = (value: string) => {
    this.password = value;
  };

  onSubmit() {
    this.authService.login({ email: this.email, password: this.password })
      .subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
  }
}