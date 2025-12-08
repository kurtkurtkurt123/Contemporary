import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from 'react-hot-toast';

// Using Heroicons for the eye toggle
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
// NOTE: You must replace this with your actual globe image component or URL
import GlobeImage from '../assets/images/globe.png';
import '../assets/styles/login.css';

const Login = () => { // Changed function name to 'Login' for convention
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Guard against double-execution (Strict Mode fix)
    if (loading) return;
    setLoading(true);

    try {
      // 2. The core API call using your AuthContext function
      const success = await login(identifier, password);

      if (success) {
        // If login is successful, navigation happens inside your 'login' function (as per your original code)
        // You can optionally add a success toast here if the 'login' function doesn't already handle it
        // toast.success("Login successful!"); 
        return;
      }

    } catch (error) {
      // 3. Error Handling and Toast Notification

      // Attempt to get the specific message from the API response
      const apiMessage = error.response?.data?.message;

      // Choose the best message for the user
      if (apiMessage === "Invalid password") {
        toast.error("The password you entered is incorrect. Please try again.");
      }
      else if (apiMessage) {
        // Display any other specific error message provided by the API
        toast.error(apiMessage);
      }
      else {
        // Fallback for general network or unknown errors
        toast.error("Login failed. Check your network or contact support.");
      }

    } finally {
      // 4. Always reset loading state when finished (success or failure)
      setLoading(false);
    }
  };

  return (
    // Main Container: Uses custom 'bg-primary' color and 'bg-city-pattern'
    <div className="min-h-screen flex items-center justify-center bg-[#3C467B] bg-city-pattern bg-cover ">

      {/* 1. Left Side: Globe and Text (Hidden on small screens) */}
      <div className="hidden lg:flex w-1/2 p-10 flex-col justify-center items-center pl-20">

        {/* Globe Image Placeholder */}
        <div className="w-[300px] h-[300px] mb-8">
          <img
            src={GlobeImage} // Use imported image path
            alt="Global Network"
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>

        <div className="text-left"> {/* Changed text-right to text-left for consistency */}
          <h2 className="text-white text-3xl font-light tracking-widest">
            SOCSCI 3
          </h2>
          <h1 className="text-white text-4xl font-extrabold mt-1">
            Learning Management System
          </h1>
        </div>
      </div>

      {/* 2. Right Side: Login Panel (Glassmorphism) */}
      <div className="w-full max-w-md p-4 sm:p-8">

        {/* Glass Panel: Uses custom 'bg-panel-dark' with 40% opacity 
      and the critical 'backdrop-blur-md' utility for the frosted effect. */}
        <div className="bg-panel-dark/40 p-10 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-md">

          {/* ************************************** */}
          {/* 👇 CODE ADDED HERE: "SOCSCI 3 LMS" title */}
          <div className="text-center mb-2">
            <p className="text-white text-base font-light opacity-80 tracking-widest uppercase">
              SOCSCI 3 LMS
            </p>
          </div>
          {/* ************************************** */}

          <div className="text-center mb-10">
            <h1 className="text-white text-5xl font-light">Login</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-white text-base block mb-1 font-medium">Email and Username</label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                // Input styling uses transparent white background and border
                className="w-full p-4 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
                placeholder="Enter your Email or ID"
                required
              />
            </div>

            <div className="relative">
              <label className="text-white text-base block mb-1 font-medium">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition pr-12"
                placeholder="••••••••"
                required
              />
              {/* Password Visibility Toggle Button */}
              <button
                type="button"
                className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 text-white/70 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeSlashIcon className="h-6 w-6" /> : <EyeIcon className="h-6 w-6" />}
              </button>
            </div>

            <button
              type="submit"
              // Button uses the custom 'bg-btn-primary' color
              className="w-full bg-[#464FB1] text-white font-semibold text-lg p-4 rounded-lg hover:bg-[#4363FF] transition duration-200 shadow-xl mt-8"
            >
              Login
            </button>
          </form>

          <p className="text-white text-center mt-8 text-base">
            Don’t have an account?{" "}
            <span
              className="text-blue-300 font-semibold cursor-pointer hover:text-blue-200"
              onClick={() => navigate("/register")}
            >
              sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;