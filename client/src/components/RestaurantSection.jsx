
import { useEffect, useState } from "react";
import API from "../services/api";
import RestaurantCard from "./RestaurantCard";

function RestaurantSection({ search, selectedCategory }) {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Normalize category names to handle spelling variations.
  const normalizeCategory = (category = "") => {
    const value = category.trim().toLowerCase();

    if (["desert", "dessert", "desserts"].includes(value)) {
      return "dessert";
    }

    return value;
  };

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await API.get("/restaurants");
        setRestaurants(res.data.restaurants || []);
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    let cancelled = false;

    const filterRestaurants = async () => {
      let filtered = restaurants;

      // Search by restaurant name or cuisine.
      if (search.trim()) {
        const query = search.trim().toLowerCase();

        filtered = filtered.filter(
          (restaurant) =>
            restaurant.name?.toLowerCase().includes(query) ||
            restaurant.cuisine?.toLowerCase().includes(query)
        );
      }

      // Filter restaurants by their menu item categories.
      if (selectedCategory !== "All") {
        const results = await Promise.all(
          filtered.map(async (restaurant) => {
            try {
              const res = await API.get(
                `/menu/restaurant/${restaurant._id}`
              );

              // Support common response property names.
              const menuItems =
                res.data.menuItems ||
                res.data.menu ||
                res.data ||
                [];

              if (!Array.isArray(menuItems)) {
                return null;
              }

              const hasCategory = menuItems.some(
                (item) =>
                  normalizeCategory(item.category) ===
                  normalizeCategory(selectedCategory)
              );

              return hasCategory ? restaurant : null;
            } catch (error) {
              console.error(
                `Failed to fetch menu for ${restaurant.name}:`,
                error
              );
              return null;
            }
          })
        );

        filtered = results.filter(Boolean);
      }

      if (!cancelled) {
        setFilteredRestaurants(filtered);
      }
    };

    if (!loading) {
      filterRestaurants();
    }

    return () => {
      cancelled = true;
    };
  }, [restaurants, search, selectedCategory, loading]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h2 className="mb-8 text-3xl font-bold">
        {selectedCategory === "All"
          ? "Popular Restaurants"
          : `${selectedCategory} Restaurants`}
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading restaurants...</p>
      ) : filteredRestaurants.length === 0 ? (
        <p className="text-gray-500">
          No restaurants found for this category.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
