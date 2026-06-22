import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RecipeChatService, Recipe } from '../../services/recipe-chat.service';
import { AuthService } from '../../../../core/services/auth.service';

import { TooltipDirective } from '../../../../shared/directives/tooltip.directive';

import { EducationService } from '../../../../core/services/education.service';
import { FeatureEducationCardComponent } from '../../../../shared/components/feature-education-card/feature-education-card.component';
import { ToastService } from '../../../../core/services/toast.service';
import { DayPlan, MealPlanService } from '../../../meal-planner/services/meal-plan.service';

@Component({
    selector: 'app-recipe-chat-page',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, TooltipDirective, FeatureEducationCardComponent],
    templateUrl: './recipe-chat-page.component.html',
    styleUrl: './recipe-chat-page.component.css'
})

export class RecipeChatPageComponent implements OnInit, OnDestroy, AfterViewChecked {
    @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
    private readonly autoScrollThresholdPx = 120;
    private shouldStickToBottom = true;
    private pendingAutoScroll = true;

    userInput = '';
    userName = signal('');
    savePlanModalOpen = false;
    savingRecipe = false;
    recipeToSave: Recipe | null = null;
    savePlanDays: DayPlan[] = [];
    selectedSaveDayName = '';
    private savePlanName = 'Weekly Plan';
    private savePlanWeekStart = new Date().toISOString().split('T')[0];

    private classicNames = [
        'Chef Kofi', 'Zuri Enthusiast', 'Amara Cook', 'Obinna Gourmet',
        'Abeni Foodie', 'Kwame Kitchen', 'Nia Nutritionist', 'Tunde Taste'
    ];

    suggestedPrompts = [
        '🥘 Jollof Rice',
        '🥜 Egusi Soup',
        '🍗 Doro Wat',
        '🐟 Thieboudienne'
    ];


    constructor(
        public chatService: RecipeChatService,
        private authService: AuthService,
        public educationService: EducationService,
        private toastService: ToastService,
        private mealPlanService: MealPlanService
    ) { }

    ngOnInit() {
        this.educationService.fetchDismissals();

        const user = this.authService.user();
        if (user && user.fullName) {
            this.userName.set(user.fullName);
        } else {
            const randomIndex = Math.floor(Math.random() * this.classicNames.length);
            this.userName.set(this.classicNames[randomIndex]);
        }

        this.chatService.startConnection();

        // Listen for connection status if service had it, but for now just a toast on start
        this.toastService.info('Connecting to Chef Kora...', 2000);
    }

    ngOnDestroy() {
        this.chatService.stopConnection();
    }

    ngAfterViewChecked() {
        if (this.pendingAutoScroll || this.shouldStickToBottom) {
            this.scrollToBottom();
            this.pendingAutoScroll = false;
        }
    }

    sendMessage(prompt?: string) {
        const text = prompt || this.userInput.trim();
        if (!text) return;

        this.shouldStickToBottom = true;
        this.pendingAutoScroll = true;
        this.chatService.sendMessage(this.userName(), text);
        this.userInput = '';
    }

    onScroll(): void {
        const container = this.scrollContainer?.nativeElement as HTMLDivElement | undefined;
        if (!container) {
            return;
        }

        const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
        this.shouldStickToBottom = distanceFromBottom <= this.autoScrollThresholdPx;
    }

    parseJson(json: unknown): any {
        if (json == null) {
            return [];
        }

        if (typeof json === 'object') {
            return json;
        }

        try {
            return JSON.parse(String(json));
        } catch (e) {
            return [];
        }
    }

    getTooltipContent(key: any): string {
        const k = String(key).toLowerCase();
        if (k === 'calories') return 'Your total daily energy intake. Balancing this is key to weight management.';
        if (k === 'protein') return 'Building block for muscles and keeps you full. Aim for 0.8g-1g per kg of body weight.';
        if (k === 'carbs') return 'Your body\'s main energy source. Focus on complex carbs like whole grains.';
        if (k === 'fat') return 'Essential for hormone production and vitamin absorption. Pick healthy fats (nuts, avocado).';
        if (k === 'fibre') return 'Aids digestion and regulates blood sugar. Aim for 25-30g per day.';
        if (k === 'sodium') return 'Regulates fluid balance. Excessive intake can raise blood pressure.';
        return '';
    }

