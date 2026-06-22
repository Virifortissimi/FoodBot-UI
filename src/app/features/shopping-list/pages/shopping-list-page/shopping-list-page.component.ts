import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ShoppingItem, ShoppingListService } from '../../../../core/services/shopping-list.service';
import { ToastService } from '../../../../core/services/toast.service';
import { EntitlementService } from '../../../../core/services/entitlement.service';

interface GroupedCategory {
    name: string;
    emoji: string;
    items: any[];
}

@Component({
    selector: 'app-shopping-list-page',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './shopping-list-page.component.html',
    styleUrl: './shopping-list-page.component.css'
})
export class ShoppingListPageComponent implements OnInit {
    generating = false;
    initialLoading = true;
    loadError = '';
    copied = false;
    itemModalOpen = false;
    savingItem = false;
    editingItem: ShoppingItem | null = null;
    itemForm = {
        name: '',
        quantity: '1 item',
        category: 'Other'
    };
    readonly shoppingCategories = ['Produce', 'Protein', 'Dairy', 'Pantry', 'Frozen', 'Bakery', 'Spices', 'Beverages', 'Other'];
    readonly quantityPresets = ['1 item', '2 items', '500g', '1 kg', '1 bunch', '1 pack'];
    shareMenuOpen = signal(false);
    categoryUpdating = signal<Record<string, boolean>>({});
    private toastService = inject(ToastService);
    private entitlementService = inject(EntitlementService);
    readonly entitlements = computed(() => this.entitlementService.entitlements());
    readonly shoppingBlocked = computed(() => {
        const entitlement = this.entitlements()?.shoppingListInteraction;
        return !!entitlement && !entitlement.allowed;
    });
    readonly canGenerateList = computed(() => {
        const entitlement = this.entitlements()?.shoppingListGeneration;
        if (!entitlement) {
            return false;
        }

        return entitlement.unlimited || entitlement.allowed;
    });
    readonly quotaCopy = computed(() => {
        const entitlements = this.entitlements();
        const generation = entitlements?.shoppingListGeneration;

        if (!entitlements || !generation) {
            return '';
        }

        if (generation.unlimited) {
            return 'Unlimited shopping-list generation on your current plan.';
        }

        if (entitlements.planKey === 'free') {
            return generation.message || 'Upgrade to Pro to unlock shopping lists.';
        }

        return `${generation.weeklyRemaining ?? 0} weekly lists left • ${generation.monthlyRemaining ?? 0} monthly lists left`;
    });

    categories = computed<GroupedCategory[]>(() => {
        const list = this.service.currentList();
        const items = list?.items;
        if (!Array.isArray(items)) return [];

        const grouped = items.reduce((acc: Record<string, GroupedCategory>, item: any) => {
            const category = item.category || 'Other';
            if (!acc[category]) {
                acc[category] = { name: category, emoji: item.emoji || this.categoryIcon(category), items: [] };
            }

            acc[category].items.push(item);
            return acc;
        }, {});

        return Object.values(grouped);
    });

    get totalCount(): number {
        return this.service.currentList()?.items.length || 0;
    }

    get checkedCount(): number {
        return this.service.currentList()?.items.filter((item: any) => item.isChecked).length || 0;
    }

    get progressPercent(): number {
        return this.totalCount === 0 ? 0 : Math.round((this.checkedCount / this.totalCount) * 100);
    }

    constructor(public service: ShoppingListService) { }

    ngOnInit(): void {
        this.loadError = '';
        this.entitlementService.fetchEntitlements().subscribe({
            next: () => {
                if (this.shoppingBlocked()) {
                    this.initialLoading = false;
                    this.toastService.info(this.entitlements()?.shoppingListInteraction?.message || 'Shopping Lists are not available on your current plan.');
                    return;
                }

                this.service.getLatest().subscribe({
                    next: () => {
                        this.loadError = '';
                        this.initialLoading = false;
                    },
                    error: (error) => {
                        this.loadError = this.getApiErrorMessage(error, 'Unable to load your shopping list right now.');
                        this.initialLoading = false;
                    }
                });
            },
            error: () => {
                this.service.getLatest().subscribe({
                    next: () => {
                        this.loadError = '';
                        this.initialLoading = false;
                    },
                    error: (error) => {
                        this.loadError = this.getApiErrorMessage(error, 'Unable to load your shopping list right now.');
                        this.initialLoading = false;
                    }
                });
            }
        });
    }

