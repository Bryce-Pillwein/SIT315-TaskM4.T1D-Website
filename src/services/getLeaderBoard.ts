import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { AthleteData } from "@/types/AthleteData";


/**
 * Get Leader Board
 * @returns 
 */
export default async function getLeaderBoard() {
  try {
    const athletesCollectionRef = collection(db, 'latestFitnessData');
    const athletesQuery = query(athletesCollectionRef, orderBy('totalDistance', 'desc'));
    const querySnapshot = await getDocs(athletesQuery);

    // Map the query results to an array of athlete data
    const athletesData = querySnapshot.docs.map(doc => doc.data()) as AthleteData[];

    return athletesData;
  } catch (error) {
    console.error('Error fetching and ordering athlete data:', error);
    throw error;
  }
}