    getMacroPercentage(recipe: Recipe, value: string): number {
        const nutrition = this.parseJson(recipe.nutrition);
        const calories = parseFloat(String(nutrition.Calories || 0));
        if (calories === 0) return 0;

        const v = parseFloat(value);
        const label = value.toLowerCase();

        // Approx conversion: 1g protein = 4kcal, 1g carb = 4kcal, 1g fat = 9kcal
        if (label.includes('protein')) return Math.round((v * 4 / calories) * 100);
        if (label.includes('carb')) return Math.round((v * 4 / calories) * 100);
        if (label.includes('fat')) return Math.round((v * 9 / calories) * 100);

        return 0;
    }

    openSaveRecipeModal(recipe: Recipe): void {
        this.recipeToSave = recipe;
        this.savePlanModalOpen = true;
        this.savingRecipe = true;
        this.savePlanDays = [];

        this.mealPlanService.getCurrentPlan().subscribe({
            next: response => {
                this.savingRecipe = false;
                const data = response?.data;
                this.savePlanName = data?.name || 'Weekly Plan';
                this.savePlanWeekStart = data?.weekStart || new Date().toISOString().split('T')[0];
                this.savePlanDays = this.normalizePlanDays(data);
                this.selectedSaveDayName = this.savePlanDays[0]?.name || '';

                if (!this.savePlanDays.length) {
                    this.toastService.info('Create a meal plan first, then save recipes into it.');
                }
            },
            error: () => {
                this.savingRecipe = false;
                this.toastService.error('Could not load your meal plan.');
            }
        });
    }

    closeSaveRecipeModal(): void {
        this.savePlanModalOpen = false;
        this.savingRecipe = false;
        this.recipeToSave = null;
    }

    saveRecipeToSelectedDay(): void {
        if (!this.recipeToSave || !this.selectedSaveDayName || !this.savePlanDays.length) {
            return;
        }

        const targetDay = this.savePlanDays.find(day => day.name === this.selectedSaveDayName);
        if (!targetDay) {
            this.toastService.error('Choose a meal-plan day first.');
            return;
        }

        targetDay.meals = [
            ...targetDay.meals,
            {
                id: this.createClientId(),
                title: this.recipeToSave.name,
                type: 'Saved Recipe',
                calories: this.getRecipeCalories(this.recipeToSave),
                time: Number(this.recipeToSave.prepTimeMin || 0) + Number(this.recipeToSave.cookTimeMin || 0)
            }
        ];

        this.savingRecipe = true;
        this.mealPlanService.updatePlan(this.savePlanName, JSON.stringify({ weekDays: this.savePlanDays }), this.savePlanWeekStart).subscribe({
            next: () => {
                this.savingRecipe = false;
                this.toastService.success('Recipe saved to your meal plan.');
                this.closeSaveRecipeModal();
            },
            error: () => {
                this.savingRecipe = false;
                this.toastService.error('Could not save recipe to meal plan.');
            }
        });
    }

    private scrollToBottom(): void {
        const container = this.scrollContainer?.nativeElement as HTMLDivElement | undefined;
        if (!container) {
            return;
        }

        container.scrollTop = container.scrollHeight;
    }

    private normalizePlanDays(data: any): DayPlan[] {
        const parsed = this.parsePlanPayload(data);
        const days = Array.isArray(parsed?.weekDays)
            ? parsed.weekDays
            : Array.isArray(parsed?.days)
                ? parsed.days
                : [];

        return days.map((day: any, index: number) => ({
            name: String(day?.name || day?.day || `Day ${index + 1}`).substring(0, 12),
            meals: Array.isArray(day?.meals)
                ? day.meals.map((meal: any, mealIndex: number) => ({
                    id: String(meal?.id || `${index + 1}-${mealIndex + 1}`),
                    title: meal?.title || meal?.recipeName || meal?.name || 'Meal',
                    type: meal?.type || meal?.mealType || 'Meal',
                    calories: Number(meal?.calories || meal?.caloriesKcal || 0),
                    time: Number(meal?.time || meal?.prepTimeMin || meal?.durationMinutes || 20)
                }))
                : []
        }));
    }

    private parsePlanPayload(data: any): any | null {
        if (!data) {
            return null;
        }

        if (data.weekDays || data.days) {
            return data;
        }

        if (data.planData) {
            try {
                return JSON.parse(String(data.planData).trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, ''));
            } catch {
                return null;
            }
        }

        return null;
    }

    private getRecipeCalories(recipe: Recipe): number {
        const nutrition = this.parseJson(recipe.nutrition);
        return Number.parseFloat(String(nutrition?.Calories || 0)) || 0;
    }

    private createClientId(): string {
        if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
            return crypto.randomUUID();
        }

        return `saved-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    }
}
