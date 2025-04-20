import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

import { auth, db } from "./firebaseConfig.ts";
import { StoreUser } from "../types/user.ts";

// Google Sign-In
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: "customer",
        createdAt: new Date(),
      });
    }

    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

// Email/Password Sign-In
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error signing in with email:", error);
    throw error;
  }
};

// Email/Password Registration
export const registerWithEmail = async (
  email: string,
  password: string,
  displayName: string
) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName,
      role: "customer",
      createdAt: new Date(),
    });

    return user;
  } catch (error) {
    console.error("Error registering with email:", error);
    throw error;
  }
};

// Logout
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Get User Role
export const getUserRole = async (userId: string): Promise<string> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return (userDoc.data() as StoreUser).role || "customer";
    }
    return "customer";
  } catch (error) {
    console.error("Error getting user role:", error);
    return "customer";
  }
};

// Get Display Name
export const getUserDisplayName = async (userId: string): Promise<string> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return (userDoc.data() as StoreUser).displayName || "";
    }
    return "";
  } catch (error) {
    console.error("Error getting user displayName:", error);
    return "";
  }
};

// Update Role
export const updateUserRole = async (userId: string, role: string) => {
  try {
    await updateDoc(doc(db, "users", userId), { role });
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};

// Auth listener
export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  return auth.onAuthStateChanged(callback);
};
