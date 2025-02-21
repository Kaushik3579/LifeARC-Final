import React from 'react';
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  collection,
  query,
  where,
  getDocs 
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJu67Qm59LqfGT1TH9ggmsCzb8wB__2HU",
  authDomain: "lifearcai-a8ef3.firebaseapp.com",
  projectId: "lifearcai-a8ef3",
  storageBucket: "lifearcai-a8ef3.appspot.com",
  messagingSenderId: "378111666114",
  appId: "1:378111666114:web:ac458213d594c77a01185b",
  measurementId: "G-RJWV9L5V3B",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
  }
};

const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};

// Export Firebase modules for easy use
export { 
  app,
  auth, 
  provider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  db, 
  doc, 
  setDoc, 
  getDoc,
  collection,
  query,
  where,
  getDocs,
  signInWithGoogle,
  signOutUser
};
