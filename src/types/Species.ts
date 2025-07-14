export interface Species {
  id: string;
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
