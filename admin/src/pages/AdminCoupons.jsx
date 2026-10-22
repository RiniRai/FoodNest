import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialForm = {
  code: "",
  description: "",
  discountType: "percentage",
  discountValue: "",
  maxDiscountAmount: "",
  minOrderAmount: "0",
  expiryDate: "",
  isActive: true,
};

function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  });

  const fetchCoupons = async () => {
    try {
      const res = await API.get("/coupons", getHeaders());
      setCoupons(res.data.coupons || []);
    } catch (error) {
      console.error("Fetch coupons error:", error);
      toast.error(
        error.response?.data?.message || "Failed to load coupons"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.code.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    if (
      !form.discountValue ||
      Number(form.discountValue) <= 0
    ) {
      toast.error("Discount value must be greater than zero");
      return;
    }

    if (
      form.discountType === "percentage" &&
      Number(form.discountValue) > 100
    ) {
      toast.error("Percentage discount cannot exceed 100%");
      return;
    }

    if (!form.expiryDate) {
      toast.error("Please select an expiry date and time");
      return;
    }

    const payload = {
      code: form.code.trim().toUpperCase(),
      description: form.description.trim(),
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      minOrderAmount: Number(form.minOrderAmount || 0),
      expiryDate: new Date(form.expiryDate).toISOString(),
      isActive: form.isActive,
    };

    if (form.discountType === "percentage") {
      payload.maxDiscountAmount = Number(
        form.maxDiscountAmount || 0
      );
    }

    try {
      setSaving(true);

      if (editingId) {
        await API.put(
          `/coupons/${editingId}`,
          payload,
          getHeaders()
        );
        toast.success("Coupon updated successfully");
      } else {
        await API.post("/coupons", payload, getHeaders());
        toast.success("Coupon created successfully");
      }

      resetForm();
      await fetchCoupons();
    } catch (error) {
      console.error("Save coupon error:", error);
      toast.error(
        error.response?.data?.message || "Failed to save coupon"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (coupon) => {
    setEditingId(coupon._id);

    const expiry = coupon.expiryDate
      ? new Date(coupon.expiryDate)
      : null;

    const localExpiry = expiry
      ? new Date(
          expiry.getTime() - expiry.getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, 16)
      : "";

    setForm({
      code: coupon.code || "",
      description: coupon.description || "",
      discountType: coupon.discountType || "percentage",
      discountValue: String(coupon.discountValue ?? ""),
      maxDiscountAmount: String(coupon.maxDiscountAmount ?? ""),
      minOrderAmount: String(coupon.minOrderAmount ?? 0),
      expiryDate: localExpiry,
      isActive: coupon.isActive ?? true,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleCoupon = async (coupon) => {
    try {
      await API.put(
        `/coupons/${coupon._id}`,
        { isActive: !coupon.isActive },
        getHeaders()
      );

      toast.success(
        `Coupon ${coupon.isActive ? "deactivated" : "activated"}`
      );

      await fetchCoupons();
    } catch (error) {
      console.error("Toggle coupon error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update coupon"
      );
    }
  };

  const deleteCoupon = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this coupon?"
    );

    if (!confirmed) return;

    try {
      await API.delete(`/coupons/${id}`, getHeaders());

      toast.success("Coupon deleted successfully");

      if (editingId === id) {
        resetForm();
      }

      await fetchCoupons();
    } catch (error) {
      console.error("Delete coupon error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete coupon"
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="min-w-0 flex-1 p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">
            Manage Coupons
          </h1>
          <p className="mt-2 text-gray-500">
            Create and manage promotional offers for FoodNest customers.
          </p>
        </div>

        {/* Coupon Form */}
        <section className="mb-10 rounded-xl bg-white p-5 shadow-md md:p-7">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">
            {editingId ? "Edit Coupon" : "Create New Coupon"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Coupon Code *
                </label>
                <input
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  placeholder="e.g. WELCOME20"
                  required
                  maxLength={30}
                  className="w-full rounded-lg border p-3 uppercase outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Description
                </label>
                <input
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Welcome discount"
                  className="w-full rounded-lg border p-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Discount Type *
                </label>
                <select
                  name="discountType"
                  value={form.discountType}
                  onChange={handleChange}
                  className="w-full rounded-lg border bg-white p-3 outline-none focus:border-orange-500"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat Amount (₹)</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Discount Value *
                </label>
                <input
                  name="discountValue"
                  type="number"
                  min="0.01"
                  step="0.01"
                  max={form.discountType === "percentage" ? 100 : undefined}
                  value={form.discountValue}
                  onChange={handleChange}
                  placeholder={
                    form.discountType === "percentage"
                      ? "e.g. 20"
                      : "e.g. 50"
                  }
                  required
                  className="w-full rounded-lg border p-3 outline-none focus:border-orange-500"
                />
              </div>

              {form.discountType === "percentage" && (
                <div>
                  <label className="mb-2 block font-medium text-gray-700">
                    Maximum Discount (₹)
                  </label>
                  <input
                    name="maxDiscountAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.maxDiscountAmount}
                    onChange={handleChange}
                    placeholder="e.g. 100"
                    className="w-full rounded-lg border p-3 outline-none focus:border-orange-500"
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Minimum Order Amount (₹)
                </label>
                <input
                  name="minOrderAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.minOrderAmount}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Expiry Date and Time *
                </label>
                <input
                  name="expiryDate"
                  type="datetime-local"
                  value={form.expiryDate}
                  onChange={handleChange}
                  min={new Date().toISOString().slice(0, 16)}
                  required
                  className="w-full rounded-lg border p-3 outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center gap-3 self-end pb-3">
                <input
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="h-5 w-5 accent-orange-500"
                />
                <label
                  htmlFor="isActive"
                  className="font-medium text-gray-700"
                >
                  Coupon is active
                </label>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Coupon"
                    : "Create Coupon"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-100"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Coupon List */}
        <section className="rounded-xl bg-white p-5 shadow-md md:p-7">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold text-gray-800">
              All Coupons
            </h2>
            <span className="rounded-full bg-orange-100 px-4 py-2 font-medium text-orange-700">
              {coupons.length} total
            </span>
          </div>

          {loading ? (
            <p className="py-8 text-center text-gray-500">
              Loading coupons...
            </p>
          ) : coupons.length === 0 ? (
            <p className="py-8 text-center text-gray-500">
              No coupons found. Create your first coupon above.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-left">
                <thead>
                  <tr className="bg-orange-500 text-white">
                    <th className="p-3">Code</th>
                    <th className="p-3">Discount</th>
                    <th className="p-3">Minimum Order</th>
                    <th className="p-3">Expiry</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {coupons.map((coupon) => {
                    const expired =
                      new Date(coupon.expiryDate).getTime() < Date.now();

                    return (
                      <tr
                        key={coupon._id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-3">
                          <p className="font-bold text-gray-800">
                            {coupon.code}
                          </p>
                          <p className="text-sm text-gray-500">
                            {coupon.description}
                          </p>
                        </td>

                        <td className="p-3">
                          {coupon.discountType === "percentage"
                            ? `${coupon.discountValue}%`
                            : `₹${coupon.discountValue}`}
                          {coupon.discountType === "percentage" &&
                            coupon.maxDiscountAmount > 0 && (
                              <p className="text-sm text-gray-500">
                                Up to ₹{coupon.maxDiscountAmount}
                              </p>
                            )}
                        </td>

                        <td className="p-3">
                          ₹{coupon.minOrderAmount ?? 0}
                        </td>

                        <td className="p-3">
                          {new Date(coupon.expiryDate).toLocaleString()}
                        </td>

                        <td className="p-3">
                          <span
                            className={`rounded-full px-3 py-1 text-sm font-medium ${
                              expired
                                ? "bg-red-100 text-red-700"
                                : coupon.isActive
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {expired
                              ? "Expired"
                              : coupon.isActive
                                ? "Active"
                                : "Inactive"}
                          </span>
                        </td>

                        <td className="p-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(coupon)}
                              className="rounded-md bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleCoupon(coupon)}
                              disabled={expired}
                              className="rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {coupon.isActive ? "Deactivate" : "Activate"}
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteCoupon(coupon._id)}
                              className="rounded-md bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminCoupons;
