import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { AuthService } from '../../../../core/services/auth.service';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';
import { StaggerDirective } from '../../../../shared/directives/stagger.directive';
import { ParticleFieldComponent } from '../../../../shared/components/particle-field/particle-field.component';
import { ToastService } from '../../../../core/services/toast.service';
import { firstValueFrom } from 'rxjs';

type GoalIntent = 'lose' | 'maintain' | 'gain';
type GoalField = 'calories' | 'protein' | 'carbs' | 'fat';
type Sex = 'male' | 'female';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active';

type GoalPreset = {
  label: string;
  summary: string;
};

type Recommendation = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  bmr: number;
  tdee: number;
};

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule, RevealDirective, StaggerDirective, ParticleFieldComponent],
  template: `
    <div style="min-height: 100vh; background: var(--surface-base); display: flex; align-items: center; justify-content: center; padding: 2rem; position: relative; overflow: hidden;">
      <div class="dot-grid-section" aria-hidden="true"></div>
      <fb-particle-field density="normal" variant="light" />

      <div style="position: absolute; top: 10%; left: 5%; width: 400px; height: 400px; background: radial-gradient(circle, var(--green-100) 0%, transparent 70%); border-radius: 50%; opacity: 0.4; filter: blur(60px); z-index: 0;"></div>
      <div style="position: absolute; bottom: 10%; right: 5%; width: 300px; height: 300px; background: radial-gradient(circle, #0ea5e911 0%, transparent 70%); border-radius: 50%; opacity: 0.4; filter: blur(60px); z-index: 0;"></div>

      <div class="card" style="width: 100%; max-width: 720px; padding: 3rem; position: relative; z-index: 10; border-radius: 2.5rem; box-shadow: var(--shadow-xl);">
        <div style="margin-bottom: 3rem;">
          <div style="height: 6px; background: var(--surface-subtle); border-radius: 100px; overflow: hidden; display: flex;">
            <div [style.width.%]="(visibleStep() / 4) * 100" style="height: 100%; background: var(--green-500); transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);"></div>
          </div>
          <div class="progress-labels">
            <span class="type-overline" [class.text-green-600]="visibleStep() >= 1">Goal</span>
            <span class="type-overline" [class.text-green-600]="visibleStep() >= 2">Profile</span>
            <span class="type-overline" [class.text-green-600]="visibleStep() >= 3">Calories</span>
            <span class="type-overline" [class.text-green-600]="visibleStep() >= 4">Preferences</span>
          </div>
        </div>

        <div *ngIf="currentStep() === 1" fbReveal="up">
          <header style="margin-bottom: 2rem;">
            <h1 class="type-display" style="font-size: 2.5rem; margin-bottom: 0.75rem;">Choose Your Goal</h1>
            <p class="type-body" style="color: var(--ink-secondary);">
              Pick the outcome you want most. FoodBot will use it to personalize your calorie target.
            </p>
          </header>

          <div class="goal-grid" fbStagger>
            <button
              *ngFor="let goal of goalOptions"
              type="button"
              class="goal-card"
              [class.active]="selectedGoal() === goal.key"
              (click)="selectGoal(goal.key)">
              <span class="goal-card__eyebrow">Goal</span>
              <strong class="goal-card__title">{{ goal.label }}</strong>
              <span class="goal-card__body">{{ goal.summary }}</span>
            </button>
          </div>

          <div class="flex justify-end mt-12">
            <button (click)="nextStep()" class="btn-green" style="width: 100%; border-radius: 1rem; padding: 1.25rem;">Next: Your Details</button>
          </div>
        </div>

        <div *ngIf="currentStep() === 2" fbReveal="up">
          <header style="margin-bottom: 2rem;">
            <h1 class="type-display" style="font-size: 2.5rem; margin-bottom: 0.75rem;">Tell Us About You</h1>
            <p class="type-body" style="color: var(--ink-secondary);">
              These details help estimate your BMR and TDEE so your calorie target feels personal rather than guessed.
            </p>
          </header>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4" fbStagger>
            <div>
              <label class="form-label">Sex</label>
              <select [(ngModel)]="personalMetrics.sex" class="form-input">
                <option [ngValue]="null">Select sex</option>
                <option *ngFor="let option of sexOptions" [ngValue]="option.key">{{ option.label }}</option>
              </select>
            </div>
            <div>
              <label class="form-label">Activity level</label>
              <select [(ngModel)]="personalMetrics.activityLevel" class="form-input">
                <option *ngFor="let option of activityOptions" [ngValue]="option.key">{{ option.label }}</option>
              </select>
            </div>
            <div>
              <label class="form-label">Age</label>
              <input [(ngModel)]="personalMetrics.ageYears" type="number" class="form-input" min="16" max="100" placeholder="e.g. 29">
            </div>
            <div>
              <label class="form-label">Height</label>
              <div class="relative">
                <input [(ngModel)]="personalMetrics.heightCm" type="number" class="form-input" min="120" max="230" placeholder="e.g. 170" style="padding-right: 3rem;">
                <span class="field-unit">cm</span>
              </div>
            </div>
            <div class="sm:col-span-2">
              <label class="form-label">Weight</label>
              <div class="relative">
                <input [(ngModel)]="personalMetrics.weightKg" type="number" class="form-input" min="35" max="300" step="0.1" placeholder="e.g. 72.5" style="padding-right: 3rem;">
                <span class="field-unit">kg</span>
              </div>
            </div>
          </div>

          <div class="helper-card" style="margin-top: 1rem;">
            <strong>Why we ask</strong>
            <p>FoodBot uses your age, height, weight, sex, and activity level to estimate your daily energy needs before adjusting for your goal.</p>
          </div>

          <div class="flex gap-4 mt-12">
            <button (click)="prevStep()" class="btn-outline" style="flex: 1; border-radius: 1rem; padding: 1.25rem;">Back</button>
            <button (click)="nextStep()" class="btn-green" style="flex: 2; border-radius: 1rem; padding: 1.25rem;" [disabled]="!canCalculateRecommendation()">Next: Personalized Calories</button>
          </div>
        </div>

        <div *ngIf="currentStep() === 3" fbReveal="up">
          <header style="margin-bottom: 2rem;">
            <h1 class="type-display" style="font-size: 2.5rem; margin-bottom: 0.75rem;">Your Personalized Recommendation</h1>
            <p class="type-body" style="color: var(--ink-secondary);">
              Calories are the energy your body gets from food. This daily total helps FoodBot guide your tracker, meal plan, and dashboard.
            </p>
          </header>

          <section class="recommendation-card" *ngIf="recommendation() as rec">
            <div>
              <span class="recommendation-card__eyebrow">Recommended for {{ activeGoalPreset().label | lowercase }}</span>
              <h2 class="recommendation-card__value">{{ goals.calories }} kcal</h2>
              <p class="recommendation-card__body">{{ activeGoalPreset().summary }}</p>
            </div>
            <div class="recommendation-card__stats">
              <p>BMR {{ rec.bmr }} kcal</p>
              <p>TDEE {{ rec.tdee }} kcal</p>
              <button type="button" class="btn-outline" style="border-radius: 999px; margin-top: 0.75rem;" (click)="resetToRecommendation()">Reset to recommendation</button>
            </div>
          </section>

          <div class="helper-grid" style="margin-top: 1rem;">
            <div class="helper-card">
              <strong>What this means</strong>
              <p>Lower targets usually support weight loss, middle targets support maintenance, and higher targets support weight or muscle gain.</p>
            </div>
            <div class="helper-card">
              <strong>Example day</strong>
              <p>This is your total for the full day, not per meal.</p>
            </div>
          </div>

          <details class="helper-details">
            <summary>Why this number?</summary>
            <p>
              FoodBot estimated your baseline energy needs from your profile, then adjusted that number for your goal. You can fine-tune it now and change it later in Profile.
            </p>
          </details>

          <p class="type-body-s" style="margin-top: 1rem; color: var(--ink-secondary);">
            Not sure? Start with our recommendation. You can change this later in Profile.
          </p>

          <div class="space-y-6" style="margin-top: 2rem;" fbStagger>
            <div class="manual-edit-card">
              <div class="flex justify-between items-center mb-2">
                <label class="form-label" style="margin: 0;">Daily Calories</label>
                <span style="font-weight: 800; color: var(--green-600);">{{ goals.calories }} kcal</span>
              </div>
              <input type="number" class="form-input" [ngModel]="goals.calories" (ngModelChange)="updateGoalField('calories', $event)" min="1200" max="4200" step="10">
              <input type="range" [ngModel]="goals.calories" (ngModelChange)="updateGoalField('calories', $event)" min="1200" max="4200" step="10" class="w-full accent-green-600" style="margin-top: 1rem;">
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="card-stat" style="padding: 1rem;">
                <label class="form-label" style="font-size: 0.7rem;">Protein (g)</label>
                <input type="number" class="form-input" style="text-align: center;" [ngModel]="goals.protein" (ngModelChange)="updateGoalField('protein', $event)">
              </div>
              <div class="card-stat" style="padding: 1rem;">
                <label class="form-label" style="font-size: 0.7rem;">Carbs (g)</label>
                <input type="number" class="form-input" style="text-align: center;" [ngModel]="goals.carbs" (ngModelChange)="updateGoalField('carbs', $event)">
              </div>
              <div class="card-stat" style="padding: 1rem;">
                <label class="form-label" style="font-size: 0.7rem;">Fat (g)</label>
                <input type="number" class="form-input" style="text-align: center;" [ngModel]="goals.fat" (ngModelChange)="updateGoalField('fat', $event)">
              </div>
            </div>
          </div>

          <div class="flex gap-4 mt-12">
            <button (click)="prevStep()" class="btn-outline" style="flex: 1; border-radius: 1rem; padding: 1.25rem;">Back</button>
            <button (click)="nextStep()" class="btn-green" style="flex: 2; border-radius: 1rem; padding: 1.25rem;">Next: Preferences</button>
          </div>
        </div>

        <div *ngIf="currentStep() === 4" fbReveal="up">
          <header style="margin-bottom: 2.5rem;">
            <h1 class="type-display" style="font-size: 2.5rem; margin-bottom: 0.75rem;">Dietary Preferences</h1>
            <p class="type-body" style="color: var(--ink-secondary);">Select up to {{ maxDietaryPreferences }} dietary patterns you follow or prefer.</p>
          </header>

          <div class="flex flex-wrap gap-2" fbStagger>
            <button *ngFor="let pref of dietaryOptions" (click)="togglePref(pref.key)"
                    class="tag-selection"
                    [class.active]="preferences.includes(pref.key)"
                    [class.disabled]="isPreferenceDisabled(pref.key)"
                    [disabled]="isPreferenceDisabled(pref.key)">
              {{ pref.label }}
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

        <div *ngIf="currentStep() === 5" style="text-align: center;" fbReveal="scale-up">
          <div style="width: 120px; height: 120px; background: var(--green-50); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 2.5rem;">
            <span style="font-size: 3.5rem;">OK</span>
          </div>
          <h1 class="type-display" style="font-size: 2.5rem; margin-bottom: 1rem;">You're All Set</h1>
          <p class="type-body" style="color: var(--ink-secondary); margin-bottom: 3rem;">
            Your goal, profile details, calorie target, and food preferences are saved.
          </p>

          <button (click)="finish()" class="btn-green" style="width: 100%; border-radius: 1rem; padding: 1.25rem;">Go to Dashboard</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .progress-labels {
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;
      margin-top: 0.75rem;
      flex-wrap: wrap;
    }
    .goal-grid {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    }
    .goal-card {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      text-align: left;
      padding: 1.25rem;
      border-radius: 1.5rem;
      border: 1.5px solid var(--border-default);
      background: linear-gradient(180deg, var(--surface-base) 0%, var(--surface-subtle) 100%);
      transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .goal-card:hover {
      transform: translateY(-2px);
      border-color: var(--green-300);
      box-shadow: var(--shadow-md);
    }
    .goal-card.active {
      border-color: var(--green-500);
      box-shadow: 0 16px 30px -18px rgba(22, 198, 90, 0.75);
      background: linear-gradient(180deg, #f7fff9 0%, #edfff2 100%);
    }
    .goal-card__eyebrow,
    .recommendation-card__eyebrow {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--ink-secondary);
    }
    .goal-card__title {
      font-size: 1.125rem;
      color: var(--ink-primary);
    }
    .goal-card__body,
    .recommendation-card__body,
    .recommendation-card__stats p,
    .helper-card p,
    .helper-details p {
      color: var(--ink-secondary);
      margin: 0;
    }
    .recommendation-card {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.5rem;
      border-radius: 1.75rem;
      background: linear-gradient(135deg, #f1fff5 0%, #f8fffb 100%);
      border: 1px solid #cfeeda;
    }
    .recommendation-card__stats {
      text-align: right;
      min-width: 10rem;
    }
    .recommendation-card__value {
      font-size: clamp(2rem, 6vw, 3rem);
      line-height: 1;
      margin: 0.5rem 0;
      color: var(--green-700);
    }
    .helper-grid {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }
    .helper-card,
    .manual-edit-card,
    .helper-details {
      padding: 1rem 1.25rem;
      border-radius: 1.25rem;
      border: 1px solid var(--border-default);
      background: var(--surface-base);
    }
    .helper-details summary {
      cursor: pointer;
      font-weight: 700;
      color: var(--ink-primary);
    }
    .field-unit {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--ink-placeholder);
      font-size: 0.75rem;
    }
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
    @media (max-width: 640px) {
      .recommendation-card {
        flex-direction: column;
      }
      .recommendation-card__stats {
        text-align: left;
      }
    }
  `]
})
export class OnboardingPageComponent {
  readonly maxDietaryPreferences = 3;
  readonly goalOptions: { key: GoalIntent; label: string; summary: string }[] = [
    { key: 'lose', label: 'Lose weight', summary: 'Create a small calorie deficit for steady fat loss.' },
    { key: 'maintain', label: 'Maintain weight', summary: 'Stay close to the calories your body likely uses each day.' },
    { key: 'gain', label: 'Gain weight', summary: 'Add extra fuel to support muscle or intentional weight gain.' }
  ];
  readonly goalPresets: Record<GoalIntent, GoalPreset> = {
    lose: { label: 'weight loss', summary: 'A reduced target based on your estimated daily energy needs.' },
    maintain: { label: 'maintenance', summary: 'A balanced target based on your estimated daily energy needs.' },
    gain: { label: 'weight gain', summary: 'An increased target based on your estimated daily energy needs.' }
  };
  readonly sexOptions: { key: Sex; label: string }[] = [
    { key: 'female', label: 'Female' },
    { key: 'male', label: 'Male' }
  ];
  readonly activityOptions: { key: ActivityLevel; label: string }[] = [
    { key: 'sedentary', label: 'Sedentary' },
    { key: 'light', label: 'Lightly active' },
    { key: 'moderate', label: 'Moderately active' },
    { key: 'very_active', label: 'Very active' }
  ];

