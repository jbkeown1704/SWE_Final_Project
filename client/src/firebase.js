// Okay, so this is my main Firebase setup file. I've gotta import the core functions
// I need to connect to my Firebase project. `initializeApp` is the most important one.
import { initializeApp } from "firebase/app";
// Importing `getAnalytics` to track user behavior. Good for seeing what parts of the app are used most.
import { getAnalytics } from "firebase/analytics";
// `getAuth` is for user authentication. I'll need this for login and signup.
import { getAuth } from "firebase/auth";
// And `getFirestore` is for the database. This is where I'm storing all my event and report data.
import { getFirestore } from "firebase/firestore";

// This is the Firebase configuration object. It's a bunch of unique keys and IDs
// that Firebase gives you for your specific project.
// I've copied this directly from the Firebase console, so it should be correct.
const firebaseConfig = {
  // `apiKey`: My app's unique key for accessing Firebase services.
  apiKey: "AIzaSyDgZx4BgtU_-Vy4Z-H61E7KHBrOzd2nT2I",
  // `authDomain`: The domain for handling authentication redirects.
  authDomain: "spes-bcf0a.firebaseapp.com",
  // `projectId`: The unique ID for my project.
  projectId: "spes-bcf0a",
  // `storageBucket`: Where I can store images and other files.
  storageBucket: "spes-bcf0a.firebasestorage.app",
  // `messagingSenderId`: For push notifications, though I'm not using that yet.
  messagingSenderId: "560277357100",
  // `appId`: Another unique ID for this specific web app instance.
  appId: "1:560277357100:web:1a92ce8caa230c13744789",
  // `measurementId`: This is specifically for Google Analytics.
  measurementId: "G-4NJHXC6LM3"
};

// Initialize the Firebase app with the configuration. This needs to be done first.
const app = initializeApp(firebaseConfig);
// Initialize Analytics. This should be good to go now.
const analytics = getAnalytics(app);

// Now, I'm exporting the `auth` and `db` services so I can use them
// in any other file where I need to interact with Firebase. This is the whole point
// of this file—to create these connections and make them available throughout the app.
export const auth = getAuth(app);
export const db = getFirestore(app);