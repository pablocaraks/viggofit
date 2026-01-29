
import { WorkoutEntry } from '../types';

const STORAGE_KEY = 'viggofit_workout_data';

/**
 * Service to handle data storage.
 * Note: To connect to Google Sheets, you would replace these localStorage calls
 * with fetch requests to a Google Apps Script Web App URL.
 */
export const storageService = {
  // Save a new workout
  saveWorkout: (entry: WorkoutEntry): void => {
    const existing = storageService.getAllEntries();
    existing.push(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  },

  // Get all entries (Internal use only)
  getAllEntries: (): WorkoutEntry[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Security: Filter entries by specific User ID (Cédula)
  getEntriesByUserId: (userId: string): WorkoutEntry[] => {
    const all = storageService.getAllEntries();
    return all
      .filter(entry => entry.userId === userId)
      .sort((a, b) => a.timestamp - b.timestamp);
  },

  // Export current user data to CSV string
  exportToCSV: (userId: string): string => {
    const entries = storageService.getEntriesByUserId(userId);
    if (entries.length === 0) return '';

    const headers = ['Fecha', 'Peso Corporal', 'Musculo', 'Ejercicio', 'Peso Levantado'];
    const rows = entries.map(e => [
      e.date,
      e.bodyWeight,
      e.muscleGroup,
      e.exercise,
      e.weightLifted
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    return csvContent;
  }
};
