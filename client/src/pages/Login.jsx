import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginHero from "../components/loginHero/LoginHero";
import { toast } from "react-toastify";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaGoogle,
} from "react-icons/fa";

import API from "../services/api";

function Login() {
  const navigate = useNavigate();
const [formData, setFormData] = useState({
  email: "",
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
    const res = await API.post("/auth/login", formData);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    toast.success("Login Successful 🎉");

    setTimeout(() => {
      navigate("/");
    }, 800);
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Login Failed"
    );
  }
};

  return (
    <div className="min-h-screen bg-neutral-950">

      <div className="flex min-h-screen">

        {/* LEFT SIDE */}

        <div className="hidden lg:block lg:w-1/2 overflow-hidden">
          <LoginHero />
        </div>

        {/* RIGHT SIDE */}

        <div className="w-full lg:w-1/2 flex items-center justify-center bg-neutral-950 px-8">

          <div
            className="
              w-full
              max-w-md
              rounded-[32px]
              border
              border-white/15
              bg-white/10
              backdrop-blur-3xl
              shadow-[0_30px_80px_rgba(0,0,0,.55)]
              p-10
            "
          >

            <h2 className="text-5xl font-black text-white">
              Welcome Back 👋
            </h2>

            <p className="text-orange-400 mt-2 font-semibold">
              Sign in to continue
            </p>

            <div
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-orange-500/20
                px-4
                py-2
                text-sm
                font-semibold
                text-orange-300
              "
            >
              🔥 Trusted by 1000+ Food Lovers
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-10 space-y-6"
            >
                 {/* Email */}

                           {/* Email */}

              <div className="relative">

                <FaEnvelope className="absolute left-5 top-5 text-orange-400 text-lg" />

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/5
                    py-4
                    pl-14
                    pr-4
                    text-white
                    placeholder:text-gray-400
                    outline-none
                    transition-all
                    focus:border-orange-500
                    focus:ring-4
                    focus:ring-orange-500/20
                  "
                />

              </div>

              {/* Password */}

              <div className="relative">

                <FaLock className="absolute left-5 top-5 text-orange-400 text-lg" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/5
                    py-4
                    pl-14
                    pr-14
                    text-white
                    placeholder:text-gray-400
                    outline-none
                    transition-all
                    focus:border-orange-500
                    focus:ring-4
                    focus:ring-orange-500/20
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-5 text-gray-400 hover:text-orange-400"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>

              </div>

              {/* Remember */}

              <div className="flex items-center justify-between text-sm">

                <label className="flex items-center gap-2 cursor-pointer text-gray-300">

                  <input
                    type="checkbox"
                    className="accent-orange-500"
                  />

                  Remember Me

                </label>

                <Link
    to="/forgot-password"
    className="text-orange-400 hover:underline"
>
    Forgot Password?
</Link>

              </div>

              {/* Login Button */}

              <button
                type="submit"
                className="
                  w-full
                  rounded-2xl
                  bg-gradient-to-r
                  from-orange-500
                  via-orange-400
                  to-red-500
                  py-4
                  text-lg
                  font-bold
                  text-white
                  shadow-xl
                  transition-all
                  duration-300
                  hover:scale-[1.02]
                  hover:shadow-orange-500/30
                  flex
                  items-center
                  justify-center
                  gap-3
                "
              >
                Login Now
                <FaArrowRight />
              </button>

            </form>
            {/* Divider */}

            <div className="flex items-center gap-4 my-8">

              <hr className="flex-1 border-white/10" />

              <span className="text-gray-400 font-semibold">
                OR
              </span>

              <hr className="flex-1 border-white/10" />

            </div>

            {/* Google */}

            <button
              className="
                w-full
                rounded-2xl
                border
                border-white/10
                bg-white/5
                py-4
                text-white
                font-semibold
                flex
                items-center
                justify-center
                gap-3
                hover:bg-white/10
                transition-all
              "
            >
              <FaGoogle className="text-red-400" />

              Continue with Google

            </button>

            {/* Register */}

            <p className="text-center text-gray-400 mt-8">

              Don't have an account?

              <Link
                to="/register"
                className="ml-2 text-orange-400 font-bold hover:underline"
              >
                Register
              </Link>

            </p>

            {/* Footer */}

            <p className="text-center text-gray-500 text-sm mt-8">

              Made with ❤️ by FoodNest

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;