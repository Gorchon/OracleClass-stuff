// src/components/Navbar.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { DarkModeToggle } from "./DarkModeToggle";
import { useAuth } from "../context/AuthContext";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

const Navbar: React.FC = () => {
  const { user, role, displayName } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-brand">
          <Link to="/" onClick={closeMenu}>
            E‑Shop
          </Link>

          {/* Hamburger for mobile */}
          <button
            className="hamburger"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Links + actions */}
        <div className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          <Link to="/" onClick={closeMenu}>
            E‑Shop
          </Link>
          <Link to="/products" onClick={closeMenu}>
            Products
          </Link>
          <Link to="/cart" onClick={closeMenu}>
            Cart <span className="cart-count">(0)</span>
          </Link>
          <Link to="/orders" onClick={closeMenu}>
            Orders
          </Link>

          {/* Only show Admin link to admins */}
          {role === "admin" ? (
            <Link to="/admin" onClick={closeMenu}>
              Admin
            </Link>
          ) : (
            <div />
          )}

          {/* Dark mode toggle */}
          <div className="navbar-actions">
            <DarkModeToggle />
          </div>

          {/* Welcome message if logged in */}
          <div className="navbar-actions">
            {user ? (
              <Link to="/" onClick={closeMenu}>
                Welcome {displayName}
              </Link>
            ) : (
              <div />
            )}
          </div>

          {/* Login / Logout button */}
          <div className="navbar-actions">
            {user ? <LogoutButton /> : <LoginButton />}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
