import { Link } from "react-router-dom";
import { DarkModeToggle } from "./DarkModeToggle";
import { useState } from "react"; // añadido para manejar el toggle del menú

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // toggle del menú

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-brand">
          <Link to="/">E-Shop</Link>

          {/* Botón hamburguesa para móvil */}
          <button
            className="hamburger"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
          >
            {/* Icono dinámico */}
            {isMenuOpen ? "X" : "≡"}
          </button>
        </div>

        {/* Menú colapsable para móvil y fijo en desktop */}
        <div className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/cart">
            Cart <span className="cart-count">(0)</span>
          </Link>
          <Link to="/orders">Orders</Link>
          <Link to="/admin">Admin</Link>

          <div className="navbar-actions">
            <DarkModeToggle />
            <button className="login-button">Login</button>
          </div>
        </div>
      </div>
    </nav>
  );
};
