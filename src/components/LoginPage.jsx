import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(location.state?.message || "");

  if (user) {
    navigate("/chat");
    return null;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      if (!userCredential.user.emailVerified) {
        setMessage("Please verify your email before logging in.");
        return;
      }

      navigate("/chat");
    } catch (error) {
      setMessage("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
        {message && <p className="text-center mb-4 text-red-500">{message}</p>}
        <form onSubmit={handleLogin} className="flex flex-col space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded dark:bg-gray-700"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded dark:bg-gray-700"
            required
          />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Login
          </button>
        </form>
        <p className="text-center mt-3 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline cursor-pointer">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;