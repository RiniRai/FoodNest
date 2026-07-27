import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Cart() {
  const [cart, setCart] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart(res.data.cart);
    } catch (error) {
      console.log(error);
    }
  };

  if (!cart) {
    return (
      <>
        <Navbar />
        <h1 className="text-center mt-20 text-2xl">Loading...</h1>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">
          🛒 My Cart
        </h1>

        {cart.items.length === 0 ? (
          <h2>Your cart is empty.</h2>
        ) : (
          <>
            <div className="space-y-6">
              {cart.items.map((item) => (
                <div
                  key={item._id}
                  className="border rounded-xl p-5 flex gap-6 items-center shadow"
                >
                  <img
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    className="w-36 h-28 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">
                      {item.menuItem.name}
                    </h2>

                    <p className="text-gray-600">
                      ₹{item.menuItem.price}
                    </p>

                    <p className="mt-2">
                      Quantity : {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 border-t pt-6">
              <h2 className="text-3xl font-bold">
                Total : ₹{cart.totalPrice}
              </h2>

              <Link
                to="/checkout"
                className="inline-block mt-6 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
}

export default Cart;