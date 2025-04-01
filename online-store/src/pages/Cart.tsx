import { Link } from 'react-router-dom';
import { CartItem } from '../components/CartItem';
import { useCart } from '../context/CartContext';

export const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity } = useCart();

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const shipping = subtotal > 100 ? 0 : 10;
    const total = subtotal + shipping;

    return (
        <div className="cart-page">
            <div className="container">
                <h1>Your Shopping Cart</h1>

                {cartItems.length === 0 ? (
                    <div className="empty-cart">
                        <p>Your cart is empty</p>
                        <Link to="/products" className="continue-shopping">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="cart-layout">
                        <div className="cart-items">
                            {cartItems.map(item => (
                                <CartItem
                                    key={`${item.id}-${item.size || ''}`}
                                    item={item}
                                    onRemove={removeFromCart}
                                    onQuantityChange={updateQuantity}
                                />
                            ))}
                        </div>

                        <div className="cart-summary">
                            <h2>Order Summary</h2>
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span>${shipping.toFixed(2)}</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <Link to="/checkout" className="checkout-button">
                                Proceed to Checkout
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};