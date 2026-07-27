import { useEffect, useState } from "react";
import API from "../services/api";
import RestaurantCard from "./RestaurantCard";

function RestaurantSection({ search, selectedCategory }) {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    filterRestaurants();
  }, [search, selectedCategory, restaurants]);

  const fetchRestaurants = async () => {
    try {
      const res = await API.get("/restaurants");
      setRestaurants(res.data.restaurants);
      setFilteredRestaurants(res.data.restaurants);
    } catch (error) {
      console.log(error);
    }
  };

  const filterRestaurants = () => {
    let filtered = restaurants;

    // Search filter
    if (search.trim() !== "") {
      filtered = filtered.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(search.toLowerCase()) ||
          restaurant.cuisine.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (restaurant) =>
          restaurant.cuisine.toLowerCase() ===
          selectedCategory.toLowerCase()
      );
    }

    setFilteredRestaurants(filtered);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-4xl font-bold mb-8">
        Popular Restaurants
      </h2>

      {filteredRestaurants.length === 0 ? (
        <h2 className="text-xl text-gray-500">
          No restaurants found.
        </h2>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant._id}
              restaurant={restaurant}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default RestaurantSection;