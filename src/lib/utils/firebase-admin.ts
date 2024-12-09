import { initializeApp } from "firebase/app";  
import { getStorage } from "firebase/storage";  

// Firebase configuration using environment variables  
const firebaseConfig = {  
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, // Public-facing keys can use NEXT_PUBLIC prefix  
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,  
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,  
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,  
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,  
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,  
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,  
};  

// Initialize Firebase  
const app = initializeApp(firebaseConfig);  

// Initialize Firebase Storage  
export const storage = getStorage(app);  