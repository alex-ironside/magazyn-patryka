# Species Management System

A React application for managing arthropod species information with features like CRUD operations, search/filtering, Firebase Firestore database integration, and secure authentication.

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── SearchFilters.tsx # Search and filtering interface
│   ├── SpeciesTable.tsx  # Table display for species data
│   ├── SpeciesForm.tsx   # Form for adding/editing species
│   ├── Notification.tsx  # Snackbar notifications
│   ├── LoginForm.tsx     # Authentication login form
│   ├── ProtectedRoute.tsx # Route protection component
│   └── index.ts         # Component exports
├── config/              # Configuration files
│   └── firebase.ts      # Firebase configuration
├── hooks/               # Custom React hooks
│   ├── useSpecies.ts    # Species data management hook
│   ├── useAuth.ts       # Authentication hook
│   └── index.ts         # Hook exports
├── icons/               # Custom icon components
│   └── CustomIcons.tsx  # Text-based icon components
├── services/            # API and external services
│   ├── firebaseService.ts # Firebase Firestore operations
│   └── authService.ts   # Firebase Authentication operations
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

### LoginForm

Authentication login form with:

- Email and password fields
- Form validation using Zod
- Error handling and loading states
- Clean Material-UI design

### ProtectedRoute

Route protection component that:

- Checks user authentication status
- Shows login form for unauthenticated users
- Displays main app with logout button for authenticated users
- Handles loading states during authentication checks

## Hooks

### useSpecies

Custom hook that manages:

- Species data state with real-time updates
- Filtering logic
- Firebase Firestore operations
- CRUD operations with error handling
- Loading states

### useAuth

Custom hook that manages:

- User authentication state
- Login/logout functionality
- Firebase Authentication integration
- Error handling for auth operations
- Real-time auth state changes

## Services

### Firebase Service

Handles all Firebase Firestore operations:

- Real-time data synchronization
- CRUD operations for species
- Error handling and logging
- Optimistic updates

### Auth Service

Handles Firebase Authentication operations:

- Email/password login
- User logout
- Auth state management
- Error handling for auth operations

## Features

- **Authentication**: Secure email/password login with Firebase Auth
- **Route Protection**: All app features are locked behind authentication
- **CRUD Operations**: Create, read, update, and delete species
- **Real-time Updates**: Automatic synchronization across multiple users
- **Search & Filter**: Filter by name, type, price range, and availability
- **Form Validation**: Robust validation using React Hook Form and Zod
- **Cloud Storage**: Firebase Firestore database integration
- **Responsive Design**: CSS Grid layouts for better responsiveness
- **Type Safety**: Full TypeScript support
- **Error Handling**: Comprehensive error handling and user feedback
- **Loading States**: Visual feedback during data operations

## Technologies Used

- React 18
- TypeScript
- Material-UI (MUI)
- React Hook Form
- Zod (validation)
- Firebase Firestore
- Firebase Authentication
- CSS Grid

## Getting Started

### Prerequisites

1. Node.js (version 18 or higher recommended)
2. Firebase project (see [Firebase Setup Guide](./FIREBASE_SETUP.md))

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up Firebase:

   - Follow the [Firebase Setup Guide](./FIREBASE_SETUP.md)
   - Update `src/config/firebase.ts` with your Firebase configuration
   - Enable Authentication and create users in Firebase Console

3. Start the development server:

   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the app.

## Firebase Configuration

Before running the application, you need to:

1. Create a Firebase project
2. Set up Firestore Database
3. Enable Authentication with email/password
4. Create users in Firebase Authentication console
5. Update the Firebase configuration in `src/config/firebase.ts`
6. Set up security rules (see FIREBASE_SETUP.md)

See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed instructions.

## Database Structure

The application uses Firebase Firestore with the following structure:

```
species (collection)
├── document1
│   ├── name: "Species Name"
│   ├── type: "Mrówki"
│   ├── temperature: "25"
│   ├── nestHumidity: "60"
│   ├── arenaHumidity: "70"
│   ├── behavior: "Aggressive"
│   ├── description: "Description"
│   ├── price: 100
│   ├── inStock: true
│   └── changes: [...]
├── document2
└── ...
```

## Security

- **Authentication Required**: All data access requires valid user authentication
- **Firestore Rules**: Database access is restricted to authenticated users only
- **No Registration**: User accounts must be created manually in Firebase Console
- **Secure Configuration**: Environment variables recommended for production

## Environment Variables

For production, use environment variables for Firebase configuration:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

## Future Enhancements

- User roles and permissions
- Firebase Analytics integration
- Import/export functionality
- Advanced filtering options
- Multi-language support
- Offline support with Firebase offline persistence
- Image upload for species photos
- Advanced reporting and analytics
- Password reset functionality
- User profile management
