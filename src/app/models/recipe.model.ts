export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string[];
  preparationTime: number;
  cookingTime: number;
  nutritionalInfo: NutritionalInfo;
  dietaryTags: string[];
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}