import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

/**
 * Delete all documents from database.
 * For testing purposes
 */
export default async function deleteAll() {
  try {
    // Purge historicalFitnessData
    await deleteCollection('historicalFitnessData');

    // Purge latestFitnessData
    await deleteCollection('latestFitnessData');

    console.log('All documents deleted from both collections');
  } catch (error) {
    console.error('Error deleting documents:', error);
  }
}


/**
 * Delete Collection
 * @param collectionName 
 */
async function deleteCollection(collectionName: string) {
  const dataCollection = collection(db, collectionName);
  const querySnapshot = await getDocs(dataCollection);

  const deletePromises = querySnapshot.docs.map((document) =>
    deleteDoc(doc(db, collectionName, document.id))
  );

  await Promise.all(deletePromises);
  console.log(`All documents deleted from ${collectionName}`);
}