import React from "react";

export const AddIcon = () => <span>+</span>;
export const EditIcon = () => <span>✏️</span>;
export const DeleteIcon = () => <span>🗑️</span>;
export const SearchIcon = () => <span>🔍</span>;
export const SettingsIcon = () => <span>⚙️</span>;
export const CheckCircleIcon = ({ color }: { color: string }) => (
  <span
    style={{
      color:
        color === "success" ? "green" : color === "warning" ? "orange" : "red",
    }}
  >
    ✅
  </span>
);
export const CancelIcon = ({ color }: { color: string }) => (
  <span style={{ color: color === "warning" ? "orange" : "red" }}>❌</span>
);
