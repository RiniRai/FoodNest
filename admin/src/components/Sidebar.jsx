import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white p-6">

      <h1 className="text-3xl font-bold mb-8">
        FoodNest Admin
      </h1>

      <div className="flex flex-col gap-4">

        <Link
          to="/dashboard"
          className="hover:text-orange-400"
        >
          📊 Dashboard
        </Link>

        <Link
          to="/restaurants"
          className="hover:text-orange-400"
        >
          🍽 Restaurants
        </Link>

        <Link
          to="/menu"
          className="hover:text-orange-400"
        >
          🍔 Menu
        </Link>

        <Link
          to="/orders"
          className="hover:text-orange-400"
        >
          📦 Orders
        </Link>

        <button
          onClick={logout}
          className="mt-10 bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>

      </div>
    </div>
  );
}

export default Sidebar;