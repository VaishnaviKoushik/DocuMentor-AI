// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// IMPORTANT: Replace this with your actual Firebase project configuration
const firebaseConfig = {
  projectId: "studio-4980569185-4ba82",
  appId: "1:450774942829:web:92ddd39d82204e48842b64",
  apiKey: "Your API key ",
  authDomain: "studio-4980569185-4ba82.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "450774942829"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
