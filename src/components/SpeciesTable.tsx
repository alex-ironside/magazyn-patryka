import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  IconButton,
  Switch,
} from "@mui/material";
import { EditIcon, DeleteIcon } from "../icons/CustomIcons";
import type { Species } from "../types/Species";

interface SpeciesTableProps {
  species: Species[];
  onEdit: (species: Species) => void;
  onDelete: (id: string) => void;
  onStockChange: (id: string, inStock: boolean) => void;
  getCategoryName: (categoryId: string) => string;
}

export const SpeciesTable: React.FC<SpeciesTableProps> = ({
  species,
  onEdit,
  onDelete,
  onStockChange,
  getCategoryName,
}) => {
  return (
    <TableContainer component={Paper} sx={{ mb: 3, overflowX: "auto" }}>
      <Table sx={{ minWidth: 1100 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ minWidth: 150 }}>Nazwa</TableCell>
            <TableCell sx={{ minWidth: 100 }}>Kategoria</TableCell>
            <TableCell sx={{ minWidth: 120 }}>Temperatura</TableCell>
            <TableCell sx={{ minWidth: 140 }}>Wilgotność Gniazda</TableCell>
            <TableCell sx={{ minWidth: 130 }}>Wilgotność Arena</TableCell>
            <TableCell sx={{ minWidth: 120 }}>Zachowanie</TableCell>
            <TableCell sx={{ minWidth: 200 }}>Opis</TableCell>
            <TableCell sx={{ minWidth: 80 }}>Cena</TableCell>
            <TableCell sx={{ minWidth: 100 }}>Na stanie</TableCell>
            <TableCell align="right" sx={{ minWidth: 120 }}>
              Akcje
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {species.map((speciesItem) => (
            <TableRow key={speciesItem.id}>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {speciesItem.name}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={getCategoryName(speciesItem.type)}
                  color="secondary"
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {speciesItem.temperatureMin && speciesItem.temperatureMax
                    ? `${speciesItem.temperatureMin}-${speciesItem.temperatureMax}°C`
                    : speciesItem.temperatureMin
                    ? `${speciesItem.temperatureMin}°C`
                    : speciesItem.temperatureMax
                    ? `${speciesItem.temperatureMax}°C`
                    : "Nie określono"}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {speciesItem.nestHumidityMin && speciesItem.nestHumidityMax
                    ? `${speciesItem.nestHumidityMin}-${speciesItem.nestHumidityMax}%`
                    : speciesItem.nestHumidityMin
                    ? `${speciesItem.nestHumidityMin}%`
                    : speciesItem.nestHumidityMax
                    ? `${speciesItem.nestHumidityMax}%`
                    : "Nie określono"}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {speciesItem.arenaHumidityMin && speciesItem.arenaHumidityMax
                    ? `${speciesItem.arenaHumidityMin}-${speciesItem.arenaHumidityMax}%`
                    : speciesItem.arenaHumidityMin
                    ? `${speciesItem.arenaHumidityMin}%`
                    : speciesItem.arenaHumidityMax
                    ? `${speciesItem.arenaHumidityMax}%`
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
                <Switch
                  checked={speciesItem.inStock}
                  onChange={(e) =>
                    onStockChange(speciesItem.id, e.target.checked)
                  }
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <IconButton
                  color="primary"
                  onClick={() => onEdit(speciesItem)}
                  size="small"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => onDelete(speciesItem.id)}
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
  );
};
