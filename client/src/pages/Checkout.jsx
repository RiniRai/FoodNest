import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";

function Checkout() {
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const placeOrder = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await API.post(
        "/orders",
        {
          deliveryAddress,
          paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);

      navigate("/orders");
    } catch (error) {
      console.error(error);

     toast.error(
  error.response?.data?.message || "Failed to place order"
);
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-8">

        <h1 className="text-3xl font-bold mb-8 text-center">
          Checkout
        </h1>

        <form onSubmit={placeOrder} className="space-y-6">

          <div>
            <label className="block mb-2 font-semibold">
              Delivery Address
            </label>

            <textarea
              className="w-full border rounded-lg p-3"
              rows="4"
              value={deliveryAddress}
              onChange={(e) =>
                setDeliveryAddress(e.target.value)
              }
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Payment Method
            </label>

            <select
              className="w-full border rounded-lg p-3"
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value)
              }
            >
              <option value="COD">Cash On Delivery</option>
              <option value="ONLINE">Online Payment</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600"
          >
            Place Order
          </button>

        </form>

      </div>

      <Footer />
    </>
  );
}

export default Checkout;