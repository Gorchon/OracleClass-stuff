import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { RatingStars } from "../components/RatingStars";
import { fetchProductById } from "../services/productService";
import { Product } from "../types/products";

export const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        if (id) {
          const fetchedProduct = await fetchProductById(id);
          if (fetchedProduct) {
            setProduct(fetchedProduct);
          } else {
            setError("Product not found");
          }
        }
      } catch (error) {
        setError("Failed to load product. " + error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct().then();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="product-details">
      <Breadcrumbs
        entries={[
          { name: "Products", path: "/products" },
          { name: product.title, path: "" },
        ]}
      />

      <div className="product-container">
        <div className="product-gallery">
          <img
            key={product.id}
            src={product.image}
            alt={`Product view ${product.title}`}
          />
        </div>

        <div className="product-info">
          <h1>{product.title}</h1>
          <RatingStars rating={product.rating as number} />
          <p className="price">${product.price.toFixed(2)}</p>

          <div className="product-description">
            <p>{product.description}</p>
          </div>

          <button className="add-to-cart">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};
