import { useState } from "react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import FoodCategories from "../components/FoodCategories";
import RestaurantSection from "../components/RestaurantSection";
import Offers from "../components/Offers";
import PopularDishes from "../components/PopularDishes";
import Footer from "../components/Footer";

function Home() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <>
      <Navbar />

      <Hero />

      <SearchBar
        search={search}
        setSearch={setSearch}
      />

      <FoodCategories
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <RestaurantSection
        search={search}
        selectedCategory={selectedCategory}
      />

      <Offers />

      <PopularDishes />

      <Footer />
    </>
  );
}

export default Home;