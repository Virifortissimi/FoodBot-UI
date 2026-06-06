import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MealPlanService, Meal, DayPlan } from '../../services/meal-plan.service';
import { MealPlanGenerationComponent } from '../../components/meal-plan-generation/meal-plan-generation.component';
import { ToastService } from '../../../../core/services/toast.service';
import { inject } from '@angular/core';
import { EntitlementService } from '../../../../core/services/entitlement.service';

@Component({
  selector: 'app-planner-dashboard',
  standalone: true,
  imports: [CommonModule, DragDropModule, MealPlanGenerationComponent],
  templateUrl: './planner-dashboard.component.html',
  styleUrl: './planner-dashboard.component.css'
})
export class PlannerDashboardComponent implements OnInit {
  showGenerationModal = signal(false);
  shareMenuOpen = signal(false);
  private toastService = inject(ToastService);
  private entitlementService = inject(EntitlementService);
  private readonly dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  private readonly mealThemePalette: Record<string, Array<{
    cardBackground: string;
    borderColor: string;
    shadowColor: string;
    tagBackground: string;
    tagColor: string;
    metaColor: string;
  }>> = {
    breakfast: [
      {
        cardBackground: 'linear-gradient(180deg, rgba(255, 247, 237, 0.96), rgba(255, 255, 255, 0.98))',
        borderColor: 'rgba(251, 146, 60, 0.28)',
        shadowColor: '0 14px 28px rgba(251, 146, 60, 0.12)',
        tagBackground: '#ffedd5',
        tagColor: '#9a3412',
        metaColor: '#c2410c'
      },
      {
        cardBackground: 'linear-gradient(180deg, rgba(254, 242, 242, 0.96), rgba(255, 255, 255, 0.98))',
        borderColor: 'rgba(244, 114, 182, 0.26)',
        shadowColor: '0 14px 28px rgba(244, 114, 182, 0.12)',
        tagBackground: '#fce7f3',
        tagColor: '#9d174d',
        metaColor: '#be185d'
      },
      {
        cardBackground: 'linear-gradient(180deg, rgba(254, 249, 195, 0.92), rgba(255, 255, 255, 0.98))',
        borderColor: 'rgba(234, 179, 8, 0.24)',
        shadowColor: '0 14px 28px rgba(234, 179, 8, 0.12)',
        tagBackground: '#fef3c7',
        tagColor: '#92400e',
        metaColor: '#a16207'
      }
    ],
    lunch: [
      {
        cardBackground: 'linear-gradient(180deg, rgba(239, 246, 255, 0.98), rgba(255, 255, 255, 0.98))',
        borderColor: 'rgba(59, 130, 246, 0.22)',
        shadowColor: '0 14px 28px rgba(59, 130, 246, 0.1)',
        tagBackground: '#dbeafe',
        tagColor: '#1d4ed8',
        metaColor: '#2563eb'
      },
      {
        cardBackground: 'linear-gradient(180deg, rgba(236, 253, 245, 0.98), rgba(255, 255, 255, 0.98))',
        borderColor: 'rgba(16, 185, 129, 0.22)',
        shadowColor: '0 14px 28px rgba(16, 185, 129, 0.1)',
        tagBackground: '#d1fae5',
        tagColor: '#047857',
        metaColor: '#059669'
      },
      {
        cardBackground: 'linear-gradient(180deg, rgba(238, 242, 255, 0.98), rgba(255, 255, 255, 0.98))',
        borderColor: 'rgba(99, 102, 241, 0.2)',
        shadowColor: '0 14px 28px rgba(99, 102, 241, 0.1)',
        tagBackground: '#e0e7ff',
        tagColor: '#4338ca',
        metaColor: '#4f46e5'
      }
    ],
    dinner: [
      {
        cardBackground: 'linear-gradient(180deg, rgba(245, 243, 255, 0.98), rgba(255, 255, 255, 0.98))',
        borderColor: 'rgba(139, 92, 246, 0.24)',
        shadowColor: '0 14px 30px rgba(139, 92, 246, 0.12)',
        tagBackground: '#ede9fe',
        tagColor: '#6d28d9',
        metaColor: '#7c3aed'
      },
      {
        cardBackground: 'linear-gradient(180deg, rgba(255, 241, 242, 0.98), rgba(255, 255, 255, 0.98))',
        borderColor: 'rgba(239, 68, 68, 0.22)',
        shadowColor: '0 14px 30px rgba(239, 68, 68, 0.12)',
        tagBackground: '#ffe4e6',
        tagColor: '#be123c',
        metaColor: '#e11d48'
      },
      {
        cardBackground: 'linear-gradient(180deg, rgba(236, 253, 245, 0.98), rgba(255, 255, 255, 0.98))',
        borderColor: 'rgba(34, 197, 94, 0.22)',
        shadowColor: '0 14px 30px rgba(34, 197, 94, 0.12)',
        tagBackground: '#dcfce7',
        tagColor: '#15803d',
        metaColor: '#16a34a'
      }
    ],
    snack: [
      {
        cardBackground: 'linear-gradient(180deg, rgba(254, 242, 242, 0.98), rgba(255, 255, 255, 0.98))',
        borderColor: 'rgba(249, 115, 22, 0.22)',
        shadowColor: '0 12px 24px rgba(249, 115, 22, 0.1)',
        tagBackground: '#ffedd5',
        tagColor: '#9a3412',
        metaColor: '#ea580c'
      },
      {
        cardBackground: 'linear-gradient(180deg, rgba(250, 245, 255, 0.98), rgba(255, 255, 255, 0.98))',
        borderColor: 'rgba(168, 85, 247, 0.22)',
        shadowColor: '0 12px 24px rgba(168, 85, 247, 0.1)',
        tagBackground: '#f3e8ff',
        tagColor: '#7e22ce',
        metaColor: '#9333ea'
      },
      {
        cardBackground: 'linear-gradient(180deg, rgba(239, 246, 255, 0.98), rgba(255, 255, 255, 0.98))',
        borderColor: 'rgba(14, 165, 233, 0.22)',
        shadowColor: '0 12px 24px rgba(14, 165, 233, 0.1)',
        tagBackground: '#e0f2fe',
        tagColor: '#0369a1',
        metaColor: '#0284c7'
      }
    ],
    meal: [
      {
        cardBackground: 'linear-gradient(180deg, rgba(243, 244, 246, 0.98), rgba(255, 255, 255, 0.98))',
        borderColor: 'rgba(148, 163, 184, 0.22)',
        shadowColor: '0 12px 24px rgba(148, 163, 184, 0.1)',
        tagBackground: '#e5e7eb',
        tagColor: '#374151',
        metaColor: '#6b7280'
      }
    ]
  };
  readonly entitlements = computed(() => this.entitlementService.entitlements());
  readonly plannerBlocked = computed(() => {
    const entitlements = this.entitlements();
    return !!entitlements && !entitlements.manualMealPlanEditing.allowed;
  });
  readonly canGeneratePlan = computed(() => {
    const entitlement = this.entitlements()?.mealPlannerGeneration;
    if (!entitlement) {
      return false;
    }

    return entitlement.unlimited || entitlement.allowed;
  });
  readonly generationQuotaCopy = computed(() => {
    const entitlements = this.entitlements();
    const generation = entitlements?.mealPlannerGeneration;

    if (!entitlements || !generation) {
      return '';
    }

    if (generation.unlimited) {
      return 'Unlimited meal-plan generation on your current plan.';
    }

    if (entitlements.planKey === 'free') {
      return generation.message || 'Upgrade to Pro to unlock Meal Planner.';
    }

    return `${generation.weeklyRemaining ?? 0} weekly plans left • ${generation.monthlyRemaining ?? 0} monthly plans left`;
  });
  weekDays: DayPlan[] = [
    {
      name: 'Mon', meals: [
        { id: '1', title: 'Avocado Toast & Egg', type: 'Breakfast', time: 10, calories: 350 },
        { id: '2', title: 'Grilled Chicken Salad', type: 'Lunch', time: 15, calories: 420 },
        { id: '3', title: 'Salmon & Steamed Broccoli', type: 'Dinner', time: 25, calories: 540 },
      ]
    },
    {
      name: 'Tue', meals: [
        { id: '4', title: 'Greek Yogurt & Berries', type: 'Breakfast', time: 5, calories: 180 },
        { id: '5', title: 'Turkey Wrap', type: 'Lunch', time: 12, calories: 380 },
        { id: '6', title: 'Pasta Primavera', type: 'Dinner', time: 30, calories: 620 },
      ]
    },
    {
      name: 'Wed', meals: [
        { id: '7', title: 'Smoothie Bowl', type: 'Breakfast', time: 8, calories: 310 },
        { id: '8', title: 'Tuna Salad Sandwich', type: 'Lunch', time: 10, calories: 450 },
      ]
    },
    {
      name: 'Thu', meals: [
        { id: '9', title: 'Oatmeal & Banana', type: 'Breakfast', time: 8, calories: 290 },
        { id: '10', title: 'Lentil Soup', type: 'Lunch', time: 20, calories: 360 },
        { id: '11', title: 'Beef Stir-fry', type: 'Dinner', time: 20, calories: 580 },
      ]
    },
    {
      name: 'Fri', meals: [
        { id: '12', title: 'Scrambled Eggs & Toast', type: 'Breakfast', time: 8, calories: 320 },
        { id: '13', title: 'Caesar Salad', type: 'Lunch', time: 10, calories: 390 },
      ]
    },
    {
      name: 'Sat', meals: [
        { id: '14', title: 'Pancakes & Maple Syrup', type: 'Breakfast', time: 20, calories: 450 },
        { id: '15', title: 'Veggie Burger', type: 'Lunch', time: 15, calories: 420 },
        { id: '16', title: 'BBQ Ribs & Coleslaw', type: 'Dinner', time: 45, calories: 780 },
      ]
    },
    {
      name: 'Sun', meals: [
        { id: '17', title: 'French Toast', type: 'Breakfast', time: 15, calories: 380 },
        { id: '18', title: 'Roast Chicken & Veggies', type: 'Dinner', time: 60, calories: 650 },
      ]
    },
  ];

