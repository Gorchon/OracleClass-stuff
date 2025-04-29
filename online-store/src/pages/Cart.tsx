import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import { Link } from "react-router-dom";
import { CartItem } from "../types/ cart";
import { Product } from "../types/products";

export const Cart = () => {
  // 2. Constants for cart, products, and cartItems
  const { cart, loading, updateItemQuantity, removeFromCart, clearUserCart } =
    useCart();
  const { products, loading: productsLoading } = useProducts();
  const [cartItems, setCartItems] = useState<Array<{
    product: Product;
    cartItem: CartItem;
  }> | null>(null);

  // 3. useEffect to set cartItems
  useEffect(() => {
    if (cart && products) {
      const items = cart.items
        .map((item) => {
          const product = products.find((p) => p.id === item.productId);
          return product ? { product, cartItem: item } : null;
        })
        .filter(Boolean) as Array<{
        product: Product;
        cartItem: CartItem;
      }>;
      setCartItems(items);
    } else {
      setCartItems(null);
    }
  }, [cart, products]);

  // 4. Functions
  const handleQuantityChange = async (
    productId: string,
    newQuantity: number
  ) => {
    await updateItemQuantity(productId, newQuantity);
  };

  const handleRemoveItem = async (productId: string) => {
    await removeFromCart(productId);
  };

  const handleClearCart = async () => {
    await clearUserCart();
  };

  const calculateTotal = () => {
    if (!cartItems) return 0;
    return cartItems.reduce((total, { product, cartItem }) => {
      return total + product.price * cartItem.quantity;
    }, 0);
  };

  // 5. Loading and empty cart
  if (loading || productsLoading) {
    return <div>Loading cart...</div>;
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <Link to="/products" className="continue-shopping">
          Continue Shopping
        </Link>
      </div>
    );
  }

  // 6. Final return
  return (
    <div className="cart-page">
      <div className="cart-page-container">
        <h1>Your Shopping Cart</h1>
        <div className="cart-content-wrapper">
          <div className="cart-items-list">
            {cartItems.map(({ product, cartItem }) => (
              <div key={product.id} className="cart-item-card">
                <div className="cart-item-info">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <h3>{product.title}</h3>
                    <p>${product.price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="cart-quantity-controls">
                  <button
                    onClick={() =>
                      handleQuantityChange(product.id, cartItem.quantity - 1)
                    }
                    disabled={cartItem.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{cartItem.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(product.id, cartItem.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>

                <div className="cart-item-total">
                  ${(product.price * cartItem.quantity).toFixed(2)}
                </div>

                <button
                  onClick={() => handleRemoveItem(product.id)}
                  className="cart-remove-item"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary-section">
            <h2>Order Summary</h2>
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Estimated Shipping</span>
              <span>$0.00</span>
            </div>
            <div className="cart-summary-row total">
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>

            <button className="cart-checkout-btn">Proceed to Checkout</button>

            <button onClick={handleClearCart} className="cart-clear-btn">
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
