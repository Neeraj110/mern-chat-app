import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredential } from "../redux/slices/userSlice";
import { axiosInstance } from "../utils/axios";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSuccess = async (response) => {
    const code = response.code;
    if (!code) {
      console.error("Google login failed");
      return;
    }
    try {
      setIsLoading(true);
      const res = await axiosInstance.post(
        "http://localhost:3000/api/auth/google",
        {
          code,
        }
      );
      if (res.data && res.data.user) {
        dispatch(setCredential(res.data.user));
        navigate("/");
      }
    } catch (error) {
      console.error("Google login failed:", error);
      setError("Google login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleSuccess,
    flow: "auth-code",
  });

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await axiosInstance.post(
        "http://localhost:3000/api/auth/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      if (res.data && res.data.user) {
        dispatch(setCredential(res.data.user));
        navigate("/");
      }
    } catch (error) {
      console.error("Email login failed:", error);
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-8">
          Login to Chat App
        </h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleEmailLogin} className="mb-6">
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login with Email"}
          </button>
        </form>

        <button
          onClick={googleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg 
                     hover:bg-red-600 transition-colors disabled:opacity-50 mb-6"
          aria-label="Login with Google"
        >
          <span>Continue with Google</span>
        </button>

        <Link
          to="/reset-password"
          className="block text-center mt-4 text-blue-500"
        >
          Forgot password?
        </Link>

        <p className="text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-500">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
