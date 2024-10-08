/**
 * Athlete Data
 */
export interface AthleteData {
  athleteId: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  heartRate: number;
  maxHeartRate: number;
  totalDistance: number;
  elevationGain: number;
  totalCalories: number;
  timestamp: string;
  startTime?: Date;
}