  get isPlanEmpty(): boolean {
    return this.weekDays.every(day => day.meals.length === 0);
  }

  get weeklyCalories(): number {
    return this.weekDays.reduce((total, day) =>
      total + day.meals.reduce((d, m) => d + m.calories, 0), 0);
  }

  sumCal(acc: number, meal: Meal): number {
    return acc + (meal.calories || 0);
  }

  getMealTheme(meal: Meal): {
    cardBackground: string;
    borderColor: string;
    shadowColor: string;
    tagBackground: string;
    tagColor: string;
    metaColor: string;
  } {
    const normalizedType = (meal.type || 'Meal').trim().toLowerCase();
    const groupKey = normalizedType.includes('breakfast')
      ? 'breakfast'
      : normalizedType.includes('lunch')
        ? 'lunch'
        : normalizedType.includes('dinner')
          ? 'dinner'
          : normalizedType.includes('snack')
            ? 'snack'
            : 'meal';
    const palette = this.mealThemePalette[groupKey] ?? this.mealThemePalette['meal'];
    const hashSeed = `${meal.title}-${meal.type}-${meal.calories}`;
    const paletteIndex = this.hashString(hashSeed) % palette.length;
    return palette[paletteIndex];
  }

  getMealEmoji(meal: Meal): string {
    const normalizedType = (meal.type || 'Meal').trim().toLowerCase();
    if (normalizedType.includes('breakfast')) return '\u{1F305}';
    if (normalizedType.includes('lunch')) return '\u2600\uFE0F';
    if (normalizedType.includes('dinner')) return '\u{1F319}';
    if (normalizedType.includes('snack')) return '\u{1F34E}';
    return '\u{1F37D}\uFE0F';
  }


