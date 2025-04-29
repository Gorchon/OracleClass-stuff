// src/components/Navbar.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { DarkModeToggle } from "./DarkModeToggle";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext"; // 1️⃣ import useCart
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import logo from "../assets/e-shopp.png";

const Navbar: React.FC = () => {
  const { user, role, displayName } = useAuth();
  const { cartItemCount } = useCart(); // 2️⃣ grab cartItemCount
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-brand">
          {/* logo + home link */}
          <Link to="/" onClick={closeMenu} className="logo-link">
            <img
              src={logo as string}
              alt="E-Shop Logo"
              className="navbar-logo"
            />
            <span>E-Shop</span>
          </Link>

          {/* mobile hamburger */}
          <button
            className="hamburger"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        <div className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          {/* mobile logo in menu */}
          <Link to="/" onClick={closeMenu} className="navbar-home logo-link">
            <img
              src={logo as string}
              alt="E-Shop Logo"
              className="navbar-logo"
            />
            <span>E-Shop</span>
          </Link>

          <Link to="/products" onClick={closeMenu}>
            Products
          </Link>

          {/* updated Cart link */}
          <Link to="/cart" onClick={closeMenu}>
            🛒 Cart{" "}
            {cartItemCount > 0 ? (
              <span className="cart-count">{cartItemCount}</span>
            ) : null}
          </Link>

          <Link to="/orders" onClick={closeMenu}>
            Orders
          </Link>

          {role === "admin" && (
            <Link to="/admin" onClick={closeMenu}>
              Admin
            </Link>
          )}

          <div className="navbar-actions">
            <DarkModeToggle />
          </div>

          {user && (
            <div className="navbar-actions">
              <Link to="/" onClick={closeMenu}>
                Welcome {displayName}
              </Link>
            </div>
          )}

          <div className="navbar-actions">
            {user ? <LogoutButton /> : <LoginButton />}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
