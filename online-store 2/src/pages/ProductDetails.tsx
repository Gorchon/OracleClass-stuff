import { Breadcrumbs } from '../components/Breadcrumbs';
import { RatingStars } from '../components/RatingStars';

export const ProductDetails = () => {
    // Hardcoded product data
    const product = {
        id: 1,
        title: 'Premium Wireless Headphones',
        price: 199.99,
        rating: 4,
        description: 'Experience crystal-clear sound with our premium noise-cancelling headphones. 40-hour battery life, comfortable over-ear design, and Bluetooth 5.0 connectivity.',
        features: [
            'Active Noise Cancellation',
            '40-hour battery',
            'Bluetooth 5.0',
            'Built-in microphone'
        ],
        images: [
            'https://picsum.photos/600/400?random=1',
            'https://picsum.photos/600/400?random=2',
            'https://picsum.photos/600/400?random=3'
        ]
    };

    return (
        <div className="product-details">
            <Breadcrumbs />

            <div className="product-container">
                <div className="product-gallery">
                    {product.images.map((img, index) => (
                        <img key={index} src={img} alt={`Product view ${index + 1}`} />
                    ))}
                </div>

                <div className="product-info">
                    <h1>{product.title}</h1>
                    <RatingStars rating={product.rating} />
                    <p className="price">${product.price.toFixed(2)}</p>

                    <div className="product-description">
                        <p>{product.description}</p>
                        <ul>
                            {product.features.map((feature, index) => (
                                <li key={index}>{feature}</li>
                            ))}
                        </ul>
                    </div>

                    <button className="add-to-cart">Add to Cart</button>
                </div>
            </div>
        </div>
    );
};