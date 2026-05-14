import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDieNS3eWdbTOGOy4i2PEBO76tlAB5pvFA",
  authDomain: "football-trivia-164b3.firebaseapp.com",
  projectId: "football-trivia-164b3",
  storageBucket: "football-trivia-164b3.firebasestorage.app",
  messagingSenderId: "755112604654",
  appId: "1:755112604654:web:f3291f11e7e5773a3254ff",
  measurementId: "G-4SE2EPQWY9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export { app, db, analytics };
