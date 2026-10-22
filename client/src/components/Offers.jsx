
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Offers() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await API.get("/coupons/public");
        setCoupons(res.data?.coupons || []);
      } catch (error) {
        console.error("Failed to fetch offers:", error);
        toast.error("Unable to load offers. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(`${code} copied! Apply it at checkout.`);
    } catch {
      toast.info(`Your coupon code is ${code}. Copy it manually.`);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <section className="mb-10 rounded-3xl bg-gradient-to-r from-orange-500 to-red-500 p-8 text-white shadow-lg sm:p-12">
            <p className="mb-3 font-semibold uppercase tracking-widest text-orange-100">
              FoodNest Special Offers
            </p>

            <h1 className="text-3xl font-extrabold sm:text-5xl">
              Good food. Great deals.
            </h1>

            <p className="mt-4 max-w-xl text-orange-50">
              Discover available coupons and save on your next delicious meal.
            </p>
          </section>

          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Available Coupons
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Copy a code and apply it at checkout.
              </p>
            </div>

            {!loading && (
              <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
                {coupons.length} {coupons.length === 1 ? "offer" : "offers"}
              </span>
            )}
          </div>

          {loading ? (
            <div className="py-16 text-center text-gray-500">
              Loading offers...
            </div>
          ) : coupons.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
              <div className="text-5xl">🍽️</div>
              <h3 className="mt-4 text-xl font-bold text-gray-800">
                No offers available right now
              </h3>
              <p className="mt-2 text-gray-500">
                Check back soon for exciting deals!
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {coupons.map((coupon) => (
                <article
                  key={coupon._id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="bg-orange-50 p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
                          Special offer
                        </p>

                        <h3 className="mt-2 text-3xl font-extrabold text-gray-900">
                          {coupon.discountType === "percentage"
                            ? `${coupon.discountValue}% OFF`
                            : `₹${coupon.discountValue} OFF`}
                        </h3>
                      </div>

                      <span className="text-4xl" aria-hidden="true">
                        🎁
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-gray-600">
                      {coupon.description || "Enjoy a special FoodNest deal."}
                    </p>
                  </div>

                  <div className="p-6">
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>
                        <span className="font-semibold text-gray-800">
                          Minimum order:
                        </span>{" "}
                        ₹{coupon.minOrderAmount}
                      </p>

                      {coupon.discountType === "percentage" &&
                        coupon.maxDiscountAmount != null && (
                          <p>
                            <span className="font-semibold text-gray-800">
                              Maximum savings:
                            </span>{" "}
                            ₹{coupon.maxDiscountAmount}
                          </p>
                        )}

                      <p>
                        <span className="font-semibold text-gray-800">
                          Valid until:
                        </span>{" "}
                        {formatDate(coupon.expiryDate)}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border-2 border-dashed border-orange-300 bg-orange-50 p-3">
                      <span className="break-all font-extrabold tracking-wider text-orange-700">
                        {coupon.code}
                      </span>

                      <button
                        type="button"
                        onClick={() => copyCode(coupon.code)}
                        className="shrink-0 rounded-lg bg-orange-500 px-3 py-2 text-sm font-bold text-white transition hover:bg-orange-600"
                      >
                        Copy
                      </button>
                    </div>

                    <p className="mt-3 text-xs text-gray-500">
                      Apply this code at checkout to receive your discount.
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Offers;
