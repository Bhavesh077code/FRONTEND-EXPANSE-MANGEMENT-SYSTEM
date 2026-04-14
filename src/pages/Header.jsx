
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Header = ({ user, logout }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/search?q=${encodeURIComponent(search.trim())}`);
  };

  const handleLogout = () => {
    if (logout) logout();
    navigate('/login');
  };

  return (
    <nav className="navbar bg-[#0F172A] px-4 py-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
      {/* Logo */}
      <Link to="/" className="nav-logo flex items-center gap-2 text-white font-bold text-lg">
        <span className="logo-icon">⬡</span> NexaApp
      </Link>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="nav-search flex-1 mx-2 sm:mx-4 flex items-center max-w-xs sm:max-w-md"
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts..."
          className="search-input flex-1 px-3 py-1 rounded-l-lg text-sm outline-none"
        />
        <button type="submit" className="search-btn px-3 py-1 bg-emerald-500 text-white rounded-r-lg text-sm">
          🔍
        </button>
      </form>

      {/* Links */}
      <div className="nav-links flex items-center gap-2 sm:gap-4 text-sm">
        <Link to="/" className="nav-link text-white hover:text-emerald-400">Feed</Link>

        {user ? (
          <>
            <Link to="/create" className="btn btn-primary btn-sm">+ New Post</Link>
            <Link to="/profile" className="nav-avatar w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs text-white">
              {user.username?.[0]?.toUpperCase() || 'U'}
            </Link>
            <button onClick={handleLogout} className="btn btn-outline btn-sm text-white border-white/40 hover:border-emerald-400">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline btn-sm text-white border-white/40 hover:border-emerald-400">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
