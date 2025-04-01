// Admin.jsx
import { useState } from "react";

export const Admin = () => {
  const [products, setProducts] = useState([
    { id: 1, title: "Wireless Headphones", price: 199.99, stock: 15 },
    { id: 2, title: "Phone Case", price: 29.99, stock: 42 },
    { id: 3, title: "USB Cable", price: 9.99, stock: 87 },
  ]);

  const [newProduct, setNewProduct] = useState({
    title: "",
    price: "",
    stock: "",
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const product = {
      id: products.length + 1,
      title: newProduct.title,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
    };
    setProducts([...products, product]);
    setNewProduct({ title: "", price: "", stock: "" });
  };

  return (
    <div className="admin-page">
      <h1 className="admin-title">Admin Dashboard</h1>

      <div className="admin-container">
        <div className="product-list">
          <h2 className="product-list-title">Current Products</h2>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.title}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.stock}</td>
                    <td className="actions-cell">
                      <button className="edit-btn">Edit</button>
                      <button className="delete-btn">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="add-product">
          <h2 className="add-product-title">Add New Product</h2>
          <form onSubmit={handleAddProduct} className="add-product-form">
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.title}
              onChange={(e) =>
                setNewProduct({ ...newProduct, title: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
              step="0.01"
              required
            />
            <input
              type="number"
              placeholder="Stock Quantity"
              value={newProduct.stock}
              onChange={(e) =>
                setNewProduct({ ...newProduct, stock: e.target.value })
              }
              required
            />
            <button type="submit" className="add-product-btn">
              Add Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
