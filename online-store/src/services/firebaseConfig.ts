import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDMi2Qcx2FOb_b2ZVl1LwaZtG61A7S9Pm8",
  authDomain: "e-store-a01254831.firebaseapp.com",
  projectId: "e-store-a01254831",
  storageBucket: "e-store-a01254831.firebasestorage.app",
  messagingSenderId: "353079643387",
  appId: "1:353079643387:web:a34b1b71698f6ca199b45e",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
