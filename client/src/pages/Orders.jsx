import { useEffect, useState } from "react";
import API from "../services/api";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/orders/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data.orders);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <h2>No Orders Found</h2>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-xl shadow p-6 mb-6"
            >
              <h2 className="text-xl font-bold">
                Order ID: {order._id}
              </h2>

              <p className="mt-2">
                Status: {order.orderStatus}
              </p>

              <p>Total: ₹{order.totalAmount}</p>

              <p>Payment: {order.paymentMethod}</p>

              <p>Address: {order.deliveryAddress}</p>

              <h3 className="font-bold mt-4 mb-2">
                Items
              </h3>

              {order.items.map((item) => (
                <div key={item._id}>
                  {item.menuItem?.name} × {item.quantity}
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      <Footer />
    </>
  );
}

export default Orders;