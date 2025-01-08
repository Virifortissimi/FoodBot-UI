export interface User {
  id: string;
  name: string;
  dietaryRestrictions: string[];
  healthGoals: string[];
  recentActivities: Activity[];
}

export interface Activity {
  type: 'recipe' | 'meal-plan' | 'consultation';
  title: string;
  timestamp: Date;
  description: string;
}