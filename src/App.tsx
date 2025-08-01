import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  SpeciesDetails,
  SpeciesList,
  ProtectedRoute,
} from "./components";
import { useSpecies, useAuth, useCategories } from "./hooks";
import { theme } from "./theme/theme";
import "./App.css";

function App() {
  const { user } = useAuth();
  const {
    species,
    updateSpecies,
    loading: speciesLoading,
  } = useSpecies(user?.uid || "");

  const {
    categories,
    loading: categoriesLoading,
  } = useCategories();

  const handleUpdateSpecies = async (data: any) => {
    try {
      const updatedSpecies = {
        ...data,
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
        price: parseFloat(data.price) || 0,
        userId: user?.uid || "",
      };
      
      await updateSpecies(updatedSpecies);
    } catch (err) {
      console.error("Error updating species:", err);
    }
  };

  if (speciesLoading || categoriesLoading) {
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
        <Router>
          <Routes>
            <Route path="/" element={<SpeciesList />} />
            <Route 
              path="/species/:id" 
              element={
                <SpeciesDetails 
                  species={species}
                  categories={categories}
                  onUpdateSpecies={handleUpdateSpecies}
                  loading={speciesLoading}
                />
              } 
            />
          </Routes>
        </Router>
      </ProtectedRoute>
    </ThemeProvider>
  );
}

export default App;
