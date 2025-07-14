import React, { useState, useEffect } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Fab,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  Tooltip,
} from "@mui/material";
import "./App.css";

// Simple text-based icons as fallback
const AddIcon = () => <span>+</span>;
const EditIcon = () => <span>✏️</span>;
const DeleteIcon = () => <span>🗑️</span>;
const SearchIcon = () => <span>🔍</span>;
const CheckCircleIcon = ({ color }: { color: string }) => (
  <span
    style={{
      color:
        color === "success" ? "green" : color === "warning" ? "orange" : "red",
    }}
  >
    ✅
  </span>
);
const CancelIcon = ({ color }: { color: string }) => (
  <span style={{ color: color === "warning" ? "orange" : "red" }}>❌</span>
);
const ExpandMoreIcon = () => <span>▼</span>;
const ExpandLessIcon = () => <span>▲</span>;
const VisibilityIcon = () => <span>👁️</span>;

interface Species {
  id: string;
  name: string;
  type: string;
  temperature: string;
  nestHumidity: string;
  arenaHumidity: string;
  changes: ChangeEntry[];
  behavior: string;
  description: string;
  price: number;
  available: boolean;
  inStock: boolean;
}

interface ChangeEntry {
  date: string;
  type: "feeding" | "temperature" | "other";
  description: string;
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#2e7d32",
    },
    secondary: {
      main: "#ff6f00",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          borderRadius: "12px",
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          borderRadius: "12px",
        },
      },
    },
  },
});

const speciesTypes = [
  "Mrówki",
  "Modliszki",
  "Pająki",
  "Isopody",
  "Skoczogonki",
  "Pluskwiaki",
  "Inne",
];

