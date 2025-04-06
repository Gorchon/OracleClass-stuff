// src/services/api.ts

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
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
const db = getFirestore(app);

// -------------------------------------------
// 2) Product Seeding Array (10 items)
//    (Uses 'rating' & 'createdAt', even though your interface lacks them.)
// -------------------------------------------
const products = [
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
  {
    title: "Mechanical Keyboard",
    description: "RGB mechanical keyboard with blue switches.",
    price: 79.99,
    category: "Electronics",
    image:
      "https://media.wired.com/photos/65b0438c22aa647640de5c75/master/w_2560%2Cc_limit/Mechanical-Keyboard-Guide-Gear-GettyImages-1313504623.jpg",
    stock: 30,
    rating: 4.7,
    createdAt: new Date(),
  },
  {
    title: "Gaming Headset",
    description: "Surround sound gaming headset with noise cancellation.",
    price: 49.99,
    category: "Accessories",
    image:
      "https://assets2.razerzone.com/images/pnx.assets/57c2af30b5d9a2b699b3e896b788e00f/headset-landingpg-500x500-blacksharkv2pro2023.jpg",
    stock: 20,
    rating: 4.6,
    createdAt: new Date(),
  },
  {
    title: "Smartphone Stand",
    description: "Adjustable smartphone stand for desk use.",
    price: 15.99,
    category: "Accessories",
    image:
      "https://www.apps2car.com/cdn/shop/products/tripod-phone-stand.jpg?v=1652323294",
    stock: 100,
    rating: 4.3,
    createdAt: new Date(),
  },
  {
    title: "Bluetooth Speaker",
    description: "Portable Bluetooth speaker with deep bass.",
    price: 39.99,
    category: "Audio",
    image:
      "https://cdn.thewirecutter.com/wp-content/media/2024/11/portablebluetoothspeakers-2048px-9481.jpg?auto=webp&quality=75&width=1024",
    stock: 25,
    rating: 4.8,
    createdAt: new Date(),
  },
  {
    title: "USB-C Hub",
    description: "5-in-1 USB-C hub with HDMI and SD card reader.",
    price: 29.99,
    category: "Electronics",
    image:
      "https://m.media-amazon.com/images/I/61Bm+9UTP6L._AC_UF1000,1000_QL80_.jpg",
    stock: 40,
    rating: 4.5,
    createdAt: new Date(),
  },
  {
    title: "Laptop Stand",
    description: "Aluminum laptop stand for better ergonomics.",
    price: 34.99,
    category: "Office",
    image: "https://m.media-amazon.com/images/I/71xlXzGX9aL._AC_SL1500_.jpg",
    stock: 60,
    rating: 4.7,
    createdAt: new Date(),
  },
  {
    title: "Wireless Charger",
    description: "Fast wireless charger for Qi-compatible devices.",
    price: 19.99,
    category: "Accessories",
    image:
      "https://www.ikea.com/mx/en/images/products/livboj-wireless-charger-white__0721950_pe733427_s5.jpg?f=s",
    stock: 35,
    rating: 4.6,
    createdAt: new Date(),
  },
  {
    title: "Noise Cancelling Earbuds",
    description: "Wireless earbuds with active noise cancellation.",
    price: 89.99,
    category: "Audio",
    image:
      "https://cdn.thewirecutter.com/wp-content/media/2023/09/noise-cancelling-headphone-2048px-0872.jpg",
    stock: 15,
    rating: 4.9,
    createdAt: new Date(),
  },
  {
    title: "4K Monitor",
    description: "27-inch 4K UHD monitor with HDR support.",
    price: 299.99,
    category: "Electronics",
    image:
      "https://assets-prd.ignimgs.com/2024/10/08/alienware-aw3225qf-1718732594021-1728418469322.jpg",
    stock: 10,
    rating: 4.8,
    createdAt: new Date(),
  },
];

/**
 * 3) We'll store a cached array from Firestore, to avoid re-fetching every time.
 */
let allProducts: Product[] = [];

/**
 * 4) getProducts():
 *    - Loads from Firestore "products" collection.
 *    - If empty & source === "home", seeds with the 10 items above.
 *    - Returns the final array of products (with numeric IDs).
 */
export const getProducts = async (source: string): Promise<Product[]> => {
  try {
    const productsCol = collection(db, "products");
    const snapshot = await getDocs(productsCol);

    // If Firestore is empty and we're on home, seed it.
    if (snapshot.size === 0 && source === "home") {
      // Insert each product with a numeric `id` (1..10)
      for (let i = 0; i < products.length; i++) {
        await addDoc(productsCol, { id: i + 1, ...products[i] });
      }
      console.log("Seeded Firestore with 10 products.");

      // Return them with numeric IDs
      return products.map((p, i) => ({ id: i + 1, ...p })) as Product[];
    }

    // If not empty, read them all from Firestore
    const loadedProducts: Product[] = snapshot.docs.map((doc) => {
      // doc.data() has { id, title, ...plus rating, createdAt, etc. }
      return doc.data() as Product;
    });

    return loadedProducts;
  } catch (error) {
    console.error("Error in getProducts:", error);
    throw error;
  }
};

/**
 * 5) fetchProducts():
 *    - Calls getProducts() to ensure we have the latest data from Firestore.
 *    - Applies optional category/search filters.
 *    - Paginates the result set.
 */
export const fetchProducts = async (params: {
  page: number;
  perPage?: number;
  category?: string;
  query?: string;
  source: string; // e.g. "home"
}): Promise<ProductsResponse> => {
  const { page, category, query, source } = params;
  const perPage = params.perPage ?? 20;
  const startIndex = (page - 1) * perPage;

  // Load from Firestore if we haven't yet, or re-load each time
  allProducts = await getProducts(source);

  // Filter by category
  let filtered = [...allProducts];
  if (category) {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Filter by query
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  // Pagination
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const data = filtered.slice(startIndex, startIndex + perPage);

  return {
    data,
    totalPages,
    currentPage: page,
  };
};

/**
 * 6) fetchProductById():
 *    - If our cached `allProducts` is empty, reload from Firestore.
 *    - Find by numeric "id" property.
 */
export const fetchProductById = async (
  id: number
): Promise<Product | undefined> => {
  if (!allProducts.length) {
    // Just load them all with a generic "source"
    allProducts = await getProducts("any");
  }
  return allProducts.find((p) => p.id === id);
};
