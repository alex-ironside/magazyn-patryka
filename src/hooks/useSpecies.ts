import { useState, useEffect } from "react";
import { Species } from "../types/Species";
import {
  getAllSpecies,
  addSpecies as addSpeciesToFirebase,
  updateSpecies as updateSpeciesInFirebase,
  deleteSpecies as deleteSpeciesFromFirebase,
  updateStockStatus as updateStockStatusInFirebase,
  subscribeToSpecies,
} from "../services/firebaseService";

export const useSpecies = (userId: string) => {
  const [species, setSpecies] = useState<Species[]>([]);
  const [filteredSpecies, setFilteredSpecies] = useState<Species[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from Firebase on mount and set up real-time listener
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const loadSpecies = async () => {
      try {
        setLoading(true);
        setError(null);

        // Initial load
        const initialSpecies = await getAllSpecies(userId);
        setSpecies(initialSpecies);
        setFilteredSpecies(initialSpecies);

        // Set up real-time listener
        const unsubscribe = subscribeToSpecies(userId, (updatedSpecies) => {
          setSpecies(updatedSpecies);
        });

        setLoading(false);

        // Cleanup subscription on unmount
        return unsubscribe;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load species");
        setLoading(false);
      }
    };

    loadSpecies();
  }, [userId]);

  // Filter species based on search criteria
  useEffect(() => {
    let filtered = [...species];

    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter) {
      filtered = filtered.filter((s) => s.type === typeFilter);
    }

    if (priceRange.min) {
      filtered = filtered.filter((s) => s.price >= parseFloat(priceRange.min));
    }

    if (priceRange.max) {
      filtered = filtered.filter((s) => s.price <= parseFloat(priceRange.max));
    }

    if (showAvailableOnly) {
      filtered = filtered.filter((s) => s.inStock);
    }

    setFilteredSpecies(filtered);
  }, [species, searchTerm, typeFilter, priceRange, showAvailableOnly]);

  const addSpecies = async (newSpecies: Omit<Species, "id" | "userId">) => {
    try {
      setError(null);
      await addSpeciesToFirebase(newSpecies, userId);
      // Real-time listener will automatically update the state
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add species");
      throw err;
    }
  };

  const updateSpecies = async (updatedSpecies: Species) => {
    try {
      setError(null);
      const { id, userId: _, ...speciesData } = updatedSpecies;
      await updateSpeciesInFirebase(id, speciesData, userId);
      // Real-time listener will automatically update the state
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update species");
      throw err;
    }
  };

  const deleteSpecies = async (id: string) => {
    try {
      setError(null);
      await deleteSpeciesFromFirebase(id, userId);
      // Real-time listener will automatically update the state
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete species");
      throw err;
    }
  };

  const updateStockStatus = async (id: string, inStock: boolean) => {
    try {
      setError(null);
      await updateStockStatusInFirebase(id, inStock, userId);
      // Real-time listener will automatically update the state
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update stock status"
      );
      throw err;
    }
  };

  return {
    species,
    filteredSpecies,
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    priceRange,
    setPriceRange,
    showAvailableOnly,
    setShowAvailableOnly,
    addSpecies,
    updateSpecies,
    deleteSpecies,
    updateStockStatus,
    loading,
    error,
  };
};
