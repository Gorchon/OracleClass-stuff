import { useState, useEffect } from 'react';
import {Product} from "../types/products.ts";

type ProductFormProps = {
    product?: {
        id: number;
        title: string;
        price: number;
        description: string;
        category: string;
        image: string;
        stock: number;
    };
    onSubmit: (product: Omit<Product, 'id'>) => void;
    onCancel: () => void;
};

export const ProductForm = ({ product, onSubmit, onCancel }: ProductFormProps) => {
    const [formData, setFormData] = useState({
        title: '',
        price: 0,
        description: '',
        category: '',
        image: '',
        stock: 0,
    });

    useEffect(() => {
        if (product) {
            setFormData({
                title: product.title,
                price: product.price,
                description: product.description,
                category: product.category,
                image: product.image,
                stock: product.stock,
            });
        }
    }, [product]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="product-form">
            <div className="form-group">
                <label htmlFor="title">Product Name</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="price">Price</label>
                <input
                    type="number"
                    id="price"
                    name="price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="stock">Stock Quantity</label>
                <input
                    type="number"
                    id="stock"
                    name="stock"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select a category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Home">Home</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Sports">Sports</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="image">Image URL</label>
                <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    required
                />
            </div>

            <div className="form-actions">
                <button type="button" onClick={onCancel} className="cancel-button">
                    Cancel
                </button>
                <button type="submit" className="submit-button">
                    {product ? 'Update Product' : 'Add Product'}
                </button>
            </div>
        </form>
    );
};