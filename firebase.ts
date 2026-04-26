import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD7D63AGe7iSs5e47trrFTw7-jUSinRgzc",
  authDomain: "taskmaxxing.firebaseapp.com",
  projectId: "taskmaxxing",
  storageBucket: "taskmaxxing.firebasestorage.app",
  messagingSenderId: "769234401259",
  appId: "1:769234401259:web:5283f057d3f5dfc3494bae",
  measurementId: "G-JNNKKW7W4G",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
