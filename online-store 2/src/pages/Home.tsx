import { ProductCard } from '../components/ProductCard';
import { SearchBar } from '../components/SearchBar';
import { useState } from 'react';
import {Product} from "../types/products.ts";

export const Home = () => {
    // Mock product data
    const [products] = useState<Product[]>([
        {
            id: 1,
            title: 'Wireless Bluetooth Headphones',
            price: 99.99,
            rating: 4.5,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
            category: 'Electronics'
        },
        {
            id: 2,
            title: 'Smart Watch with Fitness Tracker',
            price: 149.99,
            rating: 4.2,
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
            category: 'Electronics'
        },
        {
            id: 3,
            title: 'Organic Cotton T-Shirt',
            price: 24.99,
            rating: 4.0,
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
            category: 'Clothing'
        },
        {
            id: 4,
            title: 'Stainless Steel Water Bottle',
            price: 19.99,
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
            category: 'Accessories'
        },
        {
            id: 5,
            title: 'Wireless Phone Charger',
            price: 29.99,
            rating: 3.9,
            image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
            category: 'Electronics'
        },
        {
            id: 6,
            title: 'Leather Wallet',
            price: 39.99,
            rating: 4.3,
            image: 'https://images.unsplash.com/photo-1590402494587-44b71d7772f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
            category: 'Accessories'
        },
        {
            id: 7,
            title: 'Cotton Throw Blanket',
            price: 34.99,
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
            category: 'Home'
        },
        {
            id: 8,
            title: 'Ceramic Coffee Mug',
            price: 12.99,
            rating: 4.1,
            image: 'https://images.unsplash.com/photo-1603575448878-868a20723f5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
            category: 'Kitchen'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');

    // Filter products based on search term
    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="home-page">
            <div className="home-header">
                <h1>Featured Products</h1>
                <SearchBar
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products..."
                />
            </div>

            <div className="product-grid">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <div className="no-results">
                        <p>No products found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};