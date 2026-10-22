
import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

import API from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const trackingSteps = [
  { status: "Pending", label: "Order Placed", icon: "✓" },
  { status: "Preparing", label: "Preparing", icon: "♨" },
  { status: "Out for Delivery", label: "Out for Delivery", icon: "🛵" },
  { status: "Delivered", label: "Delivered", icon: "✓" },
];

const estimatedMinutes = {
  Pending: 45,
  Preparing: 30,
  "Out for Delivery": 15,
};

const statusMessages = {
  Pending: "🧾 Your order has been placed successfully!",
  Preparing: "🍳 Your order is now being prepared!",
  "Out for Delivery": "🛵 Your order is on its way!",
  Delivered: "🎉 Your order has been delivered. Enjoy your meal!",
};

function showStatusToast(status) {
  const message =
    statusMessages[status] || `Your order status changed to ${status}.`;

  const options = {
    position: "top-right",
    autoClose: 4000,
  };

  if (status === "Delivered") {
    toast.success(message, options);
  } else {
    toast.info(message, options);
  }
}

function getDeliveryEstimate(order) {
  if (order.orderStatus === "Delivered") {
    return {
      title: "Order Delivered!",
      message: "Your food has been delivered successfully.",
      delivered: true,
    };
  }

  if (order.estimatedDeliveryTime) {
    const arrivalTime = new Date(order.estimatedDeliveryTime);

    if (!Number.isNaN(arrivalTime.getTime())) {
      const remainingMs = arrivalTime.getTime() - Date.now();
      const remainingMinutes = Math.max(
        0,
        Math.ceil(remainingMs / 60000)
      );

      if (remainingMinutes > 0) {
        return {
          title: "Estimated Delivery",
          message: `Your order is expected to arrive in approximately ${remainingMinutes} minute${remainingMinutes === 1 ? "" : "s"}.`,
          arrivalTime,
        };
      }

      return {
        title: "Estimated Delivery",
        message:
          "Your estimated arrival time has passed. Your order may still be on its way.",
        arrivalTime,
      };
    }
  }

  const minutes = estimatedMinutes[order.orderStatus];

  if (minutes !== undefined) {
    return {
      title: "Estimated Delivery",
      message: `Estimated delivery in approximately ${minutes} minutes.`,
    };
  }

  return {
    title: "Estimated Delivery",
    message: "Delivery estimate is currently unavailable.",
  };
}

