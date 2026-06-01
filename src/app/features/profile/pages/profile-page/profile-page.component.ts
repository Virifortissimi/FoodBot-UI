import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { BadgeProgress, BadgeService } from '../../../../core/services/badge.service';
import { SubscriptionService } from '../../../../core/services/subscription.service';
import { ToastService } from '../../../../core/services/toast.service';
import { UserService } from '../../../../core/services/user.service';

interface ProfileForm {
    name: string;
    email: string;
    goals: { calories: number; protein: number; carbs: number; fat: number; };
    preferences: string[];
}

@Component({
    selector: 'app-profile-page',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './profile-page.component.html',
    styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent implements OnInit {
    readonly maxDietaryPreferences = 3;
    saving = false;
    saveSuccess = false;
    cancellingSubscription = false;
    showCancelModal = false;
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
    subscription = {
        tier: 'Free',
        isActive: false,
        renewalDate: null as string | null,
        endsAt: null as string | null,
        status: 'active',
        cancelAtPeriodEnd: false,
        billingWarning: false
    };

    profileForm: ProfileForm = {
        name: '',
        email: '',
        goals: { calories: 2000, protein: 150, carbs: 200, fat: 65 },
        preferences: [],
    };

    nutritionFields = [
        { key: 'calories', label: 'Calories', unit: 'kcal' },
        { key: 'protein', label: 'Protein', unit: 'g' },
        { key: 'carbs', label: 'Carbs', unit: 'g' },
        { key: 'fat', label: 'Fat', unit: 'g' },
    ];

    dietaryOptions = [
        { key: 'Vegetarian', label: 'Vegetarian', emoji: '🥦' },
        { key: 'Vegan', label: 'Vegan', emoji: '🌱' },
        { key: 'Gluten-Free', label: 'Gluten-Free', emoji: '🌾' },
        { key: 'Dairy-Free', label: 'Dairy-Free', emoji: '🥛' },
        { key: 'Keto', label: 'Keto', emoji: '🥑' },
        { key: 'Halal', label: 'Halal', emoji: '☪️' },
        { key: 'Paleo', label: 'Paleo', emoji: '🦖' },
        { key: 'High Protein', label: 'High Protein', emoji: '💪' },
    ];

    constructor(
        private userService: UserService,
        private subscriptionService: SubscriptionService,
        private toastService: ToastService,
        public badgeService: BadgeService
    ) { }

    ngOnInit() {
        this.fetchProfile();
        this.fetchSubscription();
        this.badgeService.fetchBadges().subscribe();
    }

    fetchProfile() {
        this.userService.getProfile().subscribe(res => {
            if (res.success) {
                this.profileForm.name = res.data.name;
                this.profileForm.email = res.data.email;
                if (res.data.goals) {
                    this.profileForm.goals = { ...res.data.goals };
                }
                this.profileForm.preferences = this.normalizePreferences(res.data.dietaryPreferences ?? []);
            }
        });
    }

    isSelected(pref: { key: string }): boolean {
        return this.profileForm.preferences.includes(pref.key);
    }

    isPreferenceDisabled(pref: { key: string }): boolean {
        return !this.isSelected(pref) && this.selectedPreferenceCount >= this.maxDietaryPreferences;
    }

    togglePref(pref: { key: string }) {
        this.profileForm.preferences = this.normalizePreferences(this.profileForm.preferences);
        const idx = this.profileForm.preferences.indexOf(pref.key);
        if (idx >= 0) {
            this.profileForm.preferences.splice(idx, 1);
        } else if (this.selectedPreferenceCount >= this.maxDietaryPreferences) {
            return;
        } else {
            this.profileForm.preferences.push(pref.key);
        }
    }

    saveProfile() {
        this.saving = true;
        this.userService.updateProfile({
            name: this.profileForm.name,
            goals: this.profileForm.goals,
            dietaryPreferences: this.normalizePreferences(this.profileForm.preferences)
        }).subscribe({
            next: (res) => {
                this.saving = false;
                if (res.success) {
                    this.saveSuccess = true;
                    setTimeout(() => this.saveSuccess = false, 3000);
                }
            },
            error: () => this.saving = false
        });
    }

    discardChanges() {
        this.fetchProfile();
    }

    fetchSubscription() {
        this.userService.getSubscription().subscribe({
            next: (res) => {
                if (!res.success) return;
                this.subscription = {
                    tier: res.data.tier || 'Free',
                    isActive: !!res.data.isActive,
                    renewalDate: res.data.renewalDate || null,
                    endsAt: res.data.endsAt || null,
                    status: res.data.status || 'active',
                    cancelAtPeriodEnd: !!res.data.cancelAtPeriodEnd,
                    billingWarning: !!res.data.billingWarning
                };
            }
        });
    }

    get canCancelSubscription(): boolean {
        return this.subscription.isActive && this.normalizedSubscriptionTier !== 'free';
    }

    openCancelSubscriptionModal() {
        if (!this.canCancelSubscription || this.cancellingSubscription) {
            return;
        }

        this.showCancelModal = true;
    }

    closeCancelSubscriptionModal() {
        if (this.cancellingSubscription) {
            return;
        }

        this.showCancelModal = false;
    }

    cancelSubscription() {
        if (!this.canCancelSubscription || this.cancellingSubscription) {
            return;
        }

        this.cancellingSubscription = true;
        this.subscriptionService.cancel().pipe(
            finalize(() => {
                this.cancellingSubscription = false;
            })
        ).subscribe({
            next: (res) => {
                if (!res.success) {
                    this.toastService.error('Unable to cancel the subscription right now.');
                    return;
                }

                if (res.data.managementUrl) {
                    this.showCancelModal = false;
                    this.toastService.success(res.data.message || 'Redirecting to subscription management.');
                    window.location.href = res.data.managementUrl;
                    return;
                }

                this.showCancelModal = false;
                this.fetchSubscription();
                this.userService.getProfile().subscribe();
                this.toastService.success(res.data.message || 'Your subscription will end at the end of the current billing period.');
            },
            error: () => this.toastService.error('Unable to cancel the subscription right now.')
        });
    }

    get earnedBadges(): BadgeProgress[] {
        return (this.badgeService.summary()?.badges ?? [])
            .filter(badge => badge.earned)
            .sort((a, b) => (Date.parse(b.earnedAt || '') || 0) - (Date.parse(a.earnedAt || '') || 0));
    }

    get lockedBadges(): BadgeProgress[] {
        return (this.badgeService.summary()?.badges ?? [])
            .filter(badge => !badge.earned)
            .sort((a, b) => this.badgePercent(b) - this.badgePercent(a));
    }

    get selectedPreferenceCount(): number {
        return this.normalizePreferences(this.profileForm.preferences).length;
    }

    private get normalizedSubscriptionTier(): string {
        return (this.subscription.tier || 'Free').trim().toLowerCase();
    }

    get subscriptionDateLabel(): string | null {
        if (this.subscription.billingWarning && this.subscription.renewalDate) {
            return 'Paid access ends';
        }

        if (this.subscription.endsAt) {
            return 'Ends on';
        }

        if (this.subscription.renewalDate) {
            return 'Renews on';
        }

        return null;
    }

    get subscriptionDateValue(): string | null {
        return this.subscription.endsAt || this.subscription.renewalDate;
    }

    badgePercent(badge: BadgeProgress): number {
        if (!badge.progressTarget || badge.progressTarget <= 0) {
            return 0;
        }

        return Math.max(0, Math.min(100, Math.round((badge.progressCurrent / badge.progressTarget) * 100)));
    }

    getBadgeImageUrl(badge: BadgeProgress): string {
        return this.badgeImageByKey[badge.key] ?? 'assets/badges/first-plate.svg';
    }

    selectBadge(badge: BadgeProgress): void {
        this.selectedBadge = this.selectedBadge?.key === badge.key ? null : badge;
    }

    private normalizePreferences(preferences: string[]): string[] {
        const optionByNormalizedKey = new Map(
            this.dietaryOptions.map(option => [option.key.trim().toLowerCase(), option.key])
        );

        return preferences
            .map(preference => optionByNormalizedKey.get((preference ?? '').trim().toLowerCase()))
            .filter((preference): preference is string => !!preference)
            .filter((preference, index, all) => all.indexOf(preference) === index)
            .slice(0, this.maxDietaryPreferences);
    }
}
