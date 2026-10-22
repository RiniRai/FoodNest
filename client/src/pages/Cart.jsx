
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const fetchCart = useCallback(async () => {
    try {
      setError("");
      const res = await API.get("/cart");
      setCart(res.data.cart || { items: [] });
    } catch (err) {
      if (err.response?.status === 404) {
        setCart({ items: [] });
      } else {
        setError("Unable to load your cart. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const getPrice = (food) => {
    if (!food) return 0;

    const now = Date.now();
    const start = food.offerStartDate
      ? new Date(food.offerStartDate).getTime()
      : NaN;
    const end = food.offerEndDate
      ? new Date(food.offerEndDate).getTime()
      : NaN;

    const activeOffer =
      food.isDiscounted === true &&
      Number.isFinite(start) &&
      Number.isFinite(end) &&
      start <= now &&
      now <= end &&
      Number(food.discountPrice) > 0 &&
      Number(food.discountPrice) < Number(food.price);

    return activeOffer
      ? Number(food.discountPrice)
      : Number(food.price) || 0;
  };

  const updateQuantity = async (food, quantity) => {
    if (!food?._id || quantity < 1) return;

    try {
      setBusyId(food._id);
      setError("");

      await API.put("/cart", {
        menuItemId: food._id,
        quantity,
      });

      await fetchCart();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to update quantity."
      );
    } finally {
      setBusyId("");
    }
  };

  const removeItem = async (food) => {
    if (!food?._id) return;

    try {
      setBusyId(food._id);
      setError("");

      await API.delete("/cart", {
        data: { menuItemId: food._id },
      });

      await fetchCart();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to remove this item."
      );
    } finally {
      setBusyId("");
    }
  };

  const items = cart?.items || [];

  const subtotal = items.reduce(
    (sum, item) =>
      sum + getPrice(item.menuItem) * item.quantity,
    0
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <p className="text-center mt-20 py-10">Loading your cart...</p>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="max-w-5xl mx-auto p-4 sm:p-8 min-h-[60vh]">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">
          🛒 My Cart
        </h1>

        {error && (
          <div role="alert" className="mb-5 rounded-lg bg-red-50 p-4 text-red-600">
            {error}
            <button onClick={fetchCart} className="ml-3 underline">
              Retry
            </button>
          </div>
        )}

        {items.length === 0 ? (
          <div className="text-center bg-orange-50 rounded-2xl p-10">
            <h2 className="text-2xl font-bold">Your cart is empty</h2>
            <p className="text-gray-600 mt-2">
              Add something delicious from our menu!
            </p>
            <Link
              to="/menu"
              className="inline-block mt-5 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600"
            >
              Explore Menu
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-5">
              {items.map((item) => {
                const food = item.menuItem;
                if (!food) return null;

                const price = getPrice(food);
                const busy = busyId === food._id;

                return (
                  <article
                    key={item._id}
                    className="border rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row gap-5 sm:items-center shadow-sm"
                  >
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-full sm:w-36 h-40 sm:h-28 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h2 className="text-xl font-bold">{food.name}</h2>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-orange-600 font-semibold">
                          ₹{price.toFixed(2)}
                        </span>
                        {price < Number(food.price) && (
                          <span className="text-gray-400 line-through">
                            ₹{food.price}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 mt-4">
                        <button
                          disabled={busy || item.quantity <= 1}
                          onClick={() =>
                            updateQuantity(food, item.quantity - 1)
                          }
                          aria-label={`Decrease ${food.name} quantity`}
                          className="border rounded-md p-2 disabled:opacity-40"
                        >
                          <FaMinus size={12} />
                        </button>

                        <span className="font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          disabled={busy}
                          onClick={() =>
                            updateQuantity(food, item.quantity + 1)
                          }
                          aria-label={`Increase ${food.name} quantity`}
                          className="border rounded-md p-2 disabled:opacity-40"
                        >
                          <FaPlus size={12} />
                        </button>

                        <button
                          disabled={busy}
                          onClick={() => removeItem(food)}
                          className="ml-auto text-red-500 hover:text-red-700 disabled:opacity-40"
                          aria-label={`Remove ${food.name}`}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>

                    <p className="font-bold text-lg sm:text-right">
                      ₹{(price * item.quantity).toFixed(2)}
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="mt-10 border-t pt-6 max-w-md ml-auto">
              <div className="flex justify-between text-lg">
                <span>Food subtotal</span>
                <span className="font-bold">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Delivery fee, if applicable, will be calculated at checkout.
              </p>

              <Link
                to="/checkout"
                className="block text-center mt-6 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 font-semibold"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/menu"
                className="block text-center mt-3 border border-orange-500 text-orange-600 px-6 py-3 rounded-lg hover:bg-orange-50"
              >
                Continue Shopping
              </Link>
            </div>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}

export default Cart;
