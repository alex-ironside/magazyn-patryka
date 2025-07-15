export interface Species {
  id: string;
  userId: string; // Add user ID to track ownership
  name: string;
  type: string;
  temperature: string;
  nestHumidity: string;
  arenaHumidity: string;
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

export const speciesTypes = [
  "Mrówki",
  "Modliszki",
  "Pająki",
  "Isopody",
  "Skoczogonki",
  "Pluskwiaki",
  "Inne",
];
