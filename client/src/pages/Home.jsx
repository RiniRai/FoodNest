
import { useState } from "react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import FoodCategories from "../components/FoodCategories";
import RestaurantSection from "../components/RestaurantSection";
import PopularDishes from "../components/PopularDishes";
import Footer from "../components/Footer";

import { Link } from "react-router-dom";

function Home() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <>
      <Navbar />

      <Hero />

      {/* Search */}
      <SearchBar
        search={search}
        setSearch={setSearch}
      />

      {/* Food Categories */}
      <FoodCategories
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Restaurants */}
      <RestaurantSection
        search={search}
        selectedCategory={selectedCategory}
      />

      {/* Promotional Offers Banner */}
      <section className="px-4 py-10 sm:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-red-500 to-rose-600 px-6 py-10 text-white shadow-xl sm:px-12 sm:py-14">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
              🎉 Special FoodNest Deal
            </span>

            <h2 className="mt-5 text-3xl font-extrabold leading-tight sm:text-5xl">
              Delicious food.
              <br />
              Unmissable savings.
            </h2>

            <p className="mt-4 max-w-lg text-base text-white/90 sm:text-lg">
              Get 20% off your eligible order with our WELCOME20 coupon.
              Minimum order ₹299, with savings capped at ₹100.
            </p>

            <Link
              to="/offers"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-orange-600 shadow-md transition hover:-translate-y-1 hover:bg-orange-50"
            >
              Grab Your Deal
              <span aria-hidden="true">→</span>
            </Link>

            <p className="mt-4 text-sm text-white/80">
              Terms and minimum order requirements apply.
            </p>
          </div>

          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-12 -top-16 h-64 w-64 rounded-full bg-white/10 sm:h-80 sm:w-80" />
          <div className="pointer-events-none absolute -bottom-24 right-36 h-48 w-48 rounded-full bg-white/10" />

          <div className="pointer-events-none absolute bottom-6 right-8 hidden text-8xl sm:block">
            🍔
          </div>
        </div>
      </section>

      {/* Popular Dishes */}
      <PopularDishes />

      <Footer />
    </>
  );
}

export default Home;
