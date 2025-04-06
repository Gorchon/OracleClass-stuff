// Firebase setup
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDMi2Qcx2FOb_b2ZVl1LwaZtG61A7S9Pm8",
  authDomain: "e-store-a01254831.firebaseapp.com",
  projectId: "e-store-a01254831",
  storageBucket: "e-store-a01254831.firebasestorage.app",
  messagingSenderId: "353079643387",
  appId: "1:353079643387:web:a34b1b71698f6ca199b45e",
};

const app = initializeApp(firebaseConfig);

// Products mock and fetch logic
import { Product, ProductsResponse } from "../types/products";

// Generate 100 dummy products for simulation
const generateMockProducts = (): Product[] => {
  const categories = ["Electronics", "Clothing", "Home", "Beauty", "Sports"];
  const brands = ["Apple", "Samsung", "Nike", "Sony", "Adidas", "Dell", "LG"];

  return Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    title: `Product ${i + 1}`,
    price: parseFloat((Math.random() * 500 + 10).toFixed(2)),
    rating: Math.floor(Math.random() * 3) + 2, // 2-5 stars
    image: `https://picsum.photos/300/300?random=${i}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    brand: brands[Math.floor(Math.random() * brands.length)],
    description: `This is a detailed description for Product ${
      i + 1
    }. It includes all relevant features and specifications.`,
    stock: Math.floor(Math.random() * 100),
  }));
};

const allProducts = generateMockProducts();

export const fetchProducts = async (params: {
  page: number;
  perPage?: number;
  category?: string;
  query?: string;
}): Promise<ProductsResponse> => {
  const perPage = params.perPage || 20;
  const startIndex = (params.page - 1) * perPage;

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Filter products by category if specified
  let filteredProducts = [...allProducts];
  if (params.category) {
    filteredProducts = filteredProducts.filter(
      (p) => p.category.toLowerCase() === params.category?.toLowerCase()
    );
  }

  // Filter by search query if specified
  if (params.query) {
    const query = params.query.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }

  // Calculate pagination
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + perPage
  );

  return {
    data: paginatedProducts,
    totalPages,
    currentPage: params.page,
  };
};

// Utility function for single product fetch
export const fetchProductById = async (
  id: number
): Promise<Product | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return allProducts.find((p) => p.id === id);
};
