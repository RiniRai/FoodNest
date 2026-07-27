import {
  FaHamburger,
  FaPizzaSlice,
  FaIceCream,
  FaGlassWhiskey,
} from "react-icons/fa";
import { GiNoodles, GiChickenOven } from "react-icons/gi";

function FoodCategories({ selectedCategory, setSelectedCategory }) {
  const categories = [
    {
      name: "All",
      icon: "🍽️",
    },
    {
      name: "Burger",
      icon: <FaHamburger className="text-5xl text-orange-500" />,
    },
    {
      name: "Pizza",
      icon: <FaPizzaSlice className="text-5xl text-red-500" />,
    },
    {
      name: "Noodles",
      icon: <GiNoodles className="text-5xl text-yellow-500" />,
    },
    {
      name: "Biryani",
      icon: <GiChickenOven className="text-5xl text-amber-600" />,
    },
    {
      name: "Dessert",
      icon: <FaIceCream className="text-5xl text-pink-500" />,
    },
    {
      name: "Drinks",
      icon: <FaGlassWhiskey className="text-5xl text-blue-500" />,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto py-14 px-6">
      <h2 className="text-4xl font-bold text-center mb-10">
        Browse by Category
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-6">
        {categories.map((category) => (
          <div
            key={category.name}
            onClick={() => setSelectedCategory(category.name)}
            className={`rounded-2xl p-6 flex flex-col items-center cursor-pointer transition-all duration-300 ${
              selectedCategory === category.name
                ? "bg-orange-500 text-white shadow-xl scale-105"
                : "bg-white shadow-md hover:shadow-xl hover:-translate-y-2"
            }`}
          >
            <div
              className={`${
                selectedCategory === category.name
                  ? "text-white"
                  : ""
              }`}
            >
              {category.icon}
            </div>

            <p className="mt-4 text-lg font-semibold">
              {category.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FoodCategories;