  private userService = inject(UserService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  currentStep = signal(1);
  loading = signal(false);
  selectedGoal = signal<GoalIntent>('maintain');

  personalMetrics: {
    sex: Sex | null;
    ageYears: number | null;
    heightCm: number | null;
    weightKg: number | null;
    activityLevel: ActivityLevel;
  } = {
    sex: null,
    ageYears: null,
    heightCm: null,
    weightKg: null,
    activityLevel: 'moderate'
  };

  goals = {
    calories: 2200,
    protein: 150,
    carbs: 220,
    fat: 70
  };

  private goalFieldTouched: Record<GoalField, boolean> = {
    calories: false,
    protein: false,
    carbs: false,
    fat: false
  };

  preferences: string[] = [];

  dietaryOptions = [
    { key: 'Nigerian', label: 'Nigerian Cuisine' },
    { key: 'Vegetarian', label: 'Vegetarian' },
    { key: 'Vegan', label: 'Vegan' },
    { key: 'Keto', label: 'Keto' },
    { key: 'Halal', label: 'Halal' },
    { key: 'High Protein', label: 'High Protein' },
    { key: 'Weight Loss', label: 'Weight Loss' }
  ];

  visibleStep(): number {
    return Math.min(this.currentStep(), 4);
  }

  activeGoalPreset(): GoalPreset {
    return this.goalPresets[this.selectedGoal()];
  }

  recommendation(): Recommendation | null {
    if (!this.canCalculateRecommendation()) {
      return null;
    }

    const sexAdjustment = this.personalMetrics.sex === 'male' ? 5 : -161;
    const bmrBase = (10 * this.personalMetrics.weightKg!)
      + (6.25 * this.personalMetrics.heightCm!)
      - (5 * this.personalMetrics.ageYears!);
    const bmr = Math.round(bmrBase + sexAdjustment);
    const tdee = Math.round(bmr * this.activityMultiplier(this.personalMetrics.activityLevel));
    const calories = this.clampCalories(this.adjustCaloriesForGoal(tdee, this.selectedGoal()));
    const proteinMultiplier = this.selectedGoal() === 'maintain' ? 1.8 : 2.0;
    const protein = Math.round(Math.max(this.personalMetrics.weightKg! * proteinMultiplier, calories * 0.24 / 4));
    const fatRatio = this.selectedGoal() === 'lose' ? 0.25 : 0.27;
    const fat = Math.round(Math.max(this.personalMetrics.weightKg! * 0.8, calories * fatRatio / 9));
    const carbs = Math.max(0, Math.round((calories - (protein * 4) - (fat * 9)) / 4));

    return { calories, protein, carbs, fat, bmr, tdee };
  }

  canCalculateRecommendation(): boolean {
    return !!this.personalMetrics.sex
      && !!this.personalMetrics.ageYears
      && !!this.personalMetrics.heightCm
      && !!this.personalMetrics.weightKg;
  }

  selectGoal(goal: GoalIntent) {
    this.selectedGoal.set(goal);
    this.applyRecommendation();
  }

  nextStep() {
    if (this.currentStep() === 2) {
      this.applyRecommendation();
    }

    if (this.currentStep() === 4) {
      this.submit();
      return;
    }

    this.currentStep.set(this.currentStep() + 1);
  }

  prevStep() {
    this.currentStep.set(this.currentStep() - 1);
  }

  updateGoalField(field: GoalField, value: number | string) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return;
    }

