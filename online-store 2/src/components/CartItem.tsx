type CartItemProps = {
    id: number;
    title: string;
    price: number;
    quantity: number;
};

export const CartItem = ({ id, title, price, quantity }: CartItemProps) => (
    <div className="cart-item">
        <img src={`https://picsum.photos/100/100?random=${id}`} alt={title} />
        <div>
            <h3>{title}</h3>
            <p>${price.toFixed(2)} × {quantity}</p>
        </div>
        <button>Remove</button>
    </div>
);