  constructor(private mealPlanService: MealPlanService) { }

  ngOnInit() {
    this.entitlementService.fetchEntitlements().subscribe({
      next: () => {
        if (!this.plannerBlocked()) {
          this.loadPlan();
          return;
        }

        this.toastService.info(this.entitlements()?.mealPlannerGeneration.message || 'Meal Planner is not available on your current plan.');
      },
      error: () => {
        this.loadPlan();
      }
    });
  }

  loadPlan() {
    this.mealPlanService.getCurrentPlan().subscribe({
      next: (res) => {
        if (res.success && res.data?.planData) {
          const normalizedPlan = this.normalizePlanPayload(res.data);
          if (normalizedPlan) {
            this.weekDays = normalizedPlan;
          }
        }
      }
    });
  }

  drop(event: CdkDragDrop<Meal[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    this.savePlan();
  }

  savePlan() {
    if (this.plannerBlocked()) {
      this.toastService.warning(this.entitlements()?.manualMealPlanEditing.message || 'Meal Planner is not available on your current plan.');
      return;
    }

    const planData = JSON.stringify({ weekDays: this.weekDays });
    const weekStart = new Date().toISOString().split('T')[0]; // Simple week start logic
    this.mealPlanService.updatePlan('Weekly Plan', planData, weekStart).subscribe({
      next: () => this.toastService.success('Meal plan saved!'),
      error: (error) => this.toastService.error(this.getApiErrorMessage(error, 'Failed to save meal plan.'))
    });
  }

  onPlanGenerated(data: any) {
    this.showGenerationModal.set(false);
    const normalizedPlan = this.normalizePlanPayload(data);
    if (normalizedPlan) {
      this.weekDays = normalizedPlan;
      this.toastService.success('AI-Powered Meal Plan Generated!');
      this.savePlan();
      return;
    }

    this.toastService.error('Generated plan format was invalid.');
  }

  private normalizePlanPayload(data: any): DayPlan[] | null {
    const parsed = this.parsePlanPayload(data);
    if (!parsed) return null;

    if (Array.isArray(parsed.weekDays)) {
      return parsed.weekDays.map((day: any, index: number) => this.normalizeDayPlan(day, index));
    }

    if (Array.isArray(parsed.days)) {
      return parsed.days.map((day: any, index: number) => this.normalizeDayPlan(day, index));
    }

    return null;
  }

  private parsePlanPayload(data: any): any | null {
    if (!data) return null;

    if (data.weekDays || data.days) return data;

    if (data.planData) {
      try {
        return JSON.parse(this.stripJsonCodeFence(data.planData));
      } catch {
        return null;
      }
    }

    return null;
  }

  private normalizeDayPlan(day: any, index: number): DayPlan {
    const dayNumber = Number(day?.day);
    const name = typeof day?.name === 'string' && day.name.trim()
      ? day.name.trim().substring(0, 3)
      : this.dayNames[((Number.isFinite(dayNumber) && dayNumber > 0 ? dayNumber - 1 : index) % this.dayNames.length)];

    return {
      name,
      meals: Array.isArray(day?.meals)
        ? day.meals.map((meal: any, mealIndex: number) => this.normalizeMeal(meal, index, mealIndex))
        : []
    };
  }

  private normalizeMeal(meal: any, dayIndex: number, mealIndex: number): Meal {
    return {
      id: String(meal?.id || `${dayIndex + 1}-${mealIndex + 1}-${Math.random().toString(36).substring(2, 8)}`),
      title: meal?.title || meal?.recipeName || meal?.name || 'Meal',
      type: this.capitalizeMealType(meal?.type || meal?.mealType || 'Meal'),
      time: Number(meal?.time || meal?.prepTimeMin || meal?.durationMinutes || 20),
      calories: Number(meal?.calories || meal?.caloriesKcal || 0)
    };
  }

  private stripJsonCodeFence(value: string): string {
    return String(value)
      .trim()
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
  }

  private capitalizeMealType(value: string): string {
    const normalized = String(value || 'Meal').trim();
    return normalized ? normalized.charAt(0).toUpperCase() + normalized.slice(1) : 'Meal';
  }

  toggleShareMenu(): void {
    this.shareMenuOpen.update(current => !current);
  }

  openGenerateModal(): void {
    if (!this.canGeneratePlan()) {
      this.toastService.warning(this.entitlements()?.mealPlannerGeneration.message || 'You have reached your Meal Planner limit for this period.');
      return;
    }

    this.showGenerationModal.set(true);
  }

  async sharePlan(): Promise<void> {
    const shareText = this.buildShareText();
    const shareUrl = this.getShareUrl();

    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      await navigator.share({
        title: 'My FoodBot Meal Plan',
        text: shareText,
        url: shareUrl
      });
      this.shareMenuOpen.set(false);
      return;
    }

    this.shareTo('whatsapp');
  }

