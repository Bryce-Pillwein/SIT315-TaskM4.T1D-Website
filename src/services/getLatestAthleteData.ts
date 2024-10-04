import { db } from "@/config/firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import { Athlete } from "@/types/Athlete";
import { AthleteData } from "@/types/AthleteData";

/**
 * Get the latest fitness data for an athlete from the latestFitnessData collection.
 * @param athlete The athlete for whom to fetch the latest data.
 * @param callback Function to call with the latest data.
 */
export default function getLatestAthleteData(athlete: Athlete, callback: (data: AthleteData | null) => void) {
  try {
    const athleteDocRef = doc(db, 'latestFitnessData', athlete.id);

    // Listen for real-time updates using onSnapshot
    const unsubscribe = onSnapshot(athleteDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const latestData = { ...docSnapshot.data() } as AthleteData;
        callback(latestData);
      } else {
        console.log(`No latest data found for athlete with id: ${athlete.id}`);
        callback(null);
      }
    });

    return unsubscribe; // Return the unsubscribe function
  } catch (error) {
    console.error('Error fetching latest athlete data:', error);
    throw error;
  }
}
