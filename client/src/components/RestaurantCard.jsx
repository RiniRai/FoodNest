import { Link } from "react-router-dom";

function RestaurantCard({ restaurant }) {
  return (
    <Link to={`/restaurant/${restaurant._id}`}>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition cursor-pointer">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-56 object-cover"
        />

        <div className="p-4">
          <h2 className="text-xl font-bold">{restaurant.name}</h2>

          <p>{restaurant.address}</p>

          <p>{restaurant.cuisine}</p>

          <p>⭐ {restaurant.rating}</p>

          <p>{restaurant.deliveryTime}</p>
        </div>
      </div>
    </Link>
  );
}

export default RestaurantCard;