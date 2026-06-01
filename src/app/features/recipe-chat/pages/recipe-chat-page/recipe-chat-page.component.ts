import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecipeChatService, Recipe } from '../../services/recipe-chat.service';
import { AuthService } from '../../../../core/services/auth.service';

import { TooltipDirective } from '../../../../shared/directives/tooltip.directive';

import { EducationService } from '../../../../core/services/education.service';
import { FeatureEducationCardComponent } from '../../../../shared/components/feature-education-card/feature-education-card.component';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
    selector: 'app-recipe-chat-page',
    standalone: true,
    imports: [CommonModule, FormsModule, TooltipDirective, FeatureEducationCardComponent],
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
        private toastService: ToastService
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

    private scrollToBottom(): void {
        const container = this.scrollContainer?.nativeElement as HTMLDivElement | undefined;
        if (!container) {
            return;
        }

        container.scrollTop = container.scrollHeight;
    }
}
