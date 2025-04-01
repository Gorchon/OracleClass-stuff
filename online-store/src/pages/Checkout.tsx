import { CartItem } from '../components/CartItem';

const mockCartItems = [
    { id: 1, title: 'Wireless Headphones', price: 199.99, quantity: 1 },
    { id: 2, title: 'Phone Case', price: 29.99, quantity: 2 }
];

export const Checkout = () => {
    return (
        <div className="checkout-page">
            <h1>Checkout</h1>

            <div className="checkout-container">
                <div className="shipping-form">
                    <h2>Shipping Information</h2>
                    <form>
                        <input type="text" placeholder="Full Name" />
                        <input type="text" placeholder="Address" />
                        <input type="text" placeholder="City" />
                        <input type="text" placeholder="ZIP Code" />
                        <select>
                            <option>Select Country</option>
                            <option>United States</option>
                            <option>Canada</option>
                        </select>
                    </form>
                </div>

                <div className="order-summary">
                    <h2>Your Order</h2>
                    <div className="order-items">
                        {mockCartItems.map(item => (
                            <CartItem key={item.id} {...item} />
                        ))}
                    </div>

                    <div className="order-totals">
                        <div className="total-row">
                            <span>Subtotal:</span>
                            <span>$259.97</span>
                        </div>
                        <div className="total-row">
                            <span>Shipping:</span>
                            <span>$9.99</span>
                        </div>
                        <div className="total-row grand-total">
                            <span>Total:</span>
                            <span>$269.96</span>
                        </div>
                    </div>

                    <button className="place-order">Place Order</button>
                </div>
            </div>
        </div>
    );
};
