import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Species } from "../types/Species";

const COLLECTION_NAME = "species";

// Get all species
export const getAllSpecies = async (): Promise<Species[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("name"));
    const querySnapshot = await getDocs(q);
    const species: Species[] = [];

    querySnapshot.forEach((doc) => {
      species.push({
        id: doc.id,
        ...doc.data(),
      } as Species);
    });

    return species;
  } catch (error) {
    console.error("Error getting species:", error);
    throw error;
  }
};

// Add a new species
export const addSpecies = async (
  speciesData: Omit<Species, "id">
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), speciesData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding species:", error);
    throw error;
  }
};

// Update a species
export const updateSpecies = async (
  id: string,
  speciesData: Partial<Species>
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, speciesData);
  } catch (error) {
    console.error("Error updating species:", error);
    throw error;
  }
};

// Delete a species
export const deleteSpecies = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting species:", error);
    throw error;
  }
};

// Update stock status
export const updateStockStatus = async (
  id: string,
  inStock: boolean
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { inStock });
  } catch (error) {
    console.error("Error updating stock status:", error);
    throw error;
  }
};

// Real-time listener for species changes
export const subscribeToSpecies = (callback: (species: Species[]) => void) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy("name"));

  return onSnapshot(q, (querySnapshot) => {
    const species: Species[] = [];
    querySnapshot.forEach((doc) => {
      species.push({
        id: doc.id,
        ...doc.data(),
      } as Species);
    });
    callback(species);
  });
};
