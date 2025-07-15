# Firebase Setup Guide

This guide will help you set up Firebase for the Species Management System.

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "species-management")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## 2. Set up Firestore Database

1. In your Firebase project, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development (you can secure it later)
4. Select a location for your database (choose the closest to your users)
5. Click "Done"

## 3. Get Firebase Configuration

1. In your Firebase project, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "species-app")
6. Copy the Firebase configuration object

## 4. Update Firebase Configuration

1. Open `src/config/firebase.ts`
2. Replace the placeholder configuration with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
};
```

## 5. Set up Firestore Security Rules (Optional)

For production, you should set up proper security rules. In Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to species collection
    match /species/{document} {
      allow read, write: if true; // For development only
    }
  }
}
```

For production, implement proper authentication and authorization.

## 6. Database Structure

The application will automatically create the following structure in Firestore:

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

## 7. Test the Setup

1. Start your development server: `npm start`
2. Try adding a new species
3. Check your Firestore Database to see if the data appears
4. Test real-time updates by opening multiple browser tabs

## 8. Environment Variables (Recommended)

For better security, use environment variables:

1. Create a `.env` file in your project root:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

2. Update `src/config/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};
```

## 9. Deployment Considerations

- Set up proper Firestore security rules before production
- Consider implementing user authentication
- Set up Firebase Analytics if needed
- Configure proper CORS settings if deploying to a custom domain

## Troubleshooting

- **Permission denied errors**: Check your Firestore security rules
- **Configuration errors**: Verify your Firebase config in `firebase.ts`
- **Network errors**: Check your internet connection and Firebase project status
- **Real-time updates not working**: Ensure you're using the correct collection name
