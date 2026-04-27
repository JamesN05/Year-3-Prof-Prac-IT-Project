import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import * as firebaseAuthRN from "@firebase/auth";
import { initializeAuth, Persistence } from "firebase/auth";
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

// getReactNativePersistence exists in the RN bundle of @firebase/auth but
// is absent from the shared TS types. Cast the module to expose it.
const { getReactNativePersistence } = firebaseAuthRN as unknown as {
  getReactNativePersistence: (storage: typeof AsyncStorage) => Persistence;
};

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
