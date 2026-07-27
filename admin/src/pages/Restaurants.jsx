import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import { toast } from "react-toastify";

function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    cuisine: "",
    address: "",
    image: "",
    deliveryTime: "",
    rating: 4.5,
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await API.get("/restaurants", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRestaurants(res.data.restaurants);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addRestaurant = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("adminToken");

      const res = await API.post("/restaurants", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

     toast.success(res.data.message);

      setFormData({
        name: "",
        cuisine: "",
        address: "",
        image: "",
        deliveryTime: "",
        rating: 4.5,
      });

      fetchRestaurants();
    } catch (error) {
      console.log(error);
     toast.error(
  error.response?.data?.message || "Failed to add restaurant"
);
    }
  };

  const deleteRestaurant = async (id) => {
    if (!window.confirm("Delete this restaurant?")) return;

    try {
      const token = localStorage.getItem("adminToken");

      await API.delete(`/restaurants/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

     toast.success("Restaurant Deleted");

      fetchRestaurants();
    } catch (error) {
      console.log(error);
     toast.error(
  error.response?.data?.message || "Delete Failed"
);
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8">

        <h1 className="text-4xl font-bold mb-8">
          Manage Restaurants
        </h1>

        {/* Add Restaurant Form */}

        <form
          onSubmit={addRestaurant}
          className="bg-white shadow rounded-xl p-6 mb-10 grid md:grid-cols-2 gap-4"
        >
          <input
            name="name"
            placeholder="Restaurant Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-3 rounded"
            required
          />

          <input
            name="cuisine"
            placeholder="Cuisine"
            value={formData.cuisine}
            onChange={handleChange}
            className="border p-3 rounded"
            required
          />

          <input
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="border p-3 rounded"
            required
          />

          <input
            name="deliveryTime"
            placeholder="Delivery Time"
            value={formData.deliveryTime}
            onChange={handleChange}
            className="border p-3 rounded"
            required
          />

          <input
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
            className="border p-3 rounded"
            required
          />

          <input
            type="number"
            step="0.1"
            name="rating"
            placeholder="Rating"
            value={formData.rating}
            onChange={handleChange}
            className="border p-3 rounded"
          />

          <button
            type="submit"
            className="bg-orange-500 text-white py-3 rounded hover:bg-orange-600 md:col-span-2"
          >
            Add Restaurant
          </button>
        </form>

        {/* Restaurant Table */}

        <table className="w-full border shadow">

          <thead className="bg-orange-500 text-white">

            <tr>
              <th className="p-3">Image</th>
              <th>Name</th>
              <th>Cuisine</th>
              <th>Rating</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {restaurants.map((restaurant) => (
              <tr
                key={restaurant._id}
                className="border-b text-center"
              >
                <td className="p-3">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-24 h-16 object-cover mx-auto rounded"
                  />
                </td>

                <td>{restaurant.name}</td>

                <td>{restaurant.cuisine}</td>

                <td>{restaurant.rating}</td>

                <td>
                  <button
                    onClick={() => deleteRestaurant(restaurant._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>
    </div>
  );
}

export default Restaurants;