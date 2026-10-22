import { Link, useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  const navLinks = [
    { path: "/dashboard", label: "📊 Dashboard" },
    { path: "/restaurants", label: "🍽 Restaurants" },
    { path: "/menu", label: "🍔 Menu" },
    { path: "/orders", label: "📦 Orders" },
    { path: "/coupons", label: "🎟 Coupons" },
  ];

  return (
    <div className="min-h-screen w-64 shrink-0 bg-gray-900 p-6 text-white">
      <h1 className="mb-8 text-3xl font-bold">
        FoodNest Admin
      </h1>

      <nav className="flex flex-col gap-3">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`rounded-lg px-3 py-3 transition ${
              location.pathname === link.path
                ? "bg-orange-500 font-semibold text-white"
                : "text-gray-200 hover:bg-gray-800 hover:text-orange-400"
            }`}
          >
            {link.label}
          </Link>
        ))}

        <button
          onClick={logout}
          className="mt-8 rounded-lg bg-red-500 px-4 py-3 font-semibold transition hover:bg-red-600"
        >
          Logout
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;