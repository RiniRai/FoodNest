import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";


function RestaurantDetails() {
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    fetchRestaurant();
    fetchMenu();
  }, []);

  const fetchRestaurant = async () => {
    try {
      const res = await API.get("/restaurants");

      const foundRestaurant = res.data.restaurants.find(
        (item) => item._id === id
      );

      setRestaurant(foundRestaurant);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMenu = async () => {
    try {
      const res = await API.get(`/menu/restaurant/${id}`);
      setMenuItems(res.data.menuItems);
    } catch (error) {
      console.log(error);
    }
  };

  // Add Item to Cart
  const addToCart = async (menuItemId) => {
    try {
      const token = localStorage.getItem("token");

  if (!token) {
  toast.warning("Please login first");
  return;
}

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

     toast.success(res.data.message);
    } catch (error) {
      console.error(error);

     toast.error(
  error.response?.data?.message || "Failed to add item to cart"
);
    }
  };

  if (!restaurant) {
    return <h1 className="text-center mt-20">Loading...</h1>;
  }

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto p-8">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-80 object-cover rounded-xl"
        />

        <h1 className="text-4xl font-bold mt-6">
          {restaurant.name}
        </h1>

        <p className="text-gray-600 mt-2">
          📍 {restaurant.address}
        </p>

        <p className="mt-2">
          🍽 {restaurant.cuisine}
        </p>

        <p className="mt-2">
          ⭐ {restaurant.rating}
        </p>

        <p className="mt-2">
          🚴 {restaurant.deliveryTime}
        </p>

        <h2 className="text-3xl font-bold mt-10 mb-6">
          Menu
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {menuItems.map((item) => (
            <div
              key={item._id}
              className="border rounded-xl p-5 shadow"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-48 w-full object-cover rounded-lg"
              />

              <h3 className="text-2xl font-bold mt-4">
                {item.name}
              </h3>

              <p className="text-gray-600 mt-2">
                {item.description}
              </p>

              <p className="font-bold text-xl mt-3">
                ₹{item.price}
              </p>

              <button
                onClick={() => addToCart(item._id)}
                className="mt-4 bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default RestaurantDetails;