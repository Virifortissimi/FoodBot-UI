import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { ClientCacheService } from './client-cache.service';

export interface ShoppingItem {
    id: string;
    name: string;
    quantity: string;
    category: string;
    isChecked: boolean;
    emoji?: string;
}

export interface ShoppingCategory {
    category: string;
    emoji: string;
    items: ShoppingItem[];
}

export interface ShoppingList {
    id: string;
    generatedAt: string;
    items: ShoppingItem[]; // Flat list from API, but we might want to group it
}

@Injectable({
    providedIn: 'root'
})
export class ShoppingListService {
    private apiUrl = `${environment.apiUrl}/shoppinglist`;
    private readonly latestCacheKey = 'shopping.latest';
    private readonly latestCacheTtlMs = 30 * 60 * 1000;

    currentList = signal<ShoppingList | null>(null);

    constructor(
        private http: HttpClient,
        private cache: ClientCacheService
    ) { }

    getLatest(): Observable<any> {
        const cached = this.cache.get<any>(this.latestCacheKey);
        if (cached?.data?.success) {
            this.currentList.set(this.normalizeList(cached.data.data));
        }

        return this.http.get<any>(`${this.apiUrl}/latest`).pipe(
            tap(res => {
                if (res.success) {
                    const normalized = this.normalizeList(res.data);
                    this.currentList.set(normalized);
                    this.cache.set(this.latestCacheKey, { ...res, data: normalized }, this.latestCacheTtlMs);
                }
            })
        );
    }

    generateList(): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/generate`, {}).pipe(
            tap(res => {
                if (res.success) this.applyMutationResult(res);
            })
        );
    }

    toggleItem(itemId: string): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/items/${itemId}/toggle`, {}).pipe(
            tap(res => {
                if (res.success) this.applyMutationResult(res);
            })
        );
    }

    setCategoryChecked(category: string, isChecked: boolean): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/categories/check-state`, {
            category,
            isChecked
        }).pipe(
            tap(res => {
                if (res.success) this.applyMutationResult(res);
            })
        );
    }

    addItem(input: { name: string; quantity: string; category: string }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/items`, input).pipe(
            tap(res => {
                if (res.success) this.applyMutationResult(res);
            })
        );
    }

    updateItem(itemId: string, input: { name: string; quantity: string; category: string; isChecked?: boolean }): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/items/${itemId}`, input).pipe(
            tap(res => {
                if (res.success) this.applyMutationResult(res);
            })
        );
    }

    deleteItem(itemId: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/items/${itemId}`).pipe(
            tap(res => {
                if (res.success) this.applyMutationResult(res);
            })
        );
    }

    updateLocalItem(itemId: string, changes: Partial<ShoppingItem>): void {
        const list = this.currentList();
        if (!list?.items) return;

        this.currentList.set({
            ...list,
            items: list.items.map((item: ShoppingItem) =>
                item.id === itemId ? { ...item, ...changes } : item
            )
        });
    }

    removeLocalItem(itemId: string): void {
        const list = this.currentList();
        if (!list?.items) return;

        this.currentList.set({
            ...list,
            items: list.items.filter((item: ShoppingItem) => item.id !== itemId)
        });
    }

    private applyMutationResult(res: any): void {
        const normalized = this.normalizeList(res.data);
        this.currentList.set(normalized);
        this.cache.set(this.latestCacheKey, { ...res, data: normalized }, this.latestCacheTtlMs);
        this.cache.remove('dashboard.analytics');
    }

    private normalizeList(data: any): ShoppingList | null {
        if (!data) {
            return null;
        }

        const rawItems = Array.isArray(data.items)
            ? data.items
            : Array.isArray(data.categories)
                ? data.categories.flatMap((category: any) =>
                    Array.isArray(category.items)
                        ? category.items.map((item: any) => ({
                            ...item,
                            category: item.category || category.category || category.name || 'Other',
                            emoji: item.emoji || category.emoji
                        }))
                        : []
                )
                : [];

        return {
            id: String(data.id || ''),
            generatedAt: data.generatedAt || data.createdAt || new Date().toISOString(),
            items: rawItems.map((item: any, index: number) => ({
                id: String(item.id || item.itemId || `${data.id || 'shopping'}-${index}`),
                name: String(item.name || item.itemName || 'Unnamed item'),
                quantity: String(item.quantity || item.amount || '1 item'),
                category: String(item.category || 'Other'),
                emoji: item.emoji ? String(item.emoji) : this.categoryLabel(item.category),
                isChecked: Boolean(item.isChecked ?? item.checked)
            }))
        };
    }

    private categoryLabel(category: unknown): string {
        const normalized = String(category || 'Other').toLowerCase();
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
}
