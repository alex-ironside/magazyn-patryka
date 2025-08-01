import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Button,
  IconButton,
  Chip,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import { ArrowBackIcon, EditIcon, SaveIcon, CancelIcon, AddIcon, DeleteIcon } from "../icons/CustomIcons";
import { Species, Category } from "../types/Species";

// Same validation schema as SpeciesForm
const speciesFormSchema = z.object({
  name: z.string().min(1, "Nazwa gatunku jest wymagana"),
  type: z.string().min(1, "Kategoria jest wymagana"),
  temperatureMin: z.string().refine((val) => {
    if (val === "") return true;
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 100;
  }, "Temperatura min musi być między 0 a 100"),
  temperatureMax: z.string().refine((val) => {
    if (val === "") return true;
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 100;
  }, "Temperatura max musi być między 0 a 100"),
  nestHumidityMin: z.string().refine((val) => {
    if (val === "") return true;
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 100;
  }, "Wilgotność gniazda min musi być między 0 a 100"),
  nestHumidityMax: z.string().refine((val) => {
    if (val === "") return true;
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 100;
  }, "Wilgotność gniazda max musi być między 0 a 100"),
  arenaHumidityMin: z.string().refine((val) => {
    if (val === "") return true;
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 100;
  }, "Wilgotność arena min musi być między 0 a 100"),
  arenaHumidityMax: z.string().refine((val) => {
    if (val === "") return true;
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 100;
  }, "Wilgotność arena max musi być między 0 a 100"),
  behavior: z.string(),
  description: z.string(),
  price: z
    .string()
    .optional()
    .refine((val) => {
      if (val === undefined || val === "") return true;
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0;
    }, "Cena musi być większa lub równa 0"),
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

interface SpeciesDetailsProps {
  species: Species[];
  categories: Category[];
  onUpdateSpecies: (data: SpeciesFormData & { id: string }) => void;
  loading: boolean;
}

export const SpeciesDetails: React.FC<SpeciesDetailsProps> = ({
  species,
  categories,
  onUpdateSpecies,
  loading,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [currentSpecies, setCurrentSpecies] = useState<Species | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
    getValues,
    watch,
  } = useForm<SpeciesFormData>({
    resolver: zodResolver(speciesFormSchema),
    defaultValues: {
      name: "",
      type: "",
      temperatureMin: "",
      temperatureMax: "",
      nestHumidityMin: "",
      nestHumidityMax: "",
      arenaHumidityMin: "",
      arenaHumidityMax: "",
      behavior: "",
      description: "",
      price: "0",
      inStock: false,
      changes: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "changes",
  });

  const watchedChanges = watch("changes");

  // Find the current species
  useEffect(() => {
    if (id && species.length > 0) {
      const foundSpecies = species.find((s) => s.id === id);
      if (foundSpecies) {
        setCurrentSpecies(foundSpecies);
        // Reset form with species data
        reset({
          ...foundSpecies,
          temperatureMin: foundSpecies.temperatureMin?.toString() || "",
          temperatureMax: foundSpecies.temperatureMax?.toString() || "",
          nestHumidityMin: foundSpecies.nestHumidityMin?.toString() || "",
          nestHumidityMax: foundSpecies.nestHumidityMax?.toString() || "",
          arenaHumidityMin: foundSpecies.arenaHumidityMin?.toString() || "",
          arenaHumidityMax: foundSpecies.arenaHumidityMax?.toString() || "",
          price: foundSpecies.price?.toString() || "",
        });
      }
    }
  }, [id, species, reset]);

  const handleBack = () => {
    navigate("/");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (currentSpecies) {
      reset({
        ...currentSpecies,
        temperatureMin: currentSpecies.temperatureMin?.toString() || "",
        temperatureMax: currentSpecies.temperatureMax?.toString() || "",
        nestHumidityMin: currentSpecies.nestHumidityMin?.toString() || "",
        nestHumidityMax: currentSpecies.nestHumidityMax?.toString() || "",
        arenaHumidityMin: currentSpecies.arenaHumidityMin?.toString() || "",
        arenaHumidityMax: currentSpecies.arenaHumidityMax?.toString() || "",
        price: currentSpecies.price?.toString() || "",
      });
    }
    setIsEditing(false);
  };

  const handleSave = handleSubmit((data) => {
    if (currentSpecies) {
      onUpdateSpecies({ ...data, id: currentSpecies.id });
      setIsEditing(false);
    }
  });

  const addChange = () => {
    const newChange = {
      date: new Date().toISOString().split("T")[0],
      type: "feeding",
      description: "",
    };
    append(newChange);
  };

  const removeChange = (index: number) => {
    remove(index);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  const getChangeTypeLabel = (type: string) => {
    switch (type) {
      case "feeding":
        return "Karmówka";
      case "temperature":
        return "Temperatura";
      case "other":
        return "Inne";
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!currentSpecies) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Nie znaleziono gatunku. <Button onClick={handleBack}>Powrót do listy</Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={handleBack}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1">
              {currentSpecies.name}
            </Typography>
            <Chip 
              label={getCategoryName(currentSpecies.type)} 
              color="primary" 
              variant="outlined" 
            />
            <Chip 
              label={currentSpecies.inStock ? "Na stanie" : "Brak na stanie"} 
              color={currentSpecies.inStock ? "success" : "error"} 
              variant="outlined" 
            />
          </Box>
          
          <Box sx={{ display: "flex", gap: 1 }}>
            {isEditing ? (
              <>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                >
                  Anuluj
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={!isDirty}
                >
                  Zapisz
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEdit}
              >
                Edytuj
              </Button>
            )}
          </Box>
        </Box>

        {/* Form Content */}
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 3 }}>
          {/* Basic Information */}
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label="Nazwa gatunku"
                {...field}
                disabled={!isEditing}
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
                <InputLabel>Kategoria</InputLabel>
                <Select {...field} label="Kategoria" disabled={!isEditing}>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          {/* Temperature */}
          <Controller
            name="temperatureMin"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label="Temperatura min"
                type="number"
                {...field}
                disabled={!isEditing}
                error={!!errors.temperatureMin}
                helperText={errors.temperatureMin?.message}
                placeholder="20"
              />
            )}
          />

          <Controller
            name="temperatureMax"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label="Temperatura max"
                type="number"
                {...field}
                disabled={!isEditing}
                error={!!errors.temperatureMax}
                helperText={errors.temperatureMax?.message}
                placeholder="25"
              />
            )}
          />

          {/* Nest Humidity */}
          <Controller
            name="nestHumidityMin"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label="Wilgotność gniazda min"
                type="number"
                {...field}
                disabled={!isEditing}
                error={!!errors.nestHumidityMin}
                helperText={errors.nestHumidityMin?.message}
                placeholder="60"
              />
            )}
          />

          <Controller
            name="nestHumidityMax"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label="Wilgotność gniazda max"
                type="number"
                {...field}
                disabled={!isEditing}
                error={!!errors.nestHumidityMax}
                helperText={errors.nestHumidityMax?.message}
                placeholder="70"
              />
            )}
          />

          {/* Arena Humidity */}
          <Controller
            name="arenaHumidityMin"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label="Wilgotność arena min"
                type="number"
                {...field}
                disabled={!isEditing}
                error={!!errors.arenaHumidityMin}
                helperText={errors.arenaHumidityMin?.message}
                placeholder="70"
              />
            )}
          />

          <Controller
            name="arenaHumidityMax"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label="Wilgotność arena max"
                type="number"
                {...field}
                disabled={!isEditing}
                error={!!errors.arenaHumidityMax}
                helperText={errors.arenaHumidityMax?.message}
                placeholder="80"
              />
            )}
          />

          {/* Behavior and Price */}
          <Controller
            name="behavior"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label="Zachowanie"
                {...field}
                disabled={!isEditing}
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
                {...field}
                disabled={!isEditing}
                error={!!errors.price}
                helperText={errors.price?.message}
                placeholder="np. 90"
              />
            )}
          />

          {/* Stock Status */}
          <Controller
            name="inStock"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch {...field} checked={field.value} disabled={!isEditing} />}
                label="Na stanie"
              />
            )}
          />
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Changes Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h5">Zmiany</Typography>
            {isEditing && (
              <Button onClick={addChange} startIcon={<AddIcon />}>
                Dodaj zmianę
              </Button>
            )}
          </Box>

          {fields.map((field, index) => (
            <Box
              key={field.id}
              sx={{
                display: "grid",
                gridTemplateColumns: isEditing ? "1fr 1fr 2fr auto" : "1fr 1fr 2fr",
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
                    disabled={!isEditing}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
              <Controller
                name={`changes.${index}.type`}
                control={control}
                render={({ field }) => (
                  isEditing ? (
                    <FormControl fullWidth>
                      <InputLabel>Typ zmiany</InputLabel>
                      <Select {...field} label="Typ zmiany">
                        <MenuItem value="feeding">Karmówka</MenuItem>
                        <MenuItem value="temperature">Temperatura</MenuItem>
                        <MenuItem value="other">Inne</MenuItem>
                      </Select>
                    </FormControl>
                  ) : (
                    <Typography>{getChangeTypeLabel(field.value)}</Typography>
                  )
                )}
              />
              <Controller
                name={`changes.${index}.description`}
                control={control}
                render={({ field }) => (
                  <TextField 
                    fullWidth 
                    label="Opis" 
                    {...field} 
                    disabled={!isEditing}
                    multiline={!isEditing}
                  />
                )}
              />
              {isEditing && (
                <IconButton onClick={() => removeChange(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          ))}

          {(!fields || fields.length === 0) && (
            <Typography color="text.secondary" sx={{ fontStyle: "italic" }}>
              Brak zarejestrowanych zmian
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Description */}
        <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Opis gatunku
          </Typography>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                multiline
                minRows={4}
                {...field}
                disabled={!isEditing}
                placeholder={isEditing ? "Wprowadź opis gatunku..." : "Brak opisu"}
              />
            )}
          />
        </Box>
      </Paper>
    </Container>
  );
};