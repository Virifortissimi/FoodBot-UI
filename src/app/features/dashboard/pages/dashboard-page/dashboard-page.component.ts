import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { BadgeProgress, BadgeService } from '../../../../core/services/badge.service';
import { DashboardAnalyticsService } from '../../../../core/services/dashboard-analytics.service';
import { EducationService } from '../../../../core/services/education.service';
import { InsightService } from '../../../../core/services/insight.service';
import { LearningHubService } from '../../../../core/services/learning-hub.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { UserService } from '../../../../core/services/user.service';
import { FeatureEducationCardComponent } from '../../../../shared/components/feature-education-card/feature-education-card.component';
import { SettingsPanelComponent } from '../../../../shared/components/settings-panel/settings-panel.component';
import { TooltipDirective } from '../../../../shared/directives/tooltip.directive';
import { DashboardInsightCardComponent } from '../../components/insight-card/insight-card.component';

@Component({
    selector: 'app-dashboard-page',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        DashboardInsightCardComponent,
        TooltipDirective,
        FeatureEducationCardComponent,
        SettingsPanelComponent
    ],
    templateUrl: './dashboard-page.component.html',
    styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent implements OnInit {
    settingsOpen = false;
    selectedBadge: BadgeProgress | null = null;
    private readonly badgeImageByKey: Record<string, string> = {
        first_plate: 'assets/badges/first-plate.svg',
        three_day_rhythm: 'assets/badges/three-day-rhythm.svg',
        seven_day_rhythm: 'assets/badges/seven-day-rhythm.svg',
        hydration_helper: 'assets/badges/hydration-helper.svg',
        protein_builder: 'assets/badges/protein-builder.svg',
        meal_planner: 'assets/badges/meal-planner.svg',
        week_architect: 'assets/badges/week-architect.svg',
        smart_shopper: 'assets/badges/smart-shopper.svg',
        cart_finisher: 'assets/badges/cart-finisher.svg',
        recipe_explorer: 'assets/badges/recipe-explorer.svg',
        learning_starter: 'assets/badges/learning-starter.svg',
        nutrition_learner: 'assets/badges/nutrition-learner.svg'
    };

    quickActions = [
        { id: 'planner', kicker: 'Plan', label: 'Plan My Week', desc: 'Build or refine your weekly meals.', link: '/meal-planner' },
        { id: 'chat', kicker: 'Chat', label: 'Recipe Chat', desc: 'Find recipes from ingredients you already have.', link: '/recipe-chat' },
        { id: 'nutrition', kicker: 'Track', label: 'Track Nutrition', desc: 'Log meals and stay close to your goals.', link: '/nutrition' },
        { id: 'shopping', kicker: 'Shop', label: 'Shopping List', desc: 'Generate and complete your grocery list.', link: '/shopping-list' }
    ];

    constructor(
        public userService: UserService,
        public insightService: InsightService,
        public educationService: EducationService,
        public learningService: LearningHubService,
        public themeService: ThemeService,
        public dashboardAnalyticsService: DashboardAnalyticsService,
        public badgeService: BadgeService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.userService.getProfile().subscribe();
        this.insightService.fetchInsights();
        this.educationService.fetchDismissals();
        this.learningService.fetchCourses();
        this.dashboardAnalyticsService.fetchAnalytics().subscribe();
        this.badgeService.fetchBadges().subscribe();
    }

    getTooltipContent(key: string): string {
        const normalized = key.toLowerCase();
        if (normalized.includes('calories')) return 'Calories logged today versus your configured daily calorie target.';
        if (normalized.includes('protein')) return 'Protein logged today versus your configured protein goal.';
        if (normalized.includes('water')) return 'Water logged today against the dashboard hydration target.';
        if (normalized.includes('streak')) return 'How many consecutive days you have logged at least one health entry.';
        return '';
    }

    get userName(): string {
        return this.userService.profile()?.name || this.userService.profile()?.email?.split('@')[0] || 'there';
    }

    get userInitial(): string {
        return (this.userService.profile()?.name || this.userService.profile()?.email || 'U')[0].toUpperCase();
    }

    get subscriptionTier(): string {
        return this.userService.profile()?.subscriptionTier || 'Free';
    }

    get analytics() {
        return this.dashboardAnalyticsService.analytics();
    }

    get recentBadges(): BadgeProgress[] {
        return this.badgeService.summary()?.recentlyEarned ?? [];
    }

    get nearestBadges(): BadgeProgress[] {
        const badges = this.badgeService.summary()?.badges ?? [];
        return badges
            .filter(badge => !badge.earned)
            .sort((a, b) => this.badgePercent(b) - this.badgePercent(a))
            .slice(0, 3);
    }

    get hasNutritionGoals(): boolean {
        const overview = this.analytics?.overview;
        return !!overview && (overview.calorieGoal > 0 || overview.proteinGoalG > 0);
    }

    get statCards() {
        const overview = this.analytics?.overview;
        if (!overview) {
            return [];
        }

        return [
            {
                label: 'Calories',
                value: `${overview.todayCalories.toLocaleString()} / ${overview.calorieGoal.toLocaleString()} kcal`,
                meta: `${this.getProgressPercent(overview.todayCalories, overview.calorieGoal)}% of target`,
                progress: this.getProgressPercent(overview.todayCalories, overview.calorieGoal)
            },
            {
                label: 'Protein',
                value: `${this.formatDecimal(overview.todayProteinG)} / ${this.formatDecimal(overview.proteinGoalG)} g`,
                meta: `${this.getProgressPercent(overview.todayProteinG, overview.proteinGoalG)}% of target`,
                progress: this.getProgressPercent(overview.todayProteinG, overview.proteinGoalG)
            },
            {
                label: 'Water',
                value: `${this.formatLitres(overview.todayWaterMl)} / ${this.formatLitres(overview.waterGoalMl)}`,
                meta: `${this.getProgressPercent(overview.todayWaterMl, overview.waterGoalMl)}% of target`,
                progress: this.getProgressPercent(overview.todayWaterMl, overview.waterGoalMl)
            },
            {
                label: 'Current Streak',
                value: `${overview.loggingStreakDays} day${overview.loggingStreakDays === 1 ? '' : 's'}`,
                meta: `${overview.daysLoggedThisWeek} days logged this week`,
                progress: Math.min(100, overview.loggingStreakDays * 10)
            }
        ];
    }

    get trendMaxCalories(): number {
        const weeklyTrend = this.analytics?.weeklyTrend ?? [];
        const maxCalories = Math.max(...weeklyTrend.map(point => point.calories), 0);
        return maxCalories > 0 ? maxCalories : 1;
    }

    get mealPlanSourceLabel(): string {
        const generatedBy = this.analytics?.mealPlan.generatedBy?.toLowerCase();
        return generatedBy === 'ai' ? 'AI generated' : 'Manual';
    }

    get weightSummary(): string {
        const change = this.analytics?.overview.weightChangeKg;
        if (change === null || change === undefined) {
            return 'Add at least two weight logs to unlock a trend.';
        }

        const prefix = change > 0 ? '+' : '';
        return `${prefix}${this.formatDecimal(change)} kg compared with your first weight log this week.`;
    }

    get planStatusCopy(): string {
        const plan = this.analytics?.mealPlan;
        if (!plan?.hasActivePlan) {
            return 'No active meal plan yet.';
        }

        return `${plan.plannedMeals} meals across ${plan.plannedDays} day${plan.plannedDays === 1 ? '' : 's'}.`;
    }

    get shoppingStatusCopy(): string {
        const shopping = this.analytics?.shopping;
        if (!shopping?.hasList) {
            return 'No shopping list generated yet.';
        }

        return `${shopping.checkedItems} of ${shopping.totalItems} items checked off.`;
    }

    get learningStatusCopy(): string {
        const learning = this.analytics?.learning;
        if (!learning || learning.totalLessons === 0) {
            return 'Start a course to see progress here.';
        }

        return `${learning.completedLessons} of ${learning.totalLessons} lessons completed.`;
    }

    getTrendHeight(calories: number): number {
        return Math.max(8, Math.round((calories / this.trendMaxCalories) * 100));
    }

    getProgressPercent(value: number, goal: number): number {
        if (!goal || goal <= 0) {
            return 0;
        }

        return Math.max(0, Math.min(100, Math.round((value / goal) * 100)));
    }

    badgePercent(badge: BadgeProgress): number {
        return this.getProgressPercent(badge.progressCurrent, badge.progressTarget);
    }

    dismissBadge(badge: BadgeProgress): void {
        this.badgeService.markSeen([badge.key]).subscribe();
        if (this.selectedBadge?.key === badge.key) {
            this.selectedBadge = null;
        }
    }

    getBadgeImageUrl(badge: BadgeProgress): string {
        return this.badgeImageByKey[badge.key] ?? 'assets/badges/first-plate.svg';
    }

    selectBadge(badge: BadgeProgress): void {
        this.selectedBadge = this.selectedBadge?.key === badge.key ? null : badge;
    }

    formatDecimal(value: number | null | undefined): string {
        if (value === null || value === undefined) {
            return '0';
        }

        return Number(value).toFixed(1).replace(/\.0$/, '');
    }

    formatLitres(ml: number): string {
        return `${(ml / 1000).toFixed(1)} L`;
    }

    logout(): void {
        this.authService.signOut();
    }
}
