import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

function PopularDishes() {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const res = await API.get("/menu");

      // Show first 8 dishes
      setMenuItems(res.data.menuItems.slice(0, 8));
    } catch (error) {
      console.log(error);
    }
  };

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
      toast.error(
  error.response?.data?.message || "Failed to add to cart"
);
    }
  };

  return (
    <section className="max-w-7xl mx-auto py-16 px-6">
      <h2 className="text-4xl font-bold mb-10">
        🍽 Popular Dishes
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {menuItems.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-52 w-full object-cover"
            />

            <div className="p-5">
              <h3 className="text-xl font-bold">
                {item.name}
              </h3>

              <p className="text-gray-500 mt-2">
                {item.description}
              </p>

              <div className="flex justify-between items-center mt-4">
                <span className="font-bold text-xl">
                  ₹{item.price}
                </span>

                <button
                  onClick={() => addToCart(item._id)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PopularDishes;