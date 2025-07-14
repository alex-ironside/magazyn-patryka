import React, { useState } from "react";
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Typography,
  Box,
  Fab,
} from "@mui/material";
import {
  SearchFilters,
  SpeciesTable,
  SpeciesForm,
  Notification,
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
  } = useSpecies();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingSpecies, setEditingSpecies] = useState<Species | null>(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleSubmit = (data: any) => {
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
      updateSpecies({ ...newSpecies, id: editingSpecies.id });
    } else {
      addSpecies(newSpecies);
    }

    setOpenDialog(false);
    setEditingSpecies(null);
    setNotification({
      open: true,
      message: "Gatunek został zapisany!",
      severity: "success",
    });
  };

  const handleEdit = (speciesItem: Species) => {
    setEditingSpecies(speciesItem);
    setOpenDialog(true);
  };

  const handleDelete = (id: string) => {
    deleteSpecies(id);
    setNotification({
      open: true,
      message: "Gatunek został usunięty!",
      severity: "success",
    });
  };

  const handleStockChange = (id: string, inStock: boolean) => {
    updateStockStatus(id, inStock);
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          align="center"
          color="primary"
        >
          🐜 Magazyn Gatunków
        </Typography>

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

        {filteredSpecies.length === 0 && (
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
    </ThemeProvider>
  );
}

export default App;