function OrderTracker({ status }) {
  const currentIndex = trackingSteps.findIndex(
    (step) => step.status === status
  );

  return (
    <div className="mt-6 mb-8">
      <h3 className="font-bold text-lg mb-5">Delivery Progress</h3>

      <div className="flex items-start w-full">
        {trackingSteps.map((step, index) => {
          const completed = currentIndex >= index;
          const current = currentIndex === index;

          return (
            <div key={step.status} className="flex-1 min-w-0">
              <div className="flex items-center">
                <div
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 text-sm sm:text-lg font-bold ${
                    completed
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  } ${current ? "ring-4 ring-green-100" : ""}`}
                  title={step.label}
                >
                  {step.icon}
                </div>

                {index < trackingSteps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-1 sm:mx-2 rounded ${
                      currentIndex > index ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>

              <p
                className={`text-[10px] sm:text-xs mt-3 pr-1 ${
                  current
                    ? "font-bold text-green-700"
                    : completed
                      ? "text-gray-700"
                      : "text-gray-400"
                }`}
              >
                {step.label}
              </p>

              {current && (
                <p className="text-[10px] sm:text-xs text-green-600 mt-1">
                  Current
                </p>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-sm text-gray-600">
        Current status:{" "}
        <span className="font-bold text-green-700">{status}</span>
      </p>
    </div>
  );
}

function DeliveryEstimate({ order }) {
  const [, setClock] = useState(0);

  useEffect(() => {
    if (
      !order.estimatedDeliveryTime ||
      order.orderStatus === "Delivered"
    ) {
      return undefined;
    }

    const timer = setInterval(() => {
      setClock((previous) => previous + 1);
    }, 60000);

    return () => clearInterval(timer);
  }, [order.estimatedDeliveryTime, order.orderStatus]);

  const estimate = getDeliveryEstimate(order);

  return (
    <div
      className={`rounded-xl p-4 mb-6 border ${
        estimate.delivered
          ? "bg-green-50 border-green-200"
          : "bg-orange-50 border-orange-200"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl" aria-hidden="true">
          {estimate.delivered ? "✅" : "🕒"}
        </span>

        <div>
          <h3
            className={`font-bold ${
              estimate.delivered ? "text-green-800" : "text-orange-800"
            }`}
          >
            {estimate.title}
          </h3>

          <p className="text-sm mt-1 text-gray-700">{estimate.message}</p>

          {estimate.arrivalTime && !estimate.delivered && (
            <p className="text-sm mt-2 font-semibold text-gray-700">
              Expected arrival:{" "}
              {estimate.arrivalTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Price breakdown also supports older orders without coupon fields
function OrderPriceBreakdown({ order }) {
  const subtotal = Number(
    order.subtotal ?? order.totalAmount ?? 0
  );

  const discount = Number(order.discountAmount ?? 0);
  const total = Number(order.totalAmount ?? 0);

  return (
    <div className="mt-4 rounded-lg bg-gray-50 border p-4 space-y-3">
      <h4 className="font-bold text-base">Payment Summary</h4>

      <div className="flex justify-between gap-4 text-sm sm:text-base">
        <span className="text-gray-600">Subtotal</span>
        <span>₹{subtotal.toFixed(2)}</span>
      </div>

      {order.couponCode && discount > 0 && (
        <>
          <div className="flex justify-between gap-4 text-sm sm:text-base">
            <span className="text-gray-600">Coupon applied</span>
            <span className="font-semibold text-green-700">
              {order.couponCode}
            </span>
          </div>

          <div className="flex justify-between gap-4 text-sm sm:text-base">
            <span className="text-gray-600">Coupon discount</span>
            <span className="font-semibold text-green-700">
              −₹{discount.toFixed(2)}
            </span>
          </div>

          <p className="text-sm text-green-700">
            🎉 You saved ₹{discount.toFixed(2)} on this order!
          </p>
        </>
      )}

      <div className="border-t pt-3 flex justify-between gap-4 font-bold text-lg">
        <span>Total</span>
        <span className="text-orange-600">₹{total.toFixed(2)}</span>
      </div>
    </div>
  );
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const ordersRef = useRef([]);

  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        ordersRef.current = [];
        setOrders([]);
        setError("Please log in to view your orders.");
        return;
      }

      const res = await API.get("/orders/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const fetchedOrders = res.data.orders || [];

      ordersRef.current = fetchedOrders;
      setOrders(fetchedOrders);
      setError("");
    } catch (error) {
      console.error("Fetch Orders Error:", error);
      setError("Unable to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let socket;

    const token = localStorage.getItem("token");

    fetchOrders();

    if (!token) {
      return undefined;
    }

    socket = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
    });

    socket.on("connect", () => {
      console.log("Connected to FoodNest real-time updates");
      fetchOrders();
    });

    socket.on("connect_error", (socketError) => {
      console.error("Socket connection error:", socketError.message);
    });

    socket.on("orderStatusUpdated", (updatedOrder) => {
      if (!updatedOrder?.orderStatus || !updatedOrder?.orderId) {
        return;
      }

      const orderId = String(updatedOrder.orderId);

      const previousOrder = ordersRef.current.find(
        (order) => String(order._id) === orderId
      );

      if (!previousOrder) {
        fetchOrders();
        return;
      }

      if (previousOrder.orderStatus === updatedOrder.orderStatus) {
        return;
      }

      const updatedOrders = ordersRef.current.map((order) =>
        String(order._id) === orderId
          ? {
              ...order,
              orderStatus: updatedOrder.orderStatus,
              estimatedDeliveryTime:
                updatedOrder.estimatedDeliveryTime ??
                order.estimatedDeliveryTime,
            }
          : order
      );

      ordersRef.current = updatedOrders;
      setOrders(updatedOrders);

      showStatusToast(updatedOrder.orderStatus);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("orderStatusUpdated");
      socket.disconnect();
    };
  }, [fetchOrders]);

  return (
    <>
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 min-h-[60vh]">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">
          My Orders
        </h1>

        {loading ? (
          <p className="text-gray-500 text-center py-10">
            Loading your orders...
          </p>
        ) : error && orders.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-red-600 mb-4">{error}</p>

            <button
              onClick={fetchOrders}
              className="bg-orange-500 text-white px-5 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center border rounded-xl p-10">
            <h2 className="text-xl font-semibold">No Orders Found</h2>

            <p className="text-gray-500 mt-2">
              Your food orders will appear here.
            </p>
          </div>
        ) : (
          <>
            {error && (
              <p className="text-orange-600 mb-4">
                {error} Showing the last loaded order information.
              </p>
            )}

            {orders.map((order) => (
              <div
                key={order._id}
                className="border rounded-xl shadow-sm p-5 sm:p-6 mb-6 bg-white"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold break-all">
                      Order ID: {order._id}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Placed on{" "}
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold w-fit">
                    {order.orderStatus}
                  </span>
                </div>

                <OrderTracker status={order.orderStatus} />

                <DeliveryEstimate order={order} />

                <div className="border-t pt-4">
                  <h3 className="font-bold mb-3">Order Details</h3>

                  <div className="space-y-2 text-sm sm:text-base">
                    {order.items.map((item) => (
                      <div
                        key={item._id || item.menuItem?._id}
                        className="flex justify-between gap-3"
                      >
                        <span>
                          {item.menuItem?.name || "Menu item"} ×{" "}
                          {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <OrderPriceBreakdown order={order} />

                  <div className="mt-4 space-y-2 text-sm sm:text-base">
                    <p>
                      <span className="font-semibold">Payment:</span>{" "}
                      {order.paymentMethod}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Delivery Address:
                      </span>{" "}
                      {order.deliveryAddress}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </main>

      <Footer />
    </>
  );
}

export default Orders;
