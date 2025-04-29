// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";

import { AuthProvider } from "./context/AuthContext.tsx";
import { CartProvider } from "./context/CartContext.tsx";
import { OrderProvider } from "./context/OrderContext.tsx";
import { AdminProvider } from "./context/AdminContext.tsx";
import { ProductProvider } from "./context/ProductContext.tsx";
import { initializeProducts } from "./services/productService.ts"; // ✅ Add this import

// Seed products on startup
await initializeProducts();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <ProductProvider>
        <OrderProvider>
          <AdminProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </AdminProvider>
        </OrderProvider>
      </ProductProvider>
    </AuthProvider>
  </React.StrictMode>
);
