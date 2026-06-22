import { Component, EventEmitter, OnInit, Output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MealPlanService } from '../../services/meal-plan.service';
import { ParticleFieldComponent } from '../../../../shared/components/particle-field/particle-field.component';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';
import { ToastService } from '../../../../core/services/toast.service';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-meal-plan-generation',
  standalone: true,
  imports: [CommonModule, FormsModule, ParticleFieldComponent, RevealDirective],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-white/60 backdrop-blur-xl" (click)="close.emit()">
      <div class="relative w-full max-w-2xl overflow-hidden bg-white border border-[#E8E8E8] shadow-2xl rounded-3xl" 
           (click)="$event.stopPropagation()" fbReveal="scale-up">
        <!-- Ambient Design Layer -->
        <div class="dot-grid-section" aria-hidden="true"></div>
        <fb-particle-field density="sparse" variant="light" />

        @if (loading()) {
          <div class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-white/88 backdrop-blur-sm">
            <div class="w-16 h-16 border-4 border-green-100 border-t-green-500 rounded-full animate-spin"></div>
            <div class="text-center space-y-1">
              <p class="type-overline" style="color: var(--green-600); margin: 0;">Building Your Plan</p>
              <p class="type-body-s" style="margin: 0;">Balancing calories, preferences, and your week.</p>
            </div>
          </div>
        }

        <div class="relative z-10 p-12">
          <header class="mb-10 text-center">
            <span class="type-overline" style="color: var(--green-600); margin-bottom: 1rem; display: block;">AI Meal Architect</span>
            <h2 class="type-display" style="font-size: 2.25rem;">
              Generate your next<br><span style="color: var(--green-600);">perfect week.</span>
            </h2>
            <p class="type-body-s" style="margin-top: 1rem; max-width: 24rem; margin-left: auto; margin-right: auto;">
              No more stressing about "what's for dinner". Let our AI build a plan that hits your goals and satisfies your cravings.
            </p>
          </header>

          <form (ngSubmit)="generate()" class="space-y-8">
            @if (savedPreferences().length > 0) {
              <section class="profile-preferences-panel">
                <div>
                  <p class="type-overline" style="margin: 0; color: var(--green-600);">Using profile preferences</p>
                  <p class="type-body-s" style="margin: 0.25rem 0 0;">These will be included in your generated plan.</p>
                </div>
                <div class="profile-preference-chips">
                  @for (pref of savedPreferences(); track pref) {
                    <span>{{ pref }}</span>
                  }
                </div>
              </section>
            }

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-2">
                <label class="form-label">Dietary Type</label>
                <select [(ngModel)]="request.dietaryType" name="dietaryType" class="form-input">
                  <option value="balanced">🥗 Balanced</option>
                  <option value="keto">🥩 Keto</option>
                  <option value="vegan">🌱 Vegan</option>
                  <option value="paleo">🍖 Paleo</option>
                  <option value="nigerian">🇳🇬 Nigerian</option>
                </select>
              </div>

              <div class="space-y-2">
                <label class="form-label">Daily Calorie Target</label>
                <div class="relative">
                  <input type="number" [(ngModel)]="request.calorieTarget" name="calorieTarget"
                         class="form-input pr-12" placeholder="e.g. 2100">
                  <span class="absolute right-4 top-1/2 -translate-y-1/2 type-body-s" style="font-size: 0.7rem; color: var(--ink-placeholder);">kcal</span>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <label class="form-label">Plan Duration</label>
              <div class="flex gap-4">
                @for (d of [3, 7, 14]; track d) {
                  <button type="button" (click)="request.days = d"
                          [class.btn-dark]="request.days === d"
                          [class.btn-outline]="request.days !== d"
                          class="flex-1 btn-sm">
                    {{ d }} Days
                  </button>
                }
              </div>
            </div>

            <div class="pt-6 flex gap-4">
              <button type="button" (click)="close.emit()" class="flex-1 btn-outline btn-lg">
                Maybe Later
              </button>
              <button type="submit" [disabled]="loading()" class="flex-[1.8] btn-green btn-lg">
                @if (loading()) {
                  <span class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Architecting...
                } @else {
                  Generate My Week 🚀
                }
              </button>
            </div>
          </form>

          <p class="text-center type-body-s mt-6" style="font-size: 0.7rem; opacity: 0.6;">
            Generated meal plans are personalized based on your settings.
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .animate-spin { animation: spin 0.6s linear infinite; }
    .profile-preferences-panel {
      display: grid;
      gap: 0.875rem;
      padding: 1rem;
      border: 1px solid color-mix(in srgb, var(--green-500) 30%, #E8E8E8);
      border-radius: 1rem;
      background: color-mix(in srgb, var(--green-500) 6%, white);
    }
    .profile-preference-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .profile-preference-chips span {
      display: inline-flex;
      align-items: center;
      min-height: 2rem;
      padding: 0.35rem 0.75rem;
      border-radius: 999px;
      border: 1px solid color-mix(in srgb, var(--green-500) 35%, #E8E8E8);
      background: white;
      color: var(--ink-primary);
      font-size: 0.8125rem;
      font-weight: 700;
    }
  `]
})
export class MealPlanGenerationComponent implements OnInit {
  private mealPlanService = inject(MealPlanService);
  private toastService = inject(ToastService);
  private userService = inject(UserService);

  @Output() close = new EventEmitter<void>();
  @Output() generated = new EventEmitter<any>();
  loading = signal(false);
  savedPreferences = signal<string[]>([]);

  request = {
    dietaryType: 'balanced',
    allergies: [] as string[],
    calorieTarget: 2000,
    days: 7
  };

  ngOnInit(): void {
    const cachedProfile = this.userService.profile();
    if (cachedProfile) {
      this.applyProfileToRequest(cachedProfile);
    }

    this.userService.getProfile().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.applyProfileToRequest(res.data);
        }
      }
    });
  }

  generate() {
    this.loading.set(true);
    this.mealPlanService.generatePlan(this.request).subscribe({
      next: (res) => {
        setTimeout(() => {
          this.loading.set(false);
          this.generated.emit(res.data);
          this.toastService.success('AI Plan Architected! Check your new schedule.');
        }, 800);
      },
      error: (err) => {
        this.loading.set(false);
        this.toastService.error(err.error?.message || err.error?.errors?.[0] || 'The AI Architect is busy. Please try again later.');
      }
    });
  }

  private resolveDietaryType(preferences: string[]): string {
    const normalized = preferences.map(pref => pref.trim().toLowerCase());
    if (normalized.includes('keto')) return 'keto';
    if (normalized.includes('vegan')) return 'vegan';
    if (normalized.includes('paleo')) return 'paleo';
    return 'balanced';
  }

  private applyProfileToRequest(profile: any): void {
    const goals = profile.goals ?? profile.Goals;
    const calories = Number(goals?.calories ?? goals?.Calories ?? 0);
    if (calories > 0) {
      this.request.calorieTarget = calories;
    }

    const preferences = ((profile.dietaryPreferences ?? profile.DietaryPreferences ?? []) as string[])
      .filter(pref => !!pref?.trim());
    this.savedPreferences.set(preferences);

    const resolvedDietaryType = this.resolveDietaryType(preferences);
    if (resolvedDietaryType !== 'balanced') {
      this.request.dietaryType = resolvedDietaryType;
    }
  }
}
