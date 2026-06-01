import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  async onSubmit() {
    if (this.registerForm.invalid) return;

    this.loading = true;
    try {
      const result = await this.authService.signUp(
        this.registerForm.value.email,
        this.registerForm.value.firstName,
        this.registerForm.value.lastName,
        this.registerForm.value.password
      );
      if ('requiresEmailVerification' in result && result.requiresEmailVerification) {
        const pendingResult = result as unknown as { requiresEmailVerification: boolean; email: string };
        this.toastService.info('Account created. Check your email to verify your address, then sign in.', 9000);
        this.router.navigate(['/auth/login'], {
          queryParams: {
            ...this.route.snapshot.queryParams,
            email: pendingResult.email,
            verify: '1'
          }
        });
        return;
      }

      this.toastService.success('Account created successfully! Welcome to FoodBot.');
      this.router.navigateByUrl(this.resolvePostAuthRedirect());
    } catch (error: any) {
      const message = error?.message || 'Failed to create account.';
      const normalized = message.toLowerCase();
      if (normalized.includes('already registered') || normalized.includes('already verified')) {
        this.toastService.info('This email is already verified. Please sign in to continue.', 7000);
        this.router.navigate(['/auth/login'], { queryParams: this.route.snapshot.queryParams });
      } else if (normalized.includes('verify your email') || normalized.includes('verify your address')) {
        this.toastService.info(message, 7000);
        this.router.navigate(['/auth/login'], { queryParams: this.route.snapshot.queryParams });
      } else {
        this.toastService.error(message);
      }
    } finally {
      this.loading = false;
    }
  }

  private resolvePostAuthRedirect(): string {
    const redirect = (this.route.snapshot.queryParamMap.get('redirect') || '').trim();

    if (!redirect || redirect === '/' || redirect === '/home') {
      return '/dashboard';
    }

    return redirect;
  }

}
