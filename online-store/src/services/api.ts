// src/services/api.ts

import { initializeApp } from "firebase/app";

// Firestore imports (now including setDoc)
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";

// Auth imports
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";

import { Product, ProductsResponse } from "../types/products";

// -------------------------------------------
// 1) Firebase Initialization
// -------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyDMi2Qcx2FOb_b2ZVl1LwaZtG61A7S9Pm8",
  authDomain: "e-store-a01254831.firebaseapp.com",
  projectId: "e-store-a01254831",
  storageBucket: "e-store-a01254831.firebasestorage.app",
  messagingSenderId: "353079643387",
  appId: "1:353079643387:web:a34b1b71698f6ca199b45e",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);

// Google provider for OAuth
const googleProvider = new GoogleAuthProvider();

// -------------------------------------------
// 2) Authentication Helpers
// -------------------------------------------

/**
 * Sign in with Google popup, and on first-time login
 * create a user doc under "users" with default role + timestamp.
 */
export const signInWithGoogle = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // check if already in Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: "customer", // default role
        createdAt: Timestamp.fromDate(new Date()),
      });
    }

    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

/**
 * Sign in with email & password
 */
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error signing in with email:", error);
    throw error;
  }
};

/**
 * Register a new user with email & password, then
 * create a Firestore user doc with default role + timestamp.
 */
export const registerWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName,
      role: "customer", // default role
      createdAt: Timestamp.fromDate(new Date()),
    });

    return user;
  } catch (error) {
    console.error("Error registering with email:", error);
    throw error;
  }
};

/**
 * Simple sign‑out wrapper
 */
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

/**
 * Lookup a user's role in Firestore by UID
 */
export const getUserRole = async (userId: string): Promise<string> => {
  try {
    const userSnap = await getDoc(doc(db, "users", userId));
    if (userSnap.exists()) {
      return (userSnap.data().role as string) || "customer";
    }
    return "customer";
  } catch (error) {
    console.error("Error getting user role:", error);
    return "customer";
  }
};

/**
 * Lookup a user's displayName in Firestore by UID
 */
export const getUserDisplayName = async (userId: string): Promise<string> => {
  try {
    const userSnap = await getDoc(doc(db, "users", userId));
    if (userSnap.exists()) {
      return (userSnap.data().displayName as string) || "";
    }
    return "";
  } catch (error) {
    console.error("Error getting user displayName:", error);
    return "";
  }
};

// -------------------------------------------
// 3) Product Seeding Array
// -------------------------------------------
const products: Omit<Product, "id">[] = [
  {
    title: "Wireless Mouse",
    description: "Ergonomic wireless mouse with long battery life.",
    price: 25.99,
    category: "Electronics",
    image:
      "https://www.keychron.mx/cdn/shop/files/Lemokey-G1-wireless-mouse-black.jpg?v=1724653193",
    stock: 50,
    rating: 4.5,
    createdAt: new Date(),
  },
  // ... the rest of your 10 products, each with createdAt: new Date()
];

// -------------------------------------------
// 4) Cached Array
// -------------------------------------------
let allProducts: Product[] = [];

// -------------------------------------------
// 5) initializeProducts()
// -------------------------------------------
export const initializeProducts = async (): Promise<void> => {
  try {
    const productsCollection = collection(db, "products");
    const snapshot = await getDocs(productsCollection);

    if (snapshot.empty) {
      for (const prod of products) {
        await addDoc(productsCollection, prod);
        console.log(`Added: ${prod.title}`);
      }
      console.log("All products added successfully.");
    }
  } catch (error) {
    console.error("Error initializing products: ", error);
  }
};

// -------------------------------------------
// 6) getProducts()
// -------------------------------------------
export const getProducts = async (): Promise<Product[]> => {
  try {
    const productsCollection = collection(db, "products");
    const snapshot = await getDocs(productsCollection);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Product[];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// -------------------------------------------
// 7) fetchProducts()
// -------------------------------------------
export const fetchProducts = async (params: {
  page: number;
  perPage?: number;
  category?: string;
  query?: string;
}): Promise<ProductsResponse> => {
  const { page, category, query } = params;
  const perPage = params.perPage ?? 20;
  const startIndex = (page - 1) * perPage;

  allProducts = await getProducts();

  let filtered = [...allProducts];
  if (category) {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const data = filtered.slice(startIndex, startIndex + perPage);

  return { data, totalPages, currentPage: page };
};

// -------------------------------------------
// 8) fetchProductById()
// -------------------------------------------
export const fetchProductById = async (
  id: string
): Promise<Product | undefined> => {
  try {
    const productRef = doc(db, "products", id);
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
      return { id: productSnap.id, ...productSnap.data() } as Product;
    }
    return undefined;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  }
};
