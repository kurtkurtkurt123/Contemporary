import { useState } from "react";
import { useNavigate } from "react-router-dom";
// ✅ FINAL PATH CHECK: Tiyakin na ito ang tamang path
import { useAuth } from "../context/AuthContext"; 
import toast from 'react-hot-toast'; 

const Login = () => {
  // Kinuha ang login function galing sa AuthContext
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState(""); // StudentID or Email
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ GUMAMIT NG CENTRALIZED LOGIN FUNCTION MULA SA CONTEXT
      // Ang login() function na ang bahala sa API call, token saving, at REDIRECTION
      const success = await login(identifier, password);

      if (success) {
        // Wala nang navigate() dito; hahayaan ang AuthContext ang mag-redirect sa /home
        return;
      }

    } catch (error) {
      // Ang errors ay na-ha-handle na sa loob ng AuthContext
      toast.error("Login failed due to unexpected error.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#3d4b7d]">
      <div className="bg-[#535f91] p-8 rounded-xl w-[400px] shadow-2xl border border-gray-600">

        <div className="text-center mb-6">
            <h1 className="text-white text-3xl font-bold">LMS Portal</h1>
            <p className="text-gray-300 text-sm">The Contemporary World</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white text-sm block mb-1">Student ID or Email</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full p-2.5 rounded bg-[#7a85b6] text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Ex. 2024-001"
              required
            />
          </div>

          <div>
            <label className="text-white text-sm block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 rounded bg-[#7a85b6] text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold p-2.5 rounded hover:bg-blue-500 transition duration-200 shadow-lg mt-4"
          >
            Login
          </button>
        </form>

        <p className="text-white text-center mt-6 text-sm">
          Don’t have an account?{" "}
          <span
            className="text-blue-300 font-bold cursor-pointer hover:text-blue-200 underline"
            onClick={() => navigate("/register")}
          >
            Sign up here
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;