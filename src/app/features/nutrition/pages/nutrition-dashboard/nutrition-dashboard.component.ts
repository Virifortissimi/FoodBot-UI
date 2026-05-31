import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NutritionLog, NutritionService } from '../../../../core/services/nutrition.service';
import { SeoService } from '../../../../core/services/seo.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-nutrition-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, DatePipe],
  templateUrl: './nutrition-dashboard.component.html',
  styleUrl: './nutrition-dashboard.component.css'
})
export class NutritionDashboardComponent implements OnInit {
  private seoService = inject(SeoService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  today = new Date();
  showAddModal = false;
  showWaterModal = false;
  showExerciseModal = false;
  stravaBusy = false;

  newEntry: Partial<NutritionLog> = { type: 'Dinner' };
  newWaterAmount = 500;
  newExerciseEntry: { activity?: string; durationMin?: number; caloriesBurned?: number } = {};

  constructor(public nutritionService: NutritionService) { }

  ngOnInit() {
    this.seoService.setNoIndex();
    this.nutritionService.getTodayData().subscribe();
    this.handleStravaReturn();
  }

  get mealLogs() {
    return this.nutritionService.todayLogs().filter(entry => entry.type === 'meal');
  }

  get waterLogs() {
    return this.nutritionService.todayLogs().filter(entry => entry.type === 'water');
  }

  get exerciseLogs() {
    return this.nutritionService.todayLogs().filter(entry => entry.type === 'exercise');
  }

  get totals() {
    const logs = this.mealLogs;
    return logs.reduce((acc, e) => ({
      calories: acc.calories + e.calories,
      protein: acc.protein + (e.protein || 0),
      carbs: acc.carbs + (e.carbs || 0),
      fat: acc.fat + (e.fat || 0),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }

  get exerciseTotals() {
    return this.exerciseLogs.reduce((acc, entry) => ({
      durationMin: acc.durationMin + Number(entry.durationMin || 0),
      caloriesBurned: acc.caloriesBurned + Number(entry.caloriesBurned || 0)
    }), { durationMin: 0, caloriesBurned: 0 });
  }

  get waterTotalMl() {
    return this.waterLogs.reduce((acc, entry) => acc + Number(entry.amountMl || 0), 0);
  }

  get waterTotalLitres() {
    return (this.waterTotalMl / 1000).toFixed(1);
  }

  get goals() {
    return this.nutritionService.goals() || { calories: 2000, protein: 150, carbs: 200, fat: 65 };
  }

  get calorieProgress() {
    return Math.min((this.totals.calories / this.goals.calories) * 100, 100);
  }

  get macros() {
    return [
      { label: 'Protein', icon: '🥩', current: this.totals.protein, goal: this.goals.protein, color: '#16a34a' },
      { label: 'Carbs', icon: '🌾', current: this.totals.carbs, goal: this.goals.carbs, color: '#0ea5e9' },
      { label: 'Fat', icon: '🥑', current: this.totals.fat, goal: this.goals.fat, color: '#f59e0b' },
    ];
  }

  addEntry() {
    if (!this.newEntry.name || !this.newEntry.calories) return;

    this.nutritionService.logMeal({
      name: this.newEntry.name!,
      type: this.newEntry.type || 'Snack',
      calories: Number(this.newEntry.calories) || 0,
      protein: Number(this.newEntry.protein) || 0,
      carbs: Number(this.newEntry.carbs) || 0,
      fat: Number(this.newEntry.fat) || 0,
      durationMin: 0,
      caloriesBurned: 0,
      source: 'manual'
    }).subscribe({
      next: () => this.toastService.success('Meal logged successfully!'),
      error: () => this.toastService.error('Failed to log meal.')
    });

    this.newEntry = { type: 'Dinner' };
    this.showAddModal = false;
  }

  addExerciseEntry() {
    if (!this.newExerciseEntry.activity || !this.newExerciseEntry.durationMin) {
      return;
    }

    this.nutritionService.logExercise({
      activity: this.newExerciseEntry.activity,
      durationMin: Number(this.newExerciseEntry.durationMin),
      caloriesBurned: this.newExerciseEntry.caloriesBurned ? Number(this.newExerciseEntry.caloriesBurned) : null
    }).subscribe({
      next: () => this.toastService.success('Exercise logged successfully!'),
      error: () => this.toastService.error('Failed to log exercise.')
    });

    this.newExerciseEntry = {};
    this.showExerciseModal = false;
  }

  addWaterEntry() {
    if (!this.newWaterAmount || Number(this.newWaterAmount) <= 0) {
      return;
    }

    this.nutritionService.logWater({
      amountMl: Number(this.newWaterAmount)
    }).subscribe({
      next: () => this.toastService.success('Water logged successfully!'),
      error: () => this.toastService.error('Failed to log water.')
    });

    this.newWaterAmount = 500;
    this.showWaterModal = false;
  }

  quickAddWater(amountMl: number) {
    this.nutritionService.logWater({ amountMl }).subscribe({
      next: () => this.toastService.success(`${amountMl}ml of water logged.`),
      error: () => this.toastService.error('Failed to log water.')
    });
  }

  deleteEntry(id: string) {
    this.nutritionService.deleteLog(id).subscribe({
      next: () => this.toastService.success('Log deleted.'),
      error: () => this.toastService.error('Failed to delete log.')
    });
  }

  connectStrava() {
    this.stravaBusy = true;
    this.nutritionService.getStravaConnectUrl().subscribe({
      next: response => {
        this.stravaBusy = false;
        const url = response?.data?.url;
        if (!url) {
          this.toastService.error('Strava connect URL is unavailable.');
          return;
        }

        window.location.href = url;
      },
      error: () => {
        this.stravaBusy = false;
        this.toastService.error('Failed to start Strava connection.');
      }
    });
  }

  importStrava(daysBack = 14) {
    this.stravaBusy = true;
    this.nutritionService.importStrava(daysBack).subscribe({
      next: response => {
        this.stravaBusy = false;
        const importedCount = Number(response?.data?.importedCount ?? 0);
        const skippedCount = Number(response?.data?.skippedCount ?? 0);
        this.toastService.success(`Imported ${importedCount} activity${importedCount === 1 ? '' : 'ies'}${skippedCount ? `, skipped ${skippedCount}` : ''}.`);
      },
      error: () => {
        this.stravaBusy = false;
        this.toastService.error('Failed to import Strava activities.');
      }
    });
  }

  disconnectStrava() {
    this.stravaBusy = true;
    this.nutritionService.disconnectStrava().subscribe({
      next: () => {
        this.stravaBusy = false;
        this.toastService.success('Strava disconnected.');
        this.nutritionService.getTodayData().subscribe();
      },
      error: () => {
        this.stravaBusy = false;
        this.toastService.error('Failed to disconnect Strava.');
      }
    });
  }

  private handleStravaReturn() {
    this.route.queryParamMap.subscribe(params => {
      const code = params.get('code');
      const error = params.get('error');

      if (error) {
        this.toastService.error('Strava authorization was cancelled or failed.');
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {},
          replaceUrl: true
        });
        return;
      }

      if (!code) {
        return;
      }

      this.stravaBusy = true;
      this.nutritionService.connectStrava(code).subscribe({
        next: () => {
          this.stravaBusy = false;
          this.toastService.success('Strava connected. Importing recent workouts...');
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {},
            replaceUrl: true
          });
          this.importStrava(14);
        },
        error: () => {
          this.stravaBusy = false;
          this.toastService.error('Failed to finish Strava connection.');
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {},
            replaceUrl: true
          });
        }
      });
    });
  }
}
