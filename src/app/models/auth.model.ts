export interface AuthUser {
  id: string;
  email: string;
  name: string;
  joinedDate: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  name: string;
}

export interface UserAnalytics {
  mealPlansGenerated: number;
  recipesViewed: number;
  nutritionConsultations: number;
  chatInteractions: number;
  weeklyProgress: {
    date: Date;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }[];
}