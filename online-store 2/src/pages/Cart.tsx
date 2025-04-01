import { CartItem } from '../components/CartItem';

const mockCartItems = [
    { id: 1, title: 'Wireless Headphones', price: 99.99, quantity: 2 },
    { id: 2, title: 'Smart Watch', price: 199.99, quantity: 1 },
];

export const Cart = () => (
    <div className="cart-page">
        <h1>Your Cart</h1>
        <div className="cart-items">
            {mockCartItems.map(item => (
                <CartItem key={item.id} {...item} />
            ))}
        </div>
        <div className="cart-total">
            <h3>Total: $399.97</h3>
            <button>Proceed to Checkout</button>
        </div>
    </div>
);