  shareTo(target: 'whatsapp' | 'x' | 'facebook' | 'email' | 'copy'): void {
    const shareText = this.buildShareText();
    const shareUrl = this.getShareUrl();
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);

    if (target === 'copy') {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`).then(() => {
        this.toastService.success('Meal plan link copied.');
      });
      this.shareMenuOpen.set(false);
      return;
    }

    const destination = target === 'whatsapp'
      ? `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`
      : target === 'x'
        ? `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
        : target === 'facebook'
          ? `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
          : `mailto:?subject=${encodeURIComponent('My FoodBot Meal Plan')}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;

    window.open(destination, '_blank', 'noopener,noreferrer');
    this.shareMenuOpen.set(false);
  }

  private buildShareText(): string {
    const daySummaries = this.weekDays
      .filter(day => day.meals.length > 0)
      .map(day => `${day.name}: ${day.meals.map(meal => meal.title).join(', ')}`)
      .slice(0, 4);

    return [
      'Here is my FoodBot meal plan for the week:',
      ...daySummaries,
      `${this.weeklyCalories.toLocaleString()} kcal planned for the week`
    ].join('\n');
  }

  private getShareUrl(): string {
    return typeof window === 'undefined'
      ? '/meal-planner'
      : `${window.location.origin}/meal-planner`;
  }

  private hashString(value: string): number {
    let hash = 0;
    for (let index = 0; index < value.length; index++) {
      hash = ((hash << 5) - hash) + value.charCodeAt(index);
      hash |= 0;
    }

    return Math.abs(hash);
  }

  private getApiErrorMessage(error: any, fallback: string): string {
    return error?.error?.message
      || error?.error?.errors?.[0]
      || fallback;
  }
}
