import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit() {
    const email = this.route.snapshot.queryParamMap.get('email');
    if (email) {
      this.loginForm.patchValue({ email });
    }

    if (this.route.snapshot.queryParamMap.get('verified') === '1') {
      this.toastService.success('Email verified successfully. Please sign in to continue.');
    } else if (this.route.snapshot.queryParamMap.get('verify') === '1') {
      this.toastService.info('Check your email to verify your FoodBot account.', 9000);
    } else if (this.route.snapshot.queryParamMap.get('passwordReset') === '1') {
      this.toastService.success('Password updated. Please sign in with your new password.');
    }

    this.handleSupabaseCallback();
  }

  async onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    try {
      await this.authService.signIn(this.loginForm.value.email, this.loginForm.value.password);
      this.toastService.success('Welcome back!');
      this.router.navigateByUrl(this.resolvePostAuthRedirect());
    } catch (error: any) {
      const message = error.message || 'Invalid email or password.';
      if (message.toLowerCase().includes('verify your email')) {
        this.toastService.info(message, 9000);
        await this.resendVerification(false);
      } else {
        this.toastService.error(message);
      }
    } finally {
      this.loading = false;
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async onForgotPassword(event: Event) {
    event.preventDefault();
    const email = (this.loginForm.value.email || '').trim();
    if (!email) {
      this.toastService.info('Enter your email address first.');
      return;
    }

    try {
      await this.authService.requestPasswordReset(email);
      this.toastService.info('If that email exists, a password reset link has been sent.', 9000);
    } catch (error: any) {
      this.toastService.error(error?.message || 'Unable to send password reset email.');
    }
  }

  private async resendVerification(showSuccess = true) {
    const email = (this.loginForm.value.email || '').trim();
    if (!email) {
      return;
    }

    try {
      await this.authService.resendVerification(email);
      if (showSuccess) {
        this.toastService.info('Verification email sent. Check your inbox.', 9000);
      }
    } catch {
      // Login already displayed the primary verification message.
    }
  }

  private async handleSupabaseCallback() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const hashParams = new URLSearchParams(window.location.hash.startsWith('#')
      ? window.location.hash.substring(1)
      : window.location.hash);
    const queryParams = this.route.snapshot.queryParamMap;

    const accessToken = hashParams.get('access_token') || queryParams.get('access_token');
    const authCode = hashParams.get('code') || queryParams.get('code');
    const verificationToken = hashParams.get('token') || queryParams.get('token');
    const callbackType = hashParams.get('type') || queryParams.get('type');
    const callbackError = this.normalizeMessage(hashParams.get('error') || queryParams.get('error'));
    const errorDescription = this.normalizeMessage(hashParams.get('error_description') || queryParams.get('error_description'));
    const errorCode = this.normalizeMessage(hashParams.get('error_code') || queryParams.get('error_code'));
    const hasSbMarker = hashParams.has('sb') || queryParams.has('sb');

    const hasCallbackPayload = Boolean(
      accessToken
      || authCode
      || verificationToken
      || callbackType
      || callbackError
      || errorDescription
      || errorCode
      || hashParams.get('refresh_token')
      || hashParams.get('expires_in')
      || hasSbMarker
    );

    if (!hasCallbackPayload) {
      return;
    }

    await this.clearCallbackParamsFromUrl();

    if (errorDescription || callbackError) {
      const normalizedDescription = (errorDescription || '').toLowerCase();
      const isSignupVerificationReplay = (
        callbackType === 'signup'
        || hasSbMarker
        || Boolean(verificationToken)
      ) && (
        errorCode === 'otp_expired'
        || callbackError === 'access_denied'
        || normalizedDescription.includes('email link is invalid')
        || normalizedDescription.includes('has expired')
      );

      if (isSignupVerificationReplay) {
        this.toastService.success('Email already verified. Please sign in to continue.');
      } else if (errorCode === 'otp_expired') {
        this.toastService.error('This confirmation link has expired. Please request a new verification email.');
      } else {
        this.toastService.error(errorDescription || 'Authentication callback failed. Please request a new verification email.');
      }
      return;
    }

    if (!accessToken) {
      if (callbackType === 'signup') {
        if (verificationToken || authCode || hasSbMarker) {
          this.toastService.success('Email verified successfully. Please sign in to continue.');
        } else {
          this.toastService.success('Email already verified. Please sign in to continue.');
        }
      }
      return;
    }

    if (!this.looksLikeJwt(accessToken)) {
      if (callbackType === 'signup') {
        this.toastService.success('Email confirmed. Please sign in to continue.');
      } else {
        this.toastService.info('Authentication callback received. Please sign in to continue.');
      }
      return;
    }

    this.loading = true;
    try {
      await this.authService.completeSessionFromAccessToken(accessToken);
      this.toastService.success(callbackType === 'signup'
        ? 'Email verified successfully. You are now signed in.'
        : 'Signed in successfully.');

      this.router.navigateByUrl(this.resolvePostAuthRedirect());
    } catch (error: any) {
      if (callbackType === 'signup') {
        this.toastService.success('Email confirmation completed. Please sign in.');
        return;
      }

      this.toastService.error(
        error?.message || 'Email was verified, but automatic sign-in failed. Please sign in manually.'
      );
    } finally {
      this.loading = false;
    }
  }

  private async clearCallbackParamsFromUrl() {
    const nextQueryParams: Record<string, any> = { ...this.route.snapshot.queryParams };
    const callbackQueryKeys = [
      'access_token',
      'refresh_token',
      'expires_in',
      'token_type',
      'code',
      'token',
      'type',
      'error',
      'error_code',
      'error_description',
      'sb'
    ];

    for (const key of callbackQueryKeys) {
      delete nextQueryParams[key];
    }

    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams: nextQueryParams,
      replaceUrl: true,
      fragment: undefined
    });
  }

  private normalizeMessage(value: string | null): string | null {
    if (!value) {
      return null;
    }

    const normalized = value.replace(/\+/g, ' ').trim();
    return normalized || null;
  }

  private looksLikeJwt(value: string): boolean {
    const trimmed = (value || '').trim();
    if (!trimmed) {
      return false;
    }

    const parts = trimmed.split('.');
    return parts.length === 3 && parts.every(part => part.length > 0);
  }

  private resolvePostAuthRedirect(): string {
    const redirect = (this.route.snapshot.queryParamMap.get('redirect') || '').trim();

    if (!redirect || redirect === '/' || redirect === '/home') {
      return '/dashboard';
    }

    return redirect;
  }
}
