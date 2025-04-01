import { createContext, useContext, useState } from 'react';

type CartItem = {
    id: number;
    title: string;
    price: number;
    quantity: number;
    image: string;
    size?: string;
};

type CartContextType = {
    cartItems: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (id: number, size?: string) => void;
    updateQuantity: (id: number, quantity: number, size?: string) => void;
    clearCart: () => void;
};

const CartContext = createContext<CartContextType>({
    cartItems: [],
    addToCart: () => {},
    removeFromCart: () => {},
    updateQuantity: () => {},
    clearCart: () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const addToCart = (item: Omit<CartItem, 'quantity'>) => {
        setCartItems(prev => {
            const existingItem = prev.find(i =>
                i.id === item.id && i.size === item.size
            );
            if (existingItem) {
                return prev.map(i =>
                    i.id === item.id && i.size === item.size
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (id: number, size?: string) => {
        setCartItems(prev =>
            prev.filter(i => !(i.id === id && i.size === size))
        );
    };

    const updateQuantity = (id: number, quantity: number, size?: string) => {
        if (quantity <= 0) {
            removeFromCart(id, size);
            return;
        }
        setCartItems(prev =>
            prev.map(i =>
                i.id === id && i.size === size ? { ...i, quantity } : i
            )
        );
    };

    const clearCart = () => setCartItems([]);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);