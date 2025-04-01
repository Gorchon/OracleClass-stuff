export const Orders = () => {
    const orders = [
        {
            id: 'ORD-12345',
            date: '2023-10-15',
            total: 269.96,
            status: 'Delivered',
            items: [
                { id: 1, title: 'Wireless Headphones', quantity: 1, price: 199.99 },
                { id: 2, title: 'Phone Case', quantity: 2, price: 29.99 }
            ]
        },
        {
            id: 'ORD-12344',
            date: '2023-09-28',
            total: 89.97,
            status: 'Shipped',
            items: [
                { id: 3, title: 'USB Cable', quantity: 3, price: 9.99 }
            ]
        }
    ];

    return (
        <div className="orders-page">
            <h1>Your Orders</h1>

            <div className="orders-list">
                {orders.map(order => (
                    <div key={order.id} className="order-card">
                        <div className="order-header">
                            <div>
                                <span className="order-id">Order #{order.id}</span>
                                <span className="order-date">Placed on {order.date}</span>
                            </div>
                            <div>
                                <span className="order-total">${order.total.toFixed(2)}</span>
                                <span className={`order-status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
                            </div>
                        </div>

                        <div className="order-items">
                            {order.items.map(item => (
                                <div key={item.id} className="order-item">
                                    <img src={`https://picsum.photos/100/100?random=${item.id}`} alt={item.title} />
                                    <div>
                                        <p>{item.title}</p>
                                        <p>Qty: {item.quantity}</p>
                                    </div>
                                    <p>${item.price.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>

                        <button className="order-action">Track Package</button>
                    </div>
                ))}
            </div>
        </div>
    );
};