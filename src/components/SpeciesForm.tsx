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
import { Species, speciesTypes } from "../types/Species";

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
}

export const SpeciesForm: React.FC<SpeciesFormProps> = ({
  open,
  onClose,
  onSubmit,
  editingSpecies,
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
      temperature: "",
      nestHumidity: "",
      arenaHumidity: "",
      behavior: "",
      description: "",
      price: 0,
      inStock: false,
      changes: [],
    },
  });

  React.useEffect(() => {
    if (editingSpecies) {
      reset(editingSpecies);
    } else {
      reset();
    }
  }, [editingSpecies, reset]);

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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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

                <IconButton onClick={() => removeChange(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Anuluj</Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained">
          Zapisz
        </Button>
      </DialogActions>
    </Dialog>
  );
};
