import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { inject } from '@angular/core';

export interface Recipe {
    id: string;
    name: string;
    description: string;
    cuisine: string;
    ingredients: string; // JSON string
    steps: string; // JSON string
    nutrition: string; // JSON string
    prepTimeMin: number;
    cookTimeMin: number;
    servings: number;
    imageUrl?: string;
    dietaryTags: string[];
}

interface BackendRecipe {
    id?: string;
    name?: string;
    description?: string;
    cuisine?: string;
    ingredients?: unknown;
    steps?: unknown;
    nutrition?: unknown;
    prepTimeMin?: number;
    cookTimeMin?: number;
    servings?: number;
    imageUrl?: string;
    dietaryTags?: string[];
}

@Injectable({
    providedIn: 'root'
})
export class RecipeChatService {
    private hubConnection?: signalR.HubConnection;
    private apiUrl = environment.apiUrl.replace('/api/v1', ''); // Assuming hubs are at root
    private readonly minimumThinkingMs = 900;
    private thinkingReadyAt = 0;
    private assistantRenderQueue = Promise.resolve();

    messages = signal<{ sender: string, content: string, recipe?: Recipe }[]>([]);
    isConnected = signal(false);
    isTyping = signal(false);
    private toastService = inject(ToastService);

    constructor(
        private authService: AuthService,
        @Inject(PLATFORM_ID) private platformId: object
    ) {
        if (isPlatformBrowser(this.platformId)) {
            this.hubConnection = new signalR.HubConnectionBuilder()
                .withUrl(`${this.apiUrl}/hubs/recipe-chat`, {
                    accessTokenFactory: async () => await this.authService.ensureValidToken() || ''
                })
                .withAutomaticReconnect()
                .build();

            this.hubConnection.on('ReceiveMessage', (sender: string, content: string) => {
                void this.queueAssistantRender(() => {
                    this.messages.update(prev => [...prev, { sender, content }]);
                });
            });

            this.hubConnection.on('ReceiveRecipe', (recipe: BackendRecipe) => {
                const normalizedRecipe = this.normalizeRecipe(recipe);
                void this.queueAssistantRender(() => {
                    this.messages.update(prev => [...prev, {
                        sender: 'Chef Kora',
                        content: `I found a great ${normalizedRecipe.cuisine} recipe for you: ${normalizedRecipe.name}!`,
                        recipe: normalizedRecipe
                    }]);
                });
            });
        }
    }

    async startConnection() {
        if (!isPlatformBrowser(this.platformId)) return;
        try {
            if (this.hubConnection) {
                await this.hubConnection.start();
                this.isConnected.set(true);
                this.toastService.success('Connected to Chef Kora.');
                console.log('SignalR Connection started');
            }
        } catch (err) {
            console.error('Error while starting hub connection: ' + err);
            this.toastService.error('Disconnected from Chef Kora. Reconnecting...');
            setTimeout(() => this.startConnection(), 5000);
        }
    }

    async stopConnection() {
        if (this.hubConnection) {
            await this.hubConnection.stop();
        }
        this.isConnected.set(false);
        this.isTyping.set(false);
    }

