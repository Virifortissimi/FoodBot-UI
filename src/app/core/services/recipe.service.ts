import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Recipe {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  dietaryTags: string[];
  calories: number;
  proteinG: number;
  cuisine: string;
  carbsG: number;
  fatG: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    browseCap?: number | null;
    browseLimited?: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/recipes`;

  getRecipes(page = 1, pageSize = 12, tags: string[] = []): Observable<PaginatedResponse<Recipe>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    tags.forEach(tag => {
      params = params.append('tags', tag);
    });

    return this.http.get<PaginatedResponse<Recipe>>(this.apiUrl, { params });
  }

  getRecipeBySlug(slug: string): Observable<{ success: boolean; data: Recipe }> {
    return this.http.get<{ success: boolean; data: Recipe }>(`${this.apiUrl}/${slug}`);
  }

  searchRecipes(query: string, limit = 20): Observable<{ success: boolean; data: Recipe[]; meta?: { browseCap?: number | null; browseLimited?: boolean } }> {
    const params = new HttpParams()
      .set('q', query)
      .set('limit', limit.toString());

    return this.http.get<{ success: boolean; data: Recipe[]; meta?: { browseCap?: number | null; browseLimited?: boolean } }>(`${this.apiUrl}/search`, { params });
  }
}
