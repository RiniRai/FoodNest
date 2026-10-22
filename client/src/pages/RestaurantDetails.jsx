
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";

function RestaurantDetails() {
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [reviewsByItem, setReviewsByItem] = useState({});
  const [reviewForms, setReviewForms] = useState({});
  const [openReview, setOpenReview] = useState({});
  const [submitting, setSubmitting] = useState({});

  useEffect(() => {
    setRestaurant(null);
    setMenuItems([]);
    setReviewsByItem({});
    fetchRestaurant();
    fetchMenu();
  }, [id]);

  const fetchRestaurant = async () => {
    try {
      const res = await API.get("/restaurants");
      const found = res.data.restaurants.find(
        (item) => item._id === id
      );
      setRestaurant(found || null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load restaurant");
    }
  };

  const fetchMenu = async () => {
    try {
      const res = await API.get(`/menu/restaurant/${id}`);
      const items = res.data.menuItems || [];
      setMenuItems(items);
      await Promise.all(items.map((item) => fetchReviews(item._id)));
    } catch (error) {
      console.error(error);
      toast.error("Failed to load menu");
    }
  };

  const fetchReviews = async (menuItemId) => {
    try {
      const res = await API.get(`/reviews/${menuItemId}`);
      setReviewsByItem((prev) => ({
        ...prev,
        [menuItemId]: {
          reviews: res.data.reviews || [],
          averageRating: res.data.averageRating || 0,
          totalReviews: res.data.totalReviews || 0,
        },
      }));
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

  const addToCart = async (menuItemId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.warning("Please login first");
      return;
    }

    try {
      const res = await API.post(
        "/cart",
        { menuItemId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add item to cart"
      );
    }
  };

  const updateReviewForm = (menuItemId, field, value) => {
    setReviewForms((prev) => ({
      ...prev,
      [menuItemId]: {
        rating: 5,
        comment: "",
        ...prev[menuItemId],
        [field]: value,
      },
    }));
  };

  const submitReview = async (menuItemId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.warning("Please login to submit a review");
      return;
    }

    const form = reviewForms[menuItemId] || {
      rating: 5,
      comment: "",
    };

    try {
      setSubmitting((prev) => ({ ...prev, [menuItemId]: true }));

      const res = await API.post(
        "/reviews",
        {
          menuItem: menuItemId,
          rating: form.rating,
          comment: form.comment,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message || "Review submitted successfully");

      setReviewForms((prev) => ({
        ...prev,
        [menuItemId]: { rating: 5, comment: "" },
      }));

      setOpenReview((prev) => ({ ...prev, [menuItemId]: false }));
      await fetchReviews(menuItemId);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit review"
      );
    } finally {
      setSubmitting((prev) => ({ ...prev, [menuItemId]: false }));
    }
  };

  const deleteReview = async (menuItemId, reviewId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.warning("Please login first");
      return;
    }

    if (!window.confirm("Delete your review?")) return;

    try {
      const res = await API.delete(`/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(res.data.message || "Review deleted successfully");
      await fetchReviews(menuItemId);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete review"
      );
    }
  };

  const renderStars = (rating, onSelect, interactive = false) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onSelect(star)}
          disabled={!interactive}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          className={`text-xl ${
            star <= rating ? "text-yellow-400" : "text-gray-300"
          } ${
            interactive
              ? "cursor-pointer transition hover:scale-110"
              : "cursor-default"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );

  if (!restaurant) {
    return (
      <>
        <Navbar />
        <p className="mt-20 text-center text-gray-500">
          Loading restaurant...
        </p>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="h-64 w-full rounded-2xl object-cover md:h-80"
        />

        <h1 className="mt-6 text-3xl font-bold md:text-4xl">
          {restaurant.name}
        </h1>
        <p className="mt-2 text-gray-600">📍 {restaurant.address}</p>
        <p className="mt-1 text-gray-600">🍽 {restaurant.cuisine}</p>
        <p className="mt-1 text-gray-600">
          🚴 {restaurant.deliveryTime}
        </p>

        <h2 className="mb-6 mt-10 text-2xl font-bold">Our Menu</h2>

        {menuItems.length === 0 ? (
          <p className="text-gray-500">No menu items available.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {menuItems.map((item) => {
              const data = reviewsByItem[item._id] || {
                reviews: [],
                averageRating: 0,
                totalReviews: 0,
              };

              const form = reviewForms[item._id] || {
                rating: 5,
                comment: "",
              };

              return (
                <article
                  key={item._id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="p-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-52 w-full rounded-xl object-cover"
                    />

                    <h3 className="mt-4 text-xl font-bold">{item.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {item.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xl font-bold">
                        ₹{item.price}
                      </span>

                      <button
                        onClick={() => addToCart(item._id)}
                        className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                      >
                        Add to Cart
                      </button>
                    </div>

                    <div className="mt-5 border-t pt-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg text-yellow-500">
                            ★
                          </span>
                          <span className="font-semibold">
                            {data.averageRating.toFixed(1)}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({data.totalReviews}{" "}
                            {data.totalReviews === 1 ? "review" : "reviews"})
                          </span>
                        </div>

                        <button
                          onClick={() =>
                            setOpenReview((prev) => ({
                              ...prev,
                              [item._id]: !prev[item._id],
                            }))
                          }
                          className="text-sm font-semibold text-orange-600 hover:text-orange-700"
                        >
                          {openReview[item._id]
                            ? "Close"
                            : "✍ Write a review"}
                        </button>
                      </div>

                      {openReview[item._id] && (
                        <div className="mt-4 rounded-xl bg-gray-50 p-4">
                          <h4 className="font-semibold">Rate this dish</h4>

                          <div className="mt-2">
                            {renderStars(
                              form.rating,
                              (rating) =>
                                updateReviewForm(item._id, "rating", rating),
                              true
                            )}
                          </div>

                          <textarea
                            value={form.comment}
                            onChange={(e) =>
                              updateReviewForm(
                                item._id,
                                "comment",
                                e.target.value
                              )
                            }
                            placeholder="Share your experience (optional)"
                            maxLength={1000}
                            rows={3}
                            className="mt-3 w-full resize-y rounded-lg border border-gray-200 bg-white p-3 text-sm outline-none focus:border-orange-500"
                          />

                          <p className="mt-1 text-right text-xs text-gray-500">
                            {form.comment.length}/1000
                          </p>

                          <button
                            onClick={() => submitReview(item._id)}
                            disabled={!!submitting[item._id]}
                            className="mt-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
                          >
                            {submitting[item._id]
                              ? "Submitting..."
                              : "Submit Review"}
                          </button>
                        </div>
                      )}

                      {data.reviews.length > 0 && (
                        <div className="mt-4 space-y-4">
                          {data.reviews.map((review) => (
                            <div
                              key={review._id}
                              className="border-t pt-3"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="text-sm font-semibold">
                                    {review.userId?.name ||
                                      "FoodNest Customer"}
                                  </p>
                                  <div className="mt-1">
                                    {renderStars(review.rating)}
                                  </div>
                                  <p className="mt-1 text-xs text-gray-500">
                                    {new Date(
                                      review.createdAt
                                    ).toLocaleDateString()}
                                  </p>
                                </div>

                                {localStorage.getItem("token") &&
                                  (() => {
                                    try {
                                      const token =
                                        localStorage.getItem("token");
                                      const payload = JSON.parse(
                                        atob(token.split(".")[1])
                                      );

                                      const currentUserId =
                                        payload.id ||
                                        payload._id ||
                                        payload.userId;

                                      const ownerId =
                                        typeof review.userId === "object"
                                          ? review.userId?._id
                                          : review.userId;

                                      if (
                                        currentUserId &&
                                        ownerId &&
                                        String(currentUserId) === String(ownerId)
                                      ) {
                                        return (
                                          <button
                                            onClick={() =>
                                              deleteReview(item._id, review._id)
                                            }
                                            className="text-xs font-medium text-red-500 hover:text-red-700"
                                          >
                                            Delete
                                          </button>
                                        );
                                      }

                                      return null;
                                    } catch {
                                      return null;
                                    }
                                  })()}
                              </div>

                              {review.comment && (
                                <p className="mt-2 break-words text-sm leading-6 text-gray-700">
                                  {review.comment}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {data.reviews.length === 0 && (
                        <p className="mt-3 text-xs text-gray-500">
                          No reviews yet. Be the first!
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

export default RestaurantDetails;
