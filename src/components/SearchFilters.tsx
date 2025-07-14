import React from "react";
import {
  Card,
  CardContent,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { SearchIcon } from "../icons/CustomIcons";

interface SearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  typeFilter: string;
  setTypeFilter: (type: string) => void;
  priceRange: { min: string; max: string };
  setPriceRange: (range: { min: string; max: string }) => void;
  showAvailableOnly: boolean;
  setShowAvailableOnly: (show: boolean) => void;
  speciesTypes: string[];
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  priceRange,
  setPriceRange,
  showAvailableOnly,
  setShowAvailableOnly,
  speciesTypes,
}) => {
  return (
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
  );
};
