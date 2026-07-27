import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import { toast } from "react-toastify";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await API.get("/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data.orders);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("adminToken");

      await API.put(
        `/orders/${id}`,
        { orderStatus: status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

     toast.success("Order Status Updated");

      fetchOrders();
    } catch (error) {
      console.log(error);
      toast.error(
  error.response?.data?.message || "Update Failed"
);
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8">

        <h1 className="text-4xl font-bold mb-8">
          Manage Orders
        </h1>

        <table className="w-full border shadow">

          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="p-3">Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-b text-center"
              >
                <td>{order.userId?.name}</td>

                <td>₹{order.totalAmount}</td>

                <td>{order.orderStatus}</td>

                <td>
                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      updateStatus(order._id, e.target.value)
                    }
                    className="border rounded p-2"
                  >
                    <option>Pending</option>
                    <option>Preparing</option>
                    <option>Out for Delivery</option>
                    <option>Delivered</option>
                  </select>
                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>
    </div>
  );
}

export default Orders;