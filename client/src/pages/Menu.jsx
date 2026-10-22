
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Menu() {
  const navigate = useNavigate();

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingItem, setAddingItem] = useState(null);

  // Fetch today's active offers from MongoDB
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await API.get("/menu/offers");
        setOffers(res.data.menuItems || []);
      } catch (error) {
        console.error("Failed to fetch offers:", error);
        toast.error("Unable to load today's offers");
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  // Add offer item to the existing cart
  const addToCart = async (menuItemId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.warning("Please login first");
        navigate("/login");
        return;
      }

      setAddingItem(menuItemId);

      const res = await API.post(
        "/cart",
        {
          menuItemId,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message || "Item added to cart!");
    } catch (error) {
      console.error("Failed to add item:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to add item to cart"
      );
    } finally {
      setAddingItem(null);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-orange-50 px-5 py-12 md:px-10">
        <div className="mx-auto max-w-7xl">

          <button
            onClick={() => navigate("/")}
            className="mb-8 rounded-lg bg-gray-800 px-5 py-2.5 text-white hover:bg-gray-700"
          >
            ← Back to Home
          </button>

          <div className="mb-10 text-center">
            <p className="font-semibold uppercase tracking-widest text-orange-500">
              Limited-time deals
            </p>

            <h1 className="mt-2 text-4xl font-bold text-gray-900 md:text-5xl">
              Today's Best Offers 🔥
            </h1>

            <p className="mt-4 text-gray-600">
              Your favourite food at special prices!
            </p>
          </div>

          {loading ? (
            <p className="py-16 text-center text-lg text-gray-600">
              Loading today's offers...
            </p>
          ) : offers.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <div className="text-6xl">🍕</div>

              <h2 className="mt-4 text-2xl font-bold text-gray-800">
                No active offers right now
              </h2>

              <p className="mt-2 text-gray-600">
                Please check back later for delicious deals!
              </p>

              <button
                onClick={() => navigate("/restaurants")}
                className="mt-6 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
              >
                Explore Restaurants
              </button>
            </div>
          ) : (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {offers.map((item) => {
                const originalPrice = Number(item.price);
                const offerPrice = Number(item.discountPrice);

                const discountPercentage =
                  originalPrice > 0 &&
                  offerPrice >= 0 &&
                  offerPrice < originalPrice
                    ? Math.round(
                        ((originalPrice - offerPrice) /
                          originalPrice) *
                          100
                      )
                    : 0;

                return (
                  <article
                    key={item._id}
                    className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-56 w-full object-cover"
                      />

                      <span className="absolute left-3 top-3 rounded-full bg-red-500 px-4 py-2 text-sm font-bold text-white">
                        {discountPercentage}% OFF
                      </span>
                    </div>

                    <div className="p-5">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {item.name}
                      </h2>

                      <p className="mt-2 min-h-12 text-gray-600">
                        {item.description}
                      </p>

                      <p className="mt-3 text-sm text-gray-500">
                        {item.category}
                      </p>

                      <div className="mt-4 flex items-center gap-3">
                        <span className="text-2xl font-bold text-orange-600">
                          ₹{offerPrice}
                        </span>

                        <span className="text-lg text-gray-400 line-through">
                          ₹{originalPrice}
                        </span>
                      </div>

                      <button
                        onClick={() => addToCart(item._id)}
                        disabled={addingItem === item._id}
                        className="mt-5 w-full rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {addingItem === item._id
                          ? "Adding..."
                          : "Add to Cart"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Menu;
