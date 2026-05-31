import { Component, inject, signal, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { AuthService } from '../../../../core/services/auth.service';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';
import { StaggerDirective } from '../../../../shared/directives/stagger.directive';
import { ParticleFieldComponent } from '../../../../shared/components/particle-field/particle-field.component';
import { ToastService } from '../../../../core/services/toast.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule, RevealDirective, StaggerDirective, ParticleFieldComponent],
  template: `
    <div style="min-height: 100vh; background: var(--surface-base); display: flex; align-items: center; justify-content: center; padding: 2rem; position: relative; overflow: hidden;">
      <div class="dot-grid-section" aria-hidden="true"></div>
      <fb-particle-field density="normal" variant="light" />

      <!-- Back Decoration -->
      <div style="position: absolute; top: 10%; left: 5%; width: 400px; height: 400px; background:radial-gradient(circle, var(--green-100) 0%, transparent 70%); border-radius: 50%; opacity: 0.4; filter: blur(60px); z-index: 0;"></div>
      <div style="position: absolute; bottom: 10%; right: 5%; width: 300px; height: 300px; background:radial-gradient(circle, #0ea5e911 0%, transparent 70%); border-radius: 50%; opacity: 0.4; filter: blur(60px); z-index: 0;"></div>

      <div class="card" style="width: 100%; max-width: 600px; padding: 3rem; position: relative; z-index: 10; border-radius: 2.5rem; box-shadow: var(--shadow-xl);">
        
        <!-- Progress Bar -->
        <div style="margin-bottom: 3rem;">
          <div style="height: 6px; background: var(--surface-subtle); border-radius: 100px; overflow: hidden; display: flex;">
            <div [style.width.%]="(currentStep() / 3) * 100" style="height: 100%; background: var(--green-500); transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);"></div>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 0.75rem;">
            <span class="type-overline" [class.text-green-600]="currentStep() >= 1">Goals</span>
            <span class="type-overline" [class.text-green-600]="currentStep() >= 2">Preferences</span>
            <span class="type-overline" [class.text-green-600]="currentStep() >= 3">Success</span>
          </div>
        </div>

        <!-- Step 1: Goals -->
        <div *ngIf="currentStep() === 1" fbReveal="up">
          <header style="margin-bottom: 2.5rem;">
            <h1 class="type-display" style="font-size: 2.5rem; margin-bottom: 0.75rem;">Set Your Targets 🎯</h1>
            <p class="type-body" style="color: var(--ink-secondary);">What are your daily nutrition goals? We'll use these to track your progress.</p>
          </header>

          <div class="space-y-6" fbStagger>
            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="form-label" style="margin: 0;">Daily Calories</label>
                <span style="font-weight: 800; color: var(--green-600);">{{ goals.calories }} kcal</span>
              </div>
              <input type="range" [(ngModel)]="goals.calories" min="1200" max="4000" step="50" class="w-full accent-green-600">
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div class="card-stat" style="padding: 1rem;">
                <label class="form-label" style="font-size: 0.7rem;">Protein (g)</label>
                <input type="number" [(ngModel)]="goals.protein" class="form-input" style="text-align: center;">
              </div>
              <div class="card-stat" style="padding: 1rem;">
                <label class="form-label" style="font-size: 0.7rem;">Carbs (g)</label>
                <input type="number" [(ngModel)]="goals.carbs" class="form-input" style="text-align: center;">
              </div>
              <div class="card-stat" style="padding: 1rem;">
                <label class="form-label" style="font-size: 0.7rem;">Fat (g)</label>
                <input type="number" [(ngModel)]="goals.fat" class="form-input" style="text-align: center;">
              </div>
            </div>
          </div>

          <div class="flex justify-end mt-12">
            <button (click)="nextStep()" class="btn-green" style="width: 100%; border-radius: 1rem; padding: 1.25rem;">Next: Preferences</button>
          </div>
        </div>

        <!-- Step 2: Preferences -->
        <div *ngIf="currentStep() === 2" fbReveal="up">
          <header style="margin-bottom: 2.5rem;">
            <h1 class="type-display" style="font-size: 2.5rem; margin-bottom: 0.75rem;">Your Palate 🥘</h1>
            <p class="type-body" style="color: var(--ink-secondary);">Select up to {{ maxDietaryPreferences }} dietary patterns you follow or prefer.</p>
          </header>

          <div class="flex flex-wrap gap-2" fbStagger>
            <button *ngFor="let pref of dietaryOptions" (click)="togglePref(pref.key)"
                    class="tag-selection"
                    [class.active]="preferences.includes(pref.key)"
                    [class.disabled]="isPreferenceDisabled(pref.key)"
                    [disabled]="isPreferenceDisabled(pref.key)">
              {{ pref.emoji }} {{ pref.label }}
            </button>
          </div>
          <p class="type-body-s" style="margin-top: 1rem; color: var(--ink-secondary);">
            {{ preferences.length }} / {{ maxDietaryPreferences }} selected
          </p>

          <div class="flex gap-4 mt-12">
            <button (click)="prevStep()" class="btn-outline" style="flex: 1; border-radius: 1rem; padding: 1.25rem;">Back</button>
            <button (click)="nextStep()" class="btn-green" style="flex: 2; border-radius: 1rem; padding: 1.25rem;" [disabled]="loading()">
              {{ loading() ? 'Saving...' : 'Finish Setup' }}
            </button>
          </div>
        </div>

        <!-- Step 3: Success -->
        <div *ngIf="currentStep() === 3" style="text-align: center;" fbReveal="scale-up">
          <div style="width: 120px; height: 120px; background: var(--green-50); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 2.5rem;">
            <span style="font-size: 3.5rem;">🎉</span>
          </div>
          <h1 class="type-display" style="font-size: 2.5rem; margin-bottom: 1rem;">You're All Set!</h1>
          <p class="type-body" style="color: var(--ink-secondary); margin-bottom: 3rem;">
            Your nutrition goals and preferences have been locked in. Welcome to the FoodBot family!
          </p>

          <button (click)="finish()" class="btn-green" style="width: 100%; border-radius: 1rem; padding: 1.25rem;">Go to Dashboard</button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .tag-selection {
      padding: 0.75rem 1.25rem;
      border-radius: 100px;
      border: 1.5px solid var(--border-default);
      background: var(--surface-base);
      color: var(--ink-secondary);
      font-weight: 600;
      font-size: 0.9375rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .tag-selection:hover {
      border-color: var(--green-300);
      background: var(--green-50);
    }
    .tag-selection.active {
      background: var(--green-500);
      border-color: var(--green-500);
      color: white;
      box-shadow: 0 10px 15px -3px rgba(22, 198, 90, 0.3);
    }
    .tag-selection.disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
    input[type='range'] {
      height: 6px;
      -webkit-appearance: none;
      background: var(--surface-subtle);
      border-radius: 100px;
    }
    input[type='range']::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 24px;
      height: 24px;
      background: white;
      border: 3px solid var(--green-500);
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    }
  `]
})
export class OnboardingPageComponent {
  readonly maxDietaryPreferences = 3;

