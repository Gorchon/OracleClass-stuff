import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import {CartProvider} from "./context/CartContext.tsx";
import {OrderProvider} from "./context/OrderContext.tsx";
import {AdminProvider} from "./context/AdminContext.tsx";


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <CartProvider>
            <OrderProvider>
                <AdminProvider>
                    <App />
                </AdminProvider>
            </OrderProvider>
        </CartProvider>
    </React.StrictMode>
);