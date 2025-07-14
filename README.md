# Species Management System

A React application for managing arthropod species information with features like CRUD operations, search/filtering, and local storage persistence.

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── SearchFilters.tsx # Search and filtering interface
│   ├── SpeciesTable.tsx  # Table display for species data
│   ├── SpeciesForm.tsx   # Form for adding/editing species
│   ├── Notification.tsx  # Snackbar notifications
│   └── index.ts         # Component exports
├── hooks/               # Custom React hooks
│   ├── useSpecies.ts    # Species data management hook
│   └── index.ts         # Hook exports
├── icons/               # Custom icon components
│   └── CustomIcons.tsx  # Text-based icon components
├── theme/               # Material-UI theme configuration
│   └── theme.ts         # Theme settings
├── types/               # TypeScript type definitions
│   └── Species.ts       # Species and related interfaces
└── App.tsx              # Main application component
```

## Components

### SearchFilters

Handles the search and filtering functionality with:

- Text search for species name and description
- Type filter dropdown
- Price range filters
- Availability toggle

### SpeciesTable

Displays species data in a table format with:

- All species information in columns
- Status indicators
- Stock management switches
- Edit and delete actions

### SpeciesForm

Form component for adding and editing species with:

- React Hook Form integration
- Zod validation schema
- Dynamic change tracking
- Grid-based layout

### Notification

Reusable notification component for displaying success/error messages.

## Hooks

### useSpecies

Custom hook that manages:

- Species data state
- Filtering logic
- Local storage operations
- CRUD operations

## Features

- **CRUD Operations**: Create, read, update, and delete species
- **Search & Filter**: Filter by name, type, price range, and availability
- **Form Validation**: Robust validation using React Hook Form and Zod
- **Local Storage**: Data persistence in browser storage
- **Responsive Design**: CSS Grid layouts for better responsiveness
- **Type Safety**: Full TypeScript support

## Technologies Used

- React 18
- TypeScript
- Material-UI (MUI)
- React Hook Form
- Zod (validation)
- CSS Grid

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view the app.

## Future Enhancements

- Firebase integration for cloud storage
- Firebase Analytics
- Import/export functionality
- Advanced filtering options
- User authentication
- Multi-language support
