// src/pages/Admin.tsx
import React, { useState, useEffect } from "react";
import { Product } from "../types/products";
import { db } from "../services/api";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { ProductForm } from "../components/ProductForm";
import { ProductTable } from "../components/ProductTable";

export const Admin: React.FC = () => {
  // d) state for products, loading, error, editing
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // e) fetch products from Firestore
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsCollection = collection(db, "products");
      const snapshot = await getDocs(productsCollection);
      const productsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Product, "id">),
      })) as Product[];
      setProducts(productsData);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // f) add, update & delete handlers (update local state; Firestore writes happen in ProductForm)
  const addProduct = async (product: Product) => {
    try {
      setLoading(true);
      setProducts((prev) => [...prev, product]);
      return product;
    } catch (err) {
      console.error("Error adding product:", err);
      setError("Failed to add product");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      setLoading(true);
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? product : p))
      );
      return product;
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Failed to update product");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, "products", productId));
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // g) handle form submit by delegating to add/update
  const handleFormSubmit = async (productData: Omit<Product, "id">) => {
    try {
      if (editingProduct) {
        await updateProduct({ ...productData, id: editingProduct.id });
      } else {
        await addProduct(productData as Product);
      }
      setEditingProduct(null);
    } catch (err) {
      // already handled above
      console.log(err);
    }
  };

  // h) show loading state
  if (loading && products.length === 0) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="admin-page">
      <div className="container">
        <h1>Admin Dashboard</h1>

        {/* i) show error message */}
        {error && (
          <div className="error-message">
            {error} <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        {/* j) layout with form and table */}
        <div className="admin-layout">
          <div className="admin-form">
            <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
            <ProductForm
              product={editingProduct as Product}
              onSubmit={handleFormSubmit}
              onCancel={() => setEditingProduct(null)}
            />
          </div>

          <div className="admin-table">
            <h2>Product Inventory</h2>
            {products.length === 0 ? (
              <p>No products found</p>
            ) : (
              <ProductTable
                products={products}
                onEdit={setEditingProduct}
                onDelete={deleteProduct}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
