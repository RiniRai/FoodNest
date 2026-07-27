function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-[400px]">
        <h1 className="text-3xl font-bold mb-4">
          Forgot Password
        </h1>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border rounded-lg p-3"
        />

        <button
          className="w-full mt-5 bg-orange-500 text-white py-3 rounded-lg"
        >
          Send Reset Link
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;