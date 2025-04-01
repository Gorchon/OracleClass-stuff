import { useState } from 'react';
import { OrderCard } from '../components/OrderCard';
import { useOrders } from '../context/OrderContext';

export const Orders = () => {
    const { orders } = useOrders();
    const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'delivered'>('all');

    const filteredOrders = orders.filter(order => {
        if (activeTab === 'all') return true;
        return order.status === activeTab;
    });

    return (
        <div className="orders-page">
            <div className="container">
                <h1>Your Orders</h1>

                <div className="order-tabs">
                    <button
                        className={activeTab === 'all' ? 'active' : ''}
                        onClick={() => setActiveTab('all')}
                    >
                        All Orders
                    </button>
                    <button
                        className={activeTab === 'pending' ? 'active' : ''}
                        onClick={() => setActiveTab('pending')}
                    >
                        Pending
                    </button>
                    <button
                        className={activeTab === 'delivered' ? 'active' : ''}
                        onClick={() => setActiveTab('delivered')}
                    >
                        Delivered
                    </button>
                </div>

                <div className="orders-list">
                    {filteredOrders.length === 0 ? (
                        <div className="no-orders">
                            <p>No {activeTab === 'all' ? '' : activeTab} orders found</p>
                            <a href="/products" className="shop-link">
                                Continue Shopping
                            </a>
                        </div>
                    ) : (
                        filteredOrders.map(order => (
                            <OrderCard key={order.id} order={order} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};