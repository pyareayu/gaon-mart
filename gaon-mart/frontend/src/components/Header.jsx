import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useVillage } from "../context/VillageContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { village, setPickerOpen } = useVillage();
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-earth-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl">🥭</span>
          <span className="font-display font-800 text-xl text-leaf-700 tracking-tight">
            Gaon<span className="text-litchi-500">Mart</span>
          </span>
        </Link>

        <button
          onClick={() => setPickerOpen(true)}
          className="hidden sm:flex flex-col items-start text-left px-3 py-1.5 rounded-lg hover:bg-earth-100 focus-ring shrink-0"
        >
          <span className="text-[11px] text-earth-800/60 leading-none">Delivering to</span>
          <span className="text-sm font-semibold text-earth-900 flex items-center gap-1">
            📍 {village ? village.name : "Select village"} <span className="text-xs">▾</span>
          </span>
        </button>

        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            placeholder="Search for atta, litchi, milk..."
            className="w-full bg-earth-100 rounded-xl px-4 py-2 text-sm focus-ring"
          />
        </form>

        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <div className="relative group">
              <button className="text-sm font-medium px-3 py-2 rounded-lg hover:bg-earth-100 focus-ring">
                Hi, {user.name.split(" ")[0]}
              </button>
              <div className="absolute right-0 top-full hidden group-hover:block bg-white card p-2 w-40 text-sm">
                <Link to="/orders" className="block px-3 py-2 rounded-lg hover:bg-earth-100">
                  My Orders
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin" className="block px-3 py-2 rounded-lg hover:bg-earth-100">
                    Admin panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-earth-100 text-litchi-600"
                >
                  Log out
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="text-sm font-semibold px-3 py-2 rounded-lg hover:bg-earth-100">
              Login
            </Link>
          )}

          <Link to="/cart" className="relative btn-primary text-sm flex items-center gap-2">
            🛒 Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-mustard-500 text-earth-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <button
        onClick={() => setPickerOpen(true)}
        className="sm:hidden w-full text-left px-4 py-2 text-sm bg-earth-100/70 border-t border-earth-100"
      >
        📍 Delivering to <strong>{village ? village.name : "select village"}</strong> ▾
      </button>
    </header>
  );
}
