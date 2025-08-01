import { useState, useEffect } from "react";
import { Category } from "../types/Species";
import {
  getAllCategories,
  addCategory as addCategoryToFirebase,
  updateCategory as updateCategoryInFirebase,
  deleteCategory as deleteCategoryFromFirebase,
  subscribeToCategories,
} from "../services/categoryService";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load categories from Firebase on mount and set up real-time listener
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        // Create default categories if none exist
        // await createDefaultCategories();

        // Initial load
        const initialCategories = await getAllCategories();
        setCategories(initialCategories);

        // Set up real-time listener
        const unsubscribe = subscribeToCategories((updatedCategories) => {
          setCategories(updatedCategories);
        });

        setLoading(false);

        // Cleanup subscription on unmount
        return unsubscribe;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load categories"
        );
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const addCategory = async (name: string, color?: string) => {
    try {
      setError(null);
      await addCategoryToFirebase({ name, color });
      // Real-time listener will automatically update the state
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add category");
      throw err;
    }
  };

  const updateCategory = async (id: string, name: string, color?: string) => {
    try {
      setError(null);
      await updateCategoryInFirebase(id, { name, color });
      // Real-time listener will automatically update the state
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update category"
      );
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      setError(null);
      await deleteCategoryFromFirebase(id);
      // Real-time listener will automatically update the state
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete category"
      );
      throw err;
    }
  };

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryName,
    loading,
    error,
  };
};
