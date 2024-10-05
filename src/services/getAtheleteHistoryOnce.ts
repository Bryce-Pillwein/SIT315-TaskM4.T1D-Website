import { db } from "@/config/firebaseConfig";
import { Athlete } from "@/types/Athlete";
import { AthleteData } from "@/types/AthleteData";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

/**
 * Fetch Athlete History from the historicalFitnessData collection (on-demand)
 * @param athlete Athlete for whom to fetch historical data.
 * @returns Promise resolving with historical data array.
 */
export default async function getAthleteHistoryOnce(athlete: Athlete): Promise<AthleteData[]> {
  try {
    const historicalDataRef = collection(db, 'historicalFitnessData');
    const q = query(
      historicalDataRef,
      where('athleteId', '==', athlete.id),
      orderBy('timestamp', 'asc')
    );

    // Perform a one-time fetch using getDocs
    const querySnapshot = await getDocs(q);
    const historicalData = querySnapshot.docs.map(doc => ({
      athleteId: doc.data().athleteId,
      name: doc.data().name,
      age: doc.data().age,
      gender: doc.data().gender,
      heartRate: doc.data().heartRate,
      maxHeartRate: doc.data().maxHeartRate,
      totalDistance: doc.data().totalDistance,
      elevationGain: doc.data().elevationGain,
      totalCalories: doc.data().totalCalories,
      timestamp: doc.data().timestamp,
      startTime: doc.data().startTime,
    }));

    return historicalData as AthleteData[];
  } catch (error) {
    console.error('Error fetching athlete history:', error);
    throw error;
  }
}
