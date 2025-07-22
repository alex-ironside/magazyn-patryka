import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  IconButton,
  Typography,
} from "@mui/material";
import { AddIcon, DeleteIcon } from "../icons/CustomIcons";
import { Species, Category } from "../types/Species";

// Zod schema for form validation
const speciesFormSchema = z.object({
  name: z.string().min(1, "Nazwa gatunku jest wymagana"),
  type: z.string().min(1, "Kategoria jest wymagana"),
  temperatureMin: z.string().refine((val) => {
    if (val === "") return true; // Allow empty
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 100;
  }, "Temperatura min musi być między 0 a 100"),
  temperatureMax: z.string().refine((val) => {
    if (val === "") return true; // Allow empty
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 100;
  }, "Temperatura max musi być między 0 a 100"),
  nestHumidityMin: z.string().refine((val) => {
    if (val === "") return true; // Allow empty
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 100;
  }, "Wilgotność gniazda min musi być między 0 a 100"),
  nestHumidityMax: z.string().refine((val) => {
    if (val === "") return true; // Allow empty
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 100;
  }, "Wilgotność gniazda max musi być między 0 a 100"),
  arenaHumidityMin: z.string().refine((val) => {
    if (val === "") return true; // Allow empty
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 100;
  }, "Wilgotność arena min musi być między 0 a 100"),
  arenaHumidityMax: z.string().refine((val) => {
    if (val === "") return true; // Allow empty
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 100;
  }, "Wilgotność arena max musi być między 0 a 100"),
  behavior: z.string(),
  description: z.string(),
  price: z
    .string()
    .optional()
    .refine((val) => {
      if (val === undefined || val === "") return true; // Allow empty or undefined
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

interface SpeciesFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SpeciesFormData) => void;
  editingSpecies?: Species | null;
  categories: Category[];
}

export const SpeciesForm: React.FC<SpeciesFormProps> = ({
  open,
  onClose,
  onSubmit,
  editingSpecies,
  categories,
}) => {
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

  React.useEffect(() => {
    if (editingSpecies) {
      // Convert number fields to strings for the form
      reset({
        ...editingSpecies,
        temperatureMin: editingSpecies.temperatureMin?.toString() || "",
        temperatureMax: editingSpecies.temperatureMax?.toString() || "",
        nestHumidityMin: editingSpecies.nestHumidityMin?.toString() || "",
        nestHumidityMax: editingSpecies.nestHumidityMax?.toString() || "",
        arenaHumidityMin: editingSpecies.arenaHumidityMin?.toString() || "",
        arenaHumidityMax: editingSpecies.arenaHumidityMax?.toString() || "",
        price: editingSpecies.price?.toString() || "",
      });
    } else {
      reset();
    }
  }, [editingSpecies, reset]);

  // Clear form when opening a new species dialog
  React.useEffect(() => {
    if (open && !editingSpecies) {
      reset();
    }
  }, [open, editingSpecies, reset]);

  const addChange = () => {
    const newChange = {
      date: new Date().toISOString().split("T")[0],
      type: "feeding",
      description: "",
    };
    const currentChanges = getValues("changes") || [];
    setValue("changes", [...currentChanges, newChange]);
  };

  const removeChange = (index: number) => {
    const currentChanges = getValues("changes") || [];
    const updatedChanges = currentChanges.filter((_, i) => i !== index);
    setValue("changes", updatedChanges);
  };

  const handleCancel = () => {
    reset(); // Clear the form
    onClose();
  };

  const handleSave = handleSubmit((data) => {
    onSubmit(data);
    reset(); // Clear the form after successful submission
  });

  const handleDialogClose = (_event: any, reason: string) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      // Just close without resetting to preserve data
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleDialogClose} maxWidth="md" fullWidth>
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
                <InputLabel>Kategoria</InputLabel>
                <Select {...field} label="Kategoria" error={!!errors.type}>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name="temperatureMin"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label="Temperatura min"
                type="number"
                {...field}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || /^\d*\.?\d*$/.test(value)) {
                    field.onChange(value);
                  }
                }}
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
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || /^\d*\.?\d*$/.test(value)) {
                    field.onChange(value);
                  }
                }}
                error={!!errors.temperatureMax}
                placeholder="25"
              />
            )}
          />

          <Controller
            name="nestHumidityMin"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label="Wilgotność gniazda min"
                type="number"
                {...field}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || /^\d*\.?\d*$/.test(value)) {
                    field.onChange(value);
                  }
                }}
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
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || /^\d*\.?\d*$/.test(value)) {
                    field.onChange(value);
                  }
                }}
                error={!!errors.nestHumidityMax}
                placeholder="70"
              />
            )}
          />

          <Controller
            name="arenaHumidityMin"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label="Wilgotność arena min"
                type="number"
                {...field}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || /^\d*\.?\d*$/.test(value)) {
                    field.onChange(value);
                  }
                }}
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
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || /^\d*\.?\d*$/.test(value)) {
                    field.onChange(value);
                  }
                }}
                error={!!errors.arenaHumidityMax}
                placeholder="80"
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
                {...field}
                onChange={(e) => {
                  // Only allow numbers, decimal point, and backspace
                  const value = e.target.value;
                  if (value === "" || /^\d*\.?\d*$/.test(value)) {
                    field.onChange(value);
                  }
                }}
                error={!!errors.price}
                helperText={errors.price?.message}
                placeholder="np. 90"
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

          {/* Move Changes section ABOVE Description */}
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
                {/* existing controllers for change fields */}
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
                <IconButton onClick={() => removeChange(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Box>

          {/* Description section AFTER changes */}
          <Box sx={{ gridColumn: "1 / -1" }}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Opis gatunku"
                  multiline
                  minRows={3}
                  {...field}
                />
              )}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          position: "sticky",
          bottom: 0,
          backgroundColor: "background.paper",
          py: 2,
          zIndex: 2,
        }}
      >
        <Button onClick={handleCancel}>Anuluj</Button>
        <Button onClick={handleSave} variant="contained">
          Zapisz
        </Button>
      </DialogActions>
    </Dialog>
  );
};
