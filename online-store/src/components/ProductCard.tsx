// src/components/ProductCard.tsx

import { Link } from "react-router-dom";
import { RatingStars } from "./RatingStars";
import { Product } from "../types/products";
import { AddToCartButton } from "./AddToCartButton"; // 1️⃣
import { useAuth } from "../context/AuthContext"; // 1️⃣

type ProductCardProps = {
  product: Product;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const { user } = useAuth(); // 2️⃣

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-image-link">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="product-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-product.png";
          }}
        />
      </Link>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-title">
          <Link to={`/product/${product.id}`}>{product.title}</Link>
        </h3>

        <div className="product-footer">
          <div className="price-container">
            <span className="product-price">${product.price.toFixed(2)}</span>
          </div>
        </div>

        <div className="product-footer">
          <RatingStars rating={product.rating as number} />
        </div>

        {/* 3️⃣ only show add-to-cart when logged in */}
        {user ? (
          <div className="product-footer">
            <AddToCartButton productId={product.id} />
          </div>
        ) : (
          <div className="product-footer" />
        )}
      </div>
    </div>
  );
};
