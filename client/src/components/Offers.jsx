import {
  FaTags,
  FaPizzaSlice,
  FaHamburger,
  FaTruck,
} from "react-icons/fa";

const offers = [
  {
    id: 1,
    title: "Flat 50% OFF",
    description: "On all Pizza orders above ₹499",
    icon: <FaPizzaSlice className="text-5xl text-red-500" />,
    bg: "bg-red-50",
  },
  {
    id: 2,
    title: "Buy 1 Get 1 Free",
    description: "On selected Burger Combos",
    icon: <FaHamburger className="text-5xl text-orange-500" />,
    bg: "bg-orange-50",
  },
  {
    id: 3,
    title: "Free Delivery",
    description: "On orders above ₹299",
    icon: <FaTruck className="text-5xl text-green-500" />,
    bg: "bg-green-50",
  },
];

function Offers() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-center gap-3 mb-8">
        <FaTags className="text-orange-500 text-3xl" />
        <h2 className="text-4xl font-bold">
          Today's Best Offers
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className={`${offer.bg} rounded-2xl p-8 shadow-md hover:shadow-xl transition duration-300 hover:-translate-y-2`}
          >
            <div>{offer.icon}</div>

            <h3 className="text-2xl font-bold mt-6">
              {offer.title}
            </h3>

            <p className="text-gray-600 mt-3">
              {offer.description}
            </p>

            <button className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg">
              Order Now
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Offers;