    this.goalFieldTouched[field] = true;
    const normalized = field === 'calories'
      ? this.clampCalories(parsed)
      : Math.max(0, Math.round(parsed));
    this.goals[field] = normalized;
  }

  resetToRecommendation() {
    this.goalFieldTouched = {
      calories: false,
      protein: false,
      carbs: false,
      fat: false
    };
    this.applyRecommendation(true);
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
      goalIntent: this.selectedGoal(),
      sex: this.personalMetrics.sex,
      ageYears: this.personalMetrics.ageYears,
      heightCm: this.personalMetrics.heightCm,
      weightKg: this.personalMetrics.weightKg,
      activityLevel: this.personalMetrics.activityLevel,
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

  private applyRecommendation(forceAll = false) {
    const recommendation = this.recommendation();
    if (!recommendation) {
      return;
    }

    this.setGoalFromRecommendation('calories', recommendation.calories, forceAll);
    this.setGoalFromRecommendation('protein', recommendation.protein, forceAll);
    this.setGoalFromRecommendation('carbs', recommendation.carbs, forceAll);
    this.setGoalFromRecommendation('fat', recommendation.fat, forceAll);
  }

  private setGoalFromRecommendation(field: GoalField, value: number, forceAll: boolean) {
    if (forceAll || !this.goalFieldTouched[field]) {
      this.goals[field] = value;
    }
  }

  private activityMultiplier(level: ActivityLevel): number {
    return {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      very_active: 1.725
    }[level];
  }

  private adjustCaloriesForGoal(tdee: number, goal: GoalIntent): number {
    if (goal === 'lose') {
      return tdee - 450;
    }

    if (goal === 'gain') {
      return tdee + 300;
    }

    return tdee;
  }

  private clampCalories(value: number): number {
    return Math.max(1200, Math.min(4200, Math.round(value / 10) * 10));
  }

  private applyOnboardingSuccess() {
    this.currentStep.set(5);
    this.toastService.success('Onboarding completed successfully.');
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
