import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";
import API from "../services/api";
import { toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await API.post("/auth/register", formData);

    toast.success(res.data.message);

    setTimeout(() => {
      navigate("/login");
    }, 800);
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Registration Failed"
    );
  }
};

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836')",
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative bg-white/15 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl p-10 w-[450px]">

        <h1 className="text-4xl font-bold text-white text-center">
          🍔 FoodNest
        </h1>

        <p className="text-center text-gray-200 mt-2 mb-8">
          Create your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="relative">
            <FaUser className="absolute left-4 top-4 text-gray-500" />

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-3 rounded-xl outline-none"
            />
          </div>

          <div className="relative">
            <FaEnvelope className="absolute left-4 top-4 text-gray-500" />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-3 rounded-xl outline-none"
            />
          </div>

          <div className="relative">
            <FaPhone className="absolute left-4 top-4 text-gray-500" />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-3 rounded-xl outline-none"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-4 top-4 text-gray-500" />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-3 rounded-xl outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-xl text-lg font-semibold hover:bg-orange-600 transition duration-300"
          >
            Create Account
          </button>

        </form>

        <p className="text-center text-white mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-orange-300 hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;