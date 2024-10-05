import { db } from "@/config/firebaseConfig";
import { Athlete } from "@/types/Athlete";
import { collection, getDocs } from "firebase/firestore";

/**
 * Fetch athlete IDs from the latestFitnessData collection (on-demand)
 * @returns Promise resolving with array of athletes.
 */
export default async function getAthleteIdsOnce(): Promise<Athlete[]> {
  try {
    const athletesCollection = collection(db, 'latestFitnessData');

    // Perform a one-time fetch using getDocs
    const snapshot = await getDocs(athletesCollection);
    const athletes = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name, // Assuming the name is stored in the document
      };
    });

    return athletes;
  } catch (error) {
    console.error('Error fetching athlete IDs:', error);
    throw error;
  }
}
