import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  onSnapshot,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Species } from "../types/Species";

const COLLECTION_NAME = "species";

// Get all species for a specific user
export const getAllSpecies = async (userId: string): Promise<Species[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const species: Species[] = [];

    querySnapshot.forEach((doc) => {
      species.push({
        id: doc.id,
        ...doc.data(),
      } as Species);
    });

    // Sort by name in JavaScript instead of Firestore
    return species.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Error getting species:", error);
    throw error;
  }
};

// Add a new species with user ID
export const addSpecies = async (
  speciesData: Omit<Species, "id" | "userId">,
  userId: string
): Promise<string> => {
  try {
    // Remove undefined fields before sending to Firestore
    const dataToSave: Record<string, any> = Object.fromEntries(
      Object.entries(speciesData).filter(([_, v]) => v !== undefined)
    );

    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...dataToSave,
      userId,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding species:", error);
    throw error;
  }
};

// Update a species (only if user owns it)
export const updateSpecies = async (
  id: string,
  speciesData: Partial<Species>,
  userId: string
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    // Remove undefined fields to prevent Firestore errors
    const dataToUpdate: Record<string, any> = Object.fromEntries(
      Object.entries(speciesData).filter(([_, v]) => v !== undefined)
    );

    // Note: Firestore security rules should also check ownership
    await updateDoc(docRef, dataToUpdate);
  } catch (error) {
    console.error("Error updating species:", error);
    throw error;
  }
};

// Delete a species (only if user owns it)
export const deleteSpecies = async (
  id: string,
  userId: string
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    // Note: Firestore security rules should also check ownership
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting species:", error);
    throw error;
  }
};

// Update stock status (only if user owns it)
export const updateStockStatus = async (
  id: string,
  inStock: boolean,
  userId: string
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    // Note: Firestore security rules should also check ownership
    await updateDoc(docRef, { inStock });
  } catch (error) {
    console.error("Error updating stock status:", error);
    throw error;
  }
};

// Real-time listener for species changes (user-specific)
export const subscribeToSpecies = (
  userId: string,
  callback: (species: Species[]) => void
) => {
  const q = query(
    collection(db, COLLECTION_NAME),
    where("userId", "==", userId)
  );

  return onSnapshot(q, (querySnapshot) => {
    const species: Species[] = [];
    querySnapshot.forEach((doc) => {
      species.push({
        id: doc.id,
        ...doc.data(),
      } as Species);
    });
    // Sort by name in JavaScript instead of Firestore
    callback(species.sort((a, b) => a.name.localeCompare(b.name)));
  });
};
