import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await API.get("/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(res.data.stats);
    } catch (error) {
      console.log(error);
    }
  };

  return (
  <div className="flex">

    <Sidebar />

    <div className="flex-1 p-8">

      <h1 className="text-4xl font-bold mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-blue-500 text-white rounded-xl p-6 shadow">
          <h2 className="text-xl">Users</h2>
          <p className="text-4xl font-bold mt-4">
            {stats.totalUsers}
          </p>
        </div>

        <div className="bg-green-500 text-white rounded-xl p-6 shadow">
          <h2 className="text-xl">Restaurants</h2>
          <p className="text-4xl font-bold mt-4">
            {stats.totalRestaurants}
          </p>
        </div>

        <div className="bg-orange-500 text-white rounded-xl p-6 shadow">
          <h2 className="text-xl">Menu Items</h2>
          <p className="text-4xl font-bold mt-4">
            {stats.totalMenuItems}
          </p>
        </div>

        <div className="bg-purple-500 text-white rounded-xl p-6 shadow">
          <h2 className="text-xl">Orders</h2>
          <p className="text-4xl font-bold mt-4">
            {stats.totalOrders}
          </p>
        </div>

        <div className="bg-red-500 text-white rounded-xl p-6 shadow">
          <h2 className="text-xl">Revenue</h2>
          <p className="text-4xl font-bold mt-4">
            ₹{stats.totalRevenue}
          </p>
        </div>

      </div>

    </div>
  </div>
);
}

export default Dashboard;