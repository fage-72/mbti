// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDWGvTc5mKdffC0zxzPfG6vNxedSnfMr10",
  authDomain: "mbti-844f1.firebaseapp.com",
  projectId: "mbti-844f1",
  storageBucket: "mbti-844f1.firebasestorage.app",
  messagingSenderId: "498004791450",
  appId: "1:498004791450:web:1362bd16a63a7516938f23",
  measurementId: "G-JE3YQWY6L0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);