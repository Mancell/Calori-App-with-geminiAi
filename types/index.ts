export interface FoodItem {
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  unit?: string;
  quantity?: number;
}

export interface FoodAnalysis {
  items: FoodItem[];
  totalCalories: number;
  date: string;
  imageUri?: string;
}

export interface CalorieHistory {
  id: string;
  date: string;
  totalCalories: number;
  items: FoodItem[];
  imageUri?: string;
}
