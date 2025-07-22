export interface Species {
  id: string;
  userId: string; // Add user ID to track ownership
  name: string;
  type: string; // This will now store the category ID
  temperatureMin?: number | null;
  temperatureMax?: number | null;
  nestHumidityMin?: number | null;
  nestHumidityMax?: number | null;
  arenaHumidityMin?: number | null;
  arenaHumidityMax?: number | null;
  changes: ChangeEntry[];
  behavior: string;
  description: string;
  price: number;
  inStock: boolean;
}

export interface ChangeEntry {
  date: string;
  type: string;
  description: string;
}

export interface Category {
  id: string;
  name: string;
  color?: string; // Optional color for UI customization
  createdAt: string;
  updatedAt: string;
}

// Default categories for new users
export const defaultCategories = [
  "Mrówki",
  "Modliszki",
  "Pająki",
  "Isopody",
  "Skoczogonki",
  "Pluskwiaki",
  "Inne",
];
