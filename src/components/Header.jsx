import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { BookOpen, ShoppingCart, Search, User, LogOut, Package } from "lucide-react";
import "../styles/Header.css";

const Header = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const onSearch = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/?q=${q}`);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header">
      <Link to="/" className="logo">
        <BookOpen className="icon book-icon" />
        <span>KotobOnline</span>
      </Link>

      <form onSubmit={onSearch} className="search-box">
        <div className="search-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search books or authors..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </form>

      <div className="header-right">
        <Link to="/cart" className="cart-icon">
          <ShoppingCart className="icon" />
          {totalItems > 0 && (
            <span className="cart-count">{totalItems}</span>
          )}
        </Link>

        {user ? (
          <div className="user-menu" ref={menuRef}>
            <button
              className="user-icon-btn"
              aria-label="Account menu"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <User className="icon" />
            </button>

            {menuOpen && (
              <div className="dropdown">
                <span className="dropdown-email">{user.email}</span>
                <div className="dropdown-divider" />
                <Link to="/orders" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                  <Package size={15} />
                  My Orders
                </Link>
                <Link to="/cart" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                  <ShoppingCart size={15} />
                  Cart
                </Link>
                <div className="dropdown-divider" />
                <button className="dropdown-item dropdown-signout" onClick={() => { logout(); setMenuOpen(false); }}>
                  <LogOut size={15} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="btn">Sign in</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
