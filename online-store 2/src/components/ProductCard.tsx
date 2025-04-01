import { Link } from "react-router-dom";
import { RatingStars } from "./RatingStars";
import { Product } from "../types/products";

type ProductCardProps = {
  product: Product;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-image-link">
        <img
          src={product.image}
          alt={product.title}
          className="product-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "placeholder-product.png";
          }}
        />
      </Link>

      <div className="product-info">
        <span className="product-category">{product.category}</span>

        <h3 className="product-title">
          <Link to={`/product/${product.id}`}>{product.title}</Link>
        </h3>

        <div className="rating-stars">
          <RatingStars rating={product.rating} />
        </div>

        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button
            className="add-to-cart-btn"
            aria-label={`Add ${product.title} to cart`}
          >
            <span className="icon-cart"></span>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