    toggleItem(item: any): void {
        if (this.shoppingBlocked()) {
            this.toastService.warning(this.entitlements()?.shoppingListInteraction.message || 'Shopping Lists are not available on your current plan.');
            return;
        }

        item.isChecked = !item.isChecked;
        this.service.toggleItem(item.id).subscribe({
            error: (error) => {
                item.isChecked = !item.isChecked;
                this.toastService.error(this.getApiErrorMessage(error, 'Unable to update your shopping list right now.'));
            }
        });
    }

    openAddItemModal(): void {
        if (this.shoppingBlocked()) {
            this.toastService.warning(this.entitlements()?.shoppingListInteraction.message || 'Shopping Lists are not available on your current plan.');
            return;
        }

        this.editingItem = null;
        this.itemForm = { name: '', quantity: '1 item', category: 'Other' };
        this.itemModalOpen = true;
    }

    openEditItemModal(item: ShoppingItem, event?: Event): void {
        event?.stopPropagation();
        if (this.shoppingBlocked()) {
            this.toastService.warning(this.entitlements()?.shoppingListInteraction.message || 'Shopping Lists are not available on your current plan.');
            return;
        }

        this.editingItem = item;
        this.itemForm = {
            name: item.name,
            quantity: item.quantity || '1 item',
            category: item.category || 'Other'
        };
        this.itemModalOpen = true;
    }

    closeItemModal(): void {
        if (this.savingItem) return;
        this.itemModalOpen = false;
        this.editingItem = null;
    }

    applyQuantityPreset(quantity: string): void {
        this.itemForm.quantity = quantity;
    }

    saveItem(): void {
        const name = this.itemForm.name.trim();
        if (!name || this.savingItem) return;

        const payload = {
            name,
            quantity: this.itemForm.quantity.trim() || '1 item',
            category: this.itemForm.category || 'Other'
        };

        this.savingItem = true;
        const request = this.editingItem
            ? this.service.updateItem(this.editingItem.id, {
                ...payload,
                isChecked: this.editingItem.isChecked
            })
            : this.service.addItem(payload);

        request.subscribe({
            next: () => {
                this.savingItem = false;
                this.itemModalOpen = false;
                this.toastService.success(this.editingItem ? 'Shopping item updated.' : 'Shopping item added.');
                this.editingItem = null;
            },
            error: error => {
                this.savingItem = false;
                this.toastService.error(this.getApiErrorMessage(error, 'Unable to save that item right now.'));
            }
        });
    }

    deleteItem(item: ShoppingItem, event?: Event): void {
        event?.stopPropagation();
        if (!item.id || this.shoppingBlocked()) return;

        const previousList = this.service.currentList();
        this.service.removeLocalItem(item.id);
        this.service.deleteItem(item.id).subscribe({
            next: () => this.toastService.success(`${item.name} removed.`),
            error: error => {
                this.service.currentList.set(previousList);
                this.toastService.error(this.getApiErrorMessage(error, 'Unable to remove that item right now.'));
            }
        });
    }

    isCategoryChecked(category: GroupedCategory): boolean {
        return category.items.length > 0 && category.items.every(item => item.isChecked);
    }

    isCategoryIndeterminate(category: GroupedCategory): boolean {
        const checkedItems = this.getCheckedItemCount(category);
        return checkedItems > 0 && checkedItems < category.items.length;
    }

    isCategoryUpdating(categoryName: string): boolean {
        return !!this.categoryUpdating()[categoryName];
    }

    getCheckedItemCount(category: GroupedCategory): number {
        return category.items.filter(item => item.isChecked).length;
    }

