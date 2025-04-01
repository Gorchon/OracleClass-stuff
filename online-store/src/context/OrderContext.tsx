import { createContext, useContext, useState } from 'react';

type OrderItem = {
    id: number;
    title: string;
    price: number;
    quantity: number;
    image: string;
};

type Order = {
    id: string;
    date: string;
    items: OrderItem[];
    total: number;
    status: 'pending' | 'shipped' | 'delivered';
    address: string;
};

type OrderContextType = {
    orders: Order[];
    addOrder: (order: Omit<Order, 'id' | 'date'>) => void;
    updateOrderStatus: (id: string, status: Order['status']) => void;
};

const OrderContext = createContext<OrderContextType>({
    orders: [],
    addOrder: () => {},
    updateOrderStatus: () => {},
});

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
    const [orders, setOrders] = useState<Order[]>([]);

    const addOrder = (order: Omit<Order, 'id' | 'date'>) => {
        const newOrder: Order = {
            ...order,
            id: Date.now().toString(),
            date: new Date().toISOString(),
        };
        setOrders(prev => [newOrder, ...prev]);
    };

    const updateOrderStatus = (id: string, status: Order['status']) => {
        setOrders(prev =>
            prev.map(order =>
                order.id === id ? { ...order, status } : order
            )
        );
    };

    return (
        <OrderContext.Provider
            value={{
                orders,
                addOrder,
                updateOrderStatus,
            }}
        >
            {children}
        </OrderContext.Provider>
    );
};

export const useOrders = () => useContext(OrderContext);