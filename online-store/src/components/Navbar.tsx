import { Link } from 'react-router-dom';
import { DarkModeToggle } from './DarkModeToggle';
import {useState} from 'react'; //import added to handle the menu state

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false); //constant added to handle the menu toggle

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-brand">
                    <Link to="/">E-Shop</Link>
                    {/* Hamburger button for mobile */}
                    <button
                        className="hamburger"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-expanded={isMenuOpen}
                        aria-label="Toggle navigation"
                    >
                        {/* Dynamic hamburger icon */}
                        {isMenuOpen ? '✕' : '☰'}
                    </button>
                </div>
                {/* Collapsable menu for mobile/Fixed for Desktop */}
                <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>

                    <Link to="/" className="navbar-home" onClick={() => setIsMenuOpen(false)}>E-Shop</Link>
                    <Link to="/products" onClick={() => setIsMenuOpen(false)}>Products</Link>
                    <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
                        Cart <span className="cart-count">(0)</span>
                    </Link>
                    <Link to="/orders" onClick={() => setIsMenuOpen(false)}>Orders</Link>
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)}>Admin</Link>

                    <div className="navbar-actions">
                        <DarkModeToggle/>
                        <button className="login-button" onClick={() => setIsMenuOpen(false)}>Login</button>
                    </div>
                </div>
            </div>
        </nav>
    );
};