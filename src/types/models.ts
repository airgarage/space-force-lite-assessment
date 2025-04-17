export interface Car {
  plate: string;
  state: string; // US state abbreviation (e.g., "AZ", "FL"). For simplicity, we'll use a string instead of a type.
}

export interface Violation {
  id: string;
  car: Car;
  location: string;
  date: string;
  resolved: boolean;
} 