import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Recipe } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  sendMessage(message: string): Observable<string> {
    // Simulate AI response - In production, this would connect to a backend
    return of('Here are some recipe suggestions based on your ingredients...');
  }

  getRecipeSuggestions(ingredients: string[]): Observable<Recipe[]> {
    // Simulate recipe suggestions - In production, this would connect to a backend
    return of([]);
  }
}