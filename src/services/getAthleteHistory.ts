import { db } from "@/config/firebaseConfig";
import { Athlete } from "@/types/Athlete";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";

/**
 * Get real-time Athlete History from the historicalFitnessData collection
 * @param athleteId 
 * @param callback Function to call with updated historical data
 */
export default function getAthleteHistory(athlete: Athlete, callback: (data: any[]) => void) {
  try {
    const historicalDataRef = collection(db, 'historicalFitnessData');
    const q = query(historicalDataRef,
      where('athleteId', '==', athlete.id),
      orderBy('timestamp', 'asc'));

    // Listen for real-time updates using onSnapshot
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const historicalData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      callback(historicalData);
    });

    return unsubscribe; // Return the unsubscribe function
  } catch (error) {
    console.error('Error fetching athlete history:', error);
    throw error;
  }
}
