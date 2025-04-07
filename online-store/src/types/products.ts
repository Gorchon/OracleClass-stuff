// src/types/products.ts

export interface Product {
  id: string; // numeric ID you’re embedding in Firestore
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  stock: number;

  // Added optional fields:
  rating?: number; // e.g. 4.5
  createdAt?: Date; // e.g. new Date()
}

export interface AdminContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: number) => void;
}

export interface ProductsResponse {
  data: Product[];
  totalPages: number;
  currentPage: number;
}
