
import {
  FaHamburger,
  FaPizzaSlice,
  FaIceCream,
  FaGlassWhiskey,
} from "react-icons/fa";
import { GiNoodles, GiChickenOven } from "react-icons/gi";

function FoodCategories({ selectedCategory, setSelectedCategory }) {
  const categories = [
    { name: "All", icon: "🍽️" },
    {
      name: "Burger",
      icon: <FaHamburger />,
      color: "text-orange-500",
    },
    {
      name: "Pizza",
      icon: <FaPizzaSlice />,
      color: "text-red-500",
    },
    {
      name: "Noodles",
      icon: <GiNoodles />,
      color: "text-yellow-500",
    },
    {
      name: "Biryani",
      icon: <GiChickenOven />,
      color: "text-amber-600",
    },
    {
      name: "Dessert",
      icon: <FaIceCream />,
      color: "text-pink-500",
    },
    {
      name: "Drinks",
      icon: <FaGlassWhiskey />,
      color: "text-blue-500",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14">
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-orange-500">
          Find your favorites
        </p>

        <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Browse by Category
        </h2>

        <p className="mt-3 text-sm text-gray-500 sm:text-base">
          Explore delicious dishes for every craving.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-7">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.name;

          return (
            <button
              key={category.name}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelectedCategory(category.name)}
              className={`group flex min-h-32 flex-col items-center justify-center rounded-2xl border p-4 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 sm:min-h-36 ${
                isSelected
                  ? "border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-200"
                  : "border-gray-100 bg-white text-gray-800 shadow-sm hover:-translate-y-1 hover:border-orange-200 hover:shadow-md"
              }`}
            >
              <span
                className={`flex h-12 w-12 items-center justify-center text-4xl transition-transform duration-200 group-hover:scale-110 ${
                  isSelected
                    ? "text-white"
                    : category.color || ""
                }`}
              >
                {category.icon}
              </span>

              <span className="mt-3 text-sm font-semibold sm:text-base">
                {category.name}
              </span>

              {isSelected && (
                <span className="mt-1 text-xs text-white/90">
                  Selected
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default FoodCategories;
