import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";
import { CartProvider } from "./context/CartContext.tsx";
import { OrderProvider } from "./context/OrderContext.tsx";
import { AdminProvider } from "./context/AdminContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ProductProvider } from "./context/ProductContext.tsx";
import {
  PayPalScriptProvider,
  ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js";

const initialOptions = {
  "client-id":
    "AfPGBFi5aVLfT-0ZdS3Y0tM1PwIE2w_-7a_EqawbGk3YNZYcv-3futVMNJS9vPZcuIaoAPBsL67SU0dG",
  currency: "USD",
  intent: "capture",
};

import { initializeProducts } from "./services/productService.ts";

await initializeProducts();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <ProductProvider>
        <OrderProvider>
          <AdminProvider>
            <CartProvider>
              <PayPalScriptProvider
                options={initialOptions as ReactPayPalScriptOptions}
              >
                <App />
              </PayPalScriptProvider>
            </CartProvider>
          </AdminProvider>
        </OrderProvider>
      </ProductProvider>
    </AuthProvider>
  </React.StrictMode>
);
