import { Recipe } from "./recipe.model";

export interface MealPlan {
  id: string;
  userId: string;
  weekStart: Date;
  days: DayPlan[];
}

export interface DayPlan {
  date: Date;
  breakfast: Recipe;
  lunch: Recipe;
  dinner: Recipe;
  snacks: Recipe[];
}