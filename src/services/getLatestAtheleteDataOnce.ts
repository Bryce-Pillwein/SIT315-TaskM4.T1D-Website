import { db } from "@/config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Athlete } from "@/types/Athlete";
import { AthleteData } from "@/types/AthleteData";

/**
 * Fetch the latest fitness data for an athlete from the latestFitnessData collection (on-demand)
 * @param athlete The athlete for whom to fetch the latest data.
 * @returns Promise resolving with the latest athlete data or null if not found.
 */
export default async function getLatestAthleteDataOnce(athlete: Athlete): Promise<AthleteData | null> {
  try {
    const athleteDocRef = doc(db, 'latestFitnessData', athlete.id);

    // Perform a one-time fetch using getDoc
    const docSnapshot = await getDoc(athleteDocRef);

    if (docSnapshot.exists()) {
      const latestData = { ...docSnapshot.data() } as AthleteData;
      return latestData;
    } else {
      console.log(`No latest data found for athlete with id: ${athlete.id}`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching latest athlete data:', error);
    throw error;
  }
}
