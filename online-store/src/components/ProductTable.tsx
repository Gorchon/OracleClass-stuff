// src/components/ProductTable.tsx
import React from "react";
import { Link } from "react-router-dom";
import { DeleteButton } from "./DeleteButton";
import { Product } from "../types/products";

type ProductTableProps = {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
};

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onEdit,
  onDelete,
}) => {
  // b) number formatter
  const formatNumber = (value?: number, decimals = 2): string => {
    if (value === undefined || isNaN(value)) return "N/A";
    return value.toFixed(decimals);
  };

  return (
    <div className="table-container">
      <table className="product-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Rating</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              {/* c) make image clickable */}
              <td>
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.title}
                    className="product-thumbnail"
                  />
                </Link>
              </td>
              {/* c) make title clickable */}
              <td>
                <Link to={`/product/${product.id}`}>{product.title}</Link>
              </td>
              {/* d) formatted numbers */}
              <td>${formatNumber(product.price)}</td>
              <td>{formatNumber(product.stock, 0)}</td>
              <td>{formatNumber(product.rating, 1)}</td>
              <td>{product.category}</td>
              <td className="actions">
                <button onClick={() => onEdit(product)} className="edit-button">
                  Edit
                </button>
                {/* e) use our DeleteButton */}
                <DeleteButton
                  onDelete={() => onDelete(product.id)}
                  className="delete-button"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