    async sendMessage(user: string, message: string) {
        if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
            this.messages.update(prev => [...prev, { sender: user, content: message }]);
            this.thinkingReadyAt = Date.now() + this.minimumThinkingMs;
            this.isTyping.set(true);

            try {
                await this.hubConnection.invoke('SendMessage', user, message);
            } catch (error) {
                this.isTyping.set(false);
                const messageText = this.extractErrorMessage(error);
                this.toastService.error(messageText || 'Could not send your message. Please try again.');
                throw error;
            }
        }
    }

    private queueAssistantRender(render: () => void) {
        this.assistantRenderQueue = this.assistantRenderQueue.then(async () => {
            const waitMs = Math.max(0, this.thinkingReadyAt - Date.now());

            if (waitMs > 0) {
                await new Promise(resolve => setTimeout(resolve, waitMs));
            }

            this.isTyping.set(false);
            render();
        });

        return this.assistantRenderQueue;
    }

    private normalizeRecipe(recipe: BackendRecipe): Recipe {
        return {
            id: recipe.id ?? '',
            name: recipe.name ?? 'Recipe',
            description: recipe.description ?? '',
            cuisine: recipe.cuisine ?? 'African',
            ingredients: JSON.stringify(this.normalizeIngredients(recipe.ingredients)),
            steps: JSON.stringify(this.normalizeSteps(recipe.steps)),
            nutrition: JSON.stringify(this.normalizeNutrition(recipe.nutrition)),
            prepTimeMin: recipe.prepTimeMin ?? 0,
            cookTimeMin: recipe.cookTimeMin ?? 0,
            servings: recipe.servings ?? 0,
            imageUrl: recipe.imageUrl,
            dietaryTags: Array.isArray(recipe.dietaryTags) ? recipe.dietaryTags : []
        };
    }

    private normalizeIngredients(value: unknown): string[] {
        if (!Array.isArray(value)) {
            return [];
        }

        return value
            .map(item => {
                if (typeof item === 'string') {
                    return item.trim();
                }

                if (item && typeof item === 'object') {
                    const ingredient = item as {
                        name?: string;
                        quantity?: number | string;
                        unit?: string;
                    };

                    const quantity = ingredient.quantity == null ? '' : String(ingredient.quantity).trim();
                    const unit = (ingredient.unit ?? '').trim();
                    const name = (ingredient.name ?? '').trim();
                    return [quantity, unit, name].filter(Boolean).join(' ').trim();
                }

                return '';
            })
            .filter(Boolean);
    }

    private normalizeSteps(value: unknown): string[] {
        if (!Array.isArray(value)) {
            return [];
        }

        return value
            .slice()
            .sort((a, b) => {
                const aOrder = typeof a === 'object' && a && 'order' in a ? Number((a as { order?: number }).order ?? 0) : 0;
                const bOrder = typeof b === 'object' && b && 'order' in b ? Number((b as { order?: number }).order ?? 0) : 0;
                return aOrder - bOrder;
            })
            .map(step => {
                if (typeof step === 'string') {
                    return step.trim();
                }

                if (step && typeof step === 'object') {
                    return ((step as { instruction?: string }).instruction ?? '').trim();
                }

                return '';
            })
            .filter(Boolean);
    }

    private normalizeNutrition(value: unknown): Record<string, string | number> {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            return { Calories: 0, Protein: '0g', Carbs: '0g', Fat: '0g' };
        }

        const nutrition = value as {
            calories?: number;
            Calories?: number;
            proteinG?: number;
            ProteinG?: number;
            carbsG?: number;
            CarbsG?: number;
            fatG?: number;
            FatG?: number;
        };

        const calories = nutrition.calories ?? nutrition.Calories ?? 0;
        const protein = nutrition.proteinG ?? nutrition.ProteinG ?? 0;
        const carbs = nutrition.carbsG ?? nutrition.CarbsG ?? 0;
        const fat = nutrition.fatG ?? nutrition.FatG ?? 0;

        return {
            Calories: calories,
            Protein: `${protein}g`,
            Carbs: `${carbs}g`,
            Fat: `${fat}g`
        };
    }

    private extractErrorMessage(error: unknown): string {
        let message = typeof error === 'object' && error && 'message' in error
            ? String((error as { message?: string }).message ?? '').trim()
            : '';

        if (!message) {
            return '';
        }

        message = message.replace(/^Error:\s*/i, '').trim();
        message = message.replace(/^An unexpected error occurred invoking '.*?' on the server\.\s*/i, '').trim();
        message = message.replace(/^HubException:\s*/i, '').trim();

        const entitlementMessage = 'You have reached your current plan limit for this feature';
        if (message.includes(entitlementMessage)) {
            return entitlementMessage;
        }

        return message.replace(/\.+$/, '').trim();
    }
}
