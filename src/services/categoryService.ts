import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Category, defaultCategories } from "../types/Species";

const COLLECTION_NAME = "categories";

// Get all categories (shared across all users)
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME));
    const querySnapshot = await getDocs(q);
    const categories: Category[] = [];

    querySnapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data(),
      } as Category);
    });

    // Sort by name in JavaScript instead of Firestore
    return categories.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Error getting categories:", error);
    throw error;
  }
};

// Add a new category
export const addCategory = async (
  categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  try {
    const now = new Date().toISOString();
    // Remove undefined fields before sending to Firestore
    const dataToSave: Record<string, any> = Object.fromEntries(
      Object.entries({ ...categoryData }).filter(([_, v]) => v !== undefined)
    );

    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...dataToSave,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

// Update a category
export const updateCategory = async (
  id: string,
  categoryData: Partial<Omit<Category, "id" | "createdAt">>
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);

    // Remove undefined fields before updating Firestore
    const dataToUpdate: Record<string, any> = Object.fromEntries(
      Object.entries(categoryData).filter(([_, v]) => v !== undefined)
    );

    await updateDoc(docRef, {
      ...dataToUpdate,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

// Delete a category
export const deleteCategory = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

// Real-time listener for category changes
export const subscribeToCategories = (
  callback: (categories: Category[]) => void
) => {
  const q = query(collection(db, COLLECTION_NAME));

  return onSnapshot(q, (querySnapshot) => {
    const categories: Category[] = [];
    querySnapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data(),
      } as Category);
    });
    // Sort by name in JavaScript instead of Firestore
    callback(categories.sort((a, b) => a.name.localeCompare(b.name)));
  });
};

// Create default categories if none exist
export const createDefaultCategories = async (): Promise<void> => {
  try {
    const existingCategories = await getAllCategories();

    // Only create defaults if no categories exist
    if (existingCategories.length === 0) {
      const now = new Date().toISOString();

      for (const categoryName of defaultCategories) {
        await addDoc(collection(db, COLLECTION_NAME), {
          name: categoryName,
          createdAt: now,
          updatedAt: now,
        });
      }
    }
  } catch (error) {
    console.error("Error creating default categories:", error);
    throw error;
  }
};
