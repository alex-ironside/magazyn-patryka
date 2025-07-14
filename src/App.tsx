import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  FormHelperText,
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

// Zod schema for form validation
const speciesFormSchema = z.object({
  name: z.string().min(1, "Nazwa gatunku jest wymagana"),
  type: z.string().min(1, "Typ jest wymagany"),
  temperature: z.string().refine((val) => {
    if (val === "") return true; // Allow empty
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 100;
  }, "Temperatura musi być między 0 a 100"),
  nestHumidity: z.string().refine((val) => {
    if (val === "") return true; // Allow empty
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 100;
  }, "Wilgotność gniazda musi być między 0 a 100"),
  arenaHumidity: z.string().refine((val) => {
    if (val === "") return true; // Allow empty
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 100;
  }, "Wilgotność arena musi być między 0 a 100"),
  behavior: z.string(),
  description: z.string(),
  price: z.number().min(0, "Cena musi być większa od 0"),
  available: z.boolean(),
  inStock: z.boolean(),
  changes: z.array(
    z.object({
      date: z.string(),
      type: z
        .string()
        .refine((val) => ["feeding", "temperature", "other"].includes(val), {
          message: "Typ musi być: feeding, temperature lub other",
        }),
      description: z.string(),
    })
  ),
});

type SpeciesFormData = z.infer<typeof speciesFormSchema>;

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
  type: string;
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

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<SpeciesFormData>({
    resolver: zodResolver(speciesFormSchema),
    defaultValues: {
      name: "",
      type: "",
      temperature: "",
      nestHumidity: "",
      arenaHumidity: "",
      behavior: "",
      description: "",
      price: 0,
      available: true,
      inStock: false,
      changes: [],
    },
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

  const onSubmit = (data: SpeciesFormData) => {
    const newSpecies: Species = {
      id: editingSpecies?.id || Date.now().toString(),
      name: data.name,
      type: data.type,
      temperature: data.temperature,
      nestHumidity: data.nestHumidity,
      arenaHumidity: data.arenaHumidity,
      behavior: data.behavior,
      description: data.description,
      price: data.price,
      available: data.available,
      inStock: data.inStock,
      changes: data.changes,
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
    reset();
    setSnackbar({
      open: true,
      message: "Gatunek został zapisany!",
      severity: "success",
    });
  };

  const handleEdit = (speciesItem: Species) => {
    setEditingSpecies(speciesItem);
    reset(speciesItem);
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
    const currentChanges = getValues("changes") || [];
    setValue("changes", [...currentChanges, newChange]);
  };

  const updateChange = (
    index: number,
    field: keyof ChangeEntry,
    value: string
  ) => {
    const updatedChanges = [...(getValues("changes") || [])];
    updatedChanges[index] = { ...updatedChanges[index], [field]: value };
    setValue("changes", updatedChanges);
  };

  const removeChange = (index: number) => {
    const currentChanges = getValues("changes") || [];
    const updatedChanges = currentChanges.filter((_, i) => i !== index);
    setValue("changes", updatedChanges);
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
        <TableContainer component={Paper} sx={{ mb: 3, overflowX: "auto" }}>
          <Table sx={{ minWidth: 1200 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 150 }}>Nazwa</TableCell>
                <TableCell sx={{ minWidth: 100 }}>Typ</TableCell>
                <TableCell sx={{ minWidth: 120 }}>Temperatura</TableCell>
                <TableCell sx={{ minWidth: 140 }}>Wilgotność Gniazda</TableCell>
                <TableCell sx={{ minWidth: 130 }}>Wilgotność Arena</TableCell>
                <TableCell sx={{ minWidth: 120 }}>Zachowanie</TableCell>
                <TableCell sx={{ minWidth: 200 }}>Opis</TableCell>
                <TableCell sx={{ minWidth: 80 }}>Cena</TableCell>
                <TableCell sx={{ minWidth: 80 }}>Status</TableCell>
                <TableCell sx={{ minWidth: 100 }}>Na stanie</TableCell>
                <TableCell align="right" sx={{ minWidth: 120 }}>
                  Akcje
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSpecies.map((speciesItem) => (
                <TableRow key={speciesItem.id}>
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
                    <Typography variant="body2">
                      {speciesItem.temperature
                        ? `${speciesItem.temperature}°C`
                        : "Nie określono"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {speciesItem.nestHumidity
                        ? `${speciesItem.nestHumidity}%`
                        : "Nie określono"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {speciesItem.arenaHumidity
                        ? `${speciesItem.arenaHumidity}%`
                        : "Nie określono"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {speciesItem.behavior || "Nie określono"}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>
                    <Typography variant="body2" noWrap>
                      {speciesItem.description || "Brak opisu"}
                    </Typography>
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
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label="Nazwa gatunku"
                    {...field}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />

              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth required error={!!errors.type}>
                    <InputLabel>Typ</InputLabel>
                    <Select {...field} label="Typ" error={!!errors.type}>
                      {speciesTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.type && (
                      <FormHelperText>{errors.type.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />

              <Controller
                name="temperature"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label="Temperatura"
                    type="number"
                    {...field}
                    error={!!errors.temperature}
                    helperText={errors.temperature?.message}
                  />
                )}
              />

              <Controller
                name="nestHumidity"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label="Wilgotność gniazda"
                    type="number"
                    {...field}
                    error={!!errors.nestHumidity}
                    helperText={errors.nestHumidity?.message}
                  />
                )}
              />

              <Controller
                name="arenaHumidity"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label="Wilgotność arena"
                    type="number"
                    {...field}
                    error={!!errors.arenaHumidity}
                    helperText={errors.arenaHumidity?.message}
                  />
                )}
              />

              <Controller
                name="behavior"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label="Zachowanie"
                    {...field}
                    placeholder="np. agresywne, spokojne"
                  />
                )}
              />

              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label="Cena (PLN)"
                    type="number"
                    {...field}
                    error={!!errors.price}
                    helperText={errors.price?.message}
                  />
                )}
              />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <Controller
                  name="available"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="Dostępny w sprzedaży"
                    />
                  )}
                />

                <Controller
                  name="inStock"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="Na stanie"
                    />
                  )}
                />
              </Box>

              <Box sx={{ gridColumn: "1 / -1" }}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      label="Opis gatunku"
                      multiline
                      rows={3}
                      {...field}
                    />
                  )}
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

                {getValues("changes")?.map((change, index) => (
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
                    <Controller
                      name={`changes.${index}.date`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          fullWidth
                          label="Data"
                          type="date"
                          {...field}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />

                    <Controller
                      name={`changes.${index}.type`}
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel>Typ zmiany</InputLabel>
                          <Select {...field} label="Typ zmiany">
                            <MenuItem value="feeding">Karmówka</MenuItem>
                            <MenuItem value="temperature">Temperatura</MenuItem>
                            <MenuItem value="other">Inne</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />

                    <Controller
                      name={`changes.${index}.description`}
                      control={control}
                      render={({ field }) => (
                        <TextField fullWidth label="Opis" {...field} />
                      )}
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
            <Button onClick={handleSubmit(onSubmit)} variant="contained">
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
