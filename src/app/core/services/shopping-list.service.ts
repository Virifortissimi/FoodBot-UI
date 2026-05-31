import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';

export interface ShoppingItem {
    id: string;
    name: string;
    quantity: string;
    isChecked: boolean;
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

    currentList = signal<any | null>(null);

    constructor(private http: HttpClient) { }

    getLatest(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/latest`).pipe(
            tap(res => {
                if (res.success) this.currentList.set(res.data);
            })
        );
    }

    generateList(): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/generate`, {}).pipe(
            tap(res => {
                if (res.success) this.currentList.set(res.data);
            })
        );
    }

    toggleItem(itemId: string): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/items/${itemId}/toggle`, {});
    }

    setCategoryChecked(category: string, isChecked: boolean): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/categories/check-state`, {
            category,
            isChecked
        });
    }
}
