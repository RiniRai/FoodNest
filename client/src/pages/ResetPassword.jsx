
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.warning("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await API.put(
        `/auth/reset-password/${token}`,
        { password }
      );

      toast.success(res.data.message || "Password reset successfully");

      setTimeout(() => {
        navigate("/login");
      }, 800);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-orange-500">
          Reset Password
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Enter your new password
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="password"
            placeholder="New Password"
            className="w-full border rounded-lg p-3 focus:outline-none focus:border-orange-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full border rounded-lg p-3 focus:outline-none focus:border-orange-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
