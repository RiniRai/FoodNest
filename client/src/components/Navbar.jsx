
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaShoppingCart, FaTag, FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  let user = null;

  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      user = JSON.parse(storedUser);
    }
  } catch (err) {
    console.error("Invalid user data in localStorage:", err);
    localStorage.removeItem("user");
  }

  const [showMenu, setShowMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMobileMenu(false);
    navigate("/login");
  };

  const closeMobileMenu = () => setMobileMenu(false);

  const linkClass =
    "block py-2 hover:text-orange-500 transition";

  return (
    <nav className="bg-white shadow-md relative z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex justify-between items-center gap-3">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="text-xl sm:text-3xl font-bold text-orange-500 whitespace-nowrap"
          >
            🍔 FoodNest
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link to="/" className={linkClass}>
              Home
            </Link>

            <Link to="/restaurants" className={linkClass}>
              Restaurants
            </Link>

            <Link
              to="/offers"
              className="flex items-center gap-2 font-semibold text-orange-600 hover:text-orange-700 transition whitespace-nowrap"
            >
              <FaTag />
              Offers
            </Link>

            {token ? (
              <>
                <Link
                  to="/cart"
                  className="hover:text-orange-500 transition p-2"
                  aria-label="Shopping cart"
                >
                  <FaShoppingCart size={22} />
                </Link>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center gap-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-lg shadow">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="font-semibold max-w-32 truncate">
                      {user?.name || "Account"}
                    </span>
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 mt-3 w-64 max-w-[90vw] bg-white rounded-xl shadow-xl border p-5 z-50">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 shrink-0 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xl">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="min-w-0">
                          <h2 className="font-bold break-words">
                            {user?.name || "User"}
                          </h2>
                          <p className="text-gray-500 text-sm break-all">
                            {user?.email}
                          </p>
                        </div>
                      </div>

                      <hr className="my-4" />

                      <Link
                        to="/orders"
                        className={linkClass}
                        onClick={() => setShowMenu(false)}
                      >
                        📦 My Orders
                      </Link>

                      <Link
                        to="/offers"
                        className={linkClass}
                        onClick={() => setShowMenu(false)}
                      >
                        🏷️ Available Offers
                      </Link>

                      <button
                        type="button"
                        onClick={logout}
                        className="w-full mt-3 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className={linkClass}>
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition whitespace-nowrap"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Cart and Menu Button */}
          <div className="flex md:hidden items-center gap-4">
            {token && (
              <Link
                to="/cart"
                className="text-gray-700 hover:text-orange-500 p-2"
                aria-label="Shopping cart"
              >
                <FaShoppingCart size={23} />
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileMenu(!mobileMenu)}
              className="text-gray-700 hover:text-orange-500 p-2"
              aria-label={mobileMenu ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenu}
            >
              {mobileMenu ? <FaTimes size={23} /> : <FaBars size={23} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenu && (
          <div className="md:hidden mt-3 pt-3 border-t border-gray-100">
            <Link to="/" className={linkClass} onClick={closeMobileMenu}>
              Home
            </Link>

            <Link
              to="/restaurants"
              className={linkClass}
              onClick={closeMobileMenu}
            >
              Restaurants
            </Link>

            <Link
              to="/offers"
              className="flex items-center gap-2 py-2 font-semibold text-orange-600"
              onClick={closeMobileMenu}
            >
              <FaTag />
              Offers
            </Link>

            {token ? (
              <>
                <Link
                  to="/orders"
                  className={linkClass}
                  onClick={closeMobileMenu}
                >
                  📦 My Orders
                </Link>

                <Link
                  to="/profile"
                  className={linkClass}
                  onClick={closeMobileMenu}
                >
                  👤 {user?.name || "My Account"}
                </Link>

                <button
                  type="button"
                  onClick={logout}
                  className="w-full text-left py-2 text-red-600 font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-3 py-2">
                <Link
                  to="/login"
                  className="flex-1 text-center border border-orange-500 text-orange-600 py-2 rounded-lg"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex-1 text-center bg-orange-500 text-white py-2 rounded-lg"
                  onClick={closeMobileMenu}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
