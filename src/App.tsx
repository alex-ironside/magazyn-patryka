import React, { useState } from "react";
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Typography,
  Box,
  Fab,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  SearchFilters,
  SpeciesTable,
  SpeciesForm,
  Notification,
  ProtectedRoute,
} from "./components";
import { AddIcon } from "./icons/CustomIcons";
import { useSpecies } from "./hooks";
import { theme } from "./theme/theme";
import { speciesTypes, Species } from "./types/Species";
import "./App.css";

function App() {
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
    loading,
    error,
  } = useSpecies();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingSpecies, setEditingSpecies] = useState<Species | null>(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleSubmit = async (data: any) => {
    try {
      const newSpecies: Omit<Species, "id"> = {
        name: data.name,
        type: data.type,
        temperature: data.temperature,
        nestHumidity: data.nestHumidity,
        arenaHumidity: data.arenaHumidity,
        behavior: data.behavior,
        description: data.description,
        price: data.price,
        inStock: data.inStock,
        changes: data.changes,
      };

      if (editingSpecies) {
        await updateSpecies({ ...newSpecies, id: editingSpecies.id });
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

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="50vh"
          >
            <CircularProgress size={60} />
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ProtectedRoute>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <SearchFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            showAvailableOnly={showAvailableOnly}
            setShowAvailableOnly={setShowAvailableOnly}
            speciesTypes={speciesTypes}
          />

          <SpeciesTable
            species={filteredSpecies}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStockChange={handleStockChange}
          />

          {filteredSpecies.length === 0 && !loading && (
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
            open={openDialog}
            onClose={handleCloseDialog}
            onSubmit={handleSubmit}
            editingSpecies={editingSpecies}
          />

          <Notification
            open={notification.open}
            message={notification.message}
            severity={notification.severity}
            onClose={() => setNotification({ ...notification, open: false })}
          />
        </Container>
      </ProtectedRoute>
    </ThemeProvider>
  );
}

export default App;
