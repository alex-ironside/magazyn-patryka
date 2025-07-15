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

## 3. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"
5. **Important**: Disable "Allow users to sign up" if you want to control user creation manually
6. Go to the "Users" tab to manually add users:
   - Click "Add user"
   - Enter email and password
   - Click "Add user"

## 4. Get Firebase Configuration

1. In your Firebase project, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "species-app")
6. Copy the Firebase configuration object

## 5. Update Firebase Configuration

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

## 6. Set up Firestore Security Rules

For production, you should set up proper security rules. In Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to species collection only for authenticated users
    // Users can only access their own data (where userId matches their auth uid)
    match /species/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

This ensures that:

- Only authenticated users can access the species data
- Users can only read, update, and delete species they created (userId matches their auth uid)
- Users can only create new species with their own userId

## 7. Database Structure

The application will automatically create the following structure in Firestore:

```
species (collection)
├── document1
│   ├── userId: "user123"        # User ID who created this species
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

Each species document is tied to a specific user through the `userId` field, ensuring data isolation between users.

## 8. Test the Setup

1. Start your development server: `npm start`
2. You should see a login screen
3. Use the email/password you created in the Firebase Authentication console
4. After successful login, you'll see the species management interface
5. Try adding a new species
6. Check your Firestore Database to see if the data appears
7. Test real-time updates by opening multiple browser tabs

## 9. Environment Variables (Recommended)

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

## 10. Deployment Considerations

- Set up proper Firestore security rules before production
- Ensure authentication is properly configured
- Set up Firebase Analytics if needed
- Configure proper CORS settings if deploying to a custom domain
- Consider implementing user roles and permissions for different access levels

## Troubleshooting

- **Permission denied errors**: Check your Firestore security rules and ensure user is authenticated
- **Authentication errors**: Verify that email/password authentication is enabled and user exists
- **Configuration errors**: Verify your Firebase config in `firebase.ts`
- **Network errors**: Check your internet connection and Firebase project status
- **Real-time updates not working**: Ensure you're using the correct collection name and user is authenticated