function App() {
  const [species, setSpecies] = useState<Species[]>([]);
  const [filteredSpecies, setFilteredSpecies] = useState<Species[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSpecies, setEditingSpecies] = useState<Species | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Species>>({
    name: "",
    type: "",
    temperature: "",
    nestHumidity: "",
    arenaHumidity: "",
    changes: [],
    behavior: "",
    description: "",
    price: 0,
    available: true,
    inStock: false,
  });

  useEffect(() => {
    // Load data from localStorage on component mount
    const savedSpecies = localStorage.getItem("species-data");
    if (savedSpecies) {
      const parsed = JSON.parse(savedSpecies);
      setSpecies(parsed);
      setFilteredSpecies(parsed);
    }
  }, []);

  useEffect(() => {
    // Filter species based on search criteria
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
      filtered = filtered.filter((s) => s.available && s.inStock);
    }

    setFilteredSpecies(filtered);
  }, [species, searchTerm, typeFilter, priceRange, showAvailableOnly]);

  const handleSave = () => {
    if (!formData.name || !formData.type) {
      setSnackbar({
        open: true,
        message: "Nazwa i typ są wymagane!",
        severity: "error",
      });
      return;
    }

    const newSpecies: Species = {
      id: editingSpecies?.id || Date.now().toString(),
      name: formData.name || "",
      type: formData.type || "",
      temperature: formData.temperature || "",
      nestHumidity: formData.nestHumidity || "",
      arenaHumidity: formData.arenaHumidity || "",
      changes: formData.changes || [],
      behavior: formData.behavior || "",
      description: formData.description || "",
      price: formData.price || 0,
      available: formData.available !== undefined ? formData.available : true,
      inStock: formData.inStock !== undefined ? formData.inStock : false,
    };

    if (editingSpecies) {
      const updatedSpecies = species.map((s) =>
        s.id === editingSpecies.id ? newSpecies : s
      );
      setSpecies(updatedSpecies);
      localStorage.setItem("species-data", JSON.stringify(updatedSpecies));
    } else {
      const updatedSpecies = [...species, newSpecies];
      setSpecies(updatedSpecies);
      localStorage.setItem("species-data", JSON.stringify(updatedSpecies));
    }

    setOpenDialog(false);
    setEditingSpecies(null);
    setFormData({
      name: "",
      type: "",
      temperature: "",
      nestHumidity: "",
      arenaHumidity: "",
      changes: [],
      behavior: "",
      description: "",
      price: 0,
      available: true,
      inStock: false,
    });
    setSnackbar({
      open: true,
      message: "Gatunek został zapisany!",
      severity: "success",
    });
  };

  const handleEdit = (speciesItem: Species) => {
    setEditingSpecies(speciesItem);
    setFormData(speciesItem);
    setOpenDialog(true);
  };

  const handleDelete = (id: string) => {
    const updatedSpecies = species.filter((s) => s.id !== id);
    setSpecies(updatedSpecies);
    localStorage.setItem("species-data", JSON.stringify(updatedSpecies));
    setSnackbar({
      open: true,
      message: "Gatunek został usunięty!",
      severity: "success",
    });
  };

  const addChange = () => {
    const newChange: ChangeEntry = {
      date: new Date().toISOString().split("T")[0],
      type: "feeding",
      description: "",
    };
    setFormData({
      ...formData,
      changes: [...(formData.changes || []), newChange],
    });
  };

  const updateChange = (
    index: number,
    field: keyof ChangeEntry,
    value: string
  ) => {
    const updatedChanges = [...(formData.changes || [])];
    updatedChanges[index] = { ...updatedChanges[index], [field]: value };
    setFormData({ ...formData, changes: updatedChanges });
  };

  const removeChange = (index: number) => {
    const updatedChanges =
      formData.changes?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, changes: updatedChanges });
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

        {/* Search and Filter Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 2,
                alignItems: "center",
              }}
            >
              <TextField
                fullWidth
                label="Szukaj gatunku"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon />,
                }}
              />

              <FormControl fullWidth>
                <InputLabel>Typ</InputLabel>
                <Select
                  value={typeFilter}
                  label="Typ"
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <MenuItem value="">Wszystkie</MenuItem>
                  {speciesTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Cena od"
                type="number"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, min: e.target.value })
                }
              />

              <TextField
                fullWidth
                label="Cena do"
                type="number"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, max: e.target.value })
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={showAvailableOnly}
                    onChange={(e) => setShowAvailableOnly(e.target.checked)}
                  />
                }
                label="Tylko dostępne"
              />
            </Box>
          </CardContent>
        </Card>

        {/* Species List */}
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width="40"></TableCell>
                <TableCell>Nazwa</TableCell>
                <TableCell>Typ</TableCell>
                <TableCell>Cena</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Na stanie</TableCell>
                <TableCell align="right">Akcje</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSpecies.map((speciesItem) => (
                <React.Fragment key={speciesItem.id}>
                  <TableRow>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() =>
                          setExpandedRow(
                            expandedRow === speciesItem.id
                              ? null
                              : speciesItem.id
                          )
                        }
                      >
                        {expandedRow === speciesItem.id ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {speciesItem.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={speciesItem.type}
                        color="secondary"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {speciesItem.price} PLN
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {speciesItem.available && speciesItem.inStock && (
                        <Tooltip title="Dostępny na stanie">
                          <CheckCircleIcon color="success" />
                        </Tooltip>
                      )}
                      {speciesItem.available && !speciesItem.inStock && (
                        <Tooltip title="Dostępny, brak na stanie">
                          <CancelIcon color="warning" />
                        </Tooltip>
                      )}
                      {!speciesItem.available && (
                        <Tooltip title="Niedostępny">
                          <CancelIcon color="error" />
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={speciesItem.inStock}
                        onChange={(e) => {
                          const updatedSpecies = species.map((s) =>
                            s.id === speciesItem.id
                              ? { ...s, inStock: e.target.checked }
                              : s
                          );
                          setSpecies(updatedSpecies);
                          localStorage.setItem(
                            "species-data",
                            JSON.stringify(updatedSpecies)
                          );
                        }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(speciesItem)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(speciesItem.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={7}
                    >
                      <Collapse
                        in={expandedRow === speciesItem.id}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ margin: 2 }}>
                          <Typography variant="h6" gutterBottom component="div">
                            Szczegóły gatunku
                          </Typography>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" paragraph>
                              <strong>Opis:</strong>{" "}
                              {speciesItem.description || "Brak opisu"}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              <strong>Temperatura:</strong>{" "}
                              {speciesItem.temperature || "Nie określono"}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              <strong>Wilgotność gniazda:</strong>{" "}
                              {speciesItem.nestHumidity || "Nie określono"}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              <strong>Wilgotność arena:</strong>{" "}
                              {speciesItem.arenaHumidity || "Nie określono"}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              <strong>Zachowanie:</strong>{" "}
                              {speciesItem.behavior || "Nie określono"}
                            </Typography>
                          </Box>
                          {speciesItem.changes.length > 0 && (
                            <Box>
                              <Typography variant="subtitle2" gutterBottom>
                                Historia zmian:
                              </Typography>
                              {speciesItem.changes.map((change, index) => (
                                <Typography
                                  key={index}
                                  variant="caption"
                                  display="block"
                                  sx={{ ml: 2, mb: 0.5 }}
                                >
                                  • {change.date} -{" "}
                                  {change.type === "feeding"
                                    ? "Karmówka"
                                    : change.type === "temperature"
                                    ? "Temperatura"
                                    : "Inne"}
                                  : {change.description}
                                </Typography>
                              ))}
                            </Box>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredSpecies.length === 0 && (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="text.secondary">
              Brak gatunków spełniających kryteria wyszukiwania
            </Typography>
          </Box>
        )}

        {/* Add Button */}
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          onClick={() => setOpenDialog(true)}
        >
          <AddIcon />
        </Fab>

        {/* Add/Edit Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {editingSpecies ? "Edytuj gatunek" : "Dodaj nowy gatunek"}
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 3,
                mt: 2,
              }}
            >
              <TextField
                fullWidth
                label="Nazwa gatunku"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />

              <FormControl fullWidth required>
                <InputLabel>Typ</InputLabel>
                <Select
                  value={formData.type}
                  label="Typ"
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                >
                  {speciesTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Temperatura"
                value={formData.temperature}
                onChange={(e) =>
                  setFormData({ ...formData, temperature: e.target.value })
                }
                placeholder="np. 25-30°C"
              />

              <TextField
                fullWidth
                label="Wilgotność gniazda"
                value={formData.nestHumidity}
                onChange={(e) =>
                  setFormData({ ...formData, nestHumidity: e.target.value })
                }
                placeholder="np. 70-90%"
              />

              <TextField
                fullWidth
                label="Wilgotność arena"
                value={formData.arenaHumidity}
                onChange={(e) =>
                  setFormData({ ...formData, arenaHumidity: e.target.value })
                }
                placeholder="np. 50-60%"
              />

              <TextField
                fullWidth
                label="Zachowanie"
                value={formData.behavior}
                onChange={(e) =>
                  setFormData({ ...formData, behavior: e.target.value })
                }
                placeholder="np. agresywne, spokojne"
              />

              <TextField
                fullWidth
                label="Cena (PLN)"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
              />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.available}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          available: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Dostępny w sprzedaży"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.inStock}
                      onChange={(e) =>
                        setFormData({ ...formData, inStock: e.target.checked })
                      }
                    />
                  }
                  label="Na stanie"
                />
              </Box>

              <Box sx={{ gridColumn: "1 / -1" }}>
                <TextField
                  fullWidth
                  label="Opis gatunku"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </Box>

              <Box sx={{ gridColumn: "1 / -1" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Zmiany</Typography>
                  <Button onClick={addChange} startIcon={<AddIcon />}>
                    Dodaj zmianę
                  </Button>
                </Box>

                {formData.changes?.map((change, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 2fr auto",
                      gap: 2,
                      mb: 2,
                      p: 2,
                      border: "1px solid #ddd",
                      borderRadius: 1,
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Data"
                      type="date"
                      value={change.date}
                      onChange={(e) =>
                        updateChange(index, "date", e.target.value)
                      }
                      InputLabelProps={{ shrink: true }}
                    />

                    <FormControl fullWidth>
                      <InputLabel>Typ zmiany</InputLabel>
                      <Select
                        value={change.type}
                        label="Typ zmiany"
                        onChange={(e) =>
                          updateChange(index, "type", e.target.value)
                        }
                      >
                        <MenuItem value="feeding">Karmówka</MenuItem>
                        <MenuItem value="temperature">Temperatura</MenuItem>
                        <MenuItem value="other">Inne</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      fullWidth
                      label="Opis"
                      value={change.description}
                      onChange={(e) =>
                        updateChange(index, "description", e.target.value)
                      }
                    />

                    <IconButton
                      onClick={() => removeChange(index)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Anuluj</Button>
            <Button onClick={handleSave} variant="contained">
              Zapisz
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}

export default App;
