import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { BookOpen, ShoppingCart, Search } from "lucide-react";
import "../styles/Header.css";

const Header = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const onSearch = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/?q=${q}`);
  };

  return (
    <header className="header">
      {/* Logo */}
      <Link to="/" className="logo">
        <BookOpen className="icon book-icon" />
        <span>KotobOnline</span>
      </Link>

      {/* Search */}
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

      {/* Right */}
      <div className="header-right">
        <Link to="/cart" className="cart-icon">
          <ShoppingCart className="icon" />
          {totalItems > 0 && (
            <span className="cart-count">{totalItems}</span>
          )}
        </Link>

        {user ? (
          <button onClick={logout} className="btn">Logout</button>
        ) : (
          <Link to="/login" className="btn">Sign in</Link>
        )}
      </div>
    </header>
  );
};

export default Header;