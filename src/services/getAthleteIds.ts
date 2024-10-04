import { db } from "@/config/firebaseConfig";
import { Athlete } from "@/types/Athlete";
import { collection, onSnapshot } from "firebase/firestore";

/**
 * Get real-time athlete IDs from the latestFitnessData collection
 * @param callback Function to call with updated athlete IDs
 */
export default function getAthleteIds(callback: (athletes: Athlete[]) => void) {
  const athletesCollection = collection(db, 'latestFitnessData');

  const unsubscribe = onSnapshot(athletesCollection, (snapshot) => {
    const athletes = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name, // Assuming the name is stored in the document
      };
    });
    callback(athletes);
  });

  return unsubscribe;
}
