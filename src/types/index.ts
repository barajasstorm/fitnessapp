export interface UserSettings {
  startWeightKg: number;
  goalWeightKg: number;
  targetWeeklyLossKg?: number;
  createdAt: string;
}

export interface GymSession {
  didTrain: boolean;
  type?: 'strength' | 'cardio' | 'mixed';
  durationMin?: number;
  intensity?: 1 | 2 | 3 | 4 | 5;
}

export interface DailyEntry {
  id: string;
  date: string; // YYYY-MM-DD
  weightKg?: number;
  waistCm?: number;
  mood?: 1 | 2 | 3 | 4 | 5;
  sleepHours?: number;
  steps?: number;
  movementLevel?: 'low' | 'medium' | 'high';
  gymSession?: GymSession;
  notes?: string;
}

export interface AppData {
  settings: UserSettings | null;
  entries: DailyEntry[];
}

