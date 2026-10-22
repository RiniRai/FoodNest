
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";

function Checkout() {
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [placingOrder, setPlacingOrder] = useState(false);

  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Load cart items
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get("/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const items =
          res.data?.cart?.items ??
          res.data?.items ??
          (Array.isArray(res.data?.cart) ? res.data.cart : []);

        setCartItems(Array.isArray(items) ? items : []);
      } catch (error) {
        console.error("Fetch Cart Error:", error);
        toast.error("Unable to load your cart");
      } finally {
        setLoadingCart(false);
      }
    };

    fetchCart();
  }, []);

  // Calculate subtotal using current item prices
  const subtotal = cartItems.reduce((sum, item) => {
    const price = Number(item.menuItem?.price ?? item.price ?? 0);
    const quantity = Number(item.quantity ?? 1);

    return sum + price * quantity;
  }, 0);

  const discount = appliedCoupon
    ? Number(appliedCoupon.discount || 0)
    : 0;

  const finalAmount = Math.max(0, subtotal - discount);

  // Validate coupon with backend
  const handleApplyCoupon = async (e) => {
    e.preventDefault();

    const code = couponCode.trim().toUpperCase();

    if (!code) {
      toast.error("Please enter a coupon code");
      return;
    }

    if (subtotal <= 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setValidatingCoupon(true);

      const token = localStorage.getItem("token");

      const res = await API.post(
        "/coupons/validate",
        {
          code,
          orderAmount: subtotal,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.success) {
        setAppliedCoupon({
          ...res.data,
          coupon: {
            ...res.data.coupon,
            code: res.data.coupon?.code || code,
          },
        });

        setCouponCode(code);
        toast.success(res.data.message || "Coupon applied successfully!");
      } else {
        setAppliedCoupon(null);
        toast.error(res.data?.message || "Invalid coupon");
      }
    } catch (error) {
      setAppliedCoupon(null);

      toast.error(
        error.response?.data?.message || "Unable to validate coupon"
      );
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.info("Coupon removed");
  };

  // Place order
  const placeOrder = async (e) => {
    e.preventDefault();

    if (!deliveryAddress.trim()) {
      toast.error("Please enter your delivery address");
      return;
    }

    if (paymentMethod !== "COD") {
      toast.error("Only Cash on Delivery is available right now");
      return;
    }

    if (loadingCart) {
      toast.error("Please wait while your cart loads");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setPlacingOrder(true);

      const token = localStorage.getItem("token");

      const res = await API.post(
        "/orders",
        {
          deliveryAddress: deliveryAddress.trim(),
          paymentMethod: "COD",
          couponCode: appliedCoupon?.coupon?.code || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message || "Order placed successfully!");

      navigate("/orders");
    } catch (error) {
      console.error("Place Order Error:", error);

      toast.error(
        error.response?.data?.message || "Failed to place order"
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="max-w-xl mx-auto mt-10 mb-10 bg-white shadow-lg rounded-xl p-6 sm:p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Checkout
        </h1>

        {/* Order Summary */}
        <section className="mb-8 rounded-lg border p-4">
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>

          {loadingCart ? (
            <p className="text-gray-500">Loading cart...</p>
          ) : cartItems.length === 0 ? (
            <p className="text-gray-500">
              Your cart is empty. Add items before checkout.
            </p>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                {cartItems.map((item, index) => {
                  const name =
                    item.menuItem?.name ||
                    item.name ||
                    "Menu item";

                  const price = Number(
                    item.menuItem?.price ?? item.price ?? 0
                  );

                  const quantity = Number(item.quantity ?? 1);

                  return (
                    <div
                      key={item._id || item.menuItem?._id || index}
                      className="flex justify-between gap-4 text-sm"
                    >
                      <span>
                        {name} × {quantity}
                      </span>
                      <span className="font-medium">
                        ₹{(price * quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>
                      Coupon discount ({appliedCoupon.coupon?.code})
                    </span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-lg font-bold border-t pt-3">
                  <span>Total</span>
                  <span>₹{finalAmount.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </section>

        {/* Coupon Section */}
        <section className="mb-8 rounded-lg border border-orange-200 bg-orange-50 p-4">
          <h2 className="text-lg font-bold mb-3">Apply Coupon</h2>

          {appliedCoupon ? (
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-green-700">
                  {appliedCoupon.coupon?.code} applied
                </p>
                <p className="text-sm text-green-700">
                  You saved ₹{discount.toFixed(2)}!
                </p>
              </div>

              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="text-sm font-semibold text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter coupon code"
                maxLength={50}
                className="min-w-0 flex-1 rounded-lg border bg-white p-3 uppercase focus:outline-none focus:ring-2 focus:ring-orange-400"
                disabled={validatingCoupon || loadingCart}
              />

              <button
                type="submit"
                disabled={validatingCoupon || loadingCart || subtotal <= 0}
                className="rounded-lg bg-orange-500 px-4 py-3 font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {validatingCoupon ? "Checking..." : "Apply"}
              </button>
            </form>
          )}
        </section>

        <form onSubmit={placeOrder} className="space-y-6">
          <div>
            <label
              htmlFor="deliveryAddress"
              className="block mb-2 font-semibold"
            >
              Delivery Address
            </label>

            <textarea
              id="deliveryAddress"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              rows={4}
              placeholder="Enter your complete delivery address"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              maxLength={500}
              required
            />
          </div>

          <div>
            <label
              htmlFor="paymentMethod"
              className="block mb-2 font-semibold"
            >
              Payment Method
            </label>

            <select
              id="paymentMethod"
              className="w-full border rounded-lg p-3"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="COD">Cash on Delivery</option>
            </select>

            <p className="text-sm text-gray-500 mt-2">
              Pay when your order is delivered.
            </p>
          </div>

          <button
            type="submit"
            disabled={
              placingOrder ||
              loadingCart ||
              cartItems.length === 0
            }
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {placingOrder
              ? "Placing Order..."
              : `Place Order · ₹${finalAmount.toFixed(2)}`}
          </button>
        </form>
      </main>

      <Footer />
    </>
  );
}

export default Checkout;
