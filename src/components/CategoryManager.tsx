import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box,
  Chip,
  Alert,
} from "@mui/material";
import { EditIcon, DeleteIcon, AddIcon } from "../icons/CustomIcons";
import { Category } from "../types/Species";

interface CategoryManagerProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  onAddCategory: (name: string, color?: string) => Promise<void>;
  onUpdateCategory: (id: string, name: string, color?: string) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  open,
  onClose,
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  loading,
  error,
}) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      setSubmitting(true);
      await onAddCategory(newCategoryName.trim());
      setNewCategoryName("");
    } catch (err) {
      // Error is handled by the parent component
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editName.trim()) return;

    try {
      setSubmitting(true);
      await onUpdateCategory(editingCategory.id, editName.trim());
      setEditingCategory(null);
      setEditName("");
    } catch (err) {
      // Error is handled by the parent component
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      setSubmitting(true);
      await onDeleteCategory(id);
    } catch (err) {
      // Error is handled by the parent component
    } finally {
      setSubmitting(false);
    }
  };

  const startEditing = (category: Category) => {
    setEditingCategory(category);
    setEditName(category.name);
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    setEditName("");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Zarządzaj kategoriami</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Add new category */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Dodaj nową kategorię
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              label="Nazwa kategorii"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
              disabled={submitting}
            />
            <Button
              variant="contained"
              onClick={handleAddCategory}
              disabled={!newCategoryName.trim() || submitting}
              startIcon={<AddIcon />}
            >
              Dodaj
            </Button>
          </Box>
        </Box>

        {/* Categories list */}
        <Typography variant="h6" gutterBottom>
          Twoje kategorie ({categories.length})
        </Typography>

        {categories.length === 0 ? (
          <Typography
            color="text.secondary"
            sx={{ textAlign: "center", py: 2 }}
          >
            Brak kategorii. Dodaj pierwszą kategorię powyżej.
          </Typography>
        ) : (
          <List>
            {categories.map((category) => (
              <ListItem key={category.id} divider>
                {editingCategory?.id === category.id ? (
                  <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
                    <TextField
                      fullWidth
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleUpdateCategory()
                      }
                      disabled={submitting}
                    />
                    <Button
                      size="small"
                      onClick={handleUpdateCategory}
                      disabled={!editName.trim() || submitting}
                    >
                      Zapisz
                    </Button>
                    <Button
                      size="small"
                      onClick={cancelEditing}
                      disabled={submitting}
                    >
                      Anuluj
                    </Button>
                  </Box>
                ) : (
                  <>
                    <ListItemText
                      primary={
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography>{category.name}</Typography>
                          {category.color && (
                            <Chip
                              size="small"
                              sx={{
                                backgroundColor: category.color,
                                color: "white",
                                fontSize: "0.75rem",
                              }}
                            />
                          )}
                        </Box>
                      }
                      secondary={`Utworzono: ${new Date(
                        category.createdAt
                      ).toLocaleDateString()}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => startEditing(category)}
                        disabled={submitting}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={() => handleDeleteCategory(category.id)}
                        disabled={submitting}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </>
                )}
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Zamknij
        </Button>
      </DialogActions>
    </Dialog>
  );
};
