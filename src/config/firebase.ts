import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8eLg4rOjoOcQ_kQn-40aAdsTuH_83XpA",
  authDomain: "magazyn-patryka.firebaseapp.com",
  projectId: "magazyn-patryka",
  storageBucket: "magazyn-patryka.firebasestorage.app",
  messagingSenderId: "580912837406",
  appId: "1:580912837406:web:7794ccf34ef457984e0f0f",
  measurementId: "G-QHT4RH5KW7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Firebase Auth
export const auth = getAuth(app);

export default app;
