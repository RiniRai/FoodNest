import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";

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

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-bold text-orange-500"
        >
          🍔 FoodNest
        </Link>

        <div className="flex items-center gap-8">

          <Link
            to="/"
            className="hover:text-orange-500"
          >
            Home
          </Link>

          <Link
            to="/restaurants"
            className="hover:text-orange-500"
          >
            Restaurants
          </Link>

          {token ? (
            <>
              <Link
                to="/cart"
                className="hover:text-orange-500"
              >
                <FaShoppingCart size={22} />
              </Link>

              {/* Avatar */}
              <div className="relative">

                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-3"
                >
                  <div className="w-11 h-11 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-lg shadow">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>

                  <span className="font-semibold">
                    {user?.name}
                  </span>
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border p-5 z-50">

                    <div className="flex items-center gap-3">

                      <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xl">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <h2 className="font-bold">
                          {user?.name}
                        </h2>

                        <p className="text-gray-500 text-sm break-all">
                          {user?.email}
                        </p>
                      </div>

                    </div>

                    <hr className="my-4" />

                    <Link
                      to="/orders"
                      className="block py-2 hover:text-orange-500"
                      onClick={() => setShowMenu(false)}
                    >
                      📦 My Orders
                    </Link>

                    <button
                      onClick={logout}
                      className="w-full mt-3 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                    >
                      Logout
                    </button>

                  </div>
                )}

              </div>

            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-orange-500"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
              >
                Register
              </Link>
            </>
          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;