  private userService = inject(UserService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  currentStep = signal(1);
  loading = signal(false);

  goals = {
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65
  };

  preferences: string[] = [];

  dietaryOptions = [
    { key: 'Nigerian', label: 'Nigerian Cuisine', emoji: '🇳🇬' },
    { key: 'Vegetarian', label: 'Vegetarian', emoji: '🥦' },
    { key: 'Vegan', label: 'Vegan', emoji: '🌱' },
    { key: 'Keto', label: 'Keto', emoji: '🥑' },
    { key: 'Halal', label: 'Halal', emoji: '☪️' },
    { key: 'High Protein', label: 'High Protein', emoji: '💪' },
    { key: 'Weight Loss', label: 'Weight Loss', emoji: '⚖️' },
  ];

  nextStep() {
    if (this.currentStep() === 2) {
      this.submit();
    } else {
      this.currentStep.set(this.currentStep() + 1);
    }
  }

  prevStep() {
    this.currentStep.set(this.currentStep() - 1);
  }

  togglePref(key: string) {
    if (this.preferences.includes(key)) {
      this.preferences = this.preferences.filter(p => p !== key);
    } else if (this.preferences.length < this.maxDietaryPreferences) {
      this.preferences.push(key);
    }
  }

  isPreferenceDisabled(key: string): boolean {
    return !this.preferences.includes(key) && this.preferences.length >= this.maxDietaryPreferences;
  }

  async submit() {
    this.loading.set(true);
    const data = {
      caloriesGoal: this.goals.calories,
      proteinGoal: this.goals.protein,
      carbsGoal: this.goals.carbs,
      fatGoal: this.goals.fat,
      dietaryPreferences: this.preferences
    };

    try {
      await this.authService.ensureValidToken();
      await firstValueFrom(this.userService.completeOnboarding(data));
      this.applyOnboardingSuccess();
    } catch (err: any) {
      // Fallback for environments where JWT middleware rejects otherwise valid Supabase sessions.
      if (err?.status === 401) {
        const token = this.authService.token();
        if (token && this.looksLikeJwt(token)) {
          try {
            await firstValueFrom(this.userService.completeOnboardingWithToken(data, token));
            this.applyOnboardingSuccess();
            return;
          } catch (retryErr: any) {
            this.toastService.error(this.resolveOnboardingError(retryErr));
            return;
          }
        }
      }

      this.toastService.error(this.resolveOnboardingError(err));
    } finally {
      this.loading.set(false);
    }
  }

  private applyOnboardingSuccess() {
    this.currentStep.set(3);
    this.toastService.success('Onboarding completed successfully!');
    // Update local user state
    const currentUser = this.authService.user();
    if (currentUser) {
      currentUser.onboardingCompleted = true;
      this.authService.user.set({ ...currentUser });
    }
  }

  private resolveOnboardingError(err: any): string {
    const message = err?.error?.errors?.[0]
      || err?.error?.message
      || err?.message
      || null;

    if (err?.status === 401) {
      return message || 'Your session could not be verified. Please sign in again.';
    }

    return message || 'Failed to save your preferences. Please try again.';
  }

  private looksLikeJwt(value: string): boolean {
    const trimmed = (value || '').trim();
    if (!trimmed) {
      return false;
    }

    const parts = trimmed.split('.');
    return parts.length === 3 && parts.every(part => part.length > 0);
  }

  finish() {
    this.router.navigate(['/dashboard']);
  }
}
