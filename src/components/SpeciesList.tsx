import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Fab,
  Alert,
  Button,
} from "@mui/material";
import {
  SearchFilters,
  SpeciesTable,
  SpeciesForm,
  Notification,
  CategoryManager,
} from "./index";
import { AddIcon, SettingsIcon } from "../icons/CustomIcons";
import { useSpecies, useAuth, useCategories } from "../hooks";
import { Species } from "../types/Species";

export const SpeciesList: React.FC = () => {
  const { user } = useAuth();
  const {
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
    loading: speciesLoading,
    error: speciesError,
  } = useSpecies(user?.uid || "");

  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryName,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingSpecies, setEditingSpecies] = useState<Species | null>(null);
  const [openCategoryManager, setOpenCategoryManager] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleSubmit = async (data: any) => {
    try {
      const newSpecies: Omit<Species, "id" | "userId"> = {
        name: data.name,
        type: data.type,
        temperatureMin:
          data.temperatureMin && data.temperatureMin.trim() !== ""
            ? parseFloat(data.temperatureMin)
            : null,
        temperatureMax:
          data.temperatureMax && data.temperatureMax.trim() !== ""
            ? parseFloat(data.temperatureMax)
            : null,
        nestHumidityMin:
          data.nestHumidityMin && data.nestHumidityMin.trim() !== ""
            ? parseFloat(data.nestHumidityMin)
            : null,
        nestHumidityMax:
          data.nestHumidityMax && data.nestHumidityMax.trim() !== ""
            ? parseFloat(data.nestHumidityMax)
            : null,
        arenaHumidityMin:
          data.arenaHumidityMin && data.arenaHumidityMin.trim() !== ""
            ? parseFloat(data.arenaHumidityMin)
            : null,
        arenaHumidityMax:
          data.arenaHumidityMax && data.arenaHumidityMax.trim() !== ""
            ? parseFloat(data.arenaHumidityMax)
            : null,
        behavior: data.behavior,
        description: data.description,
        price: parseFloat(data.price) || 0,
        inStock: data.inStock,
        changes: data.changes,
      };

      if (editingSpecies) {
        await updateSpecies({
          ...newSpecies,
          id: editingSpecies.id,
          userId: user?.uid || "",
        });
      } else {
        await addSpecies(newSpecies);
      }

      setOpenDialog(false);
      setEditingSpecies(null);
      setNotification({
        open: true,
        message: "Gatunek został zapisany!",
        severity: "success",
      });
    } catch (err) {
      setNotification({
        open: true,
        message: "Błąd podczas zapisywania gatunku!",
        severity: "error",
      });
    }
  };

  const handleEdit = (speciesItem: Species) => {
    setEditingSpecies(speciesItem);
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSpecies(id);
      setNotification({
        open: true,
        message: "Gatunek został usunięty!",
        severity: "success",
      });
    } catch (err) {
      setNotification({
        open: true,
        message: "Błąd podczas usuwania gatunku!",
        severity: "error",
      });
    }
  };

  const handleStockChange = async (id: string, inStock: boolean) => {
    try {
      await updateStockStatus(id, inStock);
    } catch (err) {
      setNotification({
        open: true,
        message: "Błąd podczas aktualizacji stanu magazynowego!",
        severity: "error",
      });
    }
  };

  const handleOpenDialog = () => {
    setEditingSpecies(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSpecies(null);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {(speciesError || categoriesError) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {speciesError || categoriesError}
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" color="primary">
          🐜 Magazyn Gatunków
        </Typography>
        <Button
          variant="outlined"
          startIcon={<SettingsIcon />}
          onClick={() => setOpenCategoryManager(true)}
        >
          Zarządzaj kategoriami
        </Button>
      </Box>

      <SearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        showAvailableOnly={showAvailableOnly}
        setShowAvailableOnly={setShowAvailableOnly}
        categories={categories}
      />

      <SpeciesTable
        species={filteredSpecies}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStockChange={handleStockChange}
        getCategoryName={getCategoryName}
      />

      {filteredSpecies.length === 0 && !speciesLoading && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            Brak gatunków spełniających kryteria wyszukiwania
          </Typography>
        </Box>
      )}

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={handleOpenDialog}
      >
        <AddIcon />
      </Fab>

      <SpeciesForm
        key={editingSpecies?.id}
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        editingSpecies={editingSpecies}
        categories={categories}
      />

      <CategoryManager
        open={openCategoryManager}
        onClose={() => setOpenCategoryManager(false)}
        categories={categories}
        onAddCategory={addCategory}
        onUpdateCategory={updateCategory}
        onDeleteCategory={deleteCategory}
        loading={categoriesLoading}
        error={categoriesError}
      />

      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={() => setNotification({ ...notification, open: false })}
      />
    </Container>
  );
};