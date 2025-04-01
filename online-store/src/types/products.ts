// src/types/products.ts

export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    stock: number;
};

export interface AdminContextType {
    products: Product[];
    addProduct: (product: Omit<Product, 'id'>) => void;
    updateProduct: (product: Product) => void;
    deleteProduct: (id: number) => void;
};

export interface ProductsResponse {
    data: Product[];
    totalPages: number;
    currentPage: number;
}