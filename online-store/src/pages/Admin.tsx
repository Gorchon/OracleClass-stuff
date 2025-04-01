import { useState } from 'react';
import { ProductForm } from '../components/ProductForm';
import { ProductTable } from '../components/ProductTable';
import { useProducts } from '../context/AdminContext';

export const Admin = () => {
    const { products, addProduct, updateProduct, deleteProduct } = useProducts();
    const [editingProduct, setEditingProduct] = useState(null);

    return (
        <div className="admin-page">
            <div className="container">
                <h1>Admin Dashboard</h1>

                <div className="admin-layout">
                    <div className="admin-form">
                        <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                        <ProductForm
                            product={editingProduct}
                            onSubmit={(product) => {
                                if (editingProduct) {
                                    updateProduct(product);
                                } else {
                                    addProduct(product);
                                }
                                setEditingProduct(null);
                            }}
                            onCancel={() => setEditingProduct(null)}
                        />
                    </div>

                    <div className="admin-table">
                        <h2>Product Inventory</h2>
                        <ProductTable
                            products={products}
                            onEdit={setEditingProduct}
                            onDelete={deleteProduct}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};