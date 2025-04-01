import { Product } from '../types/products.ts'

type ProductTableProps = {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (id: number) => void;
};

export const ProductTable = ({ products, onEdit, onDelete }: ProductTableProps) => {
    return (
        <div className="table-container">
            <table className="product-table">
                <thead>
                <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Category</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {products.map(product => (
                    <tr key={product.id}>
                        <td>
                            <img
                                src={product.image}
                                alt={product.title}
                                className="product-thumbnail"
                            />
                        </td>
                        <td>{product.title}</td>
                        <td>${product.price.toFixed(2)}</td>
                        <td>{product.stock}</td>
                        <td>{product.category}</td>
                        <td className="actions">
                            <button
                                onClick={() => onEdit(product)}
                                className="edit-button"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(product.id)}
                                className="delete-button"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};