import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import { toast } from "react-toastify";

function Menu() {
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  const [formData, setFormData] = useState({
    restaurantId: "",
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    isAvailable: true,
  });

  useEffect(() => {
    fetchRestaurants();
    fetchMenu();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await API.get("/restaurants");
      setRestaurants(res.data.restaurants);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMenu = async () => {
    try {
      const res = await API.get("/menu");
      setMenuItems(res.data.menuItems);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const addMenuItem = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("adminToken");

      const res = await API.post("/menu", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    toast.success(res.data.message);

      setFormData({
        restaurantId: "",
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
        isAvailable: true,
      });

      fetchMenu();
    } catch (error) {
      console.log(error);
     toast.error(
  error.response?.data?.message || "Failed to add menu item"
);
    }
  };

  const deleteMenuItem = async (id) => {
    if (!window.confirm("Delete this menu item?")) return;

    try {
      const token = localStorage.getItem("adminToken");

      await API.delete(`/menu/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

     toast.success("Menu Item Deleted");

      fetchMenu();
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
        <h1 className="text-4xl font-bold mb-8">Manage Menu</h1>

        {/* Add Menu Form */}

        <form
          onSubmit={addMenuItem}
          className="bg-white shadow rounded-xl p-6 mb-10 grid md:grid-cols-2 gap-4"
        >
          <select
            name="restaurantId"
            value={formData.restaurantId}
            onChange={handleChange}
            className="border p-3 rounded"
            required
          >
            <option value="">Select Restaurant</option>

            {restaurants.map((restaurant) => (
              <option key={restaurant._id} value={restaurant._id}>
                {restaurant.name}
              </option>
            ))}
          </select>

          <input
            name="name"
            placeholder="Menu Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-3 rounded"
            required
          />

          <input
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="border p-3 rounded"
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="border p-3 rounded"
            required
          />

          <input
            name="category"
            placeholder="Category"
            value={formData.category}
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

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
            />
            Available
          </label>

          <button
            type="submit"
            className="bg-orange-500 text-white py-3 rounded hover:bg-orange-600 md:col-span-2"
          >
            Add Menu Item
          </button>
        </form>

        {/* Menu Table */}

        <table className="w-full border shadow">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="p-3">Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Available</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {menuItems.map((item) => (
              <tr key={item._id} className="text-center border-b">
                <td className="p-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-16 object-cover mx-auto rounded"
                  />
                </td>

                <td>{item.name}</td>
                <td>₹{item.price}</td>
                <td>{item.category}</td>
                <td>{item.isAvailable ? "Yes" : "No"}</td>

                <td>
                  <button
                    onClick={() => deleteMenuItem(item._id)}
                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
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

export default Menu;