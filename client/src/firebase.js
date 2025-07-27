import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDgZx4BgtU_-Vy4Z-H61E7KHBrOzd2nT2I",
  authDomain: "spes-bcf0a.firebaseapp.com",
  projectId: "spes-bcf0a",
  storageBucket: "spes-bcf0a.firebasestorage.app",
  messagingSenderId: "560277357100",
  appId: "1:560277357100:web:1a92ce8caa230c13744789",
  measurementId: "G-4NJHXC6LM3"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
