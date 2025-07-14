import { useState, useEffect } from "react";
import { Species } from "../types/Species";

export const useSpecies = () => {
  const [species, setSpecies] = useState<Species[]>([]);
  const [filteredSpecies, setFilteredSpecies] = useState<Species[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedSpecies = localStorage.getItem("species-data");
    if (savedSpecies) {
      const parsed = JSON.parse(savedSpecies);
      setSpecies(parsed);
      setFilteredSpecies(parsed);
    }
  }, []);

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

  const addSpecies = (newSpecies: Omit<Species, "id">) => {
    const speciesWithId: Species = {
      ...newSpecies,
      id: Date.now().toString(),
    };
    const updatedSpecies = [...species, speciesWithId];
    setSpecies(updatedSpecies);
    localStorage.setItem("species-data", JSON.stringify(updatedSpecies));
  };

  const updateSpecies = (updatedSpecies: Species) => {
    const newSpeciesList = species.map((s) =>
      s.id === updatedSpecies.id ? updatedSpecies : s
    );
    setSpecies(newSpeciesList);
    localStorage.setItem("species-data", JSON.stringify(newSpeciesList));
  };

  const deleteSpecies = (id: string) => {
    const updatedSpecies = species.filter((s) => s.id !== id);
    setSpecies(updatedSpecies);
    localStorage.setItem("species-data", JSON.stringify(updatedSpecies));
  };

  const updateStockStatus = (id: string, inStock: boolean) => {
    const updatedSpecies = species.map((s) =>
      s.id === id ? { ...s, inStock } : s
    );
    setSpecies(updatedSpecies);
    localStorage.setItem("species-data", JSON.stringify(updatedSpecies));
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
  };
};