    toggleCategory(category: GroupedCategory): void {
        if (this.isCategoryUpdating(category.name)) {
            return;
        }

        const nextCheckedState = !this.isCategoryChecked(category);
        const previousStates = new Map<string, boolean>(
            category.items.map(item => [item.id, item.isChecked])
        );

        this.categoryUpdating.update(state => ({
            ...state,
            [category.name]: true
        }));

        category.items.forEach(item => {
            item.isChecked = nextCheckedState;
        });

        this.service.setCategoryChecked(category.name, nextCheckedState).subscribe({
            next: () => {
                this.categoryUpdating.update(state => ({
                    ...state,
                    [category.name]: false
                }));
            },
            error: () => {
                category.items.forEach(item => {
                    item.isChecked = previousStates.get(item.id) ?? false;
                });
                this.categoryUpdating.update(state => ({
                    ...state,
                    [category.name]: false
                }));
                this.toastService.error(`Unable to update ${category.name.toLowerCase()} right now.`);
            }
        });
    }

    generateList(): void {
        if (!this.canGenerateList()) {
            this.toastService.warning(this.entitlements()?.shoppingListGeneration.message || 'You have reached your Shopping List limit for this period.');
            return;
        }

        this.generating = true;
        this.loadError = '';
        this.shareMenuOpen.set(false);
        this.service.generateList().subscribe({
            next: () => {
                this.generating = false;
                this.loadError = '';
                this.entitlementService.fetchEntitlements().subscribe();
            },
            error: (error) => {
                this.generating = false;
                this.loadError = this.getApiErrorMessage(error, 'Unable to build a shopping list right now.');
                this.toastService.error(this.loadError);
            }
        });
    }

    retryLoad(): void {
        this.initialLoading = true;
        this.loadError = '';
        this.service.getLatest().subscribe({
            next: () => {
                this.initialLoading = false;
            },
            error: (error) => {
                this.initialLoading = false;
                this.loadError = this.getApiErrorMessage(error, 'Unable to load your shopping list right now.');
            }
        });
    }

    copyList(): void {
        navigator.clipboard.writeText(this.buildShareText()).then(() => {
            this.copied = true;
            setTimeout(() => this.copied = false, 2500);
        });
    }

    toggleShareMenu(): void {
        this.shareMenuOpen.update(current => !current);
    }

    async shareList(): Promise<void> {
        const shareText = this.buildShareText();
        const shareUrl = this.getShareUrl();

        if (typeof navigator !== 'undefined' && 'share' in navigator) {
            await navigator.share({
                title: 'My FoodBot Shopping List',
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
                this.toastService.success('Shopping list link copied.');
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
                    : `mailto:?subject=${encodeURIComponent('My FoodBot Shopping List')}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;

        window.open(destination, '_blank', 'noopener,noreferrer');
        this.shareMenuOpen.set(false);
    }

    private buildShareText(): string {
        const categorySummaries = this.categories()
            .slice(0, 4)
            .map(category => `${category.name}: ${category.items.map(item => `${item.name} (${item.quantity})`).join(', ')}`);

        return [
            'Here is my FoodBot shopping list:',
            ...categorySummaries,
            `${this.totalCount} items across ${this.categories().length} categories`
        ].join('\n');
    }

    private getShareUrl(): string {
        return typeof window === 'undefined'
            ? '/shopping-list'
            : `${window.location.origin}/shopping-list`;
    }

    private categoryIcon(category: string): string {
        const normalized = category.toLowerCase();
        if (normalized.includes('produce')) return 'Produce';
        if (normalized.includes('protein') || normalized.includes('meat')) return 'Protein';
        if (normalized.includes('dairy')) return 'Dairy';
        if (normalized.includes('pantry')) return 'Pantry';
        if (normalized.includes('frozen')) return 'Frozen';
        if (normalized.includes('bakery')) return 'Bakery';
        if (normalized.includes('spice')) return 'Spices';
        if (normalized.includes('beverage')) return 'Beverages';
        return 'Other';
    }

    private getApiErrorMessage(error: any, fallback: string): string {
        return error?.error?.message
            || error?.error?.errors?.[0]
            || fallback;
    }
}
