
export interface WorkoutEntry {
  id: string;
  userId: string;
  date: string;
  bodyWeight: number;
  muscleGroup: string;
  exercise: string;
  weightLifted: number;
  timestamp: number;
}

export enum MuscleGroup {
  Pecho = 'Pecho',
  Espalda = 'Espalda',
  Pierna = 'Pierna',
  Hombros = 'Hombros',
  Brazos = 'Brazos',
  Core = 'Core',
  CuerpoCompleto = 'Cuerpo Completo'
}
