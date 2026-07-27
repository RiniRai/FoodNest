import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="bg-orange-100 min-h-[80vh] flex items-center">

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

        <div>

          <h1 className="text-6xl font-bold leading-tight">
            Delicious Food
            <span className="text-orange-500"> Delivered Fast</span>
          </h1>

          <p className="mt-6 text-gray-600 text-lg">
            Discover your favourite restaurants,
            order delicious meals,
            and enjoy lightning-fast delivery.
          </p>

          <button
            onClick={() => navigate("/restaurants")}
            className="mt-8 bg-orange-500 text-white px-8 py-4 rounded-xl text-lg hover:bg-orange-600 transition"
          >
            Order Now
          </button>

        </div>

        <div className="flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38"
            alt="Pizza"
            className="rounded-3xl shadow-xl w-[500px]"
          />
        </div>

      </div>

    </section>
  );
}

